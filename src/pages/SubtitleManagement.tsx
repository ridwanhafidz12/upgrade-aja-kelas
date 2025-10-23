import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Subtitle {
  id: string;
  name: string;
  course_id: string;
  created_at: string;
}

const SubtitleManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubtitle, setEditingSubtitle] = useState<Subtitle | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchSubtitles();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("title")
        .eq("id", courseId)
        .single();

      if (error) throw error;
      setCourseName(data.title);
    } catch (error: any) {
      toast.error("Gagal memuat kursus");
    }
  };

  const fetchSubtitles = async () => {
    try {
      const { data, error } = await supabase
        .from("episode_subtitles")
        .select("*")
        .eq("course_id", courseId)
        .order("name", { ascending: true });

      if (error) throw error;
      setSubtitles(data || []);
    } catch (error: any) {
      toast.error("Gagal memuat subtitle: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSubtitle) {
        const { error } = await supabase
          .from("episode_subtitles")
          .update(formData)
          .eq("id", editingSubtitle.id);

        if (error) throw error;
        toast.success("Subtitle berhasil diperbarui!");
      } else {
        const { error } = await supabase
          .from("episode_subtitles")
          .insert([{ ...formData, course_id: courseId }]);

        if (error) throw error;
        toast.success("Subtitle berhasil ditambahkan!");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchSubtitles();
    } catch (error: any) {
      toast.error("Gagal menyimpan subtitle: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus subtitle ini?")) return;

    try {
      const { error } = await supabase
        .from("episode_subtitles")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Subtitle berhasil dihapus!");
      fetchSubtitles();
    } catch (error: any) {
      toast.error("Gagal menghapus subtitle: " + error.message);
    }
  };

  const handleEdit = (subtitle: Subtitle) => {
    setEditingSubtitle(subtitle);
    setFormData({ name: subtitle.name });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingSubtitle(null);
    setFormData({ name: "" });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/courses")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Kursus
        </Button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Kelola Subtitle Episode</h1>
            <p className="text-muted-foreground">{courseName}</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Tambah Subtitle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSubtitle ? "Edit Subtitle" : "Tambah Subtitle Baru"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Subtitle *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    placeholder="Contoh: Pengenalan, Dasar-dasar, Lanjutan"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Subtitle akan digunakan untuk mengelompokkan episode dalam kursus ini
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingSubtitle ? "Perbarui" : "Simpan"} Subtitle
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : subtitles.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Belum ada subtitle untuk kursus ini. Mulai dengan menambahkan subtitle pertama.
              </p>
              <p className="text-sm text-muted-foreground">
                Subtitle membantu mengorganisir episode-episode dalam kursus menjadi bagian-bagian yang lebih terstruktur.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subtitles.map((subtitle) => (
              <Card key={subtitle.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{subtitle.name}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(subtitle)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(subtitle.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtitleManagement;