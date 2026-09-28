import { SectionHeader, KpiCard } from "@/components/nexia/primitives";
import { kpisSalud, docsMasUsados, docsZombie, gaps } from "@/lib/prisma-admin-mock";
import { FileWarning } from "lucide-react";

export default function InsightsDocHealth() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Salud documental"
        subtitle="Qué tan actualizada, usada y completa está la documentación que alimenta al agente."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="% Vigente"   value={`${kpisSalud.vigentes}%`} hint={`de ${kpisSalud.totalDocs} documentos`} />
        <KpiCard label="% Vencido"   value={`${kpisSalud.vencidos}%`} hint="requieren revisión" />
        <KpiCard label="Zombies"     value={kpisSalud.zombies}         hint="sin uso hace 90 días" />
        <KpiCard label="Gaps"        value={kpisSalud.gaps}            hint="temas sin doc fuente" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-elevated overflow-hidden">
          <div className="px-4 py-3 border-b border-border font-medium">Documentos más consultados</div>
          <table className="w-full text-sm">
            <tbody>
              {docsMasUsados.map((d) => (
                <tr key={d.titulo} className="border-b border-border last:border-0">
                  <td className="py-3 px-4">
                    <div className="font-medium">{d.titulo}</div>
                    <div className="text-xs text-muted-foreground">{d.area}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">{d.consultas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-elevated overflow-hidden">
          <div className="px-4 py-3 border-b border-border font-medium">Documentos zombie <span className="text-xs text-muted-foreground ml-1">— sin uso</span></div>
          <table className="w-full text-sm">
            <tbody>
              {docsZombie.map((d) => (
                <tr key={d.titulo} className="border-b border-border last:border-0">
                  <td className="py-3 px-4">
                    <div className="font-medium">{d.titulo}</div>
                    <div className="text-xs text-muted-foreground">{d.area}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground">{d.consultas} consulta{d.consultas === 1 ? "" : "s"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 mb-1">
          <FileWarning className="w-4 h-4 text-warning" />
          <h3 className="font-medium">Gaps de documentación</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Alta demanda de consultas sin documento fuente adecuado. Prioriza aquí la producción documental.</p>
        <div className="space-y-2">
          {gaps.map((g) => (
            <div key={g.tema} className="rounded-xl border border-border p-3 flex items-start gap-4">
              <div className="flex-1">
                <div className="font-medium text-sm">{g.tema}</div>
                <div className="text-xs text-muted-foreground">{g.area} · {g.descripcion}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{g.volumen}</div>
                <div className="text-[10px] uppercase text-muted-foreground">consultas 30d</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
