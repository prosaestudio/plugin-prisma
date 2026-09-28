import { useState, useEffect, useRef } from "react";
import { Search, X, BookOpen, HelpCircle, FileText, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getCourseImage } from "@/lib/course-images";

interface SearchResult {
  id: string;
  title: string;
  type: "course" | "quiz" | "module";
  subtitle?: string;
  image?: string;
  category?: string | null;
  image_url?: string | null;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!query.trim() || !user) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      const searchTerm = `%${query}%`;
      const [courses, quizzes, modules] = await Promise.all([
        supabase.from("courses").select("id, title, category, image_url").ilike("title", searchTerm).limit(5),
        supabase.from("quizzes").select("id, title, type").ilike("title", searchTerm).limit(5),
        supabase.from("modules").select("id, title, type, course_id").ilike("title", searchTerm).limit(5),
      ]);

      const items: SearchResult[] = [
        ...(courses.data?.map((c) => ({
          id: c.id,
          title: c.title,
          type: "course" as const,
          subtitle: c.category || "Curso",
          category: c.category,
          image_url: c.image_url,
        })) || []),
        ...(quizzes.data?.map((q) => ({ id: q.id, title: q.title, type: "quiz" as const, subtitle: "Quiz" })) || []),
        ...(modules.data?.map((m) => ({ id: m.id, title: m.title, type: "module" as const, subtitle: "Módulo" })) || []),
      ];
      setResults(items);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, user]);

  const handleSelect = (item: SearchResult) => {
    setOpen(false);
    if (item.type === "course") navigate(`/courses/${item.id}`);
    else if (item.type === "quiz") navigate(`/quizzes`);
    else navigate(`/courses`);
  };

  const typeIcon = (type: string) => {
    if (type === "course") return <BookOpen className="w-4 h-4" />;
    if (type === "quiz") return <HelpCircle className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div ref={containerRef} className="hidden sm:block relative z-40">
      <motion.div
        animate={{ width: open ? 520 : 256 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative"
      >
        <div
          className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200 ${
            open ? "bg-background border border-border shadow-lg" : "bg-muted hover:bg-accent cursor-pointer"
          }`}
          onClick={() => !open && setOpen(true)}
        >
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          {open ? (
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar cursos, quizzes, módulos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
          ) : (
            <span className="text-sm text-muted-foreground flex-1">Buscar...</span>
          )}
          {open ? (
            <button onClick={() => setOpen(false)} className="p-0.5 rounded hover:bg-muted text-muted-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="ml-auto text-[10px] bg-background px-1.5 py-0.5 rounded border border-border font-mono text-muted-foreground">⌘K</kbd>
          )}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{ transformOrigin: "top" }}
              className="absolute top-full left-0 right-0 mt-1 bg-background rounded-xl border border-border shadow-2xl overflow-hidden"
            >
              <div className="max-h-[50vh] overflow-y-auto">
                {loading && (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">Buscando...</div>
                )}

                {!loading && query && results.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No se encontraron resultados para "{query}"
                  </div>
                )}

                {!loading && results.length > 0 && (
                  <div className="py-1">
                    {results.map((item) => (
                      <button
                        key={`${item.type}-${item.id}`}
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-left group"
                      >
                        {item.type === "course" ? (
                          <div className="flex items-center gap-3 w-full">
                            <img
                              src={getCourseImage({ id: item.id, image_url: item.image_url, category: item.category, title: item.title })}
                              alt=""
                              className="w-[188px] h-[126px] rounded-xl object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </div>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-lg bg-muted group-hover:bg-background flex items-center justify-center text-muted-foreground shrink-0">
                              {typeIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {!query && (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Escribe para buscar en toda la plataforma
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 -z-10"
            style={{ zIndex: -1 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
