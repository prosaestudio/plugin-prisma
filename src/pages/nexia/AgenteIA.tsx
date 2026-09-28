import { useState, useRef, useEffect } from "react";
import { mensajesAgente } from "@/lib/nexia-mock";
import { Send, Plus, Mic, MoreVertical, Search, MessageSquare, Check, Circle, Activity, ChevronDown, ChevronUp, Shield, Building2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ToolLogo } from "@/components/nexia/ToolLogo";
import logoPrisma from "@/assets/logo-prisma-full.png";
import skyBg from "@/assets/agente-sky-bg.png";

type Msg = { id: number; autor: "agente" | "user"; hora: string; texto: string };

const objectives = [
  { label: "Review portfolio architecture", done: true },
  { label: "Identify design system gaps", done: true },
  { label: "Strategic roadmap drafting", done: false },
  { label: "Skill-gap analysis feedback", done: false },
];

const quickActions = ["Ver Roadmap", "Analizar Dashboard Actual", "Siguiente Objetivo"];

type Signal = { time: string; app: string; detail: string; tag: "prompt" | "tool" | "doc" | "focus" };

const trackedSignals: Signal[] = [
  { time: "10:24", app: "ChatGPT", detail: "3 prompts sobre arquitectura de design system", tag: "prompt" },
  { time: "10:08", app: "Figma", detail: "32 min editando 'Portfolio v3 — components'", tag: "focus" },
  { time: "09:51", app: "Notion", detail: "Abrió documento 'Roadmap Q3 — Senior Path'", tag: "doc" },
  { time: "09:40", app: "Cursor", detail: "Generó 2 snippets en TypeScript con IA", tag: "tool" },
  { time: "09:22", app: "Linear", detail: "Cerró 4 tareas del sprint actual", tag: "tool" },
];

const tagMeta: Record<Signal["tag"], { label: string; dot: string }> = {
  prompt: { label: "Prompt IA", dot: "bg-violet-500" },
  tool: { label: "Herramienta", dot: "bg-blue-500" },
  doc: { label: "Documento", dot: "bg-amber-500" },
  focus: { label: "Foco activo", dot: "bg-emerald-500" },
};

export default function AgenteIA() {
  const [mensajes, setMensajes] = useState<Msg[]>(mensajesAgente);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [contextOpen, setContextOpen] = useState(true);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [mensajes, typing]);

  useEffect(() => {
    const t = setTimeout(() => setTyping(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const send = () => {
    if (!input.trim()) return;
    setMensajes((m) => [
      ...m,
      { id: Date.now(), autor: "user", hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), texto: input.trim() },
    ]);
    setInput("");
    setTyping(true);
    setTimeout(() => setTyping(false), 1800);
  };

  return (
    <div
      className="rounded-3xl bg-cover bg-center p-4 lg:p-6"
      style={{ backgroundImage: `url(${skyBg})` }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 h-[calc(100vh-10rem)]">
        {/* Dark left rail */}
        <aside className="rounded-3xl bg-foreground text-background p-6 overflow-y-auto flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <img src={logoPrisma} alt="Prisma" className="h-8 invert" />
        </div>

        <div>
          <div className="h-20 w-20 rounded-3xl bg-background/10 flex items-center justify-center mb-3">
            <Building2 className="h-9 w-9 text-background/80" />
          </div>
          <div className="font-semibold">Área Producto</div>
          <div className="text-xs text-background/60">Ruta de aprendizaje del área</div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-background/60 mb-2">
            <span>Active Route Progress</span>
            <span className="text-background">45%</span>
          </div>
          <div className="h-1 bg-background/15 rounded-full overflow-hidden">
            <div className="h-full bg-background rounded-full" style={{ width: "45%" }} />
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-background/60 mb-3">Session Objectives</div>
          <div className="space-y-2">
            {objectives.map((o) => (
              <div key={o.label} className="flex items-start gap-3 p-3 rounded-xl border border-background/15">
                {o.done ? (
                  <div className="w-4 h-4 rounded-full bg-background flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-foreground" strokeWidth={3} />
                  </div>
                ) : (
                  <Circle className="w-4 h-4 text-background/40 shrink-0 mt-0.5" />
                )}
                <span className="text-sm leading-tight">{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Chat */}
      <section className="rounded-3xl bg-background flex flex-col overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Agente Prisma</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <button className="p-2 rounded-full hover:bg-muted"><Search className="w-4 h-4" /></button>
            <button className="p-2 rounded-full hover:bg-muted"><MoreVertical className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Contexto observado */}
        <div className="border-b border-border bg-muted/30">
          <button
            onClick={() => setContextOpen((v) => !v)}
            className="w-full px-6 py-3 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Activity className="w-4 h-4 text-foreground" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-sm font-medium">Contexto observado hoy</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-full px-2 py-0.5">
                {trackedSignals.length} señales
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="hidden sm:inline">Por qué te recomiendo esto</span>
              {contextOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {contextOpen && (
            <div className="px-6 pb-4 pt-1 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-border bg-background p-2.5">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Tiempo activo</div>
                  <div className="text-sm font-semibold mt-0.5">2h 14min</div>
                </div>
                <div className="rounded-xl border border-border bg-background p-2.5">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Prompts IA</div>
                  <div className="text-sm font-semibold mt-0.5">12</div>
                </div>
                <div className="rounded-xl border border-border bg-background p-2.5">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Herramientas</div>
                  <div className="text-sm font-semibold mt-0.5">5</div>
                </div>
              </div>

              <ul className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {trackedSignals.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs py-1.5 border-b border-border/40 last:border-0">
                    <span className="tabular-nums text-muted-foreground shrink-0 w-10">{s.time}</span>
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0 mt-1.5", tagMeta[s.tag].dot)} />
                    <ToolLogo name={s.app} size={16} className="shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{s.app}</span>
                        <span className="text-[10px] text-muted-foreground">· {tagMeta[s.tag].label}</span>
                      </div>
                      <div className="text-muted-foreground truncate">{s.detail}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                <Shield className="w-3 h-3" />
                Datos capturados localmente y anonimizados. Solo tú y Prisma los ven.
              </div>
            </div>
          )}
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5">
          {mensajes.map((m) => (
            <div key={m.id} className={cn("flex gap-3", m.autor === "user" ? "justify-end" : "justify-start")}>
              {m.autor === "agente" && (
                <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs shrink-0">P</div>
              )}
              <div className={cn("max-w-[75%] rounded-2xl px-4 py-3", m.autor === "user" ? "bg-muted/60" : "bg-background border border-border")}>
                <p className="text-sm leading-relaxed whitespace-pre-line">{m.texto}</p>
                <div className="text-[10px] text-muted-foreground mt-2">{m.hora}</div>
              </div>
              {m.autor === "user" && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs shrink-0">P</div>
              <div className="rounded-2xl px-4 py-3 bg-background border border-border flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:200ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:400ms]" />
                </div>
                <span className="text-xs italic text-muted-foreground">El agente está escribiendo…</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border space-y-3 bg-background">
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 pl-2 pr-1.5 py-1.5">
            <button className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted">
              <Plus className="w-4 h-4" />
            </button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Escribe tu mensaje aquí…"
              rows={1}
              className="flex-1 resize-none min-h-[36px] max-h-32 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
            />
            <button className="w-9 h-9 rounded-full hover:bg-background flex items-center justify-center text-muted-foreground">
              <Mic className="w-4 h-4" />
            </button>
            <button onClick={send} className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90">
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickActions.map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="px-4 h-9 rounded-full border border-border text-xs hover:bg-muted transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
