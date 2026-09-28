import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Clock, CheckCircle2, Play, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PillData {
 title: string;
 duration: string;
 sections: {
 type: string;
 content?: string;
 points?: string[];
 question?: string;
 options?: string[];
 correct?: number;
 }[];
}

const topics = [
 { title: "Escucha activa", category: "Comunicación", icon: "" },
 { title: "Feedback constructivo", category: "Liderazgo", icon: "" },
 { title: "Método STAR", category: "RRHH", icon: "⭐" },
 { title: "Matriz Eisenhower", category: "Productividad", icon: "" },
 { title: "Manejo de objeciones", category: "Ventas", icon: "" },
 { title: "Design Thinking", category: "Innovación", icon: "" },
 { title: "Comunicación asertiva", category: "Comunicación", icon: "" },
 { title: "Delegación efectiva", category: "Liderazgo", icon: "" },
 { title: "Gestión del tiempo", category: "Productividad", icon: "⏰" },
];

function PillPlayer({ topic, onClose }: { topic: typeof topics[0]; onClose: () => void }) {
 const { toast } = useToast();
 const [pill, setPill] = useState<PillData | null>(null);
 const [loading, setLoading] = useState(false);
 const [step, setStep] = useState(0);
 const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

 const generate = async () => {
 setLoading(true);
 setPill(null);
 setStep(0);
 setQuizAnswer(null);
 try {
 const { data, error } = await supabase.functions.invoke("simulation-ai", {
 body: {
 messages: [{ role: "user", content: `Genera una píldora de microlearning sobre: ${topic.title}` }],
 scenario: {},
 mode: "microlearning",
 },
 });
 if (error) throw error;
 const parsed = JSON.parse(data.reply.replace(/```json\n?/g, "").replace(/```/g, "").trim());
 setPill(parsed);
 } catch (e: any) {
 toast({ title: "Error", description: e.message, variant: "destructive" });
 } finally {
 setLoading(false);
 }
 };

 if (!pill && !loading) {
 return (
 <div className="max-w-2xl mx-auto text-center py-20">
 <div className="text-5xl mb-4">{topic.icon}</div>
 <h2 className="text-xl font-semibold text-foreground mb-2">{topic.title}</h2>
 <p className="text-sm text-muted-foreground mb-6">Píldora de 2-3 minutos generada con IA</p>
 <div className="flex gap-3 justify-center">
 <Button variant="outline" onClick={onClose} className="rounded-full"><ArrowLeft className="w-4 h-4 mr-2" /> Volver</Button>
 <Button onClick={generate} className="rounded-full gap-2"><Play className="w-4 h-4" /> Generar píldora</Button>
 </div>
 </div>
 );
 }

 if (loading) {
 return (
 <div className="max-w-2xl mx-auto text-center py-20">
 <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
 <p className="text-sm text-muted-foreground">Generando tu píldora con IA...</p>
 </div>
 );
 }

 if (!pill) return null;
 const totalSteps = pill.sections.length;
 const section = pill.sections[step];
 const progress = ((step + 1) / totalSteps) * 100;

 return (
 <div className="max-w-2xl mx-auto">
 <div className="flex items-center justify-between mb-6">
 <Button variant="ghost" size="sm" onClick={onClose}><ArrowLeft className="w-4 h-4 mr-2" /> Volver</Button>
 <span className="text-xs text-muted-foreground">{step + 1}/{totalSteps}</span>
 </div>
 <Progress value={progress} className="h-1.5 mb-8" />

 <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-[300px]">
 <h2 className="text-xl font-semibold text-foreground mb-6">{pill.title}</h2>

 {section.type === "intro" && (
 <p className="text-base text-muted-foreground leading-relaxed">{section.content}</p>
 )}

 {section.type === "key_points" && (
 <div className="space-y-3">
 <h3 className="text-sm font-semibold text-foreground mb-3">Puntos clave</h3>
 {section.points?.map((p, i) => (
 <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
 className="flex items-start gap-3 rounded-xl border border-border p-4"
 >
 <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
 <p className="text-sm text-foreground">{p}</p>
 </motion.div>
 ))}
 </div>
 )}

 {section.type === "example" && (
 <div className="rounded-xl bg-primary/5 border border-primary/20 p-5">
 <h3 className="text-sm font-semibold text-foreground mb-2"> Ejemplo práctico</h3>
 <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
 </div>
 )}

 {section.type === "tip" && (
 <div className="rounded-xl bg-muted p-5">
 <h3 className="text-sm font-semibold text-foreground mb-2"> Tip accionable</h3>
 <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
 </div>
 )}

 {section.type === "quiz" && (
 <div>
 <h3 className="text-base font-semibold text-foreground mb-4">{section.question}</h3>
 <div className="space-y-2">
 {section.options?.map((opt, i) => (
 <button key={i} onClick={() => setQuizAnswer(i)}
 className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${
 quizAnswer === null ? "border-border hover:border-primary/30" :
 i === section.correct ? "border-green-500 bg-green-500/10" :
 i === quizAnswer ? "border-red-500 bg-red-500/10" : "border-border opacity-50"
 }`}
 disabled={quizAnswer !== null}
 >
 {opt}
 </button>
 ))}
 </div>
 {quizAnswer !== null && (
 <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-3 text-sm font-medium ${quizAnswer === section.correct ? "text-green-600" : "text-red-600"}`}>
 {quizAnswer === section.correct ? " ¡Correcto!" : ` La respuesta correcta era: ${section.options?.[section.correct ?? 0]}`}
 </motion.p>
 )}
 </div>
 )}
 </motion.div>

 <div className="flex justify-between mt-8">
 <Button variant="ghost" onClick={() => { setStep(Math.max(0, step - 1)); setQuizAnswer(null); }} disabled={step === 0}>
 Anterior
 </Button>
 {step < totalSteps - 1 ? (
 <Button onClick={() => { setStep(step + 1); setQuizAnswer(null); }}>
 Siguiente
 </Button>
 ) : (
 <Button onClick={onClose} className="gap-2">
 <CheckCircle2 className="w-4 h-4" /> Completar
 </Button>
 )}
 </div>
 </div>
 );
}

export default function Microlearning() {
 const [activeTopic, setActiveTopic] = useState<typeof topics[0] | null>(null);

 if (activeTopic) {
 return <PillPlayer topic={activeTopic} onClose={() => setActiveTopic(null)} />;
 }

 return (
 <div className="max-w-5xl mx-auto">
 <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
 <div className="flex items-center gap-3 mb-2">
 <div className="p-2.5 rounded-xl bg-primary/10">
 <Zap className="w-6 h-6 text-primary" />
 </div>
 <h1 className="text-3xl font-semibold text-foreground">Microlearning</h1>
 </div>
 <p className="text-muted-foreground text-lg mt-2 max-w-2xl">
 Píldoras de 2-3 minutos generadas con IA. Elegí un tema y aprendé algo nuevo.
 </p>
 </motion.div>

 <h2 className="text-lg font-semibold text-foreground mb-5">Elegí un tema</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {topics.map((topic, i) => (
 <motion.div
 key={topic.title}
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 className="rounded-2xl border border-border p-5 hover:border-primary/30 transition-all cursor-pointer group"
 onClick={() => setActiveTopic(topic)}
 >
 <div className="text-2xl mb-3">{topic.icon}</div>
 <h3 className="text-sm font-semibold text-foreground mb-1">{topic.title}</h3>
 <div className="flex items-center justify-between">
 <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{topic.category}</span>
 <div className="flex items-center gap-1 text-xs text-muted-foreground">
 <Clock className="w-3.5 h-3.5" /> 2-3 min
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 );
}