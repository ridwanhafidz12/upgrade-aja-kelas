import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Kebijakan Privasi</h1>
          <p className="text-muted-foreground text-center mb-8">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Informasi yang Kami Kumpulkan</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>
                  Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami:
                </p>
                <p>
                  - Nama lengkap dan alamat email saat mendaftar
                </p>
                <p>
                  - Informasi pembayaran melalui penyedia layanan pembayaran (Midtrans)
                </p>
                <p>
                  - Data progress pembelajaran dan aktivitas di platform
                </p>
                <p>
                  - Informasi komunikasi dengan tim support kami
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Penggunaan Informasi</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>
                  Kami menggunakan informasi yang dikumpulkan untuk:
                </p>
                <p>
                  - Menyediakan, mengoperasikan, dan meningkatkan layanan kami
                </p>
                <p>
                  - Memproses transaksi dan mengirimkan konfirmasi
                </p>
                <p>
                  - Mengirimkan informasi teknis, pembaruan, dan pemberitahuan keamanan
                </p>
                <p>
                  - Merespons komentar, pertanyaan, dan permintaan layanan pelanggan
                </p>
                <p>
                  - Mengirimkan sertifikat dan badge penyelesaian kursus
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Keamanan Data</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>
                  Kami menggunakan langkah-langkah keamanan yang wajar untuk melindungi informasi pribadi Anda:
                </p>
                <p>
                  - Enkripsi data menggunakan SSL/TLS
                </p>
                <p>
                  - Penyimpanan data di server yang aman dan terlindungi
                </p>
                <p>
                  - Akses terbatas hanya untuk personel yang berwenang
                </p>
                <p>
                  - Pemantauan sistem keamanan secara berkala
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Berbagi Informasi</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>
                  Kami tidak menjual, menukar, atau mentransfer informasi pribadi Anda kepada pihak ketiga, 
                  kecuali:
                </p>
                <p>
                  - Penyedia layanan pembayaran (Midtrans) untuk memproses transaksi
                </p>
                <p>
                  - Ketika diwajibkan oleh hukum atau proses hukum
                </p>
                <p>
                  - Untuk melindungi hak, properti, atau keselamatan kami dan pengguna lain
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Cookies dan Teknologi Pelacakan</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>
                  Kami menggunakan cookies dan teknologi pelacakan serupa untuk:
                </p>
                <p>
                  - Mengingat preferensi dan pengaturan Anda
                </p>
                <p>
                  - Memahami bagaimana Anda menggunakan layanan kami
                </p>
                <p>
                  - Meningkatkan pengalaman pengguna
                </p>
                <p>
                  Anda dapat mengatur browser Anda untuk menolak cookies, namun beberapa fitur 
                  mungkin tidak berfungsi dengan baik.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Hak Pengguna</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>
                  Anda memiliki hak untuk:
                </p>
                <p>
                  - Mengakses dan memperbarui informasi pribadi Anda
                </p>
                <p>
                  - Meminta penghapusan data pribadi Anda
                </p>
                <p>
                  - Menolak pemrosesan data pribadi Anda
                </p>
                <p>
                  - Meminta salinan data pribadi Anda
                </p>
                <p>
                  Untuk menggunakan hak-hak ini, silakan hubungi kami di ridwanhafidz856@gmail.com
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Perlindungan Data Anak</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Layanan kami tidak ditujukan untuk anak-anak di bawah usia 17 tahun. 
                  Jika kami mengetahui bahwa kami telah mengumpulkan informasi pribadi dari 
                  anak di bawah 17 tahun tanpa persetujuan orang tua, kami akan mengambil 
                  langkah untuk menghapus informasi tersebut.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Perubahan Kebijakan Privasi</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. 
                  Kami akan memberi tahu Anda tentang perubahan dengan memposting 
                  kebijakan baru di halaman ini dan memperbarui tanggal "Terakhir diperbarui".
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Kontak</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau praktik privasi kami, 
                  silakan hubungi kami di:
                </p>
                <p className="mt-2 font-semibold">
                  Email: ridwanhafidz856@gmail.com
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
