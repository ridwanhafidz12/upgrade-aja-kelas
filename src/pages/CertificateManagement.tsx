import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash2, ExternalLink, Upload, CheckCircle2 } from "lucide-react";
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
  certificate_template_url: string | null;
}

const CertificateManagement = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const [selectedCourseForTemplate, setSelectedCourseForTemplate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [certsResult, coursesResult] = await Promise.all([
        supabase
          .from("certificates")
          .select(`
            *,
            courses:course_id (title)
          `)
          .order("issued_at", { ascending: false }),
        supabase
          .from("courses")
          .select("id, title, certificate_template_url")
          .eq("status", "published")
          .order("title")
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

      setCertificates(certsWithProfiles);
      const courseList = coursesResult.data || [];
      setCourses(courseList);

      // Generate signed URLs for private template previews
      const map: Record<string, string> = {};
      await Promise.all(
        courseList.map(async (course) => {
          if (course.certificate_template_url) {
            const key = course.certificate_template_url.split('/').pop() as string;
            const { data } = await supabase
              .storage
              .from('certificate-templates')
              .createSignedUrl(key, 3600);
            if (data?.signedUrl) {
              map[course.id] = data.signedUrl;
            }
          }
        })
      );
      setSignedUrls(map);
    } catch (error: any) {
      toast.error("Gagal memuat data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async () => {
    if (!selectedCourseForTemplate || !selectedFile) {
      toast.error("Pilih kursus dan file template terlebih dahulu");
      return;
    }

    const file = selectedFile;

    // Validate file type
    if (!file.type.includes('image')) {
      toast.error("File harus berupa gambar (PNG, JPG, etc)");
      return;
    }

    setUploadingTemplate(true);

    try {
      // Upload to storage with deterministic path (1 template per course)
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedCourseForTemplate}-template.${fileExt}`;

      // Delete old template if exists
      const course = courses.find(c => c.id === selectedCourseForTemplate);
      if (course?.certificate_template_url) {
        const oldFileName = course.certificate_template_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('certificate-templates')
            .remove([oldFileName]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('certificate-templates')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Store public URL (for reference); we'll use signed URLs for preview
      const { data: { publicUrl } } = supabase.storage
        .from('certificate-templates')
        .getPublicUrl(fileName);

      // Update course with template URL
      const { error: updateError } = await supabase
        .from('courses')
        .update({ certificate_template_url: publicUrl })
        .eq('id', selectedCourseForTemplate);

      if (updateError) throw updateError;

      toast.success("Template sertifikat berhasil disimpan!");
      setSelectedCourseForTemplate("");
      setSelectedFile(null);
      await fetchData();
    } catch (error: any) {
      toast.error("Gagal menyimpan template: " + error.message);
    } finally {
      setUploadingTemplate(false);
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

  const selectedCourse = courses.find(c => c.id === selectedCourseForTemplate);

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Kelola Sertifikat</h1>
          <p className="text-muted-foreground">
            Upload template sertifikat untuk setiap kursus. Sertifikat akan otomatis dibuat ketika user menyelesaikan kursus.
          </p>
        </div>

        {/* Upload Template Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Template Sertifikat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="course-select" className="text-sm font-medium mb-2 block">
                Pilih Kursus
              </Label>
              <Select
                value={selectedCourseForTemplate}
                onValueChange={setSelectedCourseForTemplate}
              >
                <SelectTrigger id="course-select">
                  <SelectValue placeholder="Pilih kursus untuk upload template..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      <div className="flex items-center gap-2">
                        {course.certificate_template_url && (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        )}
                        {course.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCourseForTemplate && (
              <div>
                <Label htmlFor="template-file" className="text-sm font-medium mb-2 block">
                  Upload Template (PNG/JPG)
                </Label>
                <div className="flex gap-2">
                  <input
                    id="template-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    disabled={uploadingTemplate}
                    className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <Button
                    type="button"
                    onClick={saveTemplate}
                    disabled={!selectedCourseForTemplate || !selectedFile || uploadingTemplate}
                  >
                    <Upload className="mr-2 h-4 w-4" /> Simpan Template
                  </Button>
                </div>
                {selectedCourse?.certificate_template_url && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">Template saat ini:</p>
                    <img 
                      src={signedUrls[selectedCourse.id] || selectedCourse.certificate_template_url} 
                      alt="Current template" 
                      className="w-64 h-auto border rounded-lg"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Catatan:</strong> Template akan digunakan untuk generate sertifikat otomatis ketika user menyelesaikan 100% dari kursus. 
                Pastikan template memiliki ruang untuk nama user, judul kursus, dan tanggal.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Daftar Template per Kursus */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Template per Kursus</h2>
          <Card>
            <CardContent className="space-y-4 pt-6">
              {courses.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada kursus terbit.</p>
              ) : (
                courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between gap-4 p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {course.certificate_template_url ? 'Template tersedia' : 'Belum ada template'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {course.certificate_template_url && (
                        <img
                          src={signedUrls[course.id] || course.certificate_template_url}
                          alt={`Template ${course.title}`}
                          className="w-40 h-auto rounded border"
                        />
                      )}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            setSelectedCourseForTemplate(course.id);
                            setSelectedFile(e.target.files?.[0] || null);
                          }}
                        />
                        <Button variant="outline" size="sm">Ganti Template</Button>
                      </label>
                      <Button
                        size="sm"
                        onClick={saveTemplate}
                        disabled={uploadingTemplate || selectedCourseForTemplate !== course.id || !selectedFile}
                      >
                        Simpan
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Certificates List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Daftar Sertifikat Terbit</h2>
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : certificates.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                Belum ada sertifikat yang diterbitkan. Sertifikat akan otomatis dibuat ketika user menyelesaikan kursus.
              </CardContent>
            </Card>
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
                        {cert.certificate_number && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={`/certificate/verify/${cert.certificate_number}`}>
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
    </div>
  );
};

export default CertificateManagement;
