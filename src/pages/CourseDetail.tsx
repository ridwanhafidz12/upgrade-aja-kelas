import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Users, Award, CheckCircle2, Play, Bookmark } from "lucide-react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const CourseDetail = () => {
  const { id } = useParams();

  const episodes = [
    { id: 1, title: "Pengenalan Web Development", duration: "15:30", completed: true },
    { id: 2, title: "HTML & CSS Fundamentals", duration: "25:45", completed: true },
    { id: 3, title: "JavaScript Basics", duration: "30:20", completed: false },
    { id: 4, title: "React Introduction", duration: "35:15", completed: false },
    { id: 5, title: "State Management", duration: "28:40", completed: false }
  ];

  const learningPoints = [
    "Menguasai HTML, CSS, dan JavaScript",
    "Membangun aplikasi web modern dengan React",
    "Memahami konsep responsive design",
    "Bekerja dengan API dan data",
    "Deploy aplikasi ke production"
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero */}
            <div className="relative h-96 rounded-xl overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Play className="h-24 w-24 text-white/80" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                <Badge className="mb-2">Intermediate</Badge>
                <h1 className="text-3xl font-bold mb-2">Web Development Master</h1>
                <p className="text-white/90">Oleh John Doe</p>
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
                    <p className="text-muted-foreground mb-4">
                      Pelajari web development dari dasar hingga mahir. Kursus ini akan mengajarkan Anda HTML, CSS, JavaScript, dan React untuk membangun aplikasi web modern yang responsif dan interaktif.
                    </p>
                    <p className="text-muted-foreground">
                      Dengan pendekatan hands-on dan project-based, Anda akan membangun portfolio yang kuat dan siap untuk karir sebagai web developer profesional.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Apa yang Akan Anda Pelajari</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {learningPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
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
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {episode.duration}
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
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent" />
                      <div>
                        <h3 className="text-xl font-bold mb-2">John Doe</h3>
                        <p className="text-muted-foreground mb-4">
                          Senior Web Developer dengan 10+ tahun pengalaman. Telah mengajar lebih dari 50,000 siswa di seluruh dunia.
                        </p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>⭐ 4.9 Rating</span>
                          <span>👥 50K+ Siswa</span>
                          <span>📚 15 Kursus</span>
                        </div>
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
                  <p className="text-4xl font-bold text-primary mb-2">Rp 299.000</p>
                  <p className="text-sm text-muted-foreground line-through">Rp 499.000</p>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    Beli Sekarang
                  </Button>
                  <Button className="w-full" variant="outline" size="lg">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">2,500+ siswa terdaftar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">5 modul pembelajaran</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">12 jam video</span>
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
