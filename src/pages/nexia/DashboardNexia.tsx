import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles, X, Maximize2, Send, BookOpen, Target, Zap, MessageSquare, Workflow, CircleAlert, Plug, Bot } from "lucide-react";
import { empresa, alertas, actividades, integraciones, areas } from "@/lib/nexia-mock";
import { PriorityBadge, IntegrationStatus, TrendBadge } from "@/components/nexia/primitives";
import { ToolLogo } from "@/components/nexia/ToolLogo";
import AmoebaAdoption from "@/components/nexia/AmoebaAdoption";
import prismaBg from "@/assets/bg-prisma-4.png";
import prismaSphere from "@/assets/prisma-sphere.png";
import prismaHoverBg from "@/assets/bg-prisma-7.png";

const fmtUsd = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`;

function GlassKpi({ label, value, trend, hint, accent }: { label: string; value: string | number; trend?: number; hint?: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg p-5">
      <div className="text-[11px] uppercase tracking-wide text-foreground/70 font-medium">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span
          className={accent ? "text-4xl font-semibold text-foreground" : "text-3xl font-semibold text-foreground"}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {value}
        </span>
        {typeof trend === "number" && <TrendBadge value={trend} />}
      </div>
      {hint && <div className="mt-1 text-xs text-foreground/60">{hint}</div>}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  // Onboarding gate (super admin primera vez)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("prisma_admin_onboarded")) {
      navigate("/onboarding", { replace: true });
    }
  }, [navigate]);

  const moduloEstados = [
    { nombre: "Módulo 01 — Diagnóstico", estado: "Activo", color: "text-success bg-success/10", to: "/diagnostico" },
    { nombre: "Módulo 02 — Hunting", estado: "2 búsquedas activas", color: "text-foreground bg-muted", to: "/hunting" },
    { nombre: "Módulo 03 — Upskilling", estado: "7 áreas en curso", color: "text-success bg-success/10", to: "/upskilling" },
  ];

  const dotColor = (tipo: string) =>
    tipo === "ok" ? "bg-success" : tipo === "warn" ? "bg-warning" : "bg-foreground";

  // Pérdida estimada por área (orden descendente por USD)
  const lossData = [...areas]
    .map((a) => ({ area: a.nombre, valor: a.roiPerdidoUsdMes }))
    .sort((a, b) => b.valor - a.valor);

  return (
    <div className="space-y-8">
      <section
        className="rounded-3xl relative overflow-hidden p-8 lg:p-10 min-h-[360px] flex items-center"
        style={{ backgroundImage: `url(${prismaBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 items-center w-full">
          <div className="rounded-2xl p-7 lg:p-8 bg-white/25 backdrop-blur-xl border border-white/40 shadow-[0_8px_40px_rgba(0,0,0,0.08)] text-foreground">
            <div className="text-[11px] uppercase tracking-[0.22em] text-foreground/70 mb-4">
              Resumen Ejecutivo
            </div>
            <h1
              className="text-4xl lg:text-5xl leading-[1.1] text-foreground"
              style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
            >
              Buen día
              <br />
              <em className="not-italic font-light text-foreground/70">así está usando la IA tu organización</em>
            </h1>
            <p className="text-sm text-foreground/75 mt-4 max-w-md">
              Así está usando la IA tu organización — y cuánto valor puede recuperar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <GlassKpi
              label="ROI recuperable estimado"
              value={fmtUsd(empresa.roiRecuperableTotalUsd)}
              hint="USD anualizado"
              accent
            />
            <GlassKpi
              label="Procesos sin automatizar"
              value={empresa.procesosAutomatizablesTotal}
              hint="detectados en todas las áreas"
            />
            <GlassKpi
              label="Señales de uso incorrecto"
              value={empresa.colaboradoresConErrores}
              hint="agregadas por área"
            />
            <GlassKpi
              label="Áreas con adopción nula de IA"
              value={`${empresa.areasAdopcionNula} de ${empresa.areasTotal}`}
              hint="sin uso registrado"
            />
          </div>
        </div>
      </section>

      <FlujosPreviewWidget onOpen={() => navigate("/flujos")} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">

          <div className="card-elevated p-6 relative overflow-hidden">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-lg font-semibold">Pérdida de valor estimada por área</h3>
              <span className="text-xs text-muted-foreground">USD / mes</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Estimado en base a horas perdidas, errores de proceso y tareas automatizables no aprovechadas.
            </p>
            <PrismaLossWave data={lossData} />
          </div>

          <AmoebaAdoption />

          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold mb-4">Alertas y acciones recomendadas</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                    <th className="py-2 pr-4 font-medium">Área</th>
                    <th className="py-2 pr-4 font-medium">Causa detectada</th>
                    <th className="py-2 pr-4 font-medium">Acción sugerida</th>
                    <th className="py-2 pr-4 font-medium">Prioridad</th>
                    <th className="py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {alertas.map((a, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-3 pr-4 font-medium">{a.area}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{a.brecha}</td>
                      <td className="py-3 pr-4">{a.accion}</td>
                      <td className="py-3 pr-4"><PriorityBadge priority={a.prioridad as any} /></td>
                      <td className="py-3 text-right">
                        <button onClick={() => navigate(a.to)} className="text-xs font-medium text-foreground hover:text-highlight inline-flex items-center gap-1">
                          Ver detalle <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6 bg-muted/30 rounded-3xl p-5">
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold mb-4">Estado de módulos</h3>
            <div className="space-y-3">
              {moduloEstados.map((m) => (
                <button key={m.nombre} onClick={() => navigate(m.to)} className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted transition-colors text-left">
                  <span className="text-sm font-medium">{m.nombre}</span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${m.color}`}>{m.estado}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold mb-4">Últimas actividades</h3>
            <ul className="space-y-3">
              {actividades.map((act, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dotColor(act.tipo)}`} />
                  <div className="flex-1">
                    <p className="text-sm">{act.texto}</p>
                    <span className="text-xs text-muted-foreground">{act.tiempo}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Integraciones activas</h3>
              <button onClick={() => navigate("/configuracion")} className="text-xs font-medium text-muted-foreground hover:text-foreground">
                Gestionar →
              </button>
            </div>
            <div className="space-y-2">
              {integraciones.map((it) => (
                <div key={it.id} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-muted/40">
                  <span className="text-sm font-medium flex items-center gap-2 min-w-0">
                    <ToolLogo name={it.nombre} size={18} />
                    <span className="truncate">{it.nombre}</span>
                  </span>
                  <IntegrationStatus status={it.estado} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PrismaFloatingWidget onOpen={() => navigate("/upskilling/agente")} />
    </div>
  );
}

type LossWaveDatum = { area: string; valor: number };

function PrismaLossWave({ data }: { data: LossWaveDatum[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const width = 820;
  const height = 300;
  const paddingX = 58;
  const paddingY = 34;

  const { points, path, areaPath, active } = useMemo(() => {
    const max = Math.max(...data.map((d) => d.valor), 1);
    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingY * 2;
    const pts = data.map((d, index) => {
      const x = paddingX + (index / Math.max(data.length - 1, 1)) * usableWidth;
      const normalized = d.valor / max;
      const y = paddingY + (1 - normalized) * usableHeight;
      return { ...d, x, y };
    });

    const curve = pts.reduce((acc, point, index) => {
      if (index === 0) return `M ${point.x},${point.y}`;
      const prev = pts[index - 1];
      const cp1x = prev.x + (point.x - prev.x) * 0.48;
      const cp1y = prev.y;
      const cp2x = point.x - (point.x - prev.x) * 0.48;
      const cp2y = point.y;
      return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
    }, "");

    const last = pts[pts.length - 1];
    const first = pts[0];
    const areaPath = `${curve} L ${last.x},${height - paddingY} L ${first.x},${height - paddingY} Z`;

    return { points: pts, path: curve, areaPath, active: activeIndex === null ? pts[0] : pts[activeIndex] };
  }, [activeIndex, data]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-border">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[300px] w-full" role="img" aria-label="Onda de pérdida de valor estimada por área">
        <defs>
          <linearGradient id="prismaLossGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#f5d3a8" />
            <stop offset="20%" stopColor="#f7a87a" />
            <stop offset="40%" stopColor="#f08aa0" />
            <stop offset="60%" stopColor="#c98ad6" />
            <stop offset="80%" stopColor="#8aa9e8" />
            <stop offset="100%" stopColor="#8ed8c4" />
          </linearGradient>
          <linearGradient id="prismaLossFill" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#f5d3a8" stopOpacity="0.6" />
            <stop offset="20%" stopColor="#f7a87a" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#f08aa0" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#c98ad6" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#8aa9e8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8ed8c4" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="prismaLossFade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
          </linearGradient>
          <filter id="prismaWaveGlow" x="-20%" y="-80%" width="140%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={paddingX}
            x2={width - paddingX}
            y1={paddingY + ratio * (height - paddingY * 2)}
            y2={paddingY + ratio * (height - paddingY * 2)}
            stroke="hsl(var(--border))"
            strokeDasharray="4 8"
            strokeOpacity="0.65"
          />
        ))}

        <path d={areaPath} fill="url(#prismaLossFill)" />
        <path d={areaPath} fill="url(#prismaLossFade)" />
        <path d={path} fill="none" stroke="url(#prismaLossGradient)" strokeWidth="5" strokeLinecap="round" filter="url(#prismaWaveGlow)" />

        {points.map((point, index) => (
          <g key={point.area} onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)} className="cursor-pointer">
            <circle cx={point.x} cy={point.y} r={index === 0 ? 8 : 6} fill="#ffffff" stroke="url(#prismaLossGradient)" strokeWidth="4" />
            <text x={point.x} y={height - 12} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11">
              {point.area}
            </text>
          </g>
        ))}
      </svg>

      {active && (
        <div className="absolute left-5 top-5 rounded-2xl border border-border bg-background/95 px-4 py-3 shadow-xl backdrop-blur">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Mayor foco del flujo</div>
          <div className="mt-1 text-sm font-semibold">{active.area}</div>
          <div className="text-xs text-muted-foreground">{fmtUsd(active.valor)} / mes recuperable</div>
        </div>
      )}
    </div>
  );
}

function PrismaFloatingWidget({ onOpen }: { onOpen: () => void }) {
  const [mode, setMode] = useState<"hint" | "quick" | "closed">("hint");

  const quickTools = [
    { icon: Target, label: "Ver mis objetivos", hint: "3 activos" },
    { icon: BookOpen, label: "Ruta de upskilling", hint: "45% completada" },
    { icon: Zap, label: "Resumen del día", hint: "12 prompts · 5 herramientas" },
    { icon: MessageSquare, label: "Practicar prompt", hint: "ChatGPT · Notion" },
  ];

  const oportunidades = [
    "Detecté 3 procesos automatizables en Operaciones esta semana",
    "Marketing muestra prompts sin estructura a nivel de área",
    "Legal sigue con adopción nula — $48K/mes de valor perdido",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 max-w-[28rem]">
      {mode === "hint" && (
        <div className="rounded-2xl bg-background border border-border shadow-2xl p-4 w-80 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start gap-3">
            <img src={prismaSphere} alt="Prisma" className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Prisma detectó</span>
                <button onClick={() => setMode("closed")} className="text-muted-foreground hover:text-foreground -mr-1 -mt-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm mt-1 leading-snug">
                Detecté <span className="font-medium">3 oportunidades de mejora</span> con impacto directo en ROI esta semana.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setMode("quick")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-foreground text-background text-xs font-medium hover:opacity-90"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Vista rápida
                </button>
                <button
                  onClick={() => setMode("closed")}
                  className="px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted"
                >
                  Más tarde
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === "quick" && (
        <div className="rounded-3xl bg-background border border-border shadow-2xl w-[26rem] overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <div className="relative p-5 border-b border-border">
            <div className="flex items-start gap-3">
              <img src={prismaSphere} alt="Prisma" className="w-12 h-12 rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Agente Prisma</div>
                <div className="text-sm font-medium mt-0.5">Vista rápida · resumen de hoy</div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={onOpen} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" title="Abrir agente completo">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setMode("closed")} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">3 oportunidades detectadas</div>
            <ul className="space-y-2">
              {oportunidades.map((o, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs leading-snug">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-5 pb-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Acciones rápidas</div>
            <div className="grid grid-cols-2 gap-2">
              {quickTools.map((t) => (
                <button key={t.label} onClick={onOpen} className="text-left p-2.5 rounded-xl border border-border hover:bg-muted transition-colors">
                  <t.icon className="w-3.5 h-3.5 text-foreground mb-1.5" />
                  <div className="text-xs font-medium leading-tight">{t.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{t.hint}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 pb-4">
            <button onClick={onOpen} className="w-full flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-2 text-left hover:bg-muted transition-colors">
              <span className="text-xs text-muted-foreground flex-1 truncate">Pregúntale algo a Prisma…</span>
              <span className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center">
                <Send className="w-3 h-3" />
              </span>
            </button>
          </div>

          <button onClick={onOpen} className="group relative w-full px-5 py-3 border-t border-border bg-muted/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors overflow-hidden">
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-cover bg-center"
              style={{ backgroundImage: `url(${prismaHoverBg})` }}
              aria-hidden
            />
            <span className="relative flex items-center gap-1.5 group-hover:text-foreground">
              <Sparkles className="w-3.5 h-3.5" /> Abrir agente completo
              <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        </div>
      )}

      <button
        onClick={() => setMode((m) => (m === "closed" ? "hint" : m === "hint" ? "quick" : "closed"))}
        className="relative w-14 h-14 rounded-full overflow-hidden shadow-2xl ring-2 ring-background hover:scale-105 transition-transform"
        aria-label="Abrir Prisma"
      >
        <img src={prismaSphere} alt="Prisma" className="w-full h-full object-cover" />
        <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
      </button>
    </div>
  );
}

function FlujosPreviewWidget({ onOpen }: { onOpen: () => void }) {
  const topAreas = [...areas]
    .sort((a, b) => b.procesosAutomatizables - a.procesosAutomatizables)
    .slice(0, 3);

  // Prisma palette per branch
  const branchColors = ["#f08aa0", "#c98ad6", "#8aa9e8"];
  const stageColors = ["#f7a87a", "#f08aa0", "#c98ad6", "#8ed8c4"];
  const stages = [
    { label: "Dolores", icon: CircleAlert },
    { label: "Aprendizaje", icon: BookOpen },
    { label: "Herramientas", icon: Plug },
    { label: "Automatización", icon: Bot },
  ];

  // Mind-map geometry
  const W = 900;
  const H = 340;
  const rootX = 110;
  const rootY = H / 2;
  const areaX = 360;
  const areaYs = [70, H / 2, H - 70];
  const stageX = 720;
  const stageStep = 78;
  const stageYStart = (H - stageStep * (stages.length - 1)) / 2;

  return (
    <button
      onClick={onOpen}
      className="group w-full text-left card-elevated p-5 lg:p-6 hover:shadow-lg transition-shadow bg-white"
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <Workflow className="w-3.5 h-3.5" /> Mapa mental de flujos
          </div>
          <h3
            className="mt-2 text-xl lg:text-2xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Procesos por área conectados como mind map
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Cada área se ramifica hacia sus dolores, aprendizajes, herramientas y automatizaciones.
          </p>
        </div>
        <span className="hidden md:inline-flex items-center gap-1 text-xs font-medium text-foreground/80 group-hover:text-foreground">
          Ver flujos completos
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>

      <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-white">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[300px] lg:h-[340px]" preserveAspectRatio="xMidYMid meet">
          {/* Left branches: root → areas */}
          {topAreas.map((a, i) => {
            const y = areaYs[i];
            const c1x = rootX + 90;
            const c2x = areaX - 90;
            const color = branchColors[i];
            return (
              <path
                key={`l-${a.id}`}
                d={`M ${rootX + 18} ${rootY} C ${c1x} ${rootY}, ${c2x} ${y}, ${areaX - 8} ${y}`}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            );
          })}

          {/* Right branches: middle area → stages */}
          {stages.map((_, j) => {
            const y = stageYStart + j * stageStep;
            const yMid = areaYs[1];
            const c1x = areaX + 110;
            const c2x = stageX - 110;
            return (
              <path
                key={`r-${j}`}
                d={`M ${areaX + 110} ${yMid} C ${c1x + 40} ${yMid}, ${c2x} ${y}, ${stageX - 8} ${y}`}
                fill="none"
                stroke={stageColors[j]}
                strokeWidth="2.25"
                strokeLinecap="round"
              />
            );
          })}

          {/* Root node */}
          <g>
            <circle cx={rootX} cy={rootY} r="22" fill="#0f172a" />
            <circle cx={rootX} cy={rootY} r="22" fill="url(#rootGrad)" />
            <text x={rootX} y={rootY + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">
              Prisma
            </text>
            <defs>
              <radialGradient id="rootGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f08aa0" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#c98ad6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#8aa9e8" stopOpacity="0.9" />
              </radialGradient>
            </defs>
            {/* connector dot */}
            <circle cx={rootX + 18} cy={rootY} r="4" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
          </g>

          {/* Area nodes (middle column) */}
          {topAreas.map((a, i) => {
            const y = areaYs[i];
            const color = branchColors[i];
            const isMid = i === 1;
            const boxW = 220;
            return (
              <g key={`area-${a.id}`}>
                {/* card */}
                <rect
                  x={areaX - 8}
                  y={y - 22}
                  width={boxW}
                  height="44"
                  rx="10"
                  fill="#ffffff"
                  stroke="#e5e7eb"
                />
                {/* color tab */}
                <rect x={areaX - 8} y={y - 22} width="6" height="44" rx="3" fill={color} />
                <text x={areaX + 12} y={y - 2} fontSize="12" fontWeight="600" fill="#0f172a">
                  {a.nombre.length > 22 ? a.nombre.slice(0, 22) + "…" : a.nombre}
                </text>
                <text x={areaX + 12} y={y + 14} fontSize="10" fill="#64748b">
                  {a.procesosAutomatizables} procesos · {a.score}% madurez
                </text>
                {isMid && (
                  <circle cx={areaX + boxW + 2} cy={y} r="4" fill="#fff" stroke="#0f172a" strokeWidth="1.5" />
                )}
              </g>
            );
          })}

          {/* Stage nodes (right column) */}
          {stages.map((s, j) => {
            const y = stageYStart + j * stageStep;
            const boxW = 170;
            const color = stageColors[j];
            return (
              <g key={`stage-${s.label}`}>
                <rect
                  x={stageX - 8}
                  y={y - 18}
                  width={boxW}
                  height="36"
                  rx="9"
                  fill="#ffffff"
                  stroke="#e5e7eb"
                />
                <rect x={stageX} y={y - 8} width="14" height="14" rx="3" fill={color} />
                <text x={stageX + 22} y={y + 4} fontSize="12" fontWeight="600" fill="#0f172a">
                  {s.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </button>
  );
}
