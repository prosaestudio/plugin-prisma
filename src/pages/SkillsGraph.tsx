import { motion } from "framer-motion";
import { Target, TrendingUp, Award, Radar, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useCourses } from "@/hooks/useData";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const SKILL_MAP: Record<string, string[]> = {
  "Liderazgo": ["liderazgo", "management", "gestión", "dirección", "equipo"],
  "Comunicación": ["comunicación", "presentación", "oratoria", "writing", "redacción"],
  "Análisis de Datos": ["datos", "analytics", "excel", "data", "estadística", "bi"],
  "Gestión de Proyectos": ["proyecto", "agile", "scrum", "planificación", "pmo"],
  "Ventas": ["ventas", "sales", "negociación", "comercial", "cliente"],
  "Tecnología": ["programación", "software", "tech", "digital", "código", "ia", "ai"],
  "Innovación": ["innovación", "design thinking", "creatividad", "ideación"],
  "Finanzas": ["finanzas", "presupuesto", "contabilidad", "costos"],
};

const CAREER_PATHS = [
  { title: "Team Lead", requiredSkills: ["Liderazgo", "Comunicación", "Gestión de Proyectos"] },
  { title: "Director Comercial", requiredSkills: ["Ventas", "Liderazgo", "Análisis de Datos"] },
  { title: "Product Manager", requiredSkills: ["Gestión de Proyectos", "Análisis de Datos", "Comunicación", "Tecnología"] },
  { title: "Director de Innovación", requiredSkills: ["Innovación", "Liderazgo", "Tecnología", "Comunicación"] },
];

export default function SkillsGraph() {
  const { user } = useAuth();
  const { data: courses } = useCourses();

  const { data: quizResults } = useQuery({
    queryKey: ["skills-quiz-results", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("quiz_results").select("score, total_questions, quiz_id").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: progressData } = useQuery({
    queryKey: ["skills-progress", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("progress_tracking").select("completed, module_id").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Calculate skills from courses + quizzes
  const skills = Object.entries(SKILL_MAP).map(([name, keywords]) => {
    const matchingCourses = (courses || []).filter((c: any) =>
      keywords.some((k) => (c.title + " " + (c.description || "") + " " + (c.category || "")).toLowerCase().includes(k))
    );
    const courseScore = Math.min(matchingCourses.length * 20, 60);
    const completedModules = (progressData || []).filter((p) => p.completed).length;
    const progressScore = Math.min(completedModules * 5, 25);
    const quizScore = quizResults?.length ? Math.min(
      Math.round(quizResults.reduce((a, r) => a + (r.total_questions > 0 ? (r.score / r.total_questions) * 100 : 0), 0) / quizResults.length / 10), 15
    ) : 0;
    const level = Math.min(courseScore + progressScore + quizScore, 100);
    return { name, level, evidence: matchingCourses.length, courses: matchingCourses };
  }).sort((a, b) => b.level - a.level);

  // Find best career match
  const careerMatches = CAREER_PATHS.map((path) => {
    const matchedSkills = path.requiredSkills.filter((rs) => skills.find((s) => s.name === rs && s.level > 30));
    const match = Math.round((matchedSkills.length / path.requiredSkills.length) * 100);
    const missing = path.requiredSkills.filter((rs) => !skills.find((s) => s.name === rs && s.level > 30));
    return { ...path, match, missing };
  }).sort((a, b) => b.match - a.match);

  const bestPath = careerMatches[0];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground">Mis Skills</h1>
        </div>
        <p className="text-muted-foreground text-lg mt-2 max-w-2xl">
          Tu perfil de habilidades calculado a partir de tus cursos, módulos completados y evaluaciones.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Radar className="w-5 h-5 text-primary" /> Perfil de Habilidades
          </h2>
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{skill.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{skill.evidence} cursos</span>
                  <span className="text-sm font-semibold text-foreground">{skill.level}%</span>
                </div>
              </div>
              <Progress value={skill.level} className="h-2" />
              {skill.courses.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {skill.courses.slice(0, 3).map((c: any) => (
                    <Link key={c.id} to={`/courses/${c.id}`} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      {c.title}
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Career GPS</h3>
            </div>
            {careerMatches.map((path, i) => (
              <div key={path.title} className={`mb-4 last:mb-0 ${i > 0 ? "pt-4 border-t border-border" : ""}`}>
                <p className="text-sm font-semibold text-foreground mb-1">{path.title}</p>
                <div className="flex items-center gap-2 mb-2">
                  <Progress value={path.match} className="h-2 flex-1" />
                  <span className="text-xs font-medium text-foreground">{path.match}%</span>
                </div>
                {path.missing.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {path.missing.map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">{s}</span>
                    ))}
                  </div>
                )}
                {path.missing.length === 0 && (
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ¡Skills completas!
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          <div className="rounded-2xl bg-muted p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Resumen</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-xl bg-background">
                <p className="text-2xl font-bold text-foreground">{(courses || []).length}</p>
                <p className="text-xs text-muted-foreground">Cursos</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-background">
                <p className="text-2xl font-bold text-foreground">{(progressData || []).filter((p) => p.completed).length}</p>
                <p className="text-xs text-muted-foreground">Módulos</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-background">
                <p className="text-2xl font-bold text-foreground">{quizResults?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Quizzes</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-background">
                <p className="text-2xl font-bold text-foreground">{skills.filter((s) => s.level > 50).length}</p>
                <p className="text-xs text-muted-foreground">Skills 50%+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}