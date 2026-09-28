import { useParams } from "react-router-dom";
import { useState } from "react";
import { Check, X, FileText, Sparkles, Zap, MapPin, Award, Clock, Calendar, ShieldCheck, Brain, MessageSquare, Wrench, Target, TrendingUp, Activity, Eye } from "lucide-react";
import { candidatos, requerimientos } from "@/lib/nexia-mock";
import { MatchScore, PrismaProgress } from "@/components/nexia/primitives";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarFor } from "@/lib/avatar";
import { ToolLogo } from "@/components/nexia/ToolLogo";
import bgPrisma from "@/assets/bg-prisma-8.png";
import bgPrismaHero from "@/assets/bg-prisma-9.png";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function CandidatoDetalle() {
  const { id } = useParams();
  const c = candidatos.find((x) => x.id === id) || candidatos[0];
  const [notas, setNotas] = useState("Match muy fuerte. Validar disponibilidad para inicio en mayo.");
  const techScore = Math.round(c.habilidades.reduce((a, h) => a + h.valor, 0) / c.habilidades.length);

  const req = requerimientos.find((r) => r.id === c.reqId);
  const tools = req?.herramientas ?? [];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="rounded-3xl text-foreground p-8 lg:p-10 relative overflow-hidden"
        style={{
          backgroundImage: `url(${bgPrismaHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/35" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-6 flex-1">
            <Avatar className="h-32 w-32 ring-2 ring-background/60 shadow-lg">
              <AvatarImage src={avatarFor(c.id)} alt={c.nombre} />
              <AvatarFallback className="bg-background/60 text-foreground text-2xl">{c.avatar}</AvatarFallback>
            </Avatar>
            <MatchScore score={c.matchScore} size={140} />
            <div>
              {c.matchScore >= 90 && (
                <span className="inline-block text-[10px] uppercase tracking-[0.18em] px-3 py-1 rounded-full bg-foreground/10 backdrop-blur-md mb-3">
                  Top 1% Candidate
                </span>
              )}
              <h1
                className="text-4xl lg:text-5xl leading-tight"
                style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
              >
                {c.nombre}
              </h1>
              <p className="text-sm text-foreground/70 mt-2">
                {c.rolActual.split(" en ")[0]} — {c.ubicacion}
              </p>
              {tools.length > 0 && (
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/60">Stack</span>
                  {tools.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-md border border-background/40">
                      <ToolLogo name={t} size={14} />
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <div className="flex gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-foreground text-background h-11 px-5 text-sm font-medium hover:opacity-90">
                <Check className="w-4 h-4" /> Avanzar
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-foreground/30 bg-background/40 backdrop-blur-md h-11 px-5 text-sm font-medium hover:bg-background/60">
                <X className="w-4 h-4" /> Rechazar
              </button>
            </div>
            <button className="self-start w-10 h-10 rounded-full border border-foreground/30 bg-background/40 backdrop-blur-md flex items-center justify-center hover:bg-background/60">
              <FileText className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-foreground" />
              <div className="flex-1 h-px bg-foreground/30 w-32" />
              <span className="w-2 h-2 rounded-full border border-foreground" />
              <span className="text-foreground/70">Technical Assessment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Test metadata strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { icon: ShieldCheck, label: "Evaluación verificada", value: "Prisma Core™ v3.2" },
          { icon: Calendar, label: "Aplicada el", value: "12 May 2026" },
          { icon: Clock, label: "Duración", value: "47 min · 2 intentos" },
          { icon: Activity, label: "Percentil", value: `Top ${Math.max(2, 100 - c.matchScore)}%` },
          { icon: TrendingUp, label: "vs. promedio rol", value: `+${Math.max(8, Math.round(c.matchScore / 5))} pts` },
        ].map((m) => (
          <div key={m.label} className="card-elevated p-3 flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <m.icon className="w-4 h-4 text-foreground/70" strokeWidth={1.6} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground truncate">{m.label}</div>
              <div className="text-sm font-medium truncate">{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical Evaluation */}
        <div className="card-elevated p-7">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-2xl" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
                Technical Evaluation
              </h2>
              <p className="text-sm text-muted-foreground">Verified through Prisma Core™ Assessment</p>
            </div>
            <div className="text-right">
              <span
                className="text-5xl text-muted-foreground/50"
                style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
              >
                {techScore}
              </span>
              <span className="text-xs text-muted-foreground block">/ 100</span>
            </div>
          </div>

          {/* All skills bars */}
          <div className="space-y-3.5 mt-6">
            {c.habilidades.map((h) => (
              <div key={h.nombre}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{h.nombre}</span>
                  <span className="tabular-nums text-muted-foreground">{h.valor}%</span>
                </div>
                <PrismaProgress percent={h.valor} />
              </div>
            ))}
          </div>

          {/* Sub-metrics grid */}
          <div className="mt-6 pt-5 border-t border-border">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Desglose de la prueba
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: Brain, label: "Razonamiento", value: Math.min(99, techScore + 4) },
                { icon: Wrench, label: "Uso de herramientas", value: Math.max(40, techScore - 6) },
                { icon: MessageSquare, label: "Calidad de prompt", value: Math.min(98, techScore + 2) },
                { icon: Target, label: "Precisión de output", value: Math.max(45, techScore - 3) },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-muted/40 p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
                    <m.icon className="w-3.5 h-3.5" strokeWidth={1.6} /> {m.label}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-semibold tabular-nums">{m.value}</span>
                    <span className="text-[10px] text-muted-foreground">/ 100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why the match */}
        <div className="rounded-3xl bg-foreground text-background p-7 flex flex-col">
          <h2
            className="text-2xl flex items-center gap-2 mb-5"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            <Sparkles className="w-5 h-5" /> Why the match?
          </h2>

          <ul className="space-y-5">
            {c.porQueMatch.slice(0, 3).map((p, i) => {
              const Icon = [Zap, Award, MapPin][i] || Award;
              return (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-background/15 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm leading-relaxed text-background/90">{p}</p>
                </li>
              );
            })}
          </ul>

          {/* Behavioral signals from the test */}
          <div
            className="mt-6 rounded-2xl p-5 relative overflow-hidden"
            style={{
              backgroundImage: `url(${bgPrisma})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-foreground/55" />
            <div className="relative">
              <div className="text-[10px] uppercase tracking-[0.18em] text-background/80 mb-3">
                Señales observadas durante la prueba
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Iteración con el modelo", value: "Alta" },
                  { label: "Citas verificadas", value: "8 / 10" },
                  { label: "Refactor de prompts", value: "5 veces" },
                  { label: "Uso de contexto largo", value: "Eficiente" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-background/15 backdrop-blur-md border border-background/20 p-2.5">
                    <div className="text-[10px] text-background/70">{s.label}</div>
                    <div className="text-sm font-medium mt-0.5 text-background">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test timeline — emotional ridge */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4" /> Recorrido del assessment
          </h3>
          <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> Ver replay completo
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Curva de desempeño a lo largo de las etapas evaluadas.
        </p>

        {(() => {
          const data = [
            { stage: "Briefing", time: "0:00", score: 100 },
            { stage: "Caso práctico", time: "12:30", score: 88 },
            { stage: "Live coding IA", time: "28:15", score: 82 },
            { stage: "Defensa oral", time: "42:50", score: 91 },
          ];
          return (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data} margin={{ top: 30, right: 24, left: 0, bottom: 8 }}>
                <defs>
                  <linearGradient id="assessGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a5b4fc" />
                    <stop offset="33%" stopColor="#f0abfc" />
                    <stop offset="66%" stopColor="#fdba74" />
                    <stop offset="100%" stopColor="#fde68a" />
                  </linearGradient>
                  <linearGradient id="assessFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide domain={[60, 105]} />
                <Tooltip
                  cursor={{ stroke: "hsl(var(--foreground))", strokeOpacity: 0.2, strokeDasharray: "3 3" }}
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v} pts`, "Score"]}
                  labelFormatter={(l, p) => {
                    const t = p?.[0]?.payload?.time;
                    return t ? `${l} · ${t}` : l;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="url(#assessGrad)"
                  strokeWidth={1.5}
                  fill="url(#assessFill)"
                  dot={{ r: 3, fill: "hsl(var(--background))", stroke: "hsl(var(--foreground))", strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: "hsl(var(--foreground))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                  isAnimationActive
                />
              </AreaChart>
            </ResponsiveContainer>
          );
        })()}
      </div>

      <div className="card-elevated p-6">
        <h3 className="font-semibold mb-3">Notas del proceso</h3>
        <Textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={3} />
      </div>
    </div>
  );
}
