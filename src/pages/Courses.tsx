import { useState } from "react";
import { useCourses } from "@/hooks/useData";
import { motion } from "framer-motion";
import { BookOpen, Clock, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { getCourseImage } from "@/lib/course-images";

export default function Courses() {
  const { user } = useAuth();
  const isAdmin = user?.role === "company_admin" || user?.role === "super_admin";
  const { data: courses } = useCourses();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  const allCourses = courses || [];
  const categories = ["Todos", ...Array.from(new Set(allCourses.map((c: any) => c.category).filter(Boolean)))];

  const filtered = allCourses.filter((c: any) => {
    const matchesSearch = !search || c.title?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "Todos" || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">Cursos</h1>
          <p className="text-muted-foreground mt-2 text-base">{isAdmin ? "Gestiona y crea contenido de aprendizaje" : "Explora tus cursos asignados"}</p>
        </div>
        {isAdmin && (
          <Link to="/admin/courses">
            <Button className="rounded-full h-11 px-6"><Plus className="w-4 h-4 mr-2" />Crear Curso</Button>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar cursos..." className="pl-9 h-11 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat as string}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${
                activeCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveCategory(cat as string)}
            >
              {cat as string}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">No se encontraron cursos</h3>
          <p className="text-muted-foreground mt-1">Intenta ajustar tu búsqueda o filtro</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course: any, i: number) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/courses/${course.id}`} className="group block">
                <div className="rounded-2xl overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                    <img
                      src={getCourseImage(course)}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm text-foreground">
                        {course.category || "General"}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-base font-semibold text-foreground line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration || "—"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
