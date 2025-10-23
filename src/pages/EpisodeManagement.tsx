import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Episode {
  id: string;
  title: string;
  subtitle_id?: string;
  episode_subtitles?: {
    name: string;
  };
  description: string;
  youtube_url: string;
  episode_number: number;
  duration_minutes: number;
  is_preview: boolean;
}

interface Subtitle {
  id: string;
  name: string;
}

const EpisodeManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle_id: "",
    description: "",
    youtube_url: "",
    episode_number: 1,
    duration_minutes: 0,
    is_preview: false
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchEpisodes();
      fetchSubtitles();
    }
  }, [courseId]);

  const fetchSubtitles = async () => {
    try {
      const { data, error } = await supabase
        .from("episode_subtitles")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setSubtitles(data || []);
    } catch (error: any) {
      toast.error("Gagal memuat subtitle");
    }
  };

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

  const fetchEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from("course_episodes")
        .select(`
          *,
          episode_subtitles:subtitle_id (name)
        `)
        .eq("course_id", courseId)
        .order("episode_number", { ascending: true });

      if (error) throw error;
      setEpisodes(data || []);
    } catch (error: any) {
      toast.error("Gagal memuat episode");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingEpisode) {
        const { error } = await supabase
          .from("course_episodes")
          .update(formData)
          .eq("id", editingEpisode.id);

        if (error) throw error;
        toast.success("Episode berhasil diperbarui!");
      } else {
        const { error } = await supabase
          .from("course_episodes")
          .insert([{ ...formData, course_id: courseId }]);

        if (error) throw error;
        toast.success("Episode berhasil ditambahkan!");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchEpisodes();
    } catch (error: any) {
      toast.error("Gagal menyimpan episode: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus episode ini?")) return;

    try {
      const { error } = await supabase
        .from("course_episodes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Episode berhasil dihapus!");
      fetchEpisodes();
    } catch (error: any) {
      toast.error("Gagal menghapus episode: " + error.message);
    }
  };

  const handleEdit = (episode: Episode) => {
    setEditingEpisode(episode);
    setFormData({
      title: episode.title,
      subtitle_id: episode.subtitle_id || "",
      description: episode.description || "",
      youtube_url: episode.youtube_url,
      episode_number: episode.episode_number,
      duration_minutes: episode.duration_minutes || 0,
      is_preview: episode.is_preview
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingEpisode(null);
    const nextEpisodeNumber = episodes.length > 0 
      ? Math.max(...episodes.map(e => e.episode_number)) + 1 
      : 1;
    
    setFormData({
      title: "",
      subtitle_id: "",
      description: "",
      youtube_url: "",
      episode_number: nextEpisodeNumber,
      duration_minutes: 0,
      is_preview: false
    });
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
            <h1 className="text-4xl font-bold mb-2">Kelola Episode</h1>
            <p className="text-muted-foreground">{courseName}</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Tambah Episode
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingEpisode ? "Edit Episode" : "Tambah Episode Baru"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="episode_number">Nomor Episode *</Label>
                  <Input
                    id="episode_number"
                    type="number"
                    value={formData.episode_number}
                    onChange={(e) => setFormData({ ...formData, episode_number: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="title">Judul Episode *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle_id">Sub Judul</Label>
                  <Select
                    value={formData.subtitle_id}
                    onValueChange={(value) => setFormData({ ...formData, subtitle_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih subtitle (opsional)..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tanpa Subtitle</SelectItem>
                      {subtitles.map((subtitle) => (
                        <SelectItem key={subtitle.id} value={subtitle.id}>
                          {subtitle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="youtube_url">URL YouTube *</Label>
                  <Input
                    id="youtube_url"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Durasi (menit)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_preview"
                    checked={formData.is_preview}
                    onChange={(e) => setFormData({ ...formData, is_preview: e.target.checked })}
                  />
                  <Label htmlFor="is_preview">Izinkan Preview Gratis</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingEpisode ? "Perbarui" : "Simpan"} Episode
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
        ) : (
          <div className="space-y-4">
            {episodes.map((episode) => (
              <Card key={episode.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <span>Episode {episode.episode_number}: {episode.title}</span>
                      {episode.episode_subtitles?.name && (
                        <p className="text-sm font-medium text-muted-foreground mt-1">{episode.episode_subtitles.name}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {episode.is_preview && (
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                          Preview
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(episode)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(episode.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {episode.description}
                  </p>
                  <a
                    href={episode.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {episode.youtube_url}
                  </a>
                  {episode.duration_minutes > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Durasi: {episode.duration_minutes} menit
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EpisodeManagement;
