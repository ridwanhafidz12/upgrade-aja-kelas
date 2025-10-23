import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  issued_at: string;
  qr_code_url: string | null;
  profiles: {
    full_name: string;
  };
  courses: {
    title: string;
  };
}

interface Course {
  id: string;
  title: string;
}

interface User {
  id: string;
  full_name: string;
}

const CertificateManagement = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    course_id: ""
  });
  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const [selectedCourseForTemplate, setSelectedCourseForTemplate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [certsResult, coursesResult, usersResult] = await Promise.all([
        supabase
          .from("certificates")
          .select(`
            *,
            courses:course_id (title)
          `)
          .order("issued_at", { ascending: false }),
        supabase
          .from("courses")
          .select("id, title")
          .eq("status", "published")
          .order("title"),
        supabase
          .from("profiles")
          .select("id, full_name")
          .order("full_name")
      ]);
      
      // Fetch profiles separately for certificates
      const certsWithProfiles = await Promise.all(
        (certsResult.data || []).map(async (cert) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", cert.user_id)
            .single();
          
          return {
            ...cert,
            profiles: profile
          };
        })
      );

      if (certsResult.error) throw certsResult.error;
      if (coursesResult.error) throw coursesResult.error;
      if (usersResult.error) throw usersResult.error;

      setCertificates(certsWithProfiles);
      setCourses(coursesResult.data || []);
      setUsers(usersResult.data || []);
    } catch (error: any) {
      toast.error("Gagal memuat data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.functions.invoke("generate-certificate", {
        body: {
          userId: formData.user_id,
          courseId: formData.course_id
        }
      });

      if (error) throw error;
      toast.success("Sertifikat berhasil dibuat!");
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error("Gagal membuat sertifikat: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus sertifikat ini?")) return;

    try {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Sertifikat berhasil dihapus!");
      fetchData();
    } catch (error: any) {
      toast.error("Gagal menghapus sertifikat: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({ user_id: "", course_id: "" });
  };

  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !selectedCourseForTemplate) {
      toast.error("Pilih kursus dan file template terlebih dahulu");
      return;
    }

    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.includes('image')) {
      toast.error("File harus berupa gambar (PNG, JPG, etc)");
      return;
    }

    setUploadingTemplate(true);
    
    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedCourseForTemplate}-template.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('certificate-templates')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('certificate-templates')
        .getPublicUrl(fileName);

      // Update course with template URL
      const { error: updateError } = await supabase
        .from('courses')
        .update({ certificate_template_url: publicUrl })
        .eq('id', selectedCourseForTemplate);

      if (updateError) throw updateError;

      toast.success("Template sertifikat berhasil diupload!");
      setSelectedCourseForTemplate("");
      fetchData();
    } catch (error: any) {
      toast.error("Gagal upload template: " + error.message);
    } finally {
      setUploadingTemplate(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Kelola Sertifikat</h1>
            <p className="text-muted-foreground">Terbitkan dan kelola sertifikat penyelesaian kursus</p>
          </div>

          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Terbitkan Sertifikat
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Terbitkan Sertifikat Baru</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="user_id">Pilih User *</Label>
                  <Select
                    value={formData.user_id}
                    onValueChange={(value) => setFormData({ ...formData, user_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih user..." />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="course_id">Pilih Kursus *</Label>
                  <Select
                    value={formData.course_id}
                    onValueChange={(value) => setFormData({ ...formData, course_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kursus..." />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Terbitkan Sertifikat
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

          <Card className="w-96">
            <CardContent className="p-4">
              <Label className="text-sm font-medium mb-2 block">Upload Template Sertifikat</Label>
              <Select
                value={selectedCourseForTemplate}
                onValueChange={setSelectedCourseForTemplate}
              >
                <SelectTrigger className="mb-2">
                  <SelectValue placeholder="Pilih kursus..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="file"
                accept="image/*"
                onChange={handleTemplateUpload}
                disabled={!selectedCourseForTemplate || uploadingTemplate}
                className="w-full text-sm"
              />
            </CardContent>
          </Card>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <Card key={cert.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <div className="text-lg">{cert.certificate_number}</div>
                      <div className="text-sm font-normal text-muted-foreground mt-1">
                        {cert.profiles?.full_name} - {cert.courses?.title}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {cert.qr_code_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href={cert.qr_code_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(cert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Diterbitkan: {new Date(cert.issued_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateManagement;
