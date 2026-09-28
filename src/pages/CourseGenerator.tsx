import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, FileText, Video, Link2, Loader2, CheckCircle2, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface GeneratedCourse {
  title: string;
  description: string;
  category: string;
  duration: string;
  modules: { title: string; type: string; duration: string; content: string }[];
  quizzes: { question: string; options: string[]; correct: string; explanation: string }[];
}

export default function CourseGenerator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedCourse | null>(null);
  const [saving, setSaving] = useState(false);

  const generate = async () => {
    if (!content.trim() && !topic.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const prompt = content.trim()
        ? `Genera un curso completo a partir de este contenido:\n\n${content.substring(0, 4000)}`
        : `Genera un curso completo sobre: ${topic}`;

      const { data, error } = await supabase.functions.invoke("simulation-ai", {
        body: {
          messages: [{ role: "user", content: prompt }],
          scenario: {},
          mode: "course_generator",
        },
      });
      if (error) throw error;
      const parsed = JSON.parse(data.reply.replace(/```json\n?/g, "").replace(/```/g, "").trim());
      setResult(parsed);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const saveCourse = async () => {
    if (!result || !user?.companyId) {
      toast({ title: "Error", description: "Se necesita una empresa asociada para crear cursos.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { data: course, error: courseError } = await supabase.from("courses").insert({
        title: result.title,
        description: result.description,
        category: result.category,
        duration: result.duration,
        company_id: user.companyId,
        created_by: user.id,
      }).select().single();
      if (courseError) throw courseError;

      for (let i = 0; i < result.modules.length; i++) {
        const mod = result.modules[i];
        await supabase.from("modules").insert({
          course_id: course.id,
          title: mod.title,
          type: "text",
          content: mod.content,
          duration: mod.duration,
          sort_order: i,
        });
      }

      toast({ title: "¡Curso creado!", description: `"${result.title}" con ${result.modules.length} módulos.` });
      setResult(null);
      setContent("");
      setTopic("");
    } catch (e: any) {
      toast({ title: "Error al guardar", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => setResult(null)} className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" /> Volver</Button>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">{result.title}</h2>
          <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{result.category}</span>
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{result.duration}</span>
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{result.modules.length} módulos</span>
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{result.quizzes.length} preguntas</span>
          </div>
        </div>

        <h3 className="text-base font-semibold text-foreground mb-3">Módulos</h3>
        <div className="space-y-3 mb-8">
          {result.modules.map((mod, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{mod.title}</span>
                <span className="text-xs text-muted-foreground ml-auto">{mod.duration}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-3">{mod.content}</p>
            </motion.div>
          ))}
        </div>

        <h3 className="text-base font-semibold text-foreground mb-3">Quiz Preview</h3>
        <div className="space-y-3 mb-8">
          {result.quizzes.slice(0, 3).map((q, i) => (
            <div key={i} className="rounded-xl border border-border p-4">
              <p className="text-sm font-medium text-foreground mb-2">{q.question}</p>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, j) => (
                  <span key={j} className={`text-xs p-2 rounded-lg ${opt === q.correct ? "bg-green-500/10 text-green-700 dark:text-green-400 font-medium" : "bg-muted text-muted-foreground"}`}>
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setResult(null)} className="rounded-full flex-1">Descartar</Button>
          <Button onClick={saveCourse} disabled={saving} className="rounded-full flex-1 gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Guardar como curso
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground">Crear Curso con IA</h1>
        </div>
        <p className="text-muted-foreground text-lg mt-2 max-w-2xl">
          Describe un tema o pega contenido y la IA genera un curso completo con módulos, lecciones y quizzes.
        </p>
      </motion.div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Tema del curso</Label>
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder='Ej: "Introducción a Python para analistas de datos"' className="mt-1.5" />
        </div>

        <div>
          <Label className="text-sm font-medium">O pega contenido fuente (opcional)</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Pega aquí texto de un documento, artículo, o descripción detallada del contenido..." className="mt-1.5 min-h-[200px]" />
        </div>

        <Button onClick={generate} disabled={loading || (!content.trim() && !topic.trim())} className="rounded-full gap-2 w-full h-12">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? "Generando curso..." : "Generar curso con IA"}
        </Button>
      </div>

      <div className="mt-10 rounded-2xl bg-muted p-8">
        <h3 className="text-base font-semibold text-foreground mb-2">¿Cómo funciona?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
          {[
            { icon: FileText, text: "Describe el tema o pega contenido" },
            { icon: Sparkles, text: "La IA genera la estructura" },
            { icon: BookOpen, text: "Revisá y ajustá el resultado" },
            { icon: CheckCircle2, text: "Guardá como curso real" },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-xl bg-background">
              <step.icon className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs">{step.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}