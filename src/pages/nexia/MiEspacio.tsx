import { useMemo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, Send, FileText, Calendar, Mail, MessageSquare,
  Slack, Github, Database, ArrowRight, TrendingUp, Lightbulb,
} from "lucide-react";
import { EditorialHeader, PillButton } from "@/components/nexia/primitives";
import { usuarioActual } from "@/lib/nexia-mock";
import agentBg from "@/assets/agent-hills-bg.png.asset.json";
import prismaAvatar from "@/assets/ball-prisma.png.asset.json";

// ────────── Stream de lecturas que Prisma ha hecho ──────────
type ToolKey = "gmail" | "calendar" | "slack" | "notion" | "github" | "drive" | "hubspot";

const TOOL_META: Record<ToolKey, { label: string; Icon: any; color: string }> = {
  gmail:    { label: "Gmail",    Icon: Mail,        color: "#f08aa0" },
  calendar: { label: "Calendar", Icon: Calendar,    color: "#8aa9e8" },
  slack:    { label: "Slack",    Icon: Slack,       color: "#c98ad6" },
  notion:   { label: "Notion",   Icon: FileText,    color: "#8ed8c4" },
  github:   { label: "GitHub",   Icon: Github,      color: "#f7a87a" },
  drive:    { label: "Drive",    Icon: Database,    color: "#8aa9e8" },
  hubspot:  { label: "HubSpot",  Icon: MessageSquare, color: "#f08aa0" },
};

type Lectura = {
  id: string;
  tool: ToolKey;
  resumen: string;
  detalle: string;
  hace: string;
};

const LECTURAS: Lectura[] = [
  { id: "l1", tool: "gmail",    hace: "hace 4 min", resumen: "Hilo con cliente Banca Empresas sobre integración API", detalle: "Detecté 3 dudas técnicas recurrentes y un compromiso pendiente para el viernes." },
  { id: "l2", tool: "calendar", hace: "hace 12 min", resumen: "Reunión 'Roadmap Q3' programada para mañana 10:00", detalle: "Preparé un brief con los 4 temas clave en discusión la semana pasada." },
  { id: "l3", tool: "slack",    hace: "hace 28 min", resumen: "Conversación en #producto-ia sobre métricas de adopción", detalle: "Andrea Pino propuso 2 KPIs nuevos. Identifiqué un riesgo de doble conteo." },
  { id: "l4", tool: "notion",   hace: "hace 1 h",    resumen: "Documento 'Estrategia 2026' actualizado por Carolina", detalle: "Cambios en la sección de talento. Aún no se refleja en el OKR maestro." },
  { id: "l5", tool: "github",   hace: "hace 2 h",    resumen: "PR #482 abierto en repo prisma-core", detalle: "Cambios en el módulo de embeddings, podría afectar la latencia del agente." },
  { id: "l6", tool: "drive",    hace: "hace 3 h",    resumen: "Hoja 'Pipeline Comercial Q2' editada", detalle: "Felipe Parra movió 4 deals a 'Negociación'. Ticket promedio subió 18%." },
  { id: "l7", tool: "hubspot",  hace: "ayer",        resumen: "12 leads nuevos calificados desde campaña LinkedIn", detalle: "El segmento Fintech LATAM concentra el 60%. Tasa de respuesta alta." },
];

// ────────── Primeros hallazgos del agente ──────────
type Hallazgo = {
  id: string;
  titulo: string;
  porque: string;
  impacto: string;
  tone: "alerta" | "oportunidad" | "info";
};

const HALLAZGOS: Hallazgo[] = [
  { id: "h1", tone: "oportunidad", titulo: "Tu agenda de mañana puede simplificarse", porque: "3 de las 6 reuniones se solapan con bloques de foco recurrentes en tu calendario.", impacto: "Liberaría ~2.5 h de trabajo profundo." },
  { id: "h2", tone: "alerta",      titulo: "Hay un compromiso por vencer en Gmail",   porque: "Le prometiste a Banca Empresas un documento técnico para el viernes.", impacto: "Cliente clave, ticket mensual >$45K." },
  { id: "h3", tone: "info",        titulo: "Tu equipo está pidiendo claridad en métricas", porque: "Detecté 4 conversaciones distintas en Slack sobre cómo medir adopción.", impacto: "Podrías unificarlo en una decisión esta semana." },
];

const TONE_COLOR: Record<Hallazgo["tone"], string> = {
  alerta: "#f08aa0",
  oportunidad: "#8ed8c4",
  info: "#8aa9e8",
};

// ────────── Chat inline con el agente ──────────
type Msg = { id: string; role: "user" | "agent"; text: string };

export default function MiEspacio() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m0", role: "agent", text: `Hola ${usuarioActual.nombre.split(" ")[0]} — he leído tus últimas conversaciones, documentos y agenda. Pregúntame lo que necesites o pídeme que profundice en alguno de los hallazgos.` },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    const userMsg: Msg = { id: `u${Date.now()}`, role: "user", text: value };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, {
        id: `a${Date.now()}`,
        role: "agent",
        text: simulateReply(value),
      }]);
    }, 600);
  };

  const sugerencias = useMemo(
    () => [
      "¿Qué debería priorizar hoy?",
      "Resume mis mensajes pendientes",
      "Prepara mi reunión de mañana",
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <EditorialHeader
        eyebrow={`Mi espacio · ${usuarioActual.area}`}
        title={`Hola, ${usuarioActual.nombre.split(" ")[0]}`}
        description="Esto es lo que Prisma ha aprendido al conectarse con tus herramientas. Te muestro mis primeros hallazgos y puedes conversar conmigo aquí mismo."
        action={
          <PillButton variant="solid" onClick={() => document.getElementById("chat-input")?.focus()}>
            <Sparkles className="w-4 h-4" /> Hablar con Prisma
          </PillButton>
        }
      />

      <div
        className="relative rounded-3xl overflow-hidden p-6 lg:p-8"
        style={{
          backgroundImage: `url(${agentBg.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {/* ─── Lecturas del agente ─── */}
          <section
            className="lg:col-span-2 rounded-2xl p-6 backdrop-blur-md border"
            style={{ background: "rgba(255,255,255,0.78)", borderColor: "rgba(255,255,255,0.6)" }}
          >
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Lecturas recientes</div>
                <h2 className="text-2xl mt-1" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
                  Lo que Prisma está leyendo por ti
                </h2>
              </div>
              <Link to="/diagnostico/integraciones" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                Ver integraciones <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <ol className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
              {LECTURAS.map((l) => {
                const meta = TOOL_META[l.tool];
                return (
                  <li key={l.id} className="relative">
                    <span
                      className="absolute -left-[18px] top-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-background"
                      style={{ background: meta.color }}
                    >
                      <meta.Icon className="w-2.5 h-2.5 text-white" />
                    </span>
                    <div className="rounded-2xl border border-border bg-background hover:bg-muted/40 transition-colors p-3.5">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                        <span style={{ color: meta.color, fontWeight: 600 }}>{meta.label}</span>
                        <span>·</span>
                        <span>{l.hace}</span>
                      </div>
                      <div className="text-sm font-medium leading-snug">{l.resumen}</div>
                      <div className="text-xs text-muted-foreground mt-1 italic">{l.detalle}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* ─── Hallazgos + chat ─── */}
          <aside className="space-y-6 flex flex-col">
            <div
              className="relative rounded-3xl p-5 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 100%)",
                backdropFilter: "blur(28px) saturate(180%)",
                WebkitBackdropFilter: "blur(28px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.5)",
                boxShadow:
                  "0 8px 32px rgba(31,38,135,0.15), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(255,255,255,0.15)",
              }}
            >
              {/* highlight superior tipo liquid glass */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-3xl"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%)",
                }}
              />
              <div className="relative flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-foreground/70" />
                <h3 className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Primeros hallazgos</h3>
              </div>
              <div className="relative space-y-3">
                {HALLAZGOS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => send(`Cuéntame más sobre: ${h.titulo}`)}
                    className="relative w-full text-left rounded-2xl p-3.5 overflow-hidden group transition-all hover:-translate-y-px"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 100%)",
                      backdropFilter: "blur(24px) saturate(180%)",
                      WebkitBackdropFilter: "blur(24px) saturate(180%)",
                      border: "1px solid rgba(255,255,255,0.55)",
                      borderLeft: `3px solid ${TONE_COLOR[h.tone]}`,
                      boxShadow:
                        "0 4px 18px rgba(31,38,135,0.10), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(255,255,255,0.15)",
                    }}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
                      }}
                    />
                    <div className="relative flex items-start gap-2">
                      <TrendingUp className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: TONE_COLOR[h.tone] }} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium leading-snug">{h.titulo}</div>
                        <div className="text-xs text-muted-foreground italic mt-1">{h.porque}</div>
                        <div className="text-[11px] text-foreground/70 mt-1.5">{h.impacto}</div>
                      </div>
                    </div>
                    <div className="relative text-[10px] uppercase tracking-wider text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Conversar →
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat inline — más grande, sin bg propio (lo aporta la sección) */}
            <div
              className="rounded-2xl overflow-hidden flex flex-col flex-1 backdrop-blur-md border"
              style={{ minHeight: 640, background: "rgba(255,255,255,0.55)", borderColor: "rgba(255,255,255,0.6)" }}
            >
              <div
                className="px-5 py-3 flex items-center gap-2"
                style={{ background: "rgba(255,255,255,0.5)", borderBottom: "1px solid rgba(255,255,255,0.4)" }}
              >
                <img
                  src={prismaAvatar.url}
                  alt="Prisma"
                  className="w-9 h-9 rounded-full shadow-sm object-cover"
                />
                <div className="leading-tight">
                  <div className="text-sm font-medium text-foreground">Prisma</div>
                  <div className="text-[10px] text-foreground/70">Tu agente personal · al día con tus herramientas</div>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] text-sm leading-relaxed rounded-2xl px-3.5 py-2 shadow-sm ${
                        m.role === "user"
                          ? "bg-foreground text-background"
                          : "text-foreground"
                      }`}
                      style={m.role === "user" ? undefined : { background: "rgba(255,255,255,0.9)" }}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 pt-2 flex flex-wrap gap-1.5">
                {sugerencias.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[11px] px-2.5 py-1 rounded-full hover:bg-white transition-colors text-foreground"
                    style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.6)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="p-3 mt-2 flex gap-2"
                style={{ background: "rgba(255,255,255,0.5)", borderTop: "1px solid rgba(255,255,255,0.4)" }}
              >
                <input
                  id="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escríbele a Prisma…"
                  className="flex-1 h-10 px-3.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 text-foreground placeholder:text-foreground/50"
                  style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.7)" }}
                />
                <button
                  type="submit"
                  className="h-10 w-10 rounded-full inline-flex items-center justify-center text-foreground bg-background border border-border hover:bg-muted transition-colors"
                  aria-label="Enviar"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>

    </div>
  );
}

function simulateReply(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("priorizar") || lower.includes("hoy")) {
    return "Hoy te recomiendo cerrar el documento técnico de Banca Empresas (compromiso del viernes) y preparar la reunión de Roadmap Q3 — te dejé un brief con los 4 temas más discutidos.";
  }
  if (lower.includes("pendient") || lower.includes("mensaje")) {
    return "Tienes 7 mensajes sin responder priorizables: 3 en Slack #producto-ia, 2 en Gmail (cliente y proveedor), y 2 menciones en Notion. ¿Quieres que los agrupe por urgencia?";
  }
  if (lower.includes("reuni") || lower.includes("ma\u00f1ana")) {
    return "Mañana a las 10:00 tienes 'Roadmap Q3'. Te preparo un brief con los avances de Andrea, las dudas abiertas y 2 decisiones que conviene tomar. ¿Lo armo ahora?";
  }
  if (lower.includes("hallazgo") || lower.includes("agenda")) {
    return "Mañana 3 reuniones chocan con tus bloques de foco. Puedo proponer un re-orden moviendo dos a la tarde — eso te libera 2.5 h en la mañana. ¿Lo intento?";
  }
  return "Anotado. Estoy revisando tus fuentes conectadas para responderte con contexto — en un momento te dejo un resumen accionable.";
}
