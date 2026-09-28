import { motion } from "framer-motion";
import { ArrowRight, Target, Zap, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useCourses } from "@/hooks/useData";

const SKILL_KEYWORDS: Record<string, { keywords: string[]; icon: string; color: string }> = {
 "Liderazgo": { keywords: ["liderazgo", "management", "gestión", "equipo"], icon: "", color: "from-amber-500/10 to-orange-500/10" },
 "Comunicación": { keywords: ["comunicación", "presentación", "oratoria"], icon: "", color: "from-blue-500/10 to-cyan-500/10" },
 "Ventas": { keywords: ["ventas", "sales", "comercial", "negociación"], icon: "", color: "from-green-500/10 to-emerald-500/10" },
 "Tecnología": { keywords: ["programación", "software", "tech", "digital", "ia"], icon: "", color: "from-purple-500/10 to-violet-500/10" },
 "Innovación": { keywords: ["innovación", "design thinking", "creatividad"], icon: "", color: "from-yellow-500/10 to-amber-500/10" },
};

export function SkillPulse() {
 const { data: courses } = useCourses();

 const skillSuggestions = Object.entries(SKILL_KEYWORDS).map(([name, { keywords, icon, color }]) => {
 const matchingCourses = (courses || []).filter((c: any) =>
 keywords.some((k) => (c.title + " " + (c.description || "") + " " + (c.category || "")).toLowerCase().includes(k))
 );
 return { name, icon, color, courseCount: matchingCourses.length, topCourse: matchingCourses[0] };
 }).filter((s) => s.courseCount > 0).slice(0, 4);

 if (skillSuggestions.length === 0) return null;

 return (
 <div className="mb-10">
 <div className="flex items-center justify-between mb-5">
 <div className="flex items-center gap-2">
 <Zap className="w-4 h-4 text-primary" />
 <h2 className="text-lg font-semibold text-foreground">Recomendado para vos</h2>
 </div>
 <Link to="/skills" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
 Ver mis skills <ArrowRight className="w-3 h-3" />
 </Link>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
 {skillSuggestions.map((skill, i) => (
 <motion.div
 key={skill.name}
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.06 }}
 >
 <Link
 to={skill.topCourse ? `/courses/${skill.topCourse.id}` : "/skills"}
 className="block group"
 >
 <div className={`rounded-2xl p-5 bg-gradient-to-br ${skill.color} border border-border/50 hover:border-primary/20 transition-all`}>
 <div className="flex items-start justify-between mb-3">
 <span className="text-2xl">{skill.icon}</span>
 <div className="flex items-center gap-1 text-xs text-muted-foreground">
 <BookOpen className="w-3 h-3" /> {skill.courseCount}
 </div>
 </div>
 <h3 className="text-sm font-semibold text-foreground mb-1">{skill.name}</h3>
 {skill.topCourse && (
 <p className="text-xs text-muted-foreground line-clamp-1">{skill.topCourse.title}</p>
 )}
 <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
 Explorar <ArrowRight className="w-3 h-3" />
 </div>
 </div>
 </Link>
 </motion.div>
 ))}
 </div>
 </div>
 );
}
