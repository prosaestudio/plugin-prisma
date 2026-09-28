import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import prismaSphere from "@/assets/prisma-sphere.png";

type StepKind = "text" | "textarea" | "chips-single" | "chips-multi" | "button";

type Step = {
  id: string;
  agentText: string;
  kind: StepKind;
  options?: string[];
  cta?: string;
  branch?: (val: any) => string | null; // returns next step id or null for default
};

// Pasos hardcodeados según especificación
const buildSteps = (): Step[] => [
  { id: "intro", agentText: "Hola 👋 Soy el Agente Prisma. Voy a hacerte algunas preguntas rápidas para personalizar tu experiencia. Toma menos de 5 minutos.", kind: "button", cta: "Empecemos" },
  { id: "cargo", agentText: "¿Cuál es tu cargo actual?", kind: "text" },
  { id: "tareas", agentText: "¿Cuáles son las 3 tareas que más tiempo te toman en tu semana típica?", kind: "textarea" },
  {
    id: "herramientas",
    agentText: "¿Usas alguna herramienta de IA hoy en tu trabajo?",
    kind: "chips-multi",
    options: ["ChatGPT", "Copilot", "Claude", "Gemini", "Notion AI", "No uso ninguna"],
    branch: (val: string[]) => (val.includes("No uso ninguna") && val.length === 1 ? "no-uso" : "para-que"),
  },
  {
    id: "para-que",
    agentText: "¿Para qué tareas la usas principalmente?",
    kind: "chips-multi",
    options: ["Redactar textos", "Analizar datos", "Resumir documentos", "Generar ideas", "Responder emails", "Automatizar tareas", "Otra"],
  },
  {
    id: "no-uso",
    agentText: "¿Por qué no has usado IA en tu trabajo?",
    kind: "chips-single",
    options: ["No sé cómo usarla", "No creo que aplique a mi trabajo", "No tengo acceso", "No tenía tiempo de aprenderla", "Otra"],
  },
  { id: "frustracion", agentText: "¿Cuál es tu mayor frustración o pérdida de tiempo en tu rol actual?", kind: "textarea" },
  { id: "final", agentText: "Perfecto. Con esto Prisma ya puede analizar tu área de trabajo y detectar dónde hay oportunidades de mejora. Tu diagnóstico estará listo en los próximos minutos.", kind: "button", cta: "Ver mi dashboard" },
];

type Msg =
  | { id: number; role: "agent"; text: string }
  | { id: number; role: "user"; text: string };

export default function OnboardingColaborador() {
  const navigate = useNavigate();
  const steps = useRef(buildSteps()).current;
  const [activeStepId, setActiveStepId] = useState<string>("intro");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(true);
  const [input, setInput] = useState("");
  const [chipMulti, setChipMulti] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  const currentStep = steps.find((s) => s.id === activeStepId);

  // Push agent message when activeStepId changes
  useEffect(() => {
    if (!currentStep) return;
    setTyping(true);
    setChipMulti([]);
    const t = setTimeout(() => {
      setMessages((m) => [...m, { id: idRef.current++, role: "agent", text: currentStep.agentText }]);
      setTyping(false);
    }, 900);
    return () => clearTimeout(t);
  }, [activeStepId, currentStep]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const goNext = (value: any, displayText?: string) => {
    if (!currentStep) return;
    if (displayText) {
      setMessages((m) => [...m, { id: idRef.current++, role: "user", text: displayText }]);
    }
    setAnswers((a) => ({ ...a, [currentStep.id]: value }));

    // Determine next step
    const branched = currentStep.branch?.(value) ?? null;
    let nextId: string | null = branched;
    if (!nextId) {
      const idx = steps.findIndex((s) => s.id === currentStep.id);
      // Skip alt branch step if we're on "para-que" or "no-uso"
      let candidate = steps[idx + 1];
      if (currentStep.id === "para-que") candidate = steps.find((s) => s.id === "frustracion") ?? null!;
      if (currentStep.id === "no-uso") candidate = steps.find((s) => s.id === "frustracion") ?? null!;
      nextId = candidate?.id ?? null;
    }
    if (nextId) setActiveStepId(nextId);
  };

  const finish = () => {
    localStorage.setItem("prisma_colaborador_onboarded", "true");
    localStorage.setItem("prisma_colaborador_onboarding_data", JSON.stringify(answers));
    navigate("/dashboard", { replace: true });
  };

  const sendText = () => {
    if (!input.trim()) return;
    goNext(input.trim(), input.trim());
    setInput("");
  };

  const submitChipsMulti = () => {
    if (chipMulti.length === 0) return;
    goNext(chipMulti, chipMulti.join(", "));
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="border-b border-border bg-background">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <img src={prismaSphere} alt="Prisma" className="w-9 h-9 rounded-full" />
          <div>
            <div className="text-sm font-medium">Agente Prisma</div>
            <div className="text-xs text-muted-foreground">Configurando tu experiencia</div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
              {m.role === "agent" && (
                <img src={prismaSphere} alt="" className="w-8 h-8 rounded-full shrink-0" />
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
                  m.role === "user" ? "bg-foreground text-background" : "bg-background border border-border"
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <img src={prismaSphere} alt="" className="w-8 h-8 rounded-full shrink-0" />
              <div className="rounded-2xl px-4 py-3 bg-background border border-border flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:200ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:400ms]" />
              </div>
            </div>
          )}
        </div>

        {/* Input area depending on step */}
        {!typing && currentStep && (
          <div className="pt-4 mt-4 border-t border-border space-y-3">
            {currentStep.kind === "button" && (
              <button
                onClick={() =>
                  currentStep.id === "final"
                    ? finish()
                    : goNext(true)
                }
                className="w-full inline-flex items-center justify-center gap-2 rounded-full h-12 bg-foreground text-background text-sm font-medium hover:opacity-90"
              >
                {currentStep.id === "final" && <Sparkles className="w-4 h-4" />}
                {currentStep.cta}
              </button>
            )}

            {currentStep.kind === "text" && (
              <div className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendText(); }}
                  placeholder="Escribe tu respuesta…"
                  className="flex-1 bg-transparent px-3 outline-none text-sm h-10"
                  autoFocus
                />
                <button onClick={sendText} className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}

            {currentStep.kind === "textarea" && (
              <div className="space-y-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu respuesta…"
                  rows={3}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
                  autoFocus
                />
                <button onClick={sendText} disabled={!input.trim()} className="w-full inline-flex items-center justify-center gap-2 rounded-full h-11 bg-foreground text-background text-sm font-medium disabled:opacity-40">
                  Enviar <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {currentStep.kind === "chips-single" && (
              <div className="flex flex-wrap gap-2">
                {currentStep.options!.map((o) => (
                  <button
                    key={o}
                    onClick={() => goNext(o, o)}
                    className="px-4 h-10 rounded-full text-sm border border-border bg-background hover:bg-foreground hover:text-background transition-colors"
                  >
                    {o}
                  </button>
                ))}
              </div>
            )}

            {currentStep.kind === "chips-multi" && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {currentStep.options!.map((o) => {
                    const active = chipMulti.includes(o);
                    return (
                      <button
                        key={o}
                        onClick={() => setChipMulti((c) => (active ? c.filter((x) => x !== o) : [...c, o]))}
                        className={cn(
                          "px-4 h-10 rounded-full text-sm border transition-colors",
                          active ? "bg-foreground text-background border-foreground" : "bg-background border-border hover:bg-muted"
                        )}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={submitChipsMulti}
                  disabled={chipMulti.length === 0}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full h-11 bg-foreground text-background text-sm font-medium disabled:opacity-40"
                >
                  Continuar <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
