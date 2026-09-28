import { SectionHeader, IntegrationStatus } from "@/components/nexia/primitives";
import { conectores } from "@/lib/prisma-admin-mock";
import { RefreshCw, Settings2, Plug } from "lucide-react";

export default function DocsConnectors() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Conectores"
        subtitle="Sincroniza repositorios existentes. Los documentos se importan e indexan automáticamente."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conectores.map((c) => (
          <div key={c.id} className="card-elevated p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                  <Plug className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">{c.nombre}</div>
                  <div className="text-xs text-muted-foreground">{c.proveedor}</div>
                </div>
              </div>
              <IntegrationStatus status={c.estado} />
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
              <div>
                <div className="text-[11px] uppercase text-muted-foreground">Archivos</div>
                <div className="font-semibold">{c.archivos.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-muted-foreground">Frecuencia</div>
                <div className="font-medium">{c.frecuencia}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-muted-foreground">Última sync</div>
                <div className="font-medium">{c.ultimaSync}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 inline-flex items-center justify-center gap-2 h-9 rounded-xl bg-foreground text-background text-sm font-medium">
                <RefreshCw className="w-4 h-4" /> Sincronizar ahora
              </button>
              <button className="inline-flex items-center justify-center gap-2 h-9 px-3 rounded-xl border border-border text-sm font-medium hover:bg-muted">
                <Settings2 className="w-4 h-4" /> Configurar
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Los conectores utilizan cuentas de servicio con permisos de solo lectura. Ninguna información se sincroniza fuera del entorno de Prisma.
      </p>
    </div>
  );
}
