import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const FAQ = () => {
  const faqs = [
    {
      question: "Apa itu Upgradeaja?",
      answer: "Upgradeaja adalah platform pembelajaran online yang fokus pada peningkatan skill digital seperti programming, design, marketing, AI, dan teknologi lainnya. Kami menyediakan kursus berkualitas dengan sertifikat resmi."
    },
    {
      question: "Bagaimana cara mendaftar di Upgradeaja?",
      answer: "Anda dapat mendaftar dengan mengklik tombol 'Daftar Gratis' di halaman utama, lalu mengisi formulir pendaftaran dengan email dan password. Setelah itu, Anda dapat langsung menjelajahi dan membeli kursus yang tersedia."
    },
    {
      question: "Apakah saya mendapat sertifikat setelah menyelesaikan kursus?",
      answer: "Ya! Setelah menyelesaikan 100% materi kursus, Anda akan mendapatkan e-certificate resmi dengan QR code untuk verifikasi. Sertifikat ini dapat digunakan untuk portofolio atau keperluan profesional Anda."
    },
    {
      question: "Bagaimana cara pembayaran kursus?",
      answer: "Kami menggunakan sistem pembayaran Midtrans yang aman dan mendukung berbagai metode pembayaran seperti transfer bank, e-wallet, dan kartu kredit. Setelah pembayaran berhasil, akses kursus akan langsung aktif."
    },
    {
      question: "Apakah ada kursus gratis?",
      answer: "Ya, kami menyediakan beberapa kursus gratis untuk membantu Anda memulai perjalanan belajar. Anda dapat melihat daftar kursus gratis di halaman katalog dengan filter harga 'Gratis'."
    },
    {
      question: "Berapa lama akses kursus berlaku?",
      answer: "Akses kursus yang telah dibeli berlaku selamanya (lifetime access). Anda dapat belajar dengan kecepatan Anda sendiri tanpa batas waktu."
    },
    {
      question: "Apakah bisa refund jika tidak cocok dengan kursus?",
      answer: "Ya, kami menyediakan kebijakan refund dalam 7 hari sejak pembelian dengan syarat dan ketentuan tertentu. Silakan hubungi tim support kami untuk proses refund."
    },
    {
      question: "Bagaimana cara menghubungi support?",
      answer: "Anda dapat menghubungi kami melalui email di ridwanhafidz856@gmail.com. Tim kami akan merespons pertanyaan Anda secepatnya."
    }
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pertanyaan yang Sering Diajukan</h2>
          <p className="text-muted-foreground text-lg">Temukan jawaban untuk pertanyaan umum tentang Upgradeaja</p>
        </div>
        <Card className="max-w-3xl mx-auto p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
    </section>
  );
};

export default FAQ;
