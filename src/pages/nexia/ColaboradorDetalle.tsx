import { useNavigate, useParams } from "react-router-dom";
import { colaboradores, historialScore } from "@/lib/nexia-mock";
import { MatchScore, PrismaProgress, SectionHeader, TrendBadge } from "@/components/nexia/primitives";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarFor } from "@/lib/avatar";
import { ToolLogo } from "@/components/nexia/ToolLogo";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ColaboradorDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const c = colaboradores.find((x) => x.id === id) || colaboradores[0];

  const senales = [
    { titulo: "Frecuencia", desc: "Alta (4-6 sesiones/día)", color: "text-success" },
    { titulo: "Sofisticación", desc: "Media-alta (usa roles, contexto, ejemplos)", color: "text-warning" },
    { titulo: "Iteración", desc: "Alta (promedia 4,1 refinamientos por tarea)", color: "text-success" },
    { titulo: "Diversidad", desc: "Media (2 herramientas principales)", color: "text-warning" },
    { titulo: "Evolución", desc: "Muy positiva (+87% vs hace 3 meses)", color: "text-success" },
  ];

  const renderRidge = () => (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={historialScore} margin={{ top: 24, right: 16, left: 0, bottom: 8 }}>
        <defs>
          <linearGradient id="hist-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="33%" stopColor="#f0abfc" />
            <stop offset="66%" stopColor="#fdba74" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          <linearGradient id="hist-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity={0.08} />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
        <Tooltip
          cursor={{ stroke: "hsl(var(--foreground))", strokeOpacity: 0.2, strokeDasharray: "3 3" }}
          contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
          formatter={(v: number) => [`${v} pts`, "Score"]}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="url(#hist-stroke)"
          strokeWidth={1.5}
          fill="url(#hist-fill)"
          dot={{ r: 3, fill: "hsl(var(--background))", stroke: "hsl(var(--foreground))", strokeWidth: 1.5 }}
          activeDot={{ r: 5, fill: "hsl(var(--foreground))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
          isAnimationActive
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  return (
    <div className="space-y-6">
      <SectionHeader title="Tu eficiencia con IA en tu rol" subtitle={`${c.nombre} · ${c.rol} · ${c.area}`} />

      {/* KPIs del colaborador */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tareas automatizables en tu rol", value: "4", hint: "identificadas" },
          { label: "Errores de uso detectados", value: "2", hint: "esta semana" },
          { label: "Tiempo recuperable estimado", value: "3.2 h", hint: "/ semana" },
          { label: "Progreso del plan de mejora", value: "45%", hint: "completado" },
        ].map((k) => (
          <div key={k.label} className="card-elevated p-5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">{k.label}</div>
            <div className="text-3xl tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>{k.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{k.hint}</div>
          </div>
        ))}
      </div>

      {/* Lo que Prisma detectó */}
      <div className="card-elevated p-6">
        <h3 className="font-semibold mb-1">Lo que Prisma detectó en tu proceso de trabajo</h3>
        <p className="text-xs text-muted-foreground mb-5">Basado en tu actividad real con las herramientas conectadas — sin encuestas.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-destructive uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-destructive" /> Error detectado
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Estás usando ChatGPT para análisis de datos sin especificar el formato de salida. Esto genera outputs que requieren reproceso.
            </p>
            <button onClick={() => navigate("/upskilling/agente")} className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-4 h-9 bg-foreground text-background hover:opacity-90">
              Corregir con el Agente IA
            </button>
          </div>

          <div className="rounded-2xl border border-warning/30 bg-warning/5 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-warning uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-warning" /> Oportunidad de automatización
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Tus reportes semanales pueden generarse automáticamente con Copilot. Estimado: 2.5 horas ahorradas por semana.
            </p>
            <button onClick={() => navigate("/upskilling/agente")} className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-4 h-9 border border-border hover:bg-muted">
              Ver cómo
            </button>
          </div>

          <div className="rounded-2xl border border-success/30 bg-success/5 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-success uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-success" /> Buena práctica detectada
            </div>
            <p className="text-sm leading-relaxed">
              Estás iterando correctamente tus prompts de redacción. Mantén este patrón.
            </p>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card-elevated p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarFor(c.id)} alt={c.nombre} />
                <AvatarFallback className="bg-foreground text-background text-xl">{c.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-lg">{c.nombre}</div>
                <div className="text-sm text-muted-foreground">{c.rol}</div>
                <div className="text-xs text-muted-foreground">{c.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-6 justify-center py-4">
              <MatchScore score={c.score} size={150} />
              <div>
                <div className="text-xs uppercase text-muted-foreground">Nivel</div>
                <div className="font-semibold">{c.nivel}</div>
                <div className="mt-2 text-xs uppercase text-muted-foreground">Tendencia</div>
                <TrendBadge value={c.tendencia} />
              </div>
            </div>
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-1">Historial de score</h3>
            <p className="text-xs text-muted-foreground mb-3">Últimos 6 meses</p>
            {renderRidge()}
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-3">Herramientas activas</h3>
            <ul className="space-y-2 text-sm">
              {[{n:"ChatGPT",d:"4,2 sesiones/día"},{n:"Claude",d:"1,8 sesiones/día"},{n:"Copilot",d:"0,3 sesiones/día"}].map((h)=>(
                <li key={h.n} className="flex justify-between items-center p-2.5 rounded-lg bg-muted/40">
                  <span className="flex items-center gap-2"><ToolLogo name={h.n} size={16} />{h.n}</span>
                  <span className="text-muted-foreground">{h.d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl p-6 bg-muted/40 border border-border">
            <h3 className="font-semibold mb-4">Señales de comportamiento observadas</h3>
            <div className="space-y-3">
              {senales.map((s) => (
                <div key={s.titulo} className="p-3 rounded-xl bg-background border border-border">
                  <div className={`font-medium text-sm ${s.color}`}>{s.titulo}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-2">Ruta de upskilling asignada</h3>
            <p className="text-sm font-medium">AI for Product Managers</p>
            <div className="my-3"><PrismaProgress percent={68} /></div>
            <div className="text-xs text-muted-foreground mb-4">68% completado</div>
            <button onClick={() => navigate("/upskilling/rutas/ai-pm")} className="text-sm font-medium hover:text-highlight">Ver ruta →</button>
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-2">Notas del área</h3>
            <p className="text-sm text-muted-foreground italic">"Colaborador con alto potencial. Se recomienda certificación avanzada en Q3."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
