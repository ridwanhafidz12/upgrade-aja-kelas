import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Award, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import heroImage from "@/assets/hero-learning.jpg";
import FAQ from "@/components/FAQ";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Kursus Berkualitas",
      description: "Ratusan kursus digital dari instruktur terbaik"
    },
    {
      icon: Award,
      title: "Sertifikat Resmi",
      description: "Dapatkan sertifikat dengan QR code verifikasi"
    },
    {
      icon: Users,
      title: "Komunitas Aktif",
      description: "Belajar bersama ribuan pelajar lainnya"
    },
    {
      icon: TrendingUp,
      title: "Karir Meningkat",
      description: "Tingkatkan skill untuk karir yang lebih baik"
    }
  ];

  const popularCourses = [
    {
      title: "Web Development Master",
      instructor: "John Doe",
      price: "Rp 299.000",
      students: "2.5K+",
      rating: "4.8"
    },
    {
      title: "UI/UX Design Fundamental",
      instructor: "Jane Smith",
      price: "Rp 249.000",
      students: "1.8K+",
      rating: "4.9"
    },
    {
      title: "Digital Marketing Pro",
      instructor: "Mike Johnson",
      price: "Gratis",
      students: "3.2K+",
      rating: "4.7"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/90" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Tingkatkan Skill Digital Anda
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Platform pembelajaran online terbaik untuk coding, desain, marketing digital, AI, dan teknologi lainnya.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/courses">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Mulai Belajar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Daftar Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mengapa Upgradeaja?</h2>
            <p className="text-muted-foreground text-lg">Belajar dengan cara yang lebih efektif dan menyenangkan</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-all hover:shadow-lg">
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

      {/* Popular Courses */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Kursus Populer</h2>
              <p className="text-muted-foreground">Dipilih oleh ribuan pelajar</p>
            </div>
            <Link to="/courses">
              <Button variant="outline">
                Lihat Semua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCourses.map((course, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all group">
                <div className="h-48 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <BookOpen className="h-20 w-20 text-white/80" />
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">{course.title}</CardTitle>
                  <CardDescription>Oleh {course.instructor}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">{course.students} siswa</p>
                      <p className="text-sm text-muted-foreground">⭐ {course.rating}</p>
                    </div>
                    <p className="text-xl font-bold text-primary">{course.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Meningkatkan Karir Anda?</h2>
          <p className="text-xl mb-8 text-white/90">Bergabung dengan ribuan profesional yang sudah upgrade skill mereka</p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Daftar Sekarang Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <footer className="border-t py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Upgradeaja
              </h3>
              <p className="text-muted-foreground">Platform pembelajaran digital terbaik untuk meningkatkan skill Anda</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/courses" className="hover:text-primary">Kursus</Link></li>
                <li><Link to="/auth" className="hover:text-primary">Dashboard</Link></li>
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
