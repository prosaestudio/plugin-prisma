import { SectionHeader } from "@/components/nexia/primitives";
import { heatmap, diasSemana, maquinas, turnos, picosAnomalos } from "@/lib/prisma-admin-mock";
import { Zap } from "lucide-react";

const PRISMA_STOPS = ["#f5d3a8", "#f7a87a", "#f08aa0", "#c98ad6", "#8aa9e8", "#8ed8c4"];
function heatColor(v: number, max: number) {
  const t = Math.max(0, Math.min(1, v / max));
  const c = PRISMA_STOPS[Math.min(PRISMA_STOPS.length - 1, Math.floor(t * PRISMA_STOPS.length))];
  const alpha = 0.18 + t * 0.82;
  const r = parseInt(c.slice(1, 3), 16);
  const g = parseInt(c.slice(3, 5), 16);
  const b = parseInt(c.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
}

export default function InsightsActivity() {
  const max = Math.max(...heatmap.flatMap((r) => r.dias));
  const maxMaq = Math.max(...maquinas.map((m) => m.consultas));
  const maxTurno = Math.max(...turnos.map((t) => t.consultas));

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Actividad por sector"
        subtitle="Dónde vive la demanda de consultas: por área, línea, ubicación física y turno."
      />

      <div className="card-elevated p-5">
        <h3 className="font-medium mb-1">Heatmap · área × día de la semana</h3>
        <p className="text-xs text-muted-foreground mb-4">Intensidad = volumen de consultas al agente. Agregado por área.</p>
        <div className="overflow-x-auto">
          <table className="text-sm">
            <thead>
              <tr>
                <th></th>
                {diasSemana.map((d) => <th key={d} className="px-2 pb-2 text-[11px] uppercase text-muted-foreground font-medium">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {heatmap.map((row) => (
                <tr key={row.area}>
                  <td className="pr-3 py-1 text-xs text-muted-foreground whitespace-nowrap">{row.area}</td>
                  {row.dias.map((v, i) => (
                    <td key={i} className="p-0.5">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center text-[10px]"
                        style={{ backgroundColor: heatColor(v, max), color: "hsl(var(--foreground))" }}
                        title={`${row.area} · ${diasSemana[i]}: ${v}`}
                      >
                        {v}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-elevated p-5">
          <h3 className="font-medium mb-4">Actividad por línea / máquina</h3>
          <div className="space-y-3">
            {maquinas.map((m) => (
              <div key={m.nombre}>
                <div className="flex items-baseline justify-between text-sm mb-1">
                  <div><span className="font-medium">{m.nombre}</span> <span className="text-xs text-muted-foreground">· {m.ubicacion}</span></div>
                  <div className="text-xs text-muted-foreground">{m.consultas}</div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-prisma rounded-full" style={{ width: `${(m.consultas / maxMaq) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated p-5">
          <h3 className="font-medium mb-4">Actividad por turno</h3>
          <div className="space-y-3">
            {turnos.map((t) => (
              <div key={t.turno}>
                <div className="flex items-baseline justify-between text-sm mb-1">
                  <div className="font-medium">{t.turno}</div>
                  <div className="text-xs text-muted-foreground">{t.consultas}</div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-prisma rounded-full" style={{ width: `${(t.consultas / maxTurno) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-warning" />
          <h3 className="font-medium">Picos anómalos detectados</h3>
        </div>
        <div className="space-y-2">
          {picosAnomalos.map((p, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-border p-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{p.tema}</div>
                <div className="text-xs text-muted-foreground">{p.area} · {p.ubicacion} · turno {p.turno} · {p.cuando}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-warning">+{p.delta}%</div>
                <div className="text-[10px] uppercase text-muted-foreground">vs baseline</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
