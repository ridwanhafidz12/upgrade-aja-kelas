import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Award, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Episode {
  id: string;
  title: string;
  subtitle?: string | null;
  episode_number: number;
  youtube_url: string;
  duration_minutes: number | null;
  description: string | null;
}

interface EpisodeProgress {
  episode_id: string;
  completed: boolean;
}

const CourseLearning = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<any>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [progress, setProgress] = useState<EpisodeProgress[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (id) {
      fetchCourseData();
    }
  }, [id, user]);

  const fetchCourseData = async () => {
    try {
      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Check enrollment
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user?.id)
        .eq('course_id', id)
        .maybeSingle();

      if (enrollmentError) throw enrollmentError;
      
      if (!enrollmentData) {
        toast.error("Anda belum terdaftar di kursus ini");
        navigate(`/courses/${id}`);
        return;
      }
      
      setEnrollment(enrollmentData);

      // Fetch episodes
      const { data: episodesData, error: episodesError } = await supabase
        .from('course_episodes')
        .select('*')
        .eq('course_id', id)
        .order('episode_number', { ascending: true });

      if (episodesError) throw episodesError;
      setEpisodes(episodesData || []);
      
      if (episodesData && episodesData.length > 0) {
        setCurrentEpisode(episodesData[0]);
      }

      // Fetch progress
      const { data: progressData, error: progressError } = await supabase
        .from('episode_progress')
        .select('episode_id, completed')
        .eq('user_id', user?.id)
        .in('episode_id', episodesData?.map(e => e.id) || []);

      if (progressError) throw progressError;
      setProgress(progressData || []);
    } catch (error) {
      toast.error("Gagal memuat data kursus");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markEpisodeComplete = async (episodeId: string) => {
    try {
      const { error } = await supabase
        .from('episode_progress')
        .upsert({
          user_id: user?.id,
          episode_id: episodeId,
          completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,episode_id'
        });

      if (error) throw error;

      // Update local progress
      setProgress(prev => {
        const existing = prev.find(p => p.episode_id === episodeId);
        if (existing) {
          return prev.map(p => 
            p.episode_id === episodeId ? { ...p, completed: true } : p
          );
        } else {
          return [...prev, { episode_id: episodeId, completed: true }];
        }
      });

      // Calculate and update enrollment progress
      const completedCount = progress.filter(p => p.completed).length + 1;
      const progressPercentage = Math.round((completedCount / episodes.length) * 100);

      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .update({
          progress: progressPercentage,
          completed_at: progressPercentage === 100 ? new Date().toISOString() : null
        })
        .eq('id', enrollment.id);

      if (enrollmentError) throw enrollmentError;

      toast.success("Episode selesai!");
      
      if (progressPercentage === 100) {
        toast.success("Selamat! Anda telah menyelesaikan kursus ini!");
      }
    } catch (error) {
      toast.error("Gagal menyimpan progress");
      console.error(error);
    }
  };

  const isEpisodeCompleted = (episodeId: string) => {
    return progress.some(p => p.episode_id === episodeId && p.completed);
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const completedEpisodes = progress.filter(p => p.completed).length;
  const totalEpisodes = episodes.length;
  const courseProgress = totalEpisodes > 0 ? Math.round((completedEpisodes / totalEpisodes) * 100) : 0;
  const allEpisodesCompleted = completedEpisodes === totalEpisodes && totalEpisodes > 0;

  const handleGenerateCertificate = async () => {
    setGeneratingCertificate(true);
    try {
      // Check if certificate already exists
      const { data: existingCert } = await supabase
        .from('certificates')
        .select('certificate_number')
        .eq('user_id', user?.id)
        .eq('course_id', id)
        .maybeSingle();

      if (existingCert) {
        toast.success("Anda sudah memiliki sertifikat untuk kursus ini!");
        navigate(`/certificate/verify/${existingCert.certificate_number}`);
        return;
      }

      const { data, error } = await supabase.functions.invoke("generate-certificate", {
        body: { courseId: id }
      });

      if (error) throw error;
      
      toast.success("Sertifikat berhasil dibuat!");
      
      // Redirect to certificate verification page
      if (data?.certificate?.certificate_number) {
        navigate(`/certificate/verify/${data.certificate.certificate_number}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat sertifikat");
    } finally {
      setGeneratingCertificate(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/courses/${id}`)}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Kembali ke Detail Kursus
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Player & Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card>
              <CardContent className="p-0">
                {currentEpisode && (
                  <div className="aspect-video">
                    <iframe
                      src={getYoutubeEmbedUrl(currentEpisode.youtube_url)}
                      className="w-full h-full rounded-t-lg"
                      allowFullScreen
                      title={currentEpisode.title}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{currentEpisode?.title}</h2>
                  {currentEpisode?.subtitle && (
                    <p className="text-muted-foreground mb-4">{currentEpisode.subtitle}</p>
                  )}
                  {currentEpisode?.description && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {currentEpisode.description}
                    </p>
                  )}
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Button 
                      onClick={() => currentEpisode && markEpisodeComplete(currentEpisode.id)}
                      disabled={currentEpisode ? isEpisodeCompleted(currentEpisode.id) : false}
                    >
                      {currentEpisode && isEpisodeCompleted(currentEpisode.id) ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Selesai
                        </>
                      ) : (
                        "Tandai Selesai"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Description */}
            <Card>
              <CardHeader>
                <CardTitle>Tentang Kursus</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">{course?.title}</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {course?.description || 'Tidak ada deskripsi'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Episodes List */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Kursus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Selesai</span>
                    <span className="font-medium">{completedEpisodes}/{totalEpisodes} Episode</span>
                  </div>
                  <Progress value={courseProgress} className="h-2" />
                  <p className="text-center text-sm font-medium mt-2">{courseProgress}%</p>
                </div>

                {allEpisodesCompleted && (
                  <Button 
                    className="w-full gap-2" 
                    onClick={handleGenerateCertificate}
                    disabled={generatingCertificate}
                  >
                    <Award className="h-4 w-4" />
                    {generatingCertificate ? "Membuat Sertifikat..." : "Dapatkan Sertifikat"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Episodes List */}
            <Card>
              <CardHeader>
                <CardTitle>Daftar Episode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {episodes.map((episode) => (
                    <button
                      key={episode.id}
                      onClick={() => setCurrentEpisode(episode)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        currentEpisode?.id === episode.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-transparent hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isEpisodeCompleted(episode.id) ? (
                          <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {episode.episode_number}. {episode.title}
                          </p>
                          {episode.subtitle && (
                            <p className="text-xs text-muted-foreground truncate">
                              {episode.subtitle}
                            </p>
                          )}
                          {episode.duration_minutes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {episode.duration_minutes} menit
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
