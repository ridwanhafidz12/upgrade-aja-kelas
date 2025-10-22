import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, DollarSign, Award, Plus } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const Admin = () => {
  const stats = [
    { label: "Total Kursus", value: "24", icon: BookOpen, change: "+3 bulan ini" },
    { label: "Total Siswa", value: "1,234", icon: Users, change: "+180 bulan ini" },
    { label: "Pendapatan", value: "Rp 45.5M", icon: DollarSign, change: "+12% bulan ini" },
    { label: "Sertifikat", value: "856", icon: Award, change: "+95 bulan ini" }
  ];

  const recentCourses = [
    { title: "Web Development Master", students: 234, status: "Aktif", price: "Rp 299K" },
    { title: "UI/UX Design Fundamental", students: 189, status: "Aktif", price: "Rp 249K" },
    { title: "Digital Marketing Pro", students: 312, status: "Aktif", price: "Gratis" }
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard Admin</h1>
            <p className="text-muted-foreground">Kelola kursus dan platform Upgradeaja</p>
          </div>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Tambah Kursus
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold mb-2">{stat.value}</p>
                <p className="text-xs text-success">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Kursus Terbaru</CardTitle>
              <CardDescription>Kelola kursus yang tersedia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCourses.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold mb-1">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">{course.students} siswa</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary mb-1">{course.price}</p>
                      <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">
                        {course.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Lihat Semua Kursus
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
              <CardDescription>Kelola platform dengan mudah</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Kursus Baru
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Kelola Episode Video
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="mr-2 h-4 w-4" />
                Atur Harga Kursus
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Award className="mr-2 h-4 w-4" />
                Generate Sertifikat
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Kelola User
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
