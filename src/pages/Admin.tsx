import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, DollarSign, Award, Plus, Tag, FileText } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    totalCertificates: 0
  });
  const [recentCourses, setRecentCourses] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentCourses();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: courses } = await supabase.from("courses").select("id", { count: "exact" });
      const { data: enrollments } = await supabase.from("enrollments").select("id", { count: "exact" });
      const { data: payments } = await supabase.from("payments").select("amount").eq("status", "settlement");
      const { data: certificates } = await supabase.from("certificates").select("id", { count: "exact" });

      const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setStats({
        totalCourses: courses?.length || 0,
        totalStudents: enrollments?.length || 0,
        totalRevenue: totalRevenue,
        totalCertificates: certificates?.length || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchRecentCourses = async () => {
    try {
      const { data } = await supabase
        .from("courses")
        .select("id, title, price, is_free, status")
        .order("created_at", { ascending: false })
        .limit(3);

      if (data) {
        const coursesWithEnrollments = await Promise.all(
          data.map(async (course) => {
            const { count } = await supabase
              .from("enrollments")
              .select("*", { count: "exact", head: true })
              .eq("course_id", course.id);
            
            return {
              ...course,
              students: count || 0,
              displayPrice: course.is_free ? "Gratis" : `Rp ${course.price.toLocaleString('id-ID')}`
            };
          })
        );
        setRecentCourses(coursesWithEnrollments);
      }
    } catch (error) {
      console.error("Error fetching recent courses:", error);
    }
  };

  const statsDisplay = [
    { label: "Total Kursus", value: stats.totalCourses.toString(), icon: BookOpen, change: "Dari database" },
    { label: "Total Siswa", value: stats.totalStudents.toString(), icon: Users, change: "Total pendaftaran" },
    { label: "Pendapatan", value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`, icon: DollarSign, change: "Total lunas" },
    { label: "Sertifikat", value: stats.totalCertificates.toString(), icon: Award, change: "Total diterbitkan" }
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
          <Button size="lg" className="gap-2" onClick={() => navigate("/admin/courses")}>
            <Plus className="h-5 w-5" />
            Kelola Kursus
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsDisplay.map((stat, index) => (
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
                      <p className="font-bold text-primary mb-1">{course.displayPrice}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        course.status === 'published' ? 'bg-success/10 text-success' :
                        course.status === 'draft' ? 'bg-warning/10 text-warning' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/admin/courses")}>
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
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/admin/courses")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Kelola Kursus
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/admin/categories")}
              >
                <Tag className="mr-2 h-4 w-4" />
                Kelola Kategori
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/admin/subtitles")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Kelola Subtitle
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate("/admin/certificates")}
              >
                <Award className="mr-2 h-4 w-4" />
                Kelola Sertifikat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
