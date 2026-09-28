import { SectionHeader } from "@/components/nexia/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { vencimientos, duplicados } from "@/lib/prisma-admin-mock";
import { AlertTriangle, Copy, GitCompareArrows, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DocsHealth() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Vigencia & duplicados"
        subtitle="Alertas de documentos vencidos o próximos a vencer, y detección automática de duplicados o contradicciones."
      />

      <Tabs defaultValue="vigencia" className="space-y-4">
        <TabsList className="bg-muted rounded-xl p-1">
          <TabsTrigger value="vigencia" className="rounded-lg gap-2"><Clock className="w-4 h-4" /> Vigencia</TabsTrigger>
          <TabsTrigger value="duplicados" className="rounded-lg gap-2"><Copy className="w-4 h-4" /> Duplicados & contradicciones</TabsTrigger>
        </TabsList>

        <TabsContent value="vigencia">
          <div className="card-elevated overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
                  <th className="py-3 px-4 font-medium">Documento</th>
                  <th className="py-3 px-4 font-medium">Área</th>
                  <th className="py-3 px-4 font-medium">Criticidad</th>
                  <th className="py-3 px-4 font-medium">Estado</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {vencimientos.map((v) => {
                  const vencido = v.diasRestantes < 0;
                  const pronto = v.diasRestantes >= 0 && v.diasRestantes <= 14;
                  return (
                    <tr key={v.docId} className="border-b border-border last:border-0">
                      <td className="py-3 px-4 font-medium">{v.titulo}</td>
                      <td className="py-3 px-4 text-muted-foreground">{v.area}</td>
                      <td className="py-3 px-4">{v.criticidad}</td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg",
                          vencido ? "text-destructive bg-destructive/10" : pronto ? "text-warning bg-warning/10" : "text-muted-foreground bg-muted",
                        )}>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {vencido ? `Vencido hace ${Math.abs(v.diasRestantes)} días` : `Vence en ${v.diasRestantes} días`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-xs px-3 py-1 rounded-lg border border-border hover:bg-muted">Solicitar revisión</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="duplicados">
          <div className="space-y-3">
            {duplicados.map((d, i) => (
              <div key={i} className="card-elevated p-5">
                <div className="flex items-center gap-2 mb-3">
                  <GitCompareArrows className="w-4 h-4" />
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-md",
                    d.tipo === "contradiccion" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning",
                  )}>
                    {d.tipo === "contradiccion" ? "Contradicción" : "Duplicado"} · {d.similitud}% similitud
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border p-3 text-sm">{d.a}</div>
                  <div className="rounded-xl border border-border p-3 text-sm">{d.b}</div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">{d.motivo}</div>
                <div className="mt-3 flex gap-2">
                  <button className="text-xs px-3 py-1 rounded-lg border border-border hover:bg-muted">Marcar como obsoleto</button>
                  <button className="text-xs px-3 py-1 rounded-lg bg-foreground text-background">Fusionar / editar</button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
