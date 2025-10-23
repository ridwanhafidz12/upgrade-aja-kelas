import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Linkedin, Globe } from "lucide-react";
import founderImage from "@/assets/founder-profile.jpg";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Tentang Kami</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upgradeaja adalah platform pembelajaran digital yang berfokus pada pengembangan skill teknologi dan digital
          </p>
        </div>

        {/* Founder Section */}
        <Card className="max-w-4xl mx-auto mb-12">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src={founderImage} 
                  alt="Muhammad Ridwan Nuur Hafidz"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">Muhammad Ridwan Nuur Hafidz, S.Kom</h2>
                <p className="text-lg text-primary font-semibold mb-4">Founder & Lead Developer</p>
                <p className="text-muted-foreground mb-4">
                  Mahasiswa Teknik Informatika Universitas Ahmad Dahlan, Yogyakarta
                </p>
                <p className="text-muted-foreground mb-6">
                  Web Developer & Mentor yang berpengalaman dalam pengembangan web, AI, dan edukasi digital. 
                  Aktif mengembangkan berbagai platform teknologi edukatif seperti TrackLink, Sedekah Manis, 
                  Upgradeaja, Wukirtech, Karuna AI, AI Website Builder, dan masih banyak lagi. 
                  Dikenal dengan dedikasi terhadap inovasi dan pembelajaran yang menyenangkan.
                </p>
                <div className="flex gap-4 justify-center md:justify-start">
                  <a 
                    href="mailto:ridwanhafidz856@gmail.com" 
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Mail className="h-5 w-5" />
                    ridwanhafidz856@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Misi Kami</h3>
              <p className="text-muted-foreground">
                Memberikan akses pembelajaran teknologi berkualitas tinggi yang terjangkau dan mudah dipahami 
                untuk semua kalangan, dengan fokus pada praktik dan implementasi nyata.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Visi Kami</h3>
              <p className="text-muted-foreground">
                Menjadi platform pembelajaran digital terdepan di Indonesia yang menghasilkan talenta-talenta 
                teknologi berkualitas dan siap bersaing di industri global.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
