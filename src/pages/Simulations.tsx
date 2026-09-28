import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Theater, Mic, MessageSquare, Star, ArrowRight, Send, X, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Scenario {
 title: string;
 category: string;
 difficulty: string;
 duration: string;
 icon: string;
 context: string;
 aiRole: string;
 userRole: string;
 description: string;
}

interface FeedbackData {
 overall_score: number;
 dimensions: { name: string; score: number; comment: string }[];
 strengths: string[];
 improvements: string[];
 summary: string;
}

interface ChatMessage {
 role: "user" | "assistant";
 content: string;
}

const scenarios: Scenario[] = [
 {
 title: "Venta consultiva B2B",
 category: "Ventas",
 difficulty: "Intermedio",
 duration: "15 min",
 icon: "",
 context: "Eres un director de compras de una empresa mediana que está evaluando cambiar de proveedor de software CRM. Tienes objeciones sobre el precio y la migración de datos.",
 aiRole: "Director de Compras de TechCorp, escéptico pero abierto a escuchar",
 userRole: "representante de ventas presentando su solución CRM",
 description: "Practica vender una solución B2B a un cliente con objeciones reales",
 },
 {
 title: "Feedback difícil a un colaborador",
 category: "Liderazgo",
 difficulty: "Avanzado",
 duration: "10 min",
 icon: "",
 context: "Eres un empleado que ha estado llegando tarde frecuentemente y la calidad de su trabajo ha bajado. Tienes problemas personales pero no quieres compartirlos. Te pones a la defensiva.",
 aiRole: "Empleado con bajo rendimiento reciente, algo defensivo",
 userRole: "líder/gerente dando feedback constructivo",
 description: "Practica dar retroalimentación difícil con empatía y firmeza",
 },
 {
 title: "Negociación de contrato",
 category: "Negociación",
 difficulty: "Avanzado",
 duration: "20 min",
 icon: "",
 context: "Eres el representante legal del cliente. Quieres bajar el precio un 20%, extender el plazo de pago a 90 días y reducir las penalidades. Eres firme pero profesional.",
 aiRole: "Representante legal del cliente, negociador experimentado",
 userRole: "representante de la empresa defendiendo condiciones contractuales",
 description: "Negocia términos de contrato con un cliente exigente",
 },
 {
 title: "Atención al cliente frustrado",
 category: "Servicio",
 difficulty: "Básico",
 duration: "10 min",
 icon: "",
 context: "Eres un cliente que compró un producto que llegó dañado. Ya contactaste al soporte una vez y no resolvieron nada. Estás frustrado y amenazas con cancelar tu suscripción.",
 aiRole: "Cliente frustrado con un problema no resuelto",
 userRole: "agente de soporte al cliente",
 description: "Resuelve la queja de un cliente enojado con profesionalismo",
 },
 {
 title: "Entrevista de trabajo técnica",
 category: "RRHH",
 difficulty: "Intermedio",
 duration: "15 min",
 icon: "",
 context: "Eres un candidato aplicando para un puesto de Product Manager. Tienes 5 años de experiencia, buenas habilidades pero tendés a dar respuestas vagas. Pide clarificación cuando las preguntas son ambiguas.",
 aiRole: "Candidato a Product Manager con experiencia media",
 userRole: "entrevistador evaluando al candidato",
 description: "Conduce una entrevista evaluando competencias del candidato",
 },
 {
 title: "Pitch de producto a inversores",
 category: "Ventas",
 difficulty: "Avanzado",
 duration: "12 min",
 icon: "",
 context: "Eres un inversor ángel. Has visto muchos pitches. Haces preguntas difíciles sobre unit economics, competencia, y escalabilidad. Eres directo y no pierdes el tiempo.",
 aiRole: "Inversor ángel experimentado y directo",
 userRole: "founder presentando su startup para obtener inversión",
 description: "Presenta tu producto a un inversor exigente",
 },
];

function SimulationChat({ scenario, onClose }: { scenario: Scenario; onClose: () => void }) {
 const { user } = useAuth();
 const { toast } = useToast();
 const [messages, setMessages] = useState<ChatMessage[]>([]);
 const [input, setInput] = useState("");
 const [loading, setLoading] = useState(false);
 const [feedback, setFeedback] = useState<FeedbackData | null>(null);
 const [loadingFeedback, setLoadingFeedback] = useState(false);
 const [started, setStarted] = useState(false);

 const startSimulation = async () => {
 setStarted(true);
 setLoading(true);
 try {
 const { data, error } = await supabase.functions.invoke("simulation-ai", {
 body: {
 messages: [{ role: "user", content: "Hola, empecemos la simulación." }],
 scenario,
 mode: "simulation",
 userName: user?.name,
 },
 });
 if (error) throw error;
 setMessages([
 { role: "user", content: "Hola, empecemos." },
 { role: "assistant", content: data.reply },
 ]);
 } catch (e: any) {
 toast({ title: "Error", description: e.message, variant: "destructive" });
 } finally {
 setLoading(false);
 }
 };

 const sendMessage = async () => {
 if (!input.trim() || loading) return;
 const userMsg: ChatMessage = { role: "user", content: input.trim() };
 const updated = [...messages, userMsg];
 setMessages(updated);
 setInput("");
 setLoading(true);

 try {
 const { data, error } = await supabase.functions.invoke("simulation-ai", {
 body: {
 messages: updated.map((m) => ({ role: m.role, content: m.content })),
 scenario,
 mode: "simulation",
 userName: user?.name,
 },
 });
 if (error) throw error;
 setMessages([...updated, { role: "assistant", content: data.reply }]);
 } catch (e: any) {
 toast({ title: "Error", description: e.message, variant: "destructive" });
 } finally {
 setLoading(false);
 }
 };

 const requestFeedback = async () => {
 setLoadingFeedback(true);
 try {
 const { data, error } = await supabase.functions.invoke("simulation-ai", {
 body: {
 messages: [
 {
 role: "user",
 content: `Evalúa esta conversación:\n\n${messages.map((m) => `${m.role === "user" ? "USUARIO" : "INTERLOCUTOR"}: ${m.content}`).join("\n")}`,
 },
 ],
 scenario,
 mode: "feedback",
 userName: user?.name,
 },
 });
 if (error) throw error;
 const parsed = JSON.parse(data.reply.replace(/```json\n?/g, "").replace(/```/g, "").trim());
 setFeedback(parsed);
 } catch (e: any) {
 toast({ title: "Error al generar feedback", description: e.message, variant: "destructive" });
 } finally {
 setLoadingFeedback(false);
 }
 };

 if (feedback) {
 return (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-xl font-semibold text-foreground">Feedback: {scenario.title}</h2>
 <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
 </div>

 <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-6 text-center">
 <p className="text-sm text-muted-foreground mb-1">Score General</p>
 <p className="text-5xl font-bold text-primary">{feedback.overall_score}</p>
 <p className="text-xs text-muted-foreground mt-1">de 100</p>
 </div>

 <div className="space-y-3 mb-6">
 {feedback.dimensions?.map((d) => (
 <div key={d.name} className="rounded-xl border border-border p-4">
 <div className="flex items-center justify-between mb-2">
 <span className="text-sm font-medium text-foreground">{d.name}</span>
 <span className="text-sm font-semibold text-foreground">{d.score}/100</span>
 </div>
 <Progress value={d.score} className="h-2 mb-2" />
 <p className="text-xs text-muted-foreground">{d.comment}</p>
 </div>
 ))}
 </div>

 <div className="grid grid-cols-2 gap-4 mb-6">
 <div className="rounded-xl bg-green-500/10 p-4">
 <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2"> Fortalezas</h4>
 <ul className="space-y-1">
 {feedback.strengths?.map((s, i) => (
 <li key={i} className="text-xs text-muted-foreground">• {s}</li>
 ))}
 </ul>
 </div>
 <div className="rounded-xl bg-orange-500/10 p-4">
 <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2"> A mejorar</h4>
 <ul className="space-y-1">
 {feedback.improvements?.map((s, i) => (
 <li key={i} className="text-xs text-muted-foreground">• {s}</li>
 ))}
 </ul>
 </div>
 </div>

 <p className="text-sm text-muted-foreground mb-6">{feedback.summary}</p>

 <div className="flex gap-3">
 <Button onClick={onClose} variant="outline" className="rounded-full flex-1">Volver</Button>
 <Button onClick={() => { setFeedback(null); setMessages([]); setStarted(false); }} className="rounded-full flex-1 gap-2">
 <RotateCcw className="w-4 h-4" /> Repetir
 </Button>
 </div>
 </motion.div>
 );
 }

 return (
 <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h2 className="text-lg font-semibold text-foreground">{scenario.icon} {scenario.title}</h2>
 <p className="text-xs text-muted-foreground">Tu rol: {scenario.userRole}</p>
 </div>
 <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
 </div>

 {!started ? (
 <div className="flex-1 flex items-center justify-center">
 <div className="text-center max-w-md">
 <div className="text-5xl mb-4">{scenario.icon}</div>
 <h3 className="text-lg font-semibold text-foreground mb-2">{scenario.title}</h3>
 <p className="text-sm text-muted-foreground mb-2">{scenario.description}</p>
 <p className="text-xs text-muted-foreground mb-6 italic">Interlocutor: {scenario.aiRole}</p>
 <Button onClick={startSimulation} className="rounded-full gap-2" disabled={loading}>
 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
 Comenzar simulación
 </Button>
 </div>
 </div>
 ) : (
 <>
 <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
 {messages.slice(1).map((m, i) => (
 <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
 className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
 >
 <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
 m.role === "user"
 ? "bg-primary text-primary-foreground"
 : "bg-muted text-foreground"
 }`}>
 {m.content}
 </div>
 </motion.div>
 ))}
 {loading && (
 <div className="flex justify-start">
 <div className="bg-muted rounded-2xl px-4 py-3">
 <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
 </div>
 </div>
 )}
 </div>

 <div className="flex gap-2">
 <Input
 value={input}
 onChange={(e) => setInput(e.target.value)}
 onKeyDown={(e) => e.key === "Enter" && sendMessage()}
 placeholder="Escribe tu respuesta..."
 className="rounded-full"
 disabled={loading || loadingFeedback}
 />
 <Button onClick={sendMessage} size="icon" className="rounded-full shrink-0" disabled={loading || !input.trim()}>
 <Send className="w-4 h-4" />
 </Button>
 {messages.length >= 4 && (
 <Button onClick={requestFeedback} variant="outline" className="rounded-full shrink-0 gap-2" disabled={loadingFeedback}>
 {loadingFeedback ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
 Feedback
 </Button>
 )}
 </div>
 </>
 )}
 </div>
 );
}

export default function Simulations() {
 const [active, setActive] = useState<Scenario | null>(null);

 if (active) {
 return <SimulationChat scenario={active} onClose={() => setActive(null)} />;
 }

 return (
 <div className="max-w-6xl mx-auto">
 <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
 <div className="flex items-center gap-3 mb-2">
 <div className="p-2.5 rounded-xl bg-primary/10">
 <Theater className="w-6 h-6 text-primary" />
 </div>
 <h1 className="text-3xl font-semibold text-foreground">Simulaciones</h1>
 </div>
 <p className="text-muted-foreground text-lg mt-2 max-w-2xl">
 Practica conversaciones difíciles con un avatar IA. Obtén feedback detallado con score por dimensiones.
 </p>
 </motion.div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
 {scenarios.map((s, i) => (
 <motion.div
 key={s.title}
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 className="group rounded-2xl border border-border p-6 hover:border-primary/30 transition-all cursor-pointer"
 onClick={() => setActive(s)}
 >
 <div className="text-3xl mb-4">{s.icon}</div>
 <h3 className="text-base font-semibold text-foreground mb-1">{s.title}</h3>
 <p className="text-xs text-muted-foreground mb-3">{s.description}</p>
 <div className="flex gap-2 mb-3">
 <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{s.category}</span>
 <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{s.difficulty}</span>
 </div>
 <Button variant="outline" size="sm" className="w-full rounded-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
 Iniciar simulación <ArrowRight className="w-3.5 h-3.5" />
 </Button>
 </motion.div>
 ))}
 </div>
 </div>
 );
}