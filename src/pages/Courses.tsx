import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  price: number;
  is_free: boolean;
  level: string;
  duration_hours: number;
  category?: string;
  course_categories?: {
    name: string;
  };
  profiles?: {
    full_name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesResult, categoriesResult] = await Promise.all([
        supabase
          .from("courses")
          .select(`
            *,
            course_categories:category_id (name)
          `)
          .eq("status", "published")
          .order("created_at", { ascending: false }),
        supabase
          .from("course_categories")
          .select("*")
          .order("name", { ascending: true })
      ]);

      if (coursesResult.error) throw coursesResult.error;
      if (categoriesResult.error) throw categoriesResult.error;

      setCourses(coursesResult.data || []);
      setCategories(categoriesResult.data || []);
    } catch (error: any) {
      toast.error("Gagal memuat data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = selectedCategory === "all"
    ? courses
    : courses.filter(course => {
        const categoryName = course.course_categories?.name?.toLowerCase() || course.category?.toLowerCase();
        return categoryName === selectedCategory.toLowerCase();
      });

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Katalog Kursus</h1>
          <p className="text-muted-foreground">Temukan kursus terbaik untuk meningkatkan skill digital Anda</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
          >
            Semua
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.name.toLowerCase() ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.name.toLowerCase())}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Belum ada kursus tersedia
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="group overflow-hidden border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                {course.thumbnail_url && (
                  <img
                    src={course.thumbnail_url}
                    alt={`Thumbnail kursus ${course.title}`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{course.course_categories?.name || "Umum"}</Badge>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      {course.is_free ? "Gratis" : `Rp ${course.price.toLocaleString('id-ID')}`}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/courses/${course.id}`}>Lihat Detail</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
