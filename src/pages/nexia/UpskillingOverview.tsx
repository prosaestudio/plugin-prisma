import { useNavigate } from "react-router-dom";
import { GraduationCap, Map, TrendingUp, BadgeCheck, ArrowRight, Filter, Clock } from "lucide-react";
import { rutas } from "@/lib/nexia-mock";
import { EditorialHeader, PillButton, PrismaProgress } from "@/components/nexia/primitives";

const stats = [
  { icon: GraduationCap, value: "47", label: "En formación" },
  { icon: Map, value: "8", label: "Rutas activas" },
  { icon: TrendingUp, value: "54%", label: "Avance global", accent: true },
  { icon: BadgeCheck, value: "12", label: "Certificaciones" },
];

const nivelMap: Record<string, string> = {
  Básico: "BÁSICO",
  Intermedio: "INTERMEDIO",
  Avanzado: "AVANZADO",
};

export default function UpskillingOverview() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12">
      <EditorialHeader
        eyebrow="Perspective & Growth"
        title="Upskilling Vista General"
        description="Visualiza el progreso intelectual de tu organización. Desde el dominio de IA generativa hasta liderazgos estratégicos, aquí reside el futuro de tu pipeline de talento."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="card-elevated p-6 flex flex-col items-center text-center gap-3 border-b-2 border-foreground/80"
          >
            <s.icon className="w-5 h-5 text-muted-foreground self-start" strokeWidth={1.4} />
            <div
              className={`text-5xl tabular-nums ${s.accent ? "text-[hsl(15,90%,75%)]" : "text-foreground"}`}
              style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
            >
              {s.value}
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Rutas */}
      <div>
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
            Rutas de Aprendizaje Estratégicas
          </h2>
          <PillButton><Filter className="w-4 h-4" /> Filtrar</PillButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rutas.map((r) => (
            <div key={r.id} className="card-elevated p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
                <span
                  className={`px-2 py-0.5 rounded ${
                    r.nivel === "Básico"
                      ? "bg-success/10 text-success"
                      : r.nivel === "Intermedio"
                      ? "bg-warning/10 text-warning"
                      : "bg-foreground text-background"
                  }`}
                >
                  {nivelMap[r.nivel]}
                </span>
                <span className="text-muted-foreground">{r.area}</span>
              </div>

              <h3 className="text-xl leading-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
                {r.nombre}
              </h3>

              <div className="space-y-1.5 mt-auto">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Estudiantes: {r.inscritos}</span>
                  <span className="font-medium">{r.avance}%</span>
                </div>
                <PrismaProgress percent={r.avance} />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" /> {r.duracion} estimadas
              </div>

              <button
                onClick={() => navigate(`/upskilling/rutas/${r.id}`)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border h-10 text-sm hover:bg-muted transition-colors"
              >
                Ver ruta <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
