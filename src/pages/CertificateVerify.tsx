import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle2, XCircle, Calendar, User, BookOpen, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CertificateVerify = () => {
  const { certificateNumber } = useParams();
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (certificateNumber) {
      verifyCertificate();
    }
  }, [certificateNumber]);

  const verifyCertificate = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-certificate', {
        body: { certificateNumber }
      });

      if (error) throw error;

      if (data?.valid && data?.certificate) {
        setCertificate(data.certificate);
        setValid(true);
      } else {
        setValid(false);
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setValid(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/30">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memverifikasi sertifikat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {valid && certificate ? (
            <Card className="border-2 border-success">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-success to-success/60 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">Sertifikat Valid</CardTitle>
                <Badge variant="outline" className="mx-auto">
                  {certificate.certificate_number}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                  <Award className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">{certificate.courses?.title}</h2>
                  <p className="text-muted-foreground">Sertifikat Penyelesaian Kursus</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Penerima</p>
                      <p className="font-semibold">{certificate.profiles?.full_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Kursus</p>
                      <p className="font-semibold">{certificate.courses?.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tanggal Terbit</p>
                      <p className="font-semibold">
                        {new Date(certificate.issued_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* QR Code Display */}
                {certificate.qr_code_url && (
                  <div className="p-6 bg-muted/50 rounded-lg">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-5 w-5 text-primary" />
                        <p className="text-sm font-medium">Kode Verifikasi QR</p>
                      </div>
                      <div className="p-3 bg-white border-2 border-primary rounded-lg">
                        <img 
                          src={certificate.qr_code_url} 
                          alt="QR Code Verifikasi" 
                          className="w-32 h-32"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center max-w-sm">
                        Scan QR code ini untuk memverifikasi keaslian sertifikat secara cepat
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Sertifikat ini sah dan dikeluarkan oleh sistem kami.
                  </p>
                  <div className="flex gap-3 justify-center mt-4">
                    <Link to="/courses">
                      <Button variant="outline">
                        Lihat Kursus Lainnya
                      </Button>
                    </Link>
                    <Link to="/dashboard">
                      <Button>
                        Ke Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-destructive">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-10 w-10 text-destructive" />
                </div>
                <CardTitle className="text-2xl mb-2">Sertifikat Tidak Valid</CardTitle>
                <p className="text-muted-foreground">
                  Sertifikat dengan nomor <span className="font-mono font-semibold">{certificateNumber}</span> tidak ditemukan dalam sistem kami.
                </p>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-destructive/5 rounded-lg text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Pastikan nomor sertifikat yang Anda masukkan benar atau hubungi administrator.
                  </p>
                  <Link to="/courses">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Lihat Kursus Tersedia
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateVerify;
