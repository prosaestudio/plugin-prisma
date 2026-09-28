import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, BookOpen, UserCircle, MessageSquare, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link?: string;
  linkLabel?: string;
}

const steps: OnboardingStep[] = [
  {
    id: "profile",
    title: "Completa tu perfil",
    description: "Agrega tu nombre, foto y personaliza tu avatar para que tu equipo te reconozca.",
    icon: UserCircle,
    link: "/profile",
    linkLabel: "Ir a mi perfil",
  },
  {
    id: "first_course",
    title: "Explora tu primer curso",
    description: "Navega por el catálogo de cursos y empieza a aprender algo nuevo.",
    icon: BookOpen,
    link: "/courses",
    linkLabel: "Ver cursos",
  },
  {
    id: "assistant",
    title: "Conoce al Asistente IA",
    description: "Usa el asistente flotante para resolver dudas sobre cualquier curso o la plataforma.",
    icon: MessageSquare,
  },
];

export function WelcomePanel() {
  const { user } = useAuth();
  const STORAGE_KEY = `welcome_panel_${user?.id}`;
  const COMPLETED_KEY = `welcome_steps_${user?.id}`;

  const [dismissed, setDismissed] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    const wasDismissed = localStorage.getItem(STORAGE_KEY);
    if (!wasDismissed) setDismissed(false);

    const saved = localStorage.getItem(COMPLETED_KEY);
    if (saved) setCompletedSteps(JSON.parse(saved));
  }, [user?.id]);

  const toggleStep = (stepId: string) => {
    const updated = completedSteps.includes(stepId)
      ? completedSteps.filter((s) => s !== stepId)
      : [...completedSteps, stepId];
    setCompletedSteps(updated);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(updated));
  };

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const progress = Math.round((completedSteps.length / steps.length) * 100);

  if (dismissed || completedSteps.length === steps.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-border bg-card p-6 mb-8"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">¡Bienvenido a la plataforma!</h2>
            <p className="text-sm text-muted-foreground">Completa estos pasos para empezar</p>
          </div>
        </div>
        <button onClick={dismiss} className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <Progress value={progress} className="h-2 flex-1" />
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{completedSteps.length}/{steps.length}</span>
      </div>

      <div className="space-y-3">
        {steps.map((step) => {
          const done = completedSteps.includes(step.id);
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                done ? "border-primary/20 bg-primary/5" : "border-border hover:border-primary/30"
              }`}
            >
              <button onClick={() => toggleStep(step.id)} className="mt-0.5 shrink-0">
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <p className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {step.title}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                {step.link && !done && (
                  <Link to={step.link}>
                    <Button variant="link" size="sm" className="h-auto p-0 mt-1.5 text-xs text-primary">
                      {step.linkLabel} →
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
