import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Award, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import FAQ from "@/components/FAQ";
import heroImage from "@/assets/hero-learning.jpg";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  price: number;
  is_free: boolean;
  course_categories?: {
    name: string;
  };
}

const Index = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  const fetchFeaturedCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          course_categories:category_id (name)
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setFeaturedCourses(data || []);
    } catch (error: any) {
      toast.error("Gagal memuat kursus");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: "Kursus Berkualitas",
      description: "Ratusan kursus digital dari instruktur terbaik",
    },
    {
      icon: Award,
      title: "Sertifikat Resmi",
      description: "Dapatkan sertifikat setelah menyelesaikan kursus",
    },
    {
      icon: Users,
      title: "Komunitas Aktif",
      description: "Bergabung dengan ribuan pelajar lainnya",
    },
    {
      icon: GraduationCap,
      title: "Belajar Fleksibel",
      description: "Belajar kapan saja dan di mana saja",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section 
        className="relative py-32 bg-cover bg-center" 
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80" />
        <div className="container mx-auto px-4 relative z-10 text-white">
          <h1 className="text-5xl font-bold mb-6">Tingkatkan Skill Digital Anda</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Platform pembelajaran online terbaik untuk coding, desain, dan bisnis digital.
          </p>
          <Button asChild size="lg">
            <Link to="/courses">Jelajahi Kursus</Link>
          </Button>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Mengapa Upgradeaja?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Kursus Unggulan</h2>
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : featuredCourses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Belum ada kursus tersedia
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <Card key={course.id}>
                  {course.thumbnail_url && (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {course.is_free ? "Gratis" : `Rp ${course.price.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/courses/${course.id}`}>Lihat Detail</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <FAQ />

      <footer className="border-t py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">Upgradeaja</h3>
              <p className="text-muted-foreground">Platform pembelajaran digital terbaik</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/courses" className="hover:text-primary">Kursus</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary">Tentang Kami</Link></li>
                <li><a href="mailto:ridwanhafidz856@gmail.com" className="hover:text-primary">Kontak</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/terms" className="hover:text-primary">Syarat & Ketentuan</Link></li>
                <li><Link to="/privacy" className="hover:text-primary">Kebijakan Privasi</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2025 Upgradeaja. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
