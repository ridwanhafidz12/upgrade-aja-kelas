import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Syarat dan Ketentuan</h1>
          <p className="text-muted-foreground text-center mb-8">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Penerimaan Syarat</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>
                  Dengan mengakses dan menggunakan platform Upgradeaja, Anda setuju untuk terikat dengan syarat dan ketentuan berikut. 
                  Jika Anda tidak setuju dengan syarat ini, mohon untuk tidak menggunakan layanan kami.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Akun Pengguna</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>
                  - Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda
                </p>
                <p>
                  - Anda harus berusia minimal 17 tahun atau mendapatkan izin dari orang tua/wali
                </p>
                <p>
                  - Satu akun hanya untuk satu orang dan tidak boleh dibagikan
                </p>
                <p>
                  - Anda bertanggung jawab atas semua aktivitas yang terjadi di akun Anda
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Penggunaan Konten</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>
                  - Semua konten kursus dilindungi hak cipta dan hanya untuk penggunaan pribadi
                </p>
                <p>
                  - Dilarang mendistribusikan, menjual kembali, atau membagikan konten kursus
                </p>
                <p>
                  - Akses kursus berlaku selamanya untuk kursus yang telah dibeli
                </p>
                <p>
                  - Kami berhak memperbarui atau mengubah konten kursus sewaktu-waktu
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Pembayaran dan Pengembalian Dana</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>
                  - Semua harga dalam Rupiah (IDR) dan sudah termasuk pajak
                </p>
                <p>
                  - Pembayaran diproses melalui sistem pembayaran Midtrans yang aman
                </p>
                <p>
                  - Pengembalian dana dapat diajukan dalam 7 hari sejak pembelian dengan syarat tertentu
                </p>
                <p>
                  - Kursus gratis tidak memiliki kebijakan pengembalian dana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Sertifikat</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>
                  - Sertifikat diberikan setelah menyelesaikan 100% materi kursus
                </p>
                <p>
                  - Sertifikat dapat diverifikasi melalui QR code yang tertera
                </p>
                <p>
                  - Sertifikat tidak dapat dipalsukan dan pelanggaran akan dikenakan sanksi hukum
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Perilaku Pengguna</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>
                  Pengguna dilarang untuk:
                </p>
                <p>
                  - Melakukan spamming atau aktivitas yang mengganggu
                </p>
                <p>
                  - Menyebarkan konten yang melanggar hukum atau tidak pantas
                </p>
                <p>
                  - Mencoba mengakses sistem tanpa otorisasi
                </p>
                <p>
                  - Menggunakan platform untuk tujuan ilegal
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Perubahan Layanan</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>
                  Kami berhak untuk mengubah, memodifikasi, atau menghentikan layanan sewaktu-waktu 
                  dengan atau tanpa pemberitahuan. Kami tidak bertanggung jawab atas kerugian yang 
                  timbul akibat perubahan tersebut.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Kontak</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami di:
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

export default Terms;
