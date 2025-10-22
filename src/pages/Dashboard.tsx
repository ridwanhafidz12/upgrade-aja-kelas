import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, Bookmark, TrendingUp, Play } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const stats = [
    { label: "Kursus Aktif", value: "3", icon: BookOpen, color: "text-primary" },
    { label: "Kursus Selesai", value: "5", icon: Award, color: "text-success" },
    { label: "Bookmark", value: "12", icon: Bookmark, color: "text-accent" },
    { label: "Total Jam Belajar", value: "48", icon: TrendingUp, color: "text-primary" }
  ];

  const myCourses = [
    { title: "Web Development Master", progress: 65, instructor: "John Doe" },
    { title: "UI/UX Design Fundamental", progress: 40, instructor: "Jane Smith" },
    { title: "Digital Marketing Pro", progress: 85, instructor: "Mike Johnson" }
  ];

  const certificates = [
    { title: "React JS Developer", date: "Jan 2025", course: "Web Development" },
    { title: "Digital Marketing Specialist", date: "Dec 2024", course: "Marketing Pro" }
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
                {myCourses.map((course, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:border-primary transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold mb-1">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">Oleh {course.instructor}</p>
                      </div>
                      <Button size="sm" className="gap-2">
                        <Play className="h-4 w-4" />
                        Lanjutkan
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Bookmarks */}
            <Card>
              <CardHeader>
                <CardTitle>Bookmark</CardTitle>
                <CardDescription>Kursus yang Anda simpan</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Belum ada kursus yang di-bookmark
                </p>
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
                {certificates.map((cert, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:border-primary transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">{cert.title}</h4>
                        <p className="text-xs text-muted-foreground">{cert.course}</p>
                        <p className="text-xs text-muted-foreground mt-1">{cert.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">Lihat Semua Sertifikat</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
