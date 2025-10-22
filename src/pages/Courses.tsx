import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["Semua", "Web Development", "Design", "Marketing", "AI & Data", "Mobile"];
  const [activeCategory, setActiveCategory] = useState("Semua");

  const courses = [
    {
      id: 1,
      title: "Web Development Master",
      instructor: "John Doe",
      price: "Rp 299.000",
      students: "2.5K+",
      rating: "4.8",
      category: "Web Development",
      level: "Intermediate"
    },
    {
      id: 2,
      title: "UI/UX Design Fundamental",
      instructor: "Jane Smith",
      price: "Rp 249.000",
      students: "1.8K+",
      rating: "4.9",
      category: "Design",
      level: "Beginner"
    },
    {
      id: 3,
      title: "Digital Marketing Pro",
      instructor: "Mike Johnson",
      price: "Gratis",
      students: "3.2K+",
      rating: "4.7",
      category: "Marketing",
      level: "Beginner"
    },
    {
      id: 4,
      title: "React & Next.js Complete",
      instructor: "Sarah Lee",
      price: "Rp 399.000",
      students: "1.5K+",
      rating: "4.9",
      category: "Web Development",
      level: "Advanced"
    },
    {
      id: 5,
      title: "Machine Learning Basics",
      instructor: "David Chen",
      price: "Rp 449.000",
      students: "980+",
      rating: "4.6",
      category: "AI & Data",
      level: "Intermediate"
    },
    {
      id: 6,
      title: "Mobile App Development",
      instructor: "Alex Wong",
      price: "Rp 349.000",
      students: "1.2K+",
      rating: "4.8",
      category: "Mobile",
      level: "Intermediate"
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`}>
              <Card className="h-full overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <BookOpen className="h-20 w-20 text-white/80" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{course.level}</Badge>
                    <Badge variant="outline">{course.category}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{course.title}</CardTitle>
                  <CardDescription>Oleh {course.instructor}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">{course.students} siswa</p>
                      <p className="text-sm text-muted-foreground">⭐ {course.rating}</p>
                    </div>
                    <p className="text-xl font-bold text-primary">{course.price}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

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
