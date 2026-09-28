import { useMemo, useState } from "react";
import { SectionHeader, TrendBadge } from "@/components/nexia/primitives";
import {
  topicos, dolores, oportunidades, AREAS, distribHoraria, feedbackDist, type Area,
} from "@/lib/prisma-admin-mock";
import { AlertTriangle, Sparkles, TrendingUp, MessageSquare, Filter, Star } from "lucide-react";
import { cn } from "@/lib/utils";

function Sparkline({ data, className, id }: { data: number[]; className?: string; id?: string }) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`).join(" ");
  const gid = `sp-${id ?? Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={cn("w-24 h-8", className)}>
      <defs>
        <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"   stopColor="#f7a87a" />
          <stop offset="35%"  stopColor="#f08aa0" />
          <stop offset="60%"  stopColor="#c98ad6" />
          <stop offset="85%"  stopColor="#8aa9e8" />
          <stop offset="100%" stopColor="#8ed8c4" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={`url(#${gid})`} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" points={pts} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const impactoColor = {
  Alto:  "bg-destructive/10 text-destructive",
  Medio: "bg-warning/10 text-warning",
  Bajo:  "bg-muted text-muted-foreground",
};
const esfuerzoDot = { Bajo: "bg-success", Medio: "bg-warning", Alto: "bg-destructive" };

export default function InsightsTopics() {
  const [areaFiltro, setAreaFiltro] = useState<Area | "todas">("todas");

  const topicosFiltrados = useMemo(
    () => areaFiltro === "todas" ? topicos : topicos.filter((t) => t.area === areaFiltro),
    [areaFiltro]
  );

  // Top 8 por consultas
  const topTopicos = [...topicosFiltrados].sort((a, b) => b.consultas30d - a.consultas30d).slice(0, 8);
  const maxConsultas = Math.max(...topTopicos.map((t) => t.consultas30d), 1);

  // Consultas por área (agregado)
  const porArea = AREAS.map((a) => ({
    area: a,
    total: topicos.filter((t) => t.area === a).reduce((s, t) => s + t.consultas30d, 0),
  })).filter((r) => r.total > 0).sort((a, b) => b.total - a.total);
  const maxArea = Math.max(...porArea.map((a) => a.total), 1);

  // Confianza vs escalamiento (scatter)
  const scatter = topicos;

  // Trending (mayor crecimiento)
  const trending = [...topicos].sort((a, b) => b.trendPct - a.trendPct).slice(0, 5);

  // Feedback dist
  const feedbackTotal = Object.values(feedbackDist).reduce((a, b) => a + b, 0);
  const maxHora = Math.max(...distribHoraria);

  const totalConsultas = topicos.reduce((s, t) => s + t.consultas30d, 0);
  const promConfianza = Math.round(topicos.reduce((s, t) => s + t.confianza, 0) / topicos.length);
  const promEscalamiento = Math.round(topicos.reduce((s, t) => s + t.escalamiento, 0) / topicos.length);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Consultas & tópicos"
        subtitle="Qué le están preguntando al agente. Todo agregado por tópico y área — nunca por persona."
        action={
          <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={areaFiltro}
              onChange={(e) => setAreaFiltro(e.target.value as Area | "todas")}
              className="text-xs bg-transparent focus:outline-none"
            >
              <option value="todas">Todas las áreas</option>
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        }
      />

      {/* KPIs de tópicos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-elevated p-4">
          <div className="text-xs text-muted-foreground">Consultas totales</div>
          <div className="text-2xl font-bold mt-1">{totalConsultas.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground mt-1">últimos 30 días</div>
        </div>
        <div className="card-elevated p-4">
          <div className="text-xs text-muted-foreground">Confianza promedio</div>
          <div className="text-2xl font-bold mt-1">{promConfianza}%</div>
          <div className="text-[11px] text-muted-foreground mt-1">meta ≥ 80%</div>
        </div>
        <div className="card-elevated p-4">
          <div className="text-xs text-muted-foreground">Escalamiento a humano</div>
          <div className="text-2xl font-bold mt-1">{promEscalamiento}%</div>
          <div className="text-[11px] text-muted-foreground mt-1">meta ≤ 10%</div>
        </div>
        <div className="card-elevated p-4">
          <div className="text-xs text-muted-foreground">Tópicos monitoreados</div>
          <div className="text-2xl font-bold mt-1">{topicos.length}</div>
          <div className="text-[11px] text-muted-foreground mt-1">{porArea.length} áreas activas</div>
        </div>
      </div>

      {/* Top tópicos bar chart + Consultas por área */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-foreground" />
            <h3 className="font-medium">Top tópicos por volumen</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Preguntas más frecuentes al agente</p>
          <div className="space-y-2.5">
            {topTopicos.map((t) => (
              <div key={t.topico} className="grid grid-cols-[1fr_auto] gap-3 items-center">
                <div className="min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">{t.topico}</span>
                    <span className="text-xs text-muted-foreground ml-2">{t.consultas30d}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-prisma rounded-full" style={{ width: `${(t.consultas30d / maxConsultas) * 100}%` }} />
                  </div>
                </div>
                <TrendBadge value={t.trendPct} />
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-foreground" />
            <h3 className="font-medium">Consultas por área</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Distribución agregada — nunca por persona</p>
          <div className="space-y-2.5">
            {porArea.map((a) => (
              <div key={a.area}>
                <div className="flex items-center justify-between mb-1 text-sm">
                  <span className="font-medium">{a.area}</span>
                  <span className="text-muted-foreground">{a.total.toLocaleString()}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-prisma rounded-full" style={{ width: `${(a.total / maxArea) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending + Feedback + Horario */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-success" />
            <h3 className="font-medium">Trending — mayor crecimiento</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Tópicos que suben vs. el periodo anterior</p>
          <div className="space-y-3">
            {trending.map((t) => (
              <div key={t.topico} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.topico}</div>
                  <div className="text-xs text-muted-foreground">{t.area}</div>
                </div>
                <div className="text-foreground/80"><Sparkline data={t.tendencia} /></div>
                <TrendBadge value={t.trendPct} />
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-foreground" />
            <h3 className="font-medium">Satisfacción de respuestas</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Rating 1-5 sobre respuestas del agente</p>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((n) => {
              const v = (feedbackDist as Record<number, number>)[n];
              return (
                <div key={n} className="flex items-center gap-2 text-sm">
                  <span className="w-4 text-xs text-muted-foreground">{n}★</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", n >= 4 ? "bg-success" : n === 3 ? "bg-warning" : "bg-destructive")}
                      style={{ width: `${(v / feedbackTotal) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-medium">{v}%</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-baseline gap-2">
            <span className="text-2xl font-bold">4.4</span>
            <span className="text-xs text-muted-foreground">promedio global · 2 341 evaluaciones</span>
          </div>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-foreground" />
            <h3 className="font-medium">Horario de consultas</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Distribución por hora del día</p>
          <div className="flex items-end gap-[3px] h-36">
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
            <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>23h</span>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Pico entre <span className="font-medium text-foreground">08-12h</span> — coincide con arranque de turno mañana.
          </div>
        </div>
      </div>

      {/* Scatter confianza vs escalamiento */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4" />
          <h3 className="font-medium">Confianza vs. escalamiento</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Zona inferior-derecha = tópicos con baja confianza y alto escalamiento — prioridad de documentación.
        </p>
        <div className="relative h-72 border-l border-b border-border ml-8 mr-2">
          {/* grid */}
          {[25, 50, 75].map((p) => (
            <div key={p} className="absolute inset-x-0 border-t border-border/50 border-dashed" style={{ bottom: `${p}%` }} />
          ))}
          {/* y label */}
          <div className="absolute -left-8 top-0 text-[10px] text-muted-foreground">100%</div>
          <div className="absolute -left-6 bottom-0 text-[10px] text-muted-foreground">0%</div>
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] uppercase text-muted-foreground whitespace-nowrap">Confianza</div>
          {scatter.map((t) => {
            const size = 8 + Math.min(32, t.consultas30d / 20);
            const danger = t.confianza < 70 && t.escalamiento > 15;
            // Prisma gradient position based on escalation (x-axis)
            const stops = ["#f7a87a", "#f08aa0", "#c98ad6", "#8aa9e8", "#8ed8c4"];
            const c = stops[Math.min(stops.length - 1, Math.floor((t.escalamiento / 30) * stops.length))];
            return (
              <div
                key={t.topico}
                className="absolute rounded-full border-2 transition-transform hover:scale-125 cursor-pointer group"
                style={{
                  left: `${t.escalamiento * 3}%`,
                  bottom: `${t.confianza}%`,
                  width: size,
                  height: size,
                  backgroundColor: danger ? "hsl(var(--destructive) / 0.35)" : `${c}66`,
                  borderColor: danger ? "hsl(var(--destructive))" : c,
                  transform: "translate(-50%, 50%)",
                }}
                title={`${t.topico} · confianza ${t.confianza}% · escalamiento ${t.escalamiento}% · ${t.consultas30d} consultas`}
              >
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 text-[10px] whitespace-nowrap bg-background border border-border rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                  {t.topico}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] uppercase text-muted-foreground mt-2 ml-8">
          <span>0% escalamiento</span><span>30%+</span>
        </div>
      </div>

      {/* Tabla completa */}
      <div className="card-elevated overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-baseline justify-between">
          <h3 className="font-medium">Ranking completo de tópicos</h3>
          <span className="text-xs text-muted-foreground">Últimos 30 días vs. 30 días anteriores</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
              <th className="py-3 px-4 font-medium">#</th>
              <th className="py-3 px-4 font-medium">Tópico</th>
              <th className="py-3 px-4 font-medium">Área</th>
              <th className="py-3 px-4 font-medium text-right">Consultas</th>
              <th className="py-3 px-4 font-medium">Tendencia</th>
              <th className="py-3 px-4 font-medium">Sparkline</th>
              <th className="py-3 px-4 font-medium text-right">Escalamiento</th>
              <th className="py-3 px-4 font-medium text-right">Confianza</th>
            </tr>
          </thead>
          <tbody>
            {topicosFiltrados.map((t, i) => (
              <tr key={t.topico} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="py-3 px-4 text-muted-foreground">{i + 1}</td>
                <td className="py-3 px-4 font-medium">{t.topico}</td>
                <td className="py-3 px-4 text-muted-foreground">{t.area}</td>
                <td className="py-3 px-4 text-right font-semibold">{t.consultas30d}</td>
                <td className="py-3 px-4"><TrendBadge value={t.trendPct} /></td>
                <td className="py-3 px-4 text-foreground/80"><Sparkline data={t.tendencia} /></td>
                <td className="py-3 px-4 text-right">{t.escalamiento}%</td>
                <td className="py-3 px-4 text-right">{t.confianza}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dolores principales */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <h3 className="font-medium">Dolores principales</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Preguntas donde el agente respondió mal — señal directa de documento faltante o poco claro.</p>
        <div className="space-y-2">
          {dolores.map((d, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-border p-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{d.pregunta}</div>
                <div className="text-xs text-muted-foreground">{d.area} · volumen {d.volumen}</div>
              </div>
              <div className="text-xs text-right">
                <div><span className="text-muted-foreground">Confianza:</span> <span className="font-medium">{d.confianza}%</span></div>
                <div><span className="text-muted-foreground">Feedback 👎:</span> <span className="font-medium">{d.feedbackNeg}%</span></div>
                <div><span className="text-muted-foreground">Escalado:</span> <span className="font-medium">{d.escalamiento}%</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Oportunidades de mejora */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4" />
          <h3 className="font-medium">Oportunidades de mejora</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Acciones concretas priorizadas por impacto y esfuerzo — derivadas de los dolores y gaps detectados.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {oportunidades.map((o) => (
            <div key={o.id} className="rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{o.titulo}</div>
                  <div className="text-xs text-muted-foreground mt-1">{o.area}</div>
                </div>
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide", impactoColor[o.impacto])}>
                  {o.impacto}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{o.detalle}</p>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full", esfuerzoDot[o.esfuerzo])} />
                    <span className="text-muted-foreground">Esfuerzo {o.esfuerzo}</span>
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{o.consultasAfectadas} consultas afectadas</span>
                </div>
                <button className="text-foreground font-medium hover:underline">{o.accion} →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
