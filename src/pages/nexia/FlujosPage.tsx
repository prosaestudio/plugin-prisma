import { useMemo, useState, type ComponentType } from "react";
import { BookOpen, Bot, Building2, CircleAlert, Plug, Sparkles } from "lucide-react";
import { areas } from "@/lib/nexia-mock";
import { PrismaProgress, SectionHeader } from "@/components/nexia/primitives";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

type FlowDetail = {
  descripcion: string;
  recomendacion: string;
  impacto: string;
  kpi?: string;
};

type FlowNode = {
  label: string;
  meta: string;
  status: "activo" | "aprendiendo" | "pendiente" | "alerta";
  detail?: FlowDetail;
};

type FlowColumn = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  nodes: FlowNode[];
};

const STAGE_COLORS = ["#f7a87a", "#f08aa0", "#c98ad6", "#8ed8c4"];

const statusLabel: Record<FlowNode["status"], string> = {
  activo: "Activo",
  aprendiendo: "Aprendiendo",
  pendiente: "Pendiente",
  alerta: "Crítico",
};

const statusDot: Record<FlowNode["status"], string> = {
  activo: "bg-emerald-500",
  aprendiendo: "bg-amber-500",
  pendiente: "bg-slate-400",
  alerta: "bg-rose-500",
};

const defaultDetail = (label: string, status: FlowNode["status"]): FlowDetail => ({
  descripcion: `Punto del flujo "${label}" detectado por Prisma a partir de la actividad del área.`,
  recomendacion:
    status === "alerta"
      ? "Priorizar plan de remediación: definir responsable, KPI y fecha límite en las próximas 2 semanas."
      : status === "aprendiendo"
      ? "Reforzar con microcápsulas, plantillas de prompts y revisión semanal del avance."
      : status === "activo"
      ? "Mantener el ritmo: documentar buenas prácticas y replicar a áreas con menor adopción."
      : "Validar oportunidad con el líder del área y agendar diagnóstico breve.",
  impacto:
    status === "alerta"
      ? "Alto"
      : status === "aprendiendo"
      ? "Medio"
      : status === "activo"
      ? "Sostenible"
      : "Por estimar",
  kpi: status === "alerta" ? "Reducción de retrabajo > 30%" : status === "activo" ? "Adopción > 70%" : undefined,
});

const areaContext: Record<string, { madurez: number; columns: FlowColumn[] }> = {
  operaciones: {
    madurez: 28,
    columns: [
      {
        title: "Dolores",
        icon: CircleAlert,
        nodes: [
          {
            label: "Retrabajo operativo",
            meta: "Alta fricción",
            status: "alerta",
            detail: {
              descripcion: "El equipo repite tareas de conciliación manual entre planillas y sistemas internos.",
              recomendacion: "Mapear las 3 conciliaciones más costosas y diseñar un agente que las consolide.",
              impacto: "Ahorro estimado de 120 horas/mes",
              kpi: "Tiempo de cierre operativo −40%",
            },
          },
          {
            label: "Traspasos manuales",
            meta: "5 procesos",
            status: "alerta",
            detail: {
              descripcion: "Información se pasa por correo o Excel entre turnos, generando errores y demoras.",
              recomendacion: "Estandarizar plantillas y enviar resúmenes automáticos al cierre de cada turno.",
              impacto: "Reducción de incidencias de traspaso",
              kpi: "Errores de traspaso < 2%",
            },
          },
        ],
      },
      {
        title: "Aprendizaje",
        icon: BookOpen,
        nodes: [
          {
            label: "Prompts de control",
            meta: "En curso",
            status: "aprendiendo",
            detail: {
              descripcion: "Líderes están aprendiendo a auditar resultados de IA antes de publicarlos.",
              recomendacion: "Completar la ruta de Validación de Outputs y certificar a 5 líderes operativos.",
              impacto: "Calidad y trazabilidad de outputs IA",
              kpi: "Auditorías semanales > 80%",
            },
          },
          { label: "Validación de datos", meta: "Pendiente", status: "pendiente" },
        ],
      },
      {
        title: "Herramientas",
        icon: Plug,
        nodes: [
          {
            label: "Copilot",
            meta: "Uso inicial",
            status: "aprendiendo",
            detail: {
              descripcion: "Adopción incipiente en Excel y Outlook, principalmente para resúmenes.",
              recomendacion: "Definir casos de uso obligatorios y publicar biblioteca de prompts del área.",
              impacto: "Productividad individual",
              kpi: "Uso activo semanal > 60%",
            },
          },
          { label: "Excel + IA", meta: "Conectable", status: "pendiente" },
        ],
      },
      {
        title: "Automatización",
        icon: Bot,
        nodes: [
          {
            label: "Checklist asistido",
            meta: "Piloto",
            status: "aprendiendo",
            detail: {
              descripcion: "Agente que valida pasos críticos del cierre operativo y alerta omisiones.",
              recomendacion: "Escalar piloto a 3 turnos adicionales y medir reducción de incidencias.",
              impacto: "Confiabilidad operativa",
              kpi: "Incidencias críticas −50%",
            },
          },
          {
            label: "Reporte diario",
            meta: "Prioritario",
            status: "alerta",
            detail: {
              descripcion: "El reporte diario se arma manualmente cada mañana en 90 minutos.",
              recomendacion: "Automatizar consolidación desde fuentes operativas con narrativa generada por IA.",
              impacto: "Ahorro de 30 horas/semana",
              kpi: "Tiempo de reporte < 10 min",
            },
          },
        ],
      },
    ],
  },
  finanzas: {
    madurez: 22,
    columns: [
      {
        title: "Dolores",
        icon: CircleAlert,
        nodes: [
          { label: "Reportes manuales", meta: "Crítico", status: "alerta" },
          { label: "Consolidación lenta", meta: "6 procesos", status: "alerta" },
        ],
      },
      {
        title: "Aprendizaje",
        icon: BookOpen,
        nodes: [
          { label: "IA para análisis", meta: "38% avance", status: "aprendiendo" },
          { label: "Control de supuestos", meta: "Pendiente", status: "pendiente" },
        ],
      },
      {
        title: "Herramientas",
        icon: Plug,
        nodes: [
          { label: "Copilot", meta: "Activo", status: "activo" },
          { label: "ChatGPT", meta: "Bajo uso", status: "pendiente" },
        ],
      },
      {
        title: "Automatización",
        icon: Bot,
        nodes: [
          { label: "Cierre mensual", meta: "Diseño", status: "pendiente" },
          { label: "Resumen ejecutivo", meta: "Piloto", status: "aprendiendo" },
        ],
      },
    ],
  },
  marketing: {
    madurez: 42,
    columns: [
      {
        title: "Dolores",
        icon: CircleAlert,
        nodes: [
          { label: "Prompts sin estructura", meta: "Calidad variable", status: "alerta" },
          { label: "Briefs repetitivos", meta: "3 procesos", status: "aprendiendo" },
        ],
      },
      {
        title: "Aprendizaje",
        icon: BookOpen,
        nodes: [
          { label: "ChatGPT Marketing", meta: "72% avance", status: "activo" },
          { label: "Criterios de marca", meta: "En curso", status: "aprendiendo" },
        ],
      },
      {
        title: "Herramientas",
        icon: Plug,
        nodes: [
          { label: "ChatGPT", meta: "Activo", status: "activo" },
          { label: "Claude", meta: "Activo", status: "activo" },
        ],
      },
      {
        title: "Automatización",
        icon: Bot,
        nodes: [
          { label: "Variantes de campaña", meta: "Activo", status: "activo" },
          { label: "QA de contenido", meta: "Pendiente", status: "pendiente" },
        ],
      },
    ],
  },
};

const fallbackColumns = (areaName: string, procesos: number): FlowColumn[] => [
  { title: "Dolores", icon: CircleAlert, nodes: [{ label: `Brechas en ${areaName}`, meta: `${procesos} procesos`, status: procesos > 2 ? "alerta" : "pendiente" }] },
  { title: "Aprendizaje", icon: BookOpen, nodes: [{ label: "Ruta del área", meta: "En evaluación", status: "aprendiendo" }] },
  { title: "Herramientas", icon: Plug, nodes: [{ label: "IA generativa", meta: "Conexión gradual", status: "pendiente" }] },
  { title: "Automatización", icon: Bot, nodes: [{ label: "Flujo priorizado", meta: "Diseño", status: "pendiente" }] },
];

export default function FlujosPage() {
  const [selectedAreaId, setSelectedAreaId] = useState("operaciones");
  const selectedArea = areas.find((area) => area.id === selectedAreaId) || areas[0];

  const flow = useMemo(() => {
    const preset = areaContext[selectedArea.id];
    return {
      madurez: preset?.madurez ?? selectedArea.score,
      columns: preset?.columns ?? fallbackColumns(selectedArea.nombre, selectedArea.procesosAutomatizables),
    };
  }, [selectedArea]);

  return (
    <div className="space-y-7">
      <SectionHeader
        title="Flujos de trabajo por área"
        subtitle="Mapa mental de dolores, aprendizajes, herramientas y automatizaciones. Pasa el cursor sobre cada nodo para ver detalle."
      />

      <div className="grid grid-cols-1 xl:grid-cols-[17rem_1fr] gap-5">
        <aside className="card-elevated p-3 h-fit">
          <div className="px-2 py-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Áreas</div>
          <div className="space-y-1">
            {areas.map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedAreaId(area.id)}
                className={cn(
                  "w-full rounded-2xl px-3 py-3 text-left transition-colors",
                  selectedArea.id === area.id ? "bg-foreground text-background" : "hover:bg-muted",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-sm">{area.nombre}</span>
                  <span className="text-xs tabular-nums opacity-70">{area.score}</span>
                </div>
                <div className="mt-1 text-[11px] opacity-70">{area.procesosAutomatizables} procesos detectados</div>
              </button>
            ))}
          </div>
        </aside>

        <section className="card-elevated p-5 lg:p-6 overflow-hidden bg-white">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <Building2 className="w-3.5 h-3.5" /> {selectedArea.nombre}
              </div>
              <h2 className="mt-2 text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
                Mapa mental del flujo
              </h2>
            </div>
            <div className="min-w-[220px]">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Madurez del flujo</span>
                <span className="font-medium tabular-nums">{flow.madurez}%</span>
              </div>
              <PrismaProgress percent={flow.madurez} />
            </div>
          </div>

          <MindMap areaName={selectedArea.nombre} columns={flow.columns} />
        </section>
      </div>
    </div>
  );
}

function MindMap({ areaName, columns }: { areaName: string; columns: FlowColumn[] }) {
  // Canvas geometry (px in viewBox)
  const W = 1100;
  const leafSpacing = 74;
  const colTopPad = 30;
  const colBottomPad = 30;
  const leafCounts = columns.map((c) => Math.max(c.nodes.length, 1));
  const colHeights = leafCounts.map((n) => colTopPad + colBottomPad + (n - 1) * leafSpacing);
  const H = Math.max(420, ...colHeights, 110 * columns.length);

  const rootX = 90;
  const rootY = H / 2;
  const stageX = 380; // hub center x
  const leafX = 660; // leaf card left edge
  const leafW = 320;
  const leafH = 56;

  // Distribute stages evenly vertically
  const stageStep = (H - 80) / Math.max(columns.length - 1, 1);
  const stageYs = columns.map((_, i) => 40 + i * stageStep);

  // Compute leaf positions per column, centered around its stage hub
  const leafPositions = columns.map((col, ci) => {
    const n = col.nodes.length;
    const totalH = (n - 1) * leafSpacing;
    const startY = stageYs[ci] - totalH / 2;
    return col.nodes.map((_, i) => startY + i * leafSpacing);
  });

  return (
    <div className="relative w-full overflow-x-auto">
      <div className="relative mx-auto" style={{ width: "100%", minWidth: 720 }}>
        <div className="relative" style={{ width: "100%", aspectRatio: `${W} / ${H}` }}>
          {/* SVG layer: connectors + node circles */}
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <radialGradient id="rootGradFlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f7a87a" />
                <stop offset="45%" stopColor="#f08aa0" />
                <stop offset="75%" stopColor="#c98ad6" />
                <stop offset="100%" stopColor="#8aa9e8" />
              </radialGradient>
            </defs>

            {/* Root → stage hubs */}
            {columns.map((_, i) => {
              const y = stageYs[i];
              const color = STAGE_COLORS[i % STAGE_COLORS.length];
              const c1x = rootX + 120;
              const c2x = stageX - 120;
              return (
                <path
                  key={`r2s-${i}`}
                  d={`M ${rootX + 26} ${rootY} C ${c1x} ${rootY}, ${c2x} ${y}, ${stageX - 22} ${y}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Stage hubs → leaves */}
            {columns.map((col, ci) => {
              const color = STAGE_COLORS[ci % STAGE_COLORS.length];
              const hubY = stageYs[ci];
              return col.nodes.map((_, li) => {
                const ly = leafPositions[ci][li];
                const c1x = stageX + 80;
                const c2x = leafX - 80;
                return (
                  <path
                    key={`s2l-${ci}-${li}`}
                    d={`M ${stageX + 22} ${hubY} C ${c1x} ${hubY}, ${c2x} ${ly + leafH / 2}, ${leafX - 4} ${ly + leafH / 2}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                );
              });
            })}

            {/* Root anchor dot on root */}
            <circle cx={rootX + 26} cy={rootY} r="4.5" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />

            {/* Root node */}
            <g>
              <circle cx={rootX} cy={rootY} r="48" fill="url(#rootGradFlow)" />
              <circle cx={rootX} cy={rootY} r="48" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1" />
              <text x={rootX} y={rootY - 4} textAnchor="middle" fontSize="9" fontWeight="600" fill="#fff" opacity="0.85" letterSpacing="1.2">
                ÁREA
              </text>
              <text x={rootX} y={rootY + 12} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">
                {areaName.length > 14 ? areaName.slice(0, 13) + "…" : areaName}
              </text>
            </g>

            {/* Stage hubs (anchor circles) */}
            {columns.map((col, ci) => {
              const color = STAGE_COLORS[ci % STAGE_COLORS.length];
              const y = stageYs[ci];
              return (
                <g key={`hub-${ci}`}>
                  <circle cx={stageX} cy={y} r="22" fill="#ffffff" stroke={color} strokeWidth="2.5" />
                  <circle cx={stageX - 22} cy={y} r="3.5" fill={color} />
                  <circle cx={stageX + 22} cy={y} r="3.5" fill={color} />
                  <text x={stageX} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0f172a">
                    {col.title.slice(0, 3).toUpperCase()}
                  </text>
                </g>
              );
            })}

            {/* Leaf anchor dots */}
            {columns.map((col, ci) =>
              col.nodes.map((_, li) => {
                const ly = leafPositions[ci][li] + leafH / 2;
                return (
                  <circle
                    key={`ldot-${ci}-${li}`}
                    cx={leafX - 4}
                    cy={ly}
                    r="3.5"
                    fill="#fff"
                    stroke={STAGE_COLORS[ci % STAGE_COLORS.length]}
                    strokeWidth="2"
                  />
                );
              }),
            )}
          </svg>

          {/* HTML overlay: stage labels + leaf cards with HoverCards */}
          <div className="absolute inset-0">
            {/* Stage labels under each hub */}
            {columns.map((col, ci) => {
              const Icon = col.icon;
              const color = STAGE_COLORS[ci % STAGE_COLORS.length];
              return (
                <div
                  key={`hublabel-${ci}`}
                  className="absolute -translate-x-1/2 flex items-center gap-1.5 text-[11px] font-semibold"
                  style={{
                    left: `${(stageX / W) * 100}%`,
                    top: `calc(${(stageYs[ci] / H) * 100}% + 28px)`,
                    color,
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {col.title}
                </div>
              );
            })}

            {/* Leaf cards */}
            {columns.map((col, ci) =>
              col.nodes.map((node, li) => {
                const color = STAGE_COLORS[ci % STAGE_COLORS.length];
                const top = leafPositions[ci][li];
                const detail = node.detail ?? defaultDetail(node.label, node.status);
                return (
                  <div
                    key={`leaf-${ci}-${li}`}
                    className="absolute"
                    style={{
                      left: `${(leafX / W) * 100}%`,
                      top: `${(top / H) * 100}%`,
                      width: `${(leafW / W) * 100}%`,
                      height: `${(leafH / H) * 100}%`,
                    }}
                  >
                    <HoverCard openDelay={80} closeDelay={60}>
                      <HoverCardTrigger asChild>
                        <button
                          type="button"
                          className="group relative w-full h-full text-left rounded-xl border border-border bg-white px-3 pl-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 flex flex-col justify-center"
                          style={{ ["--tw-ring-color" as string]: color }}
                        >
                          <span
                            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                            style={{ background: color }}
                          />
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-[13px] font-medium leading-tight truncate">{node.label}</div>
                            <span className={cn("mt-1 h-2 w-2 rounded-full shrink-0", statusDot[node.status])} aria-hidden />
                          </div>
                          <div className="mt-0.5 text-[11px] text-muted-foreground truncate">{node.meta}</div>
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent
                        side="top"
                        align="center"
                        sideOffset={10}
                        className="w-72 p-0 border-none shadow-xl rounded-2xl overflow-hidden"
                      >
                        <div className="h-1.5 w-full" style={{ background: color }} />
                        <div className="p-4 bg-white">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                              {col.title}
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
                              <span className={cn("h-2 w-2 rounded-full", statusDot[node.status])} />
                              {statusLabel[node.status]}
                            </span>
                          </div>
                          <div className="mt-1 text-sm font-semibold leading-tight">{node.label}</div>
                          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{detail.descripcion}</p>

                          <div className="mt-3 rounded-xl bg-muted/50 px-3 py-2">
                            <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Recomendación</div>
                            <div className="mt-0.5 text-xs leading-relaxed">{detail.recomendacion}</div>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="rounded-lg border border-border px-2.5 py-2">
                              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Impacto</div>
                              <div className="text-xs font-medium mt-0.5">{detail.impacto}</div>
                            </div>
                            <div className="rounded-lg border border-border px-2.5 py-2">
                              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">KPI</div>
                              <div className="text-xs font-medium mt-0.5">{detail.kpi ?? "Por definir"}</div>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                );
              }),
            )}

            {/* Root label sparkle */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${(rootX / W) * 100}%`, top: `calc(${(rootY / H) * 100}% - 38px)` }}
            >
              <Sparkles className="h-3.5 w-3.5 text-foreground/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
