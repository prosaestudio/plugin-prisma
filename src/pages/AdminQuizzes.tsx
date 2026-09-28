import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCourses, useQuizzes } from "@/hooks/useData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Plus, Trash2, Upload, ChevronDown, ChevronRight, ClipboardCheck,
  Image, ListChecks, ArrowUpDown, CheckCircle2, XCircle, Save, GripVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type QuestionType = "multiple_choice" | "true_false" | "short_answer" | "image_choice" | "multiple_select" | "ordering";

interface NewQuestion {
  question: string;
  type: QuestionType;
  options: string[];
  correct_answer: string;
  explanation: string;
  points: number;
  image_url: string;
  imageFile?: File | null;
}

const emptyQuestion: NewQuestion = {
  question: "", type: "multiple_choice", options: ["", "", "", ""],
  correct_answer: "", explanation: "", points: 1, image_url: "", imageFile: null,
};

const typeLabels: Record<QuestionType, string> = {
  multiple_choice: "Opción Múltiple",
  true_false: "Verdadero/Falso",
  short_answer: "Respuesta Corta",
  image_choice: "Selección de Imagen",
  multiple_select: "Selección Múltiple",
  ordering: "Ordenamiento",
};

const typeIcons: Record<QuestionType, React.ReactNode> = {
  multiple_choice: <CheckCircle2 className="w-3.5 h-3.5" />,
  true_false: <XCircle className="w-3.5 h-3.5" />,
  short_answer: <ClipboardCheck className="w-3.5 h-3.5" />,
  image_choice: <Image className="w-3.5 h-3.5" />,
  multiple_select: <ListChecks className="w-3.5 h-3.5" />,
  ordering: <ArrowUpDown className="w-3.5 h-3.5" />,
};

export default function AdminQuizzes() {
  const { user } = useAuth();
  const { data: quizzes, isLoading } = useQuizzes();
  const { data: courses } = useCourses();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [newQuizCourse, setNewQuizCourse] = useState("");
  const [newQuizType, setNewQuizType] = useState<QuestionType>("multiple_choice");
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === "company_admin" || user?.role === "super_admin";
  if (!isAdmin) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">No tienes permisos para acceder a esta página.</div>;
  }

  const handleCreateQuiz = async () => {
    if (!newQuizTitle || !newQuizCourse) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("quizzes").insert({
        title: newQuizTitle,
        course_id: newQuizCourse,
        type: newQuizType,
      });
      if (error) throw error;
      toast({ title: "Quiz creado", description: "Ahora agrega preguntas al quiz." });
      setNewQuizTitle("");
      setNewQuizCourse("");
      setCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("¿Eliminar este quiz y todas sus preguntas?")) return;
    // Delete questions first, then quiz
    await supabase.from("quiz_questions").delete().eq("quiz_id", quizId);
    const { error } = await supabase.from("quizzes").delete().eq("id", quizId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Eliminado", description: "Quiz eliminado correctamente." });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Gestión de Quizzes</h1>
          <p className="page-subtitle">Crear evaluaciones, agregar preguntas con imágenes y múltiples formatos</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Crear Quiz</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo Quiz</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>Título *</Label>
                <Input value={newQuizTitle} onChange={(e) => setNewQuizTitle(e.target.value)} placeholder="Nombre del quiz" />
              </div>
              <div>
                <Label>Curso *</Label>
                <Select value={newQuizCourse} onValueChange={setNewQuizCourse}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar curso" /></SelectTrigger>
                  <SelectContent>
                    {courses?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipo principal</Label>
                <Select value={newQuizType} onValueChange={(v) => setNewQuizType(v as QuestionType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleCreateQuiz} disabled={!newQuizTitle || !newQuizCourse || saving}>
                {saving ? "Creando..." : "Crear Quiz"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-muted-foreground text-center py-12">Cargando quizzes...</div>
        ) : !quizzes?.length ? (
          <div className="card-elevated p-12 text-center">
            <ClipboardCheck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-base font-medium text-foreground">No hay quizzes aún</h3>
            <p className="text-sm text-muted-foreground mt-1">Crea tu primer quiz para empezar</p>
          </div>
        ) : (
          quizzes.map((quiz: any, i: number) => (
            <motion.div key={quiz.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <div className="card-elevated">
                <div
                  className="p-4 flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpandedQuiz(expandedQuiz === quiz.id ? null : quiz.id)}
                >
                  {expandedQuiz === quiz.id ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{quiz.title}</h3>
                    <p className="text-xs text-muted-foreground">{quiz.courses?.title || "—"} · <Badge variant="secondary" className="text-[10px]">{typeLabels[quiz.type as QuestionType] || quiz.type}</Badge></p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive shrink-0" onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(quiz.id); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {expandedQuiz === quiz.id && <QuizQuestionManager quizId={quiz.id} />}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function QuizQuestionManager({ quizId }: { quizId: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [newQ, setNewQ] = useState<NewQuestion>({ ...emptyQuestion });
  const [saving, setSaving] = useState(false);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["quiz-questions-admin", quizId],
    queryFn: async () => {
      const { data, error } = await supabase.from("quiz_questions").select("*").eq("quiz_id", quizId).order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const handleOptionChange = (index: number, value: string) => {
    const opts = [...newQ.options];
    opts[index] = value;
    setNewQ({ ...newQ, options: opts });
  };

  const addOption = () => setNewQ({ ...newQ, options: [...newQ.options, ""] });
  const removeOption = (i: number) => setNewQ({ ...newQ, options: newQ.options.filter((_, idx) => idx !== i) });

  const handleImageUpload = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `quiz-images/${quizId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("course-materials").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("course-materials").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleAddQuestion = async () => {
    if (!newQ.question || !newQ.correct_answer) return;
    setSaving(true);
    try {
      let imageUrl = newQ.image_url;
      if (newQ.imageFile) {
        imageUrl = await handleImageUpload(newQ.imageFile);
      }

      // For image_choice, upload option images if they are files
      let finalOptions = newQ.options.filter(Boolean);

      const nextOrder = (questions?.length || 0);

      const { error } = await supabase.from("quiz_questions").insert({
        quiz_id: quizId,
        question: newQ.question,
        type: newQ.type,
        options: finalOptions,
        correct_answer: newQ.correct_answer,
        explanation: newQ.explanation || null,
        points: newQ.points,
        image_url: imageUrl || null,
        sort_order: nextOrder,
      });
      if (error) throw error;

      toast({ title: "Pregunta agregada" });
      setNewQ({ ...emptyQuestion });
      setAddOpen(false);
      queryClient.invalidateQueries({ queryKey: ["quiz-questions-admin", quizId] });
      queryClient.invalidateQueries({ queryKey: ["quiz-questions", quizId] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    await supabase.from("quiz_questions").delete().eq("id", qId);
    queryClient.invalidateQueries({ queryKey: ["quiz-questions-admin", quizId] });
    queryClient.invalidateQueries({ queryKey: ["quiz-questions", quizId] });
  };

  return (
    <div className="border-t border-border px-4 pb-4">
      <div className="flex items-center justify-between py-3">
        <span className="text-xs font-medium text-muted-foreground">Preguntas ({questions?.length || 0})</span>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm"><Plus className="w-3 h-3 mr-1" /> Agregar Pregunta</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Nueva Pregunta</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>Tipo de Pregunta</Label>
                <Select value={newQ.type} onValueChange={(v) => {
                  const type = v as QuestionType;
                  let opts = newQ.options;
                  if (type === "true_false") opts = ["Verdadero", "Falso"];
                  else if (type === "short_answer") opts = [];
                  else if (opts.length < 2) opts = ["", "", "", ""];
                  setNewQ({ ...newQ, type, options: opts });
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        <span className="flex items-center gap-2">{typeIcons[k as QuestionType]} {v}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Pregunta *</Label>
                <Textarea value={newQ.question} onChange={(e) => setNewQ({ ...newQ, question: e.target.value })} placeholder="Escribe la pregunta..." />
              </div>

              {/* Image upload for the question */}
              <div>
                <Label>Imagen (opcional)</Label>
                <label className="flex items-center gap-3 p-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors mt-1">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {newQ.imageFile ? newQ.imageFile.name : "Subir imagen para la pregunta"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setNewQ({ ...newQ, imageFile: e.target.files?.[0] || null })} />
                </label>
                {!newQ.imageFile && (
                  <Input value={newQ.image_url} onChange={(e) => setNewQ({ ...newQ, image_url: e.target.value })} placeholder="O pega URL de imagen" className="mt-1.5" />
                )}
              </div>

              {/* Options */}
              {newQ.type !== "short_answer" && newQ.type !== "true_false" && (
                <div>
                  <Label>{newQ.type === "image_choice" ? "URLs de Imágenes (opciones)" : "Opciones"}</Label>
                  <div className="space-y-2 mt-1.5">
                    {newQ.options.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={opt}
                          onChange={(e) => handleOptionChange(i, e.target.value)}
                          placeholder={newQ.type === "image_choice" ? `URL imagen ${i + 1}` : `Opción ${i + 1}`}
                        />
                        {newQ.options.length > 2 && (
                          <Button variant="ghost" size="sm" className="shrink-0 text-destructive" onClick={() => removeOption(i)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addOption} className="w-full">
                      <Plus className="w-3 h-3 mr-1" /> Agregar Opción
                    </Button>
                  </div>
                </div>
              )}

              {newQ.type === "true_false" && (
                <p className="text-xs text-muted-foreground">Las opciones serán "Verdadero" y "Falso" automáticamente.</p>
              )}

              <div>
                <Label>Respuesta Correcta *</Label>
                {newQ.type === "true_false" ? (
                  <Select value={newQ.correct_answer} onValueChange={(v) => setNewQ({ ...newQ, correct_answer: v })}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Verdadero">Verdadero</SelectItem>
                      <SelectItem value="Falso">Falso</SelectItem>
                    </SelectContent>
                  </Select>
                ) : newQ.type === "multiple_select" ? (
                  <div>
                    <Input value={newQ.correct_answer} onChange={(e) => setNewQ({ ...newQ, correct_answer: e.target.value })} placeholder="Separar con comas: opción1, opción2" />
                    <p className="text-xs text-muted-foreground mt-1">Escribe las respuestas correctas separadas por comas</p>
                  </div>
                ) : newQ.type === "ordering" ? (
                  <div>
                    <Input value={newQ.correct_answer} onChange={(e) => setNewQ({ ...newQ, correct_answer: e.target.value })} placeholder="Orden correcto: item1, item2, item3" />
                    <p className="text-xs text-muted-foreground mt-1">Escribe el orden correcto separado por comas</p>
                  </div>
                ) : (
                  <Input value={newQ.correct_answer} onChange={(e) => setNewQ({ ...newQ, correct_answer: e.target.value })} placeholder="Respuesta correcta exacta" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Puntos</Label>
                  <Input type="number" min={1} value={newQ.points} onChange={(e) => setNewQ({ ...newQ, points: parseInt(e.target.value) || 1 })} />
                </div>
                <div>
                  <Label>Explicación</Label>
                  <Input value={newQ.explanation} onChange={(e) => setNewQ({ ...newQ, explanation: e.target.value })} placeholder="Por qué es correcta..." />
                </div>
              </div>

              <Button className="w-full" onClick={handleAddQuestion} disabled={!newQ.question || !newQ.correct_answer || saving}>
                {saving ? "Guardando..." : "Agregar Pregunta"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-xs text-muted-foreground py-2">Cargando...</p>
      ) : !questions?.length ? (
        <p className="text-xs text-muted-foreground py-2">Sin preguntas. Agrega la primera.</p>
      ) : (
        <div className="space-y-1.5">
          {questions.map((q: any, i: number) => (
            <div key={q.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-accent/50 text-sm">
              <span className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
              <span className="shrink-0">{typeIcons[q.type as QuestionType]}</span>
              <span className="flex-1 truncate text-foreground">{q.question}</span>
              <Badge variant="secondary" className="text-[10px] shrink-0">{q.points || 1} pts</Badge>
              {q.image_url && <Image className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive shrink-0" onClick={() => handleDeleteQuestion(q.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
