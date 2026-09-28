import { SectionHeader, KpiCard, PrismaProgress } from "@/components/nexia/primitives";
import { avanceRutas, kpisAprendizaje } from "@/lib/prisma-admin-mock";
import { Star } from "lucide-react";

export default function InsightsLearning() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Aprendizaje & onboarding"
        subtitle="Cómo avanzan las rutas de inducción y qué tan satisfechos están con el agente. Todo agregado por área."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="Tiempo prom. de resolución" value={kpisAprendizaje.tiempoPromedio} hint="pregunta → respuesta útil" />
        <KpiCard label="Rating promedio"            value={kpisAprendizaje.ratingProm}     hint="de 5 estrellas" />
        <div className="card-stat">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Distribución de rating</div>
          <div className="mt-3 space-y-1.5">
            {kpisAprendizaje.ratingDist.map((pct, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-10 flex items-center gap-0.5">
                  {5 - i} <Star className="w-3 h-3" />
                </div>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-prisma rounded-full" style={{ width: `${kpisAprendizaje.ratingDist[5 - i - 1]}%` }} />
                </div>
                <div className="w-8 text-right text-muted-foreground">{kpisAprendizaje.ratingDist[5 - i - 1]}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-elevated p-5">
        <h3 className="font-medium mb-4">Avance de rutas / onboarding — por área</h3>
        <div className="space-y-4">
          {avanceRutas.map((a) => (
            <div key={a.area}>
              <div className="flex items-baseline justify-between text-sm mb-1.5">
                <span className="font-medium">{a.area}</span>
                <span className="text-muted-foreground">{a.avance}%</span>
              </div>
              <PrismaProgress percent={a.avance} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
