import { useState } from "react";
import { ChevronRight, PlayCircle, CheckCircle2, Clock, Sparkles, Workflow, Target, BookOpen } from "lucide-react";
import { SectionHeader, PrismaProgress } from "@/components/nexia/primitives";
import { cn } from "@/lib/utils";

// ────────── Flujos / procesos del usuario y su aprendizaje asociado ──────────
type Modulo = {
  id: string;
  titulo: string;
  duracion: string;
  estado: "completado" | "en-curso" | "pendiente";
  tipo: "Microcápsula" | "Práctica" | "Plantilla" | "Caso real";
};

type Flujo = {
  id: string;
  nombre: string;
  descripcion: string;
  herramientas: string[];
  avance: number;
  porQue: string;
  impacto: string;
  modulos: Modulo[];
  color: string;
};

const FLUJOS: Flujo[] = [
  {
    id: "discovery",
    nombre: "Discovery de producto con IA",
    descripcion: "Cómo investigar usuarios, sintetizar entrevistas y priorizar oportunidades usando LLMs.",
    herramientas: ["ChatGPT", "Notion AI", "Dovetail"],
    avance: 72,
    porQue: "Prisma detectó que dedicas ~6 h semanales a sintetizar entrevistas y notas dispersas en Notion.",
    impacto: "Reducir el tiempo de síntesis en ~40% y mejorar la trazabilidad de insights.",
    color: "#8ed8c4",
    modulos: [
      { id: "d1", titulo: "Prompts para sintetizar entrevistas",   duracion: "25 min", estado: "completado", tipo: "Microcápsula" },
      { id: "d2", titulo: "Clusterización de insights con LLMs",   duracion: "40 min", estado: "completado", tipo: "Práctica" },
      { id: "d3", titulo: "Priorización RICE asistida por IA",     duracion: "35 min", estado: "en-curso",   tipo: "Caso real" },
      { id: "d4", titulo: "Plantilla: brief de oportunidad",        duracion: "15 min", estado: "pendiente",  tipo: "Plantilla" },
    ],
  },
  {
    id: "roadmap",
    nombre: "Roadmapping y priorización",
    descripcion: "Construir y comunicar el roadmap apoyándose en datos y resúmenes generados por IA.",
    herramientas: ["Linear", "ChatGPT", "Miro AI"],
    avance: 45,
    porQue: "En las últimas 3 reuniones de roadmap, el equipo pidió más claridad en los criterios de priorización.",
    impacto: "Decisiones de roadmap más rápidas y mejor alineadas con OKRs.",
    color: "#f7a87a",
    modulos: [
      { id: "r1", titulo: "Resumir tickets de Linear con IA",      duracion: "20 min", estado: "completado", tipo: "Microcápsula" },
      { id: "r2", titulo: "Construir un roadmap narrativo",         duracion: "50 min", estado: "en-curso",   tipo: "Práctica" },
      { id: "r3", titulo: "Presentar trade-offs a stakeholders",    duracion: "30 min", estado: "pendiente",  tipo: "Caso real" },
    ],
  },
  {
    id: "analisis",
    nombre: "Análisis de datos asistido por IA",
    descripcion: "Convertir datasets en hallazgos accionables sin depender 100% del equipo de data.",
    herramientas: ["ChatGPT (Advanced Data)", "Hex", "Looker"],
    avance: 28,
    porQue: "Tus prompts de análisis suelen omitir el período de tiempo y las métricas de comparación.",
    impacto: "Análisis más precisos en el primer intento, menos retrabajo con el equipo de data.",
    color: "#c98ad6",
    modulos: [
      { id: "a1", titulo: "Anatomía de un buen prompt analítico",   duracion: "30 min", estado: "en-curso",   tipo: "Microcápsula" },
      { id: "a2", titulo: "Caso real: ventas Q1 vs Q2",              duracion: "45 min", estado: "pendiente",  tipo: "Caso real" },
      { id: "a3", titulo: "Plantilla: prompt de análisis comparativo", duracion: "10 min", estado: "pendiente", tipo: "Plantilla" },
    ],
  },
  {
    id: "comunicacion",
    nombre: "Comunicación con stakeholders",
    descripcion: "Resumir, redactar y traducir mensajes clave para distintas audiencias.",
    herramientas: ["Gmail", "Slack", "ChatGPT"],
    avance: 60,
    porQue: "Escribes en promedio 14 actualizaciones por semana a distintas audiencias internas.",
    impacto: "Mensajes más claros y consistentes; menos ciclos de aclaración.",
    color: "#f08aa0",
    modulos: [
      { id: "c1", titulo: "Adaptar tono según audiencia",            duracion: "20 min", estado: "completado", tipo: "Microcápsula" },
      { id: "c2", titulo: "Resúmenes ejecutivos en 150 palabras",    duracion: "25 min", estado: "completado", tipo: "Práctica" },
      { id: "c3", titulo: "Plantilla: status semanal asistido",      duracion: "10 min", estado: "pendiente",  tipo: "Plantilla" },
    ],
  },
];

const ESTADO_META: Record<Modulo["estado"], { label: string; Icon: any; color: string }> = {
  completado: { label: "Completado", Icon: CheckCircle2, color: "text-emerald-600" },
  "en-curso": { label: "En curso",    Icon: PlayCircle,   color: "text-amber-600" },
  pendiente:  { label: "Pendiente",   Icon: Clock,        color: "text-muted-foreground" },
};

export default function MiAprendizaje() {
  const [openId, setOpenId] = useState<string | null>(FLUJOS[0].id);

  const avanceGlobal = Math.round(FLUJOS.reduce((s, f) => s + f.avance, 0) / FLUJOS.length);
  const completados = FLUJOS.reduce(
    (s, f) => s + f.modulos.filter((m) => m.estado === "completado").length, 0,
  );
  const totalModulos = FLUJOS.reduce((s, f) => s + f.modulos.length, 0);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Mi aprendizaje"
        subtitle="Tu aprendizaje organizado por los flujos y procesos que Prisma observa en tu trabajo, no por área."
      />

      {/* KPIs personales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-elevated p-5 flex items-center gap-4">
          <Workflow className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="text-3xl tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
              {FLUJOS.length}
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Flujos activos</div>
          </div>
        </div>
        <div className="card-elevated p-5 flex items-center gap-4">
          <BookOpen className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="text-3xl tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
              {completados}<span className="text-muted-foreground text-lg">/{totalModulos}</span>
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Módulos completados</div>
          </div>
        </div>
        <div className="card-elevated p-5 flex items-center gap-4">
          <Target className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-3xl tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
              {avanceGlobal}%
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Avance personal</div>
            <PrismaProgress percent={avanceGlobal} />
          </div>
        </div>
      </div>

      {/* Flujos */}
      <div className="flex flex-col gap-3">
        {FLUJOS.map((flujo) => {
          const isOpen = openId === flujo.id;
          return (
            <div
              key={flujo.id}
              className="card-elevated overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : flujo.id)}
                className="w-full grid grid-cols-1 md:grid-cols-[1.6fr_2fr_1.4fr_0.4fr] gap-4 items-center text-left px-5 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: flujo.color }}
                  />
                  <div className="min-w-0">
                    <div
                      className="font-semibold truncate"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
                    >
                      {flujo.nombre}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {flujo.herramientas.join(" · ")}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground line-clamp-2">
                  {flujo.descripcion}
                </div>

                <div className="flex items-center gap-3">
                  <PrismaProgress percent={flujo.avance} className="flex-1" />
                  <span className="text-xs font-medium w-10 text-right tabular-nums">{flujo.avance}%</span>
                </div>

                <div className="flex justify-end text-muted-foreground">
                  <ChevronRight
                    className={cn("w-4 h-4 transition-transform", isOpen && "rotate-90")}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-border/60 bg-muted/20">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.6fr] gap-5 mt-4">
                    {/* Justificación */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        <Sparkles className="w-3.5 h-3.5" style={{ color: flujo.color }} />
                        Por qué este flujo
                      </div>
                      <p className="text-sm leading-relaxed">{flujo.porQue}</p>
                      <div className="pt-2 border-t border-border/60">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
                          Impacto esperado
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{flujo.impacto}</p>
                      </div>
                    </div>

                    {/* Módulos */}
                    <div className="space-y-2">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
                        Módulos del flujo
                      </div>
                      {flujo.modulos.map((m) => {
                        const meta = ESTADO_META[m.estado];
                        const Icon = meta.Icon;
                        return (
                          <div
                            key={m.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-background border border-border hover:border-foreground/20 transition-colors"
                          >
                            <Icon className={cn("w-4 h-4 shrink-0", meta.color)} />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm truncate">{m.titulo}</div>
                              <div className="text-[11px] text-muted-foreground">
                                {m.tipo} · {m.duracion}
                              </div>
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground hidden sm:inline">
                              {meta.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
