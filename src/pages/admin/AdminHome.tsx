import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SectionHeader, KpiCard, TrendBadge } from "@/components/nexia/primitives";
import {
  kpisSalud, dolores, heatmap, diasSemana, vencimientos, gaps,
  serieConsultas90d, distribHoraria, oportunidades, consultasPorCanal,
} from "@/lib/prisma-admin-mock";
import { AlertTriangle, ArrowUpRight, FileWarning, Clock, MessageSquareWarning, Sparkles, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

// Prisma gradient stops (matches --gradient-prisma in index.css)
const PRISMA_STOPS = [
  { off: "0%",   c: "#f5d3a8" },
  { off: "18%",  c: "#f7a87a" },
  { off: "36%",  c: "#f08aa0" },
  { off: "56%",  c: "#c98ad6" },
  { off: "74%",  c: "#8aa9e8" },
  { off: "90%",  c: "#8ed8c4" },
  { off: "100%", c: "#f5d3a8" },
];

function heatColor(v: number, max: number) {
  // Prisma gradient step (t=0 → first stop, t=1 → last stop) with brightness by intensity
  const t = Math.max(0, Math.min(1, v / max));
  const idx = Math.min(PRISMA_STOPS.length - 2, Math.floor(t * (PRISMA_STOPS.length - 1)));
  const c = PRISMA_STOPS[idx].c;
  const alpha = 0.18 + t * 0.82;
  // Convert hex → rgba
  const r = parseInt(c.slice(1, 3), 16);
  const g = parseInt(c.slice(3, 5), 16);
  const b = parseInt(c.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
}

const RANGOS = [
  { id: "7d",  label: "7 días",   days: 7 },
  { id: "14d", label: "14 días",  days: 14 },
  { id: "30d", label: "30 días",  days: 30 },
  { id: "90d", label: "90 días",  days: 90 },
] as const;

function AreaChart({ data, className }: { data: number[]; className?: string }) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 92 - 4}`);
  const line = pts.join(" ");
  const area = `0,100 ${line} 100,100`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={cn("w-full h-full", className)}>
      <defs>
        <linearGradient id="ah-stroke" x1="0" x2="1" y1="0" y2="0">
          {PRISMA_STOPS.map((s) => <stop key={s.off} offset={s.off} stopColor={s.c} />)}
        </linearGradient>
        <linearGradient id="ah-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f08aa0" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#c98ad6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#8ed8c4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#ah-fill)" />
      <polyline points={line} fill="none" stroke="url(#ah-stroke)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminHome() {
  const [rangoId, setRangoId] = useState<(typeof RANGOS)[number]["id"]>("30d");
  const rango = RANGOS.find((r) => r.id === rangoId)!;

  const serie = useMemo(() => serieConsultas90d.slice(-rango.days), [rango.days]);
  const prevSerie = useMemo(() => serieConsultas90d.slice(Math.max(0, 90 - rango.days * 2), 90 - rango.days), [rango.days]);
  const totalConsultas = serie.reduce((a, b) => a + b, 0);
  const totalPrev = prevSerie.reduce((a, b) => a + b, 0) || 1;
  const trendPct = Math.round(((totalConsultas - totalPrev) / totalPrev) * 100);

  const max = Math.max(...heatmap.flatMap((r) => r.dias));
  const topDolores = dolores.slice(0, 3);
  const topOportunidades = oportunidades.slice(0, 3);
  const vencidosCriticos = vencimientos.filter((v) => v.diasRestantes < 14).slice(0, 3);
  const maxHora = Math.max(...distribHoraria);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Resumen ejecutivo"
        subtitle="Estado de la documentación y del agente Prisma."
        action={
          <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-background p-1">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground ml-2" />
            {RANGOS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRangoId(r.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                  rangoId === r.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r.label}
              </button>
            ))}
            <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground">
              Personalizar
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Consultas al agente"  value={totalConsultas.toLocaleString()} trend={trendPct} hint={`últimos ${rango.days} días`} />
        <KpiCard label="Documentación vigente" value={`${kpisSalud.vigentes}%`}          hint={`de ${kpisSalud.totalDocs} docs`} />
        <KpiCard label="Gaps activos"          value={kpisSalud.gaps}                     hint="temas sin fuente" />
        <KpiCard label="Rating agente"          value="4.4"                                hint="promedio 5⭐" />
      </div>

      {/* Serie + Distribución horaria */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card-elevated p-5">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="font-medium">Volumen de consultas</h3>
            <div className="flex items-center gap-3 text-xs">
              <TrendBadge value={trendPct} />
              <span className="text-muted-foreground">vs. periodo anterior</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Consultas diarias al agente Prisma — {rango.label}</p>
          <div className="h-40 text-foreground/80">
            <AreaChart data={serie} />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2 uppercase tracking-wide">
            <span>-{rango.days}d</span>
            <span>hoy</span>
          </div>
        </div>

        <div className="card-elevated p-5">
          <h3 className="font-medium mb-1">Distribución horaria</h3>
          <p className="text-xs text-muted-foreground mb-4">Cuándo consultan al agente</p>
          <div className="flex items-end gap-[3px] h-32">
            {distribHoraria.map((v, i) => (
              <div
                key={i}
                className="flex-1 bg-prisma rounded-sm"
                style={{ height: `${(v / maxHora) * 100}%`, opacity: 0.35 + (v / maxHora) * 0.65 }}
                title={`${i}:00 — ${v} consultas`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2 uppercase tracking-wide">
            <span>00h</span><span>08h</span><span>16h</span><span>23h</span>
          </div>
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            {consultasPorCanal.map((c) => (
              <div key={c.canal} className="flex items-center gap-2 text-xs">
                <div className="flex-1 text-muted-foreground">{c.canal}</div>
                <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-prisma" style={{ width: `${c.pct}%` }} />
                </div>
                <div className="w-8 text-right font-medium">{c.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap + Top dolores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card-elevated p-5">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="font-medium">Actividad por área — semana</h3>
            <Link to="/insights/activity" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              Ver detalle <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="text-sm">
              <thead>
                <tr>
                  <th></th>
                  {diasSemana.map((d) => <th key={d} className="px-2 pb-2 text-[10px] uppercase text-muted-foreground font-medium">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {heatmap.map((row) => (
                  <tr key={row.area}>
                    <td className="pr-3 py-1 text-xs text-muted-foreground whitespace-nowrap">{row.area}</td>
                    {row.dias.map((v, i) => (
                      <td key={i} className="p-0.5">
                        <div
                          className="w-8 h-8 rounded-md"
                          style={{ backgroundColor: heatColor(v, max) }}
                          title={`${row.area} · ${diasSemana[i]}: ${v}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquareWarning className="w-4 h-4 text-destructive" />
            <h3 className="font-medium">Top 3 dolores</h3>
            <Link to="/insights/topics" className="ml-auto text-xs text-muted-foreground hover:text-foreground">Ver todo</Link>
          </div>
          <div className="space-y-2">
            {topDolores.map((d, i) => (
              <Link key={i} to="/insights/topics" className="block rounded-xl border border-border p-3 hover:bg-muted/40 transition-colors">
                <div className="text-sm font-medium line-clamp-2">{d.pregunta}</div>
                <div className="text-xs text-muted-foreground mt-1">{d.area} · confianza {d.confianza}%</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Oportunidades + Vigencia + Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-foreground" />
            <h3 className="font-medium">Oportunidades de mejora</h3>
            <Link to="/insights/topics" className="ml-auto text-xs text-muted-foreground hover:text-foreground">Ver todo</Link>
          </div>
          <div className="space-y-2">
            {topOportunidades.map((o) => (
              <div key={o.id} className="rounded-xl border border-border p-3">
                <div className="text-sm font-medium line-clamp-2">{o.titulo}</div>
                <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                  <span className={cn("px-1.5 py-0.5 rounded font-medium",
                    o.impacto === "Alto" ? "bg-destructive/10 text-destructive" :
                    o.impacto === "Medio" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                  )}>Impacto {o.impacto}</span>
                  <span className="text-muted-foreground">{o.consultasAfectadas} consultas</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-warning" />
            <h3 className="font-medium">Vigencia — atención inmediata</h3>
            <Link to="/docs/health" className="ml-auto text-xs text-muted-foreground hover:text-foreground">Ver todo</Link>
          </div>
          <div className="space-y-2">
            {vencidosCriticos.map((v) => (
              <div key={v.docId} className="flex items-center gap-3 text-sm">
                <AlertTriangle className={v.diasRestantes < 0 ? "w-4 h-4 text-destructive" : "w-4 h-4 text-warning"} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{v.titulo}</div>
                  <div className="text-xs text-muted-foreground">{v.area} · {v.diasRestantes < 0 ? `vencido hace ${Math.abs(v.diasRestantes)} d` : `vence en ${v.diasRestantes} d`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileWarning className="w-4 h-4 text-warning" />
            <h3 className="font-medium">Gaps prioritarios</h3>
            <Link to="/insights/doc-health" className="ml-auto text-xs text-muted-foreground hover:text-foreground">Ver todo</Link>
          </div>
          <div className="space-y-2">
            {gaps.slice(0, 3).map((g) => (
              <div key={g.tema} className="flex items-start gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{g.tema}</div>
                  <div className="text-xs text-muted-foreground">{g.area}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold">{g.volumen}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">consultas</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
