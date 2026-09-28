import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Loader2, BookOpen, Target, Zap, Theater } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCourses } from "@/hooks/useData";
import { Link, useNavigate } from "react-router-dom";

const quickActions = [
 { label: "Simulación de ventas", icon: Theater, path: "/simulations" },
 { label: "Microlearning rápido", icon: Zap, path: "/microlearning" },
 { label: "Mis habilidades", icon: Target, path: "/skills" },
 { label: "Ver cursos", icon: BookOpen, path: "/courses" },
];

const placeholders = [
 "¿Cómo mejorar mi comunicación en equipo?",
 "Quiero aprender sobre liderazgo...",
 "¿Qué curso me recomiendas para negociación?",
 "Necesito preparar una presentación...",
 "¿Cómo dar feedback constructivo?",
];

interface AiSuggestion {
 type: "course" | "action" | "tip";
 title: string;
 description: string;
 link?: string;
 icon?: string;
}

const BG_IMAGE = "https://i.pinimg.com/1200x/0b/44/1e/0b441efb82cd8d8a17c6b2f1f9cc554d.jpg";

export function AiSearchHero() {
 const { user } = useAuth();
 const { data: courses } = useCourses();
 const navigate = useNavigate();
 const [query, setQuery] = useState("");
 const [focused, setFocused] = useState(false);
 const [loading, setLoading] = useState(false);
 const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
 const [placeholderIdx, setPlaceholderIdx] = useState(0);
 const [typed, setTyped] = useState("");
 const inputRef = useRef<HTMLInputElement>(null);
 const debounceRef = useRef<ReturnType<typeof setTimeout>>();

 const hour = new Date().getHours();
 const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

 useEffect(() => {
 if (focused || query) return;
 const interval = setInterval(() => {
 setPlaceholderIdx((p) => (p + 1) % placeholders.length);
 setTyped("");
 }, 4000);
 return () => clearInterval(interval);
 }, [focused, query]);

 useEffect(() => {
 if (focused || query) return;
 const target = placeholders[placeholderIdx];
 let charIdx = 0;
 const typeInterval = setInterval(() => {
 if (charIdx <= target.length) {
 setTyped(target.slice(0, charIdx));
 charIdx++;
 } else {
 clearInterval(typeInterval);
 }
 }, 45);
 return () => clearInterval(typeInterval);
 }, [placeholderIdx, focused, query]);

 const searchAi = async (q: string) => {
 if (!q.trim()) { setSuggestions([]); return; }
 setLoading(true);
 try {
 const courseList = (courses || []).slice(0, 15).map((c: any) => `- ${c.title} (${c.category || "General"})`).join("\n");
 const { data, error } = await supabase.functions.invoke("ai-assistant", {
 body: {
 messages: [{
 role: "user",
 content: `El usuario busca: "${q}"\n\nCursos disponibles:\n${courseList}\n\nResponde SOLO con un JSON array (sin markdown) con 3-4 sugerencias relevantes. Cada objeto debe tener: type ("course"|"action"|"tip"), title (corto), description (1 oración), icon (1 emoji). Si hay cursos que matchean, incluí su título exacto como title.`
 }],
 userName: user?.name,
 },
 });
 if (error) throw error;
 const parsed = JSON.parse(data.reply.replace(/```json\n?/g, "").replace(/```/g, "").trim());
 setSuggestions(Array.isArray(parsed) ? parsed : []);
 } catch {
 setSuggestions([]);
 } finally {
 setLoading(false);
 }
 };

 const handleChange = (val: string) => {
 setQuery(val);
 if (debounceRef.current) clearTimeout(debounceRef.current);
 if (val.trim().length > 2) {
 debounceRef.current = setTimeout(() => searchAi(val), 800);
 } else {
 setSuggestions([]);
 }
 };

 const handleSuggestionClick = (s: AiSuggestion) => {
 const matchingCourse = (courses || []).find((c: any) =>
 c.title.toLowerCase().includes(s.title.toLowerCase()) || s.title.toLowerCase().includes(c.title.toLowerCase())
 );
 if (matchingCourse) {
 navigate(`/courses/${matchingCourse.id}`);
 } else if (s.type === "action") {
 if (s.title.toLowerCase().includes("simulac")) navigate("/simulations");
 else if (s.title.toLowerCase().includes("micro")) navigate("/microlearning");
 else if (s.title.toLowerCase().includes("skill") || s.title.toLowerCase().includes("habilidad")) navigate("/skills");
 else navigate("/courses");
 }
 setQuery("");
 setSuggestions([]);
 };

 return (
 <div
 data-tour="dashboard-hero"
 className="relative min-h-screen flex flex-col items-center justify-center"
 >
 {/* Background image */}
 <div
 className="absolute inset-0 bg-cover bg-center bg-no-repeat"
 style={{ backgroundImage: `url(${BG_IMAGE})` }}
 />
 {/* Dark overlay for text contrast */}
 <div className="absolute inset-0 bg-foreground/60" />

 <div className="relative z-10 w-full max-w-2xl mx-auto px-6 lg:px-8 text-center">
 {/* Greeting */}
 <motion.div
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="mb-8"
 >
 <p className="text-primary-foreground/60 text-sm mb-2">{greeting} </p>
 <h1 className="text-4xl lg:text-5xl font-semibold text-primary-foreground tracking-tight font-display">
 {user?.name || "Usuario"}
 </h1>
 </motion.div>

 {/* Search input */}
 <motion.div
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 className="mb-8 relative"
 >
 <div className="relative">
 <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
 {loading ? (
 <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
 ) : (
 <Sparkles className="w-5 h-5 text-muted-foreground" />
 )}
 </div>
 <input
 ref={inputRef}
 value={query}
 onChange={(e) => handleChange(e.target.value)}
 onFocus={() => setFocused(true)}
 onBlur={() => setTimeout(() => setFocused(false), 200)}
 placeholder={focused ? "Escribe lo que quieres aprender..." : ""}
 className="w-full h-14 pl-12 pr-12 rounded-2xl bg-background text-foreground text-base border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
 />
 {!query && !focused && (
 <div className="absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-base">
 {typed}<span className="animate-pulse">|</span>
 </div>
 )}
 {query && (
 <button
 onClick={() => searchAi(query)}
 className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
 >
 <ArrowRight className="w-4 h-4" />
 </button>
 )}
 </div>

 {/* AI Suggestions dropdown */}
 <AnimatePresence>
 {suggestions.length > 0 && (
 <motion.div
 initial={{ opacity: 0, y: -8 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -8 }}
 className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-background border border-border shadow-xl z-50 overflow-hidden"
 >
 <div className="p-2">
 <p className="text-xs text-muted-foreground px-3 py-1.5 flex items-center gap-1.5">
 <Sparkles className="w-3 h-3" /> Sugerencias de IA
 </p>
 {suggestions.map((s, i) => (
 <button
 key={i}
 onClick={() => handleSuggestionClick(s)}
 className="w-full text-left px-3 py-3 rounded-xl hover:bg-muted transition-colors flex items-start gap-3"
 >
 <span className="text-lg shrink-0 mt-0.5">{s.icon || ""}</span>
 <div className="min-w-0">
 <p className="text-sm font-medium text-foreground">{s.title}</p>
 <p className="text-xs text-muted-foreground line-clamp-1">{s.description}</p>
 </div>
 <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
 </button>
 ))}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>

 {/* Quick actions */}
 <motion.div
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.35 }}
 className="flex flex-wrap justify-center gap-2"
 >
 {quickActions.map((action) => (
 <Link key={action.path} to={action.path}>
 <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground/80 hover:text-primary-foreground text-sm transition-all backdrop-blur-sm">
 <action.icon className="w-3.5 h-3.5" />
 {action.label}
 </button>
 </Link>
 ))}
 </motion.div>
 </div>
 </div>
 );
}
