import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const categories = ["Semua", "Web Development", "Design", "Marketing", "AI & Data", "Mobile"];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:instructor_id (full_name)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat kursus",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Semua" || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Katalog Kursus</h1>
          <p className="text-muted-foreground">Temukan kursus terbaik untuk meningkatkan skill digital Anda</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari kursus atau instruktur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Menampilkan {filteredCourses.length} kursus
          </p>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat kursus...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
                  <div className="h-48 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="h-20 w-20 text-white/80" />
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{course.level || 'Beginner'}</Badge>
                      <Badge variant="outline">{course.category || 'General'}</Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{course.title}</CardTitle>
                    <CardDescription>Oleh {course.profiles?.full_name || 'Instruktur'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {course.duration_hours ? `${course.duration_hours} jam` : 'Durasi variatif'}
                        </p>
                      </div>
                      <p className="text-xl font-bold text-primary">
                        {course.is_free ? 'Gratis' : `Rp ${Number(course.price).toLocaleString('id-ID')}`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Tidak ada kursus yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
