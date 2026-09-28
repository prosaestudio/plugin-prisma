import { useState } from "react";
import { SectionHeader } from "@/components/nexia/primitives";
import { aprobaciones, type Aprobacion, type AprobEstado } from "@/lib/prisma-admin-mock";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const cols: { key: AprobEstado; label: string; hint: string }[] = [
  { key: "borrador",  label: "Borrador",   hint: "En redacción" },
  { key: "revision",  label: "En revisión", hint: "Esperando aprobación" },
  { key: "publicado", label: "Publicado",  hint: "Vivo en el agente" },
];

export default function DocsApprovals() {
  const [rows, setRows] = useState<Aprobacion[]>(aprobaciones);
  const mover = (id: string, dir: 1 | -1) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const idx = cols.findIndex((c) => c.key === r.estado);
        const next = Math.max(0, Math.min(cols.length - 1, idx + dir));
        return { ...r, estado: cols[next].key };
      }),
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Flujo de aprobación"
        subtitle="Borrador → revisión → publicado. Los revisores validan antes de que un documento llegue al agente."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {cols.map((col) => {
          const items = rows.filter((r) => r.estado === col.key);
          return (
            <div key={col.key} className="card-elevated p-4 bg-muted/20">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <div className="font-medium">{col.label}</div>
                  <div className="text-xs text-muted-foreground">{col.hint}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-md bg-background border border-border">{items.length}</span>
              </div>

              <div className="space-y-2">
                {items.map((r) => {
                  const idx = cols.findIndex((c) => c.key === r.estado);
                  return (
                    <div key={r.id} className="rounded-xl border border-border bg-background p-3">
                      <div className="text-sm font-medium">{r.titulo}</div>
                      <div className="mt-1 text-xs text-muted-foreground flex flex-wrap gap-x-2 gap-y-1">
                        <span>{r.area}</span>
                        <span>·</span>
                        <span className="capitalize">{r.tipo}</span>
                        <span>·</span>
                        <span>{r.actualizado}</span>
                      </div>
                      <div className="mt-2 text-xs">
                        <span className="text-muted-foreground">Autor:</span> {r.autor}
                        <span className="text-muted-foreground"> · Revisor:</span> {r.revisor}
                      </div>
                      <div className="mt-3 flex gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => mover(r.id, -1)}
                          className={cn(
                            "inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-border",
                            idx === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-muted",
                          )}
                        >
                          <ArrowLeft className="w-3 h-3" /> Atrás
                        </button>
                        <button
                          disabled={idx === cols.length - 1}
                          onClick={() => mover(r.id, 1)}
                          className={cn(
                            "inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg",
                            idx === cols.length - 1 ? "opacity-30 cursor-not-allowed border border-border" : "bg-foreground text-background",
                          )}
                        >
                          Avanzar <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {items.length === 0 && <div className="text-xs text-muted-foreground py-6 text-center">Sin documentos</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
