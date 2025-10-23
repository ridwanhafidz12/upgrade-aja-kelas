import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, Bookmark, TrendingUp, Play } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const [bookmarks, setBookmarks] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      // Fetch enrollments with course details
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user?.id)
        .order('enrolled_at', { ascending: false });

      if (enrollmentError) throw enrollmentError;

      // Fetch course details separately for each enrollment
      const enrichedEnrollments = await Promise.all(
        (enrollmentData || []).map(async (enrollment) => {
          const { data: courseData } = await supabase
            .from('courses')
            .select('id, title, thumbnail_url, duration_hours, instructor_id, category')
            .eq('id', enrollment.course_id)
            .single();

          const { data: instructorData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', courseData?.instructor_id)
            .single();

          return {
            ...enrollment,
            courses: {
              ...courseData,
              profiles: instructorData
            }
          };
        })
      );

      setEnrollments(enrichedEnrollments);

      // Fetch certificates with course info
      const { data: certData, error: certError } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user?.id)
        .order('issued_at', { ascending: false });

      if (certError) throw certError;

      // Fetch course details for certificates
      const enrichedCerts = await Promise.all(
        (certData || []).map(async (cert) => {
          const { data: courseData } = await supabase
            .from('courses')
            .select('title')
            .eq('id', cert.course_id)
            .single();

          return {
            ...cert,
            courses: courseData
          };
        })
      );

      setCertificates(enrichedCerts);

      // Fetch bookmarks
      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (bookmarkError) throw bookmarkError;

      // Fetch course details for bookmarks
      const enrichedBookmarks = await Promise.all(
        (bookmarkData || []).map(async (bookmark) => {
          const { data: courseData } = await supabase
            .from('courses')
            .select('id, title, thumbnail_url, level, category')
            .eq('id', bookmark.course_id)
            .single();

          return {
            ...bookmark,
            courses: courseData
          };
        })
      );

      setBookmarks(enrichedBookmarks);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const activeEnrollments = enrollments.filter(e => !e.completed_at);
  const completedEnrollments = enrollments.filter(e => e.completed_at);
  const totalStudyHours = enrollments.reduce((sum, e) => sum + (e.courses?.duration_hours || 0), 0);

  const stats = [
    { label: "Kursus Aktif", value: activeEnrollments.length.toString(), icon: BookOpen, color: "text-primary" },
    { label: "Kursus Selesai", value: completedEnrollments.length.toString(), icon: Award, color: "text-success" },
    { label: "Sertifikat", value: certificates.length.toString(), icon: Award, color: "text-accent" },
    { label: "Total Jam Belajar", value: totalStudyHours.toString(), icon: TrendingUp, color: "text-primary" }
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard Saya</h1>
          <p className="text-muted-foreground">
            Selamat datang kembali, {user?.email?.split('@')[0]}! Lanjutkan perjalanan belajar Anda
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Courses */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kursus Saya</CardTitle>
                <CardDescription>Lanjutkan kursus yang sedang Anda ikuti</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : activeEnrollments.length > 0 ? (
                  activeEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="p-4 border rounded-lg hover:border-primary transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold mb-1">{enrollment.courses?.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Oleh {enrollment.courses?.profiles?.full_name || 'Instruktur'}
                          </p>
                        </div>
                        <Link to={`/courses/${enrollment.courses?.id}`}>
                          <Button size="sm" className="gap-2">
                            <Play className="h-4 w-4" />
                            Lanjutkan
                          </Button>
                        </Link>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{enrollment.progress || 0}%</span>
                        </div>
                        <Progress value={enrollment.progress || 0} className="h-2" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Belum ada kursus yang diikuti
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Bookmarks */}
            <Card>
              <CardHeader>
                <CardTitle>Bookmark</CardTitle>
                <CardDescription>Kursus yang Anda simpan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : bookmarks.length > 0 ? (
                  bookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="p-4 border rounded-lg hover:border-primary transition-all">
                      <div className="flex gap-3">
                        {bookmark.courses?.thumbnail_url && (
                          <img 
                            src={bookmark.courses.thumbnail_url} 
                            alt={bookmark.courses.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{bookmark.courses?.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {bookmark.courses?.category} • {bookmark.courses?.level}
                          </p>
                          <Link to={`/courses/${bookmark.courses?.id}`}>
                            <Button size="sm" variant="outline">
                              Lihat Kursus
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Belum ada kursus yang di-bookmark
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Certificates */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sertifikat</CardTitle>
                <CardDescription>Pencapaian Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : certificates.length > 0 ? (
                  <>
                    {certificates.map((cert) => (
                      <Link 
                        key={cert.id} 
                        to={`/certificate/verify/${cert.certificate_number}`}
                        className="block"
                      >
                        <div className="p-4 border rounded-lg hover:border-primary transition-all cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                              <Award className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm mb-1">{cert.courses?.title}</h4>
                              <p className="text-xs text-muted-foreground">{cert.certificate_number}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(cert.issued_at).toLocaleDateString('id-ID', { 
                                  year: 'numeric', 
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                              <Button size="sm" variant="link" className="h-auto p-0 mt-1 text-xs">
                                Lihat Sertifikat →
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Belum ada sertifikat
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
