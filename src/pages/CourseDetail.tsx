import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Users, Award, CheckCircle2, Play, Bookmark } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id, user]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:instructor_id (full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch episodes
      const { data: episodesData, error: episodesError } = await supabase
        .from('course_episodes')
        .select('*')
        .eq('course_id', id)
        .order('episode_number', { ascending: true });

      if (episodesError) throw episodesError;
      setEpisodes(episodesData || []);

      // Check enrollment if user is logged in
      if (user) {
        const { data: enrollmentData } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', id)
          .maybeSingle();

        setEnrollment(enrollmentData);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data kursus",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Silakan login terlebih dahulu untuk membeli kursus",
      });
      navigate('/auth');
      return;
    }

    if (enrollment) {
      toast({
        title: "Sudah Terdaftar",
        description: "Anda sudah terdaftar di kursus ini",
      });
      return;
    }

    setPurchasing(true);

    try {
      if (course.is_free) {
        // Free course - create enrollment directly
        const { error } = await supabase
          .from('enrollments')
          .insert({
            user_id: user.id,
            course_id: id,
            progress: 0
          });

        if (error) throw error;

        toast({
          title: "Berhasil!",
          description: "Anda berhasil mendaftar di kursus ini",
        });
        
        fetchCourseData();
      } else {
        // Paid course - create Midtrans payment
        const { data, error } = await supabase.functions.invoke('create-payment', {
          body: {
            courseId: id,
            amount: Number(course.price)
          }
        });

        if (error) throw error;

        if (data.payment_url) {
          window.open(data.payment_url, '_blank');
          toast({
            title: "Redirect ke Pembayaran",
            description: "Silakan selesaikan pembayaran di tab baru",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal memproses pembayaran",
        variant: "destructive",
      });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat kursus...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Kursus tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const learningPoints = course.description?.split('\n').filter((line: string) => line.trim()) || [];

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero */}
            <div className="relative h-96 rounded-xl overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              {course.thumbnail_url ? (
                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <Play className="h-24 w-24 text-white/80" />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                <Badge className="mb-2">{course.level || 'Beginner'}</Badge>
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <p className="text-white/90">Oleh {course.profiles?.full_name || 'Instruktur'}</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Kurikulum</TabsTrigger>
                <TabsTrigger value="instructor">Instruktur</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tentang Kursus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {course.description || 'Tidak ada deskripsi'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                {learningPoints.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Apa yang Akan Anda Pelajari</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {learningPoints.slice(0, 5).map((point, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                </Card>
              </TabsContent>

              <TabsContent value="curriculum">
                <Card>
                  <CardHeader>
                    <CardTitle>Daftar Episode</CardTitle>
                    <CardDescription>{episodes.length} video pembelajaran</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {episodes.map((episode) => (
                        <div
                          key={episode.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-all"
                        >
                          <div className="flex items-center gap-3">
                            {episode.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2" />
                            )}
                            <div>
                              <p className="font-medium">{episode.title}</p>
                              {episode.subtitle && (
                                <p className="text-sm text-muted-foreground">{episode.subtitle}</p>
                              )}
                              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3" />
                                {episode.duration_minutes ? `${episode.duration_minutes} menit` : 'Durasi variatif'}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor">
                <Card>
                  <CardHeader>
                    <CardTitle>Instruktur</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="flex items-start gap-4">
                        {course.profiles?.avatar_url ? (
                          <img 
                            src={course.profiles.avatar_url} 
                            alt={course.profiles.full_name}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent" />
                        )}
                        <div>
                          <h3 className="text-xl font-bold mb-2">{course.profiles?.full_name || 'Instruktur'}</h3>
                          <p className="text-muted-foreground mb-4">
                            Instruktur berpengalaman yang siap membimbing Anda dalam perjalanan pembelajaran.
                          </p>
                        </div>
                      </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary mb-2">
                    {course.is_free ? 'Gratis' : `Rp ${Number(course.price).toLocaleString('id-ID')}`}
                  </p>
                </div>

                <div className="space-y-2">
                  {enrollment ? (
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => navigate(`/courses/${id}/learn`)}
                    >
                      Lanjutkan Belajar
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handlePurchase}
                      disabled={purchasing}
                    >
                      {purchasing ? 'Memproses...' : course.is_free ? 'Daftar Sekarang' : 'Beli Sekarang'}
                    </Button>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{episodes.length} episode</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{course.duration_hours || 0} jam video</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Sertifikat penyelesaian</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
