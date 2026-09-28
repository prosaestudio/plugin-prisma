import { useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Image, ListChecks, ArrowUpDown, GripVertical, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";

type Answer = string | string[];

export default function QuizPlayer() {
 const { id } = useParams<{ id: string }>();
 const { user } = useAuth();
 const navigate = useNavigate();
 const [currentIndex, setCurrentIndex] = useState(0);
 const [answers, setAnswers] = useState<Record<number, Answer>>({});
 const [submitted, setSubmitted] = useState(false);
 const [showExplanation, setShowExplanation] = useState<number | null>(null);

 const { data: quiz } = useQuery({
 queryKey: ["quiz", id],
 queryFn: async () => {
 const { data, error } = await supabase
 .from("quizzes")
 .select("*, courses(title)")
 .eq("id", id!)
 .single();
 if (error) throw error;
 return data;
 },
 enabled: !!id,
 });

 const { data: questions } = useQuery({
 queryKey: ["quiz-questions", id],
 queryFn: async () => {
 const { data, error } = await supabase
 .from("quiz_questions")
 .select("*")
 .eq("quiz_id", id!)
 .order("sort_order");
 if (error) throw error;
 return data;
 },
 enabled: !!id,
 });

 if (!quiz || !questions) {
 return <div className="flex items-center justify-center h-64 text-muted-foreground">Cargando quiz...</div>;
 }

 const currentQ = questions[currentIndex];
 const options: string[] = currentQ?.options
 ? (typeof currentQ.options === "string" ? JSON.parse(currentQ.options) : currentQ.options as string[])
 : [];
 const totalQuestions = questions.length;
 const progressValue = submitted ? 100 : Math.round((currentIndex / totalQuestions) * 100);
 const qType = (currentQ as any)?.type || "multiple_choice";

 const isCorrect = (q: any, i: number): boolean => {
 const ans = answers[i];
 if (!ans) return false;
 if (q.type === "multiple_select") {
 const correctSet = new Set((q.correct_answer as string).split(",").map((s: string) => s.trim()));
 const ansSet = new Set(Array.isArray(ans) ? ans : []);
 if (correctSet.size !== ansSet.size) return false;
 for (const v of correctSet) if (!ansSet.has(v)) return false;
 return true;
 }
 if (q.type === "ordering") {
 const correctOrder = (q.correct_answer as string).split(",").map((s: string) => s.trim());
 const ansOrder = Array.isArray(ans) ? ans : [];
 return JSON.stringify(correctOrder) === JSON.stringify(ansOrder);
 }
 return ans === q.correct_answer;
 };

 const score = submitted
 ? questions.reduce((acc, q, i) => acc + (isCorrect(q, i) ? ((q as any).points || 1) : 0), 0)
 : 0;
 const maxScore = questions.reduce((acc, q) => acc + ((q as any).points || 1), 0);

 const handleSelect = (option: string) => {
 if (submitted) return;
 if (qType === "multiple_select") {
 const current = (answers[currentIndex] as string[]) || [];
 const updated = current.includes(option)
 ? current.filter((o) => o !== option)
 : [...current, option];
 setAnswers((prev) => ({ ...prev, [currentIndex]: updated }));
 } else {
 setAnswers((prev) => ({ ...prev, [currentIndex]: option }));
 }
 };

 const handleNext = () => {
 if (currentIndex < totalQuestions - 1) setCurrentIndex((i) => i + 1);
 };
 const handlePrev = () => {
 if (currentIndex > 0) setCurrentIndex((i) => i - 1);
 };

 const handleSubmit = async () => {
 setSubmitted(true);
 if (!user?.id || !id) return;
 const finalScore = questions.reduce((acc, q, i) => acc + (isCorrect(q, i) ? ((q as any).points || 1) : 0), 0);
 await supabase.from("quiz_results").insert({
 user_id: user.id,
 quiz_id: id,
 score: finalScore,
 total_questions: totalQuestions,
 answers: answers as any,
 attempt_number: 1,
 });
 };

 const hasAnswer = () => {
 const ans = answers[currentIndex];
 if (!ans) return false;
 if (Array.isArray(ans)) return ans.length > 0;
 return true;
 };

 const typeIcon = (type: string) => {
 switch (type) {
 case "image_choice": return <Image className="w-3.5 h-3.5" />;
 case "multiple_select": return <ListChecks className="w-3.5 h-3.5" />;
 case "ordering": return <ArrowUpDown className="w-3.5 h-3.5" />;
 default: return null;
 }
 };

 const typeLabel = (type: string) => {
 switch (type) {
 case "image_choice": return "Selecciona la imagen correcta";
 case "multiple_select": return "Selecciona todas las correctas";
 case "true_false": return "Verdadero o Falso";
 case "ordering": return "Ordena correctamente";
 default: return "Selecciona una respuesta";
 }
 };

 return (
 <div className="max-w-2xl mx-auto">
 <Link to="/quizzes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
 <ArrowLeft className="w-4 h-4" /> Volver a Quizzes
 </Link>

 <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
 {/* Header */}
 <div className="card-elevated p-6 mb-6">
 <h1 className="text-xl font-semibold text-foreground">{quiz.title}</h1>
 <p className="text-sm text-muted-foreground mt-1">{(quiz as any).courses?.title}</p>
 <div className="mt-4">
 <div className="flex justify-between text-xs mb-1.5">
 <span className="text-muted-foreground">
 {submitted ? "Completado" : `Pregunta ${currentIndex + 1} de ${totalQuestions}`}
 </span>
 <span className="font-medium text-foreground">{progressValue}%</span>
 </div>
 <Progress value={progressValue} className="h-2" />
 </div>

 {/* Question nav dots */}
 {!submitted && (
 <div className="flex gap-1.5 mt-4 flex-wrap">
 {questions.map((_, i) => (
 <button
 key={i}
 onClick={() => setCurrentIndex(i)}
 className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
 i === currentIndex
 ? "bg-primary text-primary-foreground"
 : answers[i] !== undefined
 ? "bg-primary/20 text-primary"
 : "bg-accent text-muted-foreground"
 }`}
 >
 {i + 1}
 </button>
 ))}
 </div>
 )}
 </div>

 {submitted ? (
 <ResultsView
 questions={questions}
 answers={answers}
 score={score}
 maxScore={maxScore}
 totalQuestions={totalQuestions}
 isCorrect={isCorrect}
 showExplanation={showExplanation}
 setShowExplanation={setShowExplanation}
 onRetry={() => { setSubmitted(false); setCurrentIndex(0); setAnswers({}); }}
 onBack={() => navigate("/quizzes")}
 />
 ) : (
 <AnimatePresence mode="wait">
 <motion.div
 key={currentIndex}
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="card-elevated p-6"
 >
 {/* Question type badge */}
 <div className="flex items-center gap-2 mb-4">
 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
 {typeIcon(qType)}
 {typeLabel(qType)}
 </span>
 {(currentQ as any).points > 1 && (
 <span className="text-xs text-muted-foreground">{(currentQ as any).points} puntos</span>
 )}
 </div>

 {/* Question image */}
 {(currentQ as any).image_url && qType !== "image_choice" && (
 <div className="mb-5 rounded-xl overflow-hidden border border-border">
 <img src={(currentQ as any).image_url} alt="Pregunta" className="w-full h-48 object-cover" />
 </div>
 )}

 <h3 className="text-base font-semibold text-foreground mb-6">
 {currentIndex + 1}. {currentQ.question}
 </h3>

 {/* Render by type */}
 {qType === "image_choice" ? (
 <ImageChoiceOptions
 options={options}
 selected={answers[currentIndex] as string}
 onSelect={handleSelect}
 />
 ) : qType === "ordering" ? (
 <OrderingOptions
 options={options}
 order={(answers[currentIndex] as string[]) || [...options]}
 onReorder={(newOrder) => setAnswers((prev) => ({ ...prev, [currentIndex]: newOrder }))}
 />
 ) : qType === "multiple_select" ? (
 <MultiSelectOptions
 options={options}
 selected={(answers[currentIndex] as string[]) || []}
 onToggle={handleSelect}
 />
 ) : qType === "true_false" ? (
 <TrueFalseOptions
 selected={answers[currentIndex] as string}
 onSelect={handleSelect}
 />
 ) : (
 <SingleChoiceOptions
 options={options}
 selected={answers[currentIndex] as string}
 onSelect={handleSelect}
 />
 )}

 <div className="flex justify-between mt-8">
 <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
 Anterior
 </Button>
 {currentIndex === totalQuestions - 1 ? (
 <Button onClick={handleSubmit} disabled={!hasAnswer()}>
 Enviar respuestas
 </Button>
 ) : (
 <Button onClick={handleNext} disabled={!hasAnswer()}>
 Siguiente <ChevronRight className="w-4 h-4 ml-1" />
 </Button>
 )}
 </div>
 </motion.div>
 </AnimatePresence>
 )}
 </motion.div>
 </div>
 );
}

// ========== Question Type Components ==========

function SingleChoiceOptions({ options, selected, onSelect }: { options: string[]; selected?: string; onSelect: (o: string) => void }) {
 return (
 <div className="space-y-3">
 {options.map((option) => (
 <button
 key={option}
 onClick={() => onSelect(option)}
 className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${
 selected === option
 ? "border-primary bg-primary/5 text-foreground"
 : "border-border hover:border-primary/40 text-foreground"
 }`}
 >
 {option}
 </button>
 ))}
 </div>
 );
}

function MultiSelectOptions({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (o: string) => void }) {
 return (
 <div className="space-y-3">
 {options.map((option) => {
 const isSelected = selected.includes(option);
 return (
 <button
 key={option}
 onClick={() => onToggle(option)}
 className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm flex items-center gap-3 ${
 isSelected
 ? "border-primary bg-primary/5 text-foreground"
 : "border-border hover:border-primary/40 text-foreground"
 }`}
 >
 <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
 isSelected ? "bg-primary border-primary" : "border-muted-foreground/40"
 }`}>
 {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />}
 </div>
 {option}
 </button>
 );
 })}
 </div>
 );
}

function ImageChoiceOptions({ options, selected, onSelect }: { options: string[]; selected?: string; onSelect: (o: string) => void }) {
 return (
 <div className="grid grid-cols-2 gap-3">
 {options.map((url, i) => (
 <button
 key={url}
 onClick={() => onSelect(url)}
 className={`relative rounded-xl overflow-hidden border-3 transition-all aspect-square ${
 selected === url
 ? "border-primary ring-2 ring-primary/30 scale-[1.02]"
 : "border-border hover:border-primary/40"
 }`}
 >
 <img src={url} alt={`Opción ${i + 1}`} className="w-full h-full object-cover" />
 <div className="absolute top-2 left-2">
 <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
 selected === url ? "bg-primary text-primary-foreground" : "bg-card/80 text-foreground backdrop-blur-sm"
 }`}>
 {String.fromCharCode(65 + i)}
 </span>
 </div>
 {selected === url && (
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center"
 >
 <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
 </motion.div>
 )}
 </button>
 ))}
 </div>
 );
}

function TrueFalseOptions({ selected, onSelect }: { selected?: string; onSelect: (o: string) => void }) {
 return (
 <div className="grid grid-cols-2 gap-4">
 {["Verdadero", "Falso"].map((option) => (
 <button
 key={option}
 onClick={() => onSelect(option)}
 className={`p-6 rounded-xl border-2 transition-all text-center font-medium ${
 selected === option
 ? "border-primary bg-primary/5 text-primary"
 : "border-border hover:border-primary/40 text-foreground"
 }`}
 >
 {option === "Verdadero" ? (
 <CheckCircle2 className={`w-8 h-8 mx-auto mb-2 ${selected === option ? "text-primary" : "text-muted-foreground"}`} />
 ) : (
 <XCircle className={`w-8 h-8 mx-auto mb-2 ${selected === option ? "text-primary" : "text-muted-foreground"}`} />
 )}
 {option}
 </button>
 ))}
 </div>
 );
}

function OrderingOptions({ options, order, onReorder }: { options: string[]; order: string[]; onReorder: (o: string[]) => void }) {
 return (
 <div className="space-y-2">
 <p className="text-xs text-muted-foreground mb-3">Arrastra para reordenar o usa los botones:</p>
 {order.map((item, i) => (
 <div key={item} className="flex items-center gap-2 p-3.5 rounded-xl border-2 border-border bg-card text-sm">
 <span className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground shrink-0">
 {i + 1}
 </span>
 <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
 <span className="flex-1 text-foreground">{item}</span>
 <div className="flex gap-1 shrink-0">
 <button
 disabled={i === 0}
 onClick={() => {
 const newOrder = [...order];
 [newOrder[i - 1], newOrder[i]] = [newOrder[i], newOrder[i - 1]];
 onReorder(newOrder);
 }}
 className="w-7 h-7 rounded-lg bg-accent hover:bg-accent/80 flex items-center justify-center disabled:opacity-30 transition-opacity"
 >
 ↑
 </button>
 <button
 disabled={i === order.length - 1}
 onClick={() => {
 const newOrder = [...order];
 [newOrder[i], newOrder[i + 1]] = [newOrder[i + 1], newOrder[i]];
 onReorder(newOrder);
 }}
 className="w-7 h-7 rounded-lg bg-accent hover:bg-accent/80 flex items-center justify-center disabled:opacity-30 transition-opacity"
 >
 ↓
 </button>
 </div>
 </div>
 ))}
 </div>
 );
}

// ========== Results ==========

function ResultsView({
 questions, answers, score, maxScore, totalQuestions, isCorrect, showExplanation, setShowExplanation, onRetry, onBack
}: {
 questions: any[];
 answers: Record<number, Answer>;
 score: number;
 maxScore: number;
 totalQuestions: number;
 isCorrect: (q: any, i: number) => boolean;
 showExplanation: number | null;
 setShowExplanation: (i: number | null) => void;
 onRetry: () => void;
 onBack: () => void;
}) {
 const pct = Math.round((score / maxScore) * 100);
 const passed = pct >= 70;

 return (
 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-elevated p-8">
 <div className="text-center mb-8">
 <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? "bg-success/10" : "bg-destructive/10"}`}>
 {passed ? <CheckCircle2 className="w-12 h-12 text-success" /> : <XCircle className="w-12 h-12 text-destructive" />}
 </div>
 <h2 className="text-3xl font-bold text-foreground">{score} / {maxScore}</h2>
 <p className="text-muted-foreground mt-2">{passed ? "¡Excelente trabajo! Has aprobado el quiz." : "No alcanzaste el puntaje mínimo. ¡Intenta de nuevo!"}</p>
 <p className="text-xl font-semibold text-primary mt-1">{pct}% correcto</p>
 </div>

 <div className="space-y-3">
 {questions.map((q, i) => {
 const correct = isCorrect(q, i);
 const ans = answers[i];
 const displayAns = Array.isArray(ans) ? ans.join(", ") : (ans || "Sin responder");
 const qType = q.type;

 return (
 <div key={q.id} className={`p-4 rounded-xl border ${correct ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
 <div className="flex items-start gap-2">
 <span className={`mt-0.5 ${correct ? "text-success" : "text-destructive"}`}>
 {correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
 </span>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium text-foreground">{i + 1}. {q.question}</p>
 <div className="flex items-center gap-2 mt-1">
 <span className="text-xs px-1.5 py-0.5 rounded bg-accent text-accent-foreground">{q.points || 1} pts</span>
 <span className="text-xs text-muted-foreground capitalize">{qType?.replace("_", " ")}</span>
 </div>

 {qType === "image_choice" ? (
 <div className="flex gap-2 mt-2">
 {ans && (
 <div className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${correct ? "border-success" : "border-destructive"}`}>
 <img src={displayAns} alt="" className="w-full h-full object-cover" />
 </div>
 )}
 {!correct && (
 <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-success">
 <img src={q.correct_answer} alt="" className="w-full h-full object-cover" />
 </div>
 )}
 </div>
 ) : (
 <>
 <p className="text-xs mt-1.5">
 <span className="text-muted-foreground">Tu respuesta: </span>
 <span className={correct ? "text-success" : "text-destructive"}>{displayAns}</span>
 </p>
 {!correct && (
 <p className="text-xs mt-0.5">
 <span className="text-muted-foreground">Correcta: </span>
 <span className="text-success">{q.correct_answer}</span>
 </p>
 )}
 </>
 )}

 {q.explanation && (
 <button
 onClick={() => setShowExplanation(showExplanation === i ? null : i)}
 className="text-xs text-primary flex items-center gap-1 mt-2 hover:underline"
 >
 <Lightbulb className="w-3 h-3" />
 {showExplanation === i ? "Ocultar explicación" : "Ver explicación"}
 </button>
 )}
 <AnimatePresence>
 {showExplanation === i && q.explanation && (
 <motion.p
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="text-xs text-muted-foreground mt-2 p-2 rounded-lg bg-accent/50 overflow-hidden"
 >
 {q.explanation}
 </motion.p>
 )}
 </AnimatePresence>
 </div>
 </div>
 </div>
 );
 })}
 </div>

 <div className="mt-8 flex gap-3 justify-center">
 <Button variant="outline" onClick={onBack}>Volver a Quizzes</Button>
 <Button onClick={onRetry}>Intentar de nuevo</Button>
 </div>
 </motion.div>
 );
}
