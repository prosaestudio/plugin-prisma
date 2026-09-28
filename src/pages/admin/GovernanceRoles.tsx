import { SectionHeader } from "@/components/nexia/primitives";
import { rolesMatriz } from "@/lib/prisma-admin-mock";
import { Check, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GovernanceRoles() {
  const cols = [
    { key: "subir",       label: "Subir docs" },
    { key: "aprobar",     label: "Aprobar" },
    { key: "verMetricas", label: "Ver métricas" },
    { key: "admin",       label: "Administrar" },
  ] as const;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Roles & permisos"
        subtitle="Quién puede subir documentos, quién los aprueba, y quién sólo puede consultar métricas."
      />

      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4" />
          <h3 className="font-medium">Matriz de permisos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-3 px-4 font-medium">Rol</th>
                {cols.map((c) => <th key={c.key} className="py-3 px-4 font-medium text-center">{c.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {rolesMatriz.map((r) => (
                <tr key={r.rol} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium">{r.rol}</td>
                  {cols.map((c) => {
                    const on = (r as any)[c.key] as boolean;
                    return (
                      <td key={c.key} className="py-3 px-4 text-center">
                        {on
                          ? <Check className="w-4 h-4 text-success inline-block" />
                          : <X className="w-4 h-4 text-muted-foreground/50 inline-block" />}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-elevated p-5">
        <h3 className="font-medium mb-1">Principio de gobernanza</h3>
        <p className="text-sm text-muted-foreground">
          Los indicadores de Prisma siempre se muestran <span className="font-medium text-foreground">agregados por área, tópico o turno</span>. Nunca por persona individual. Este principio es no-negociable y aplica tanto a la vista admin como a cualquier reporte exportado.
        </p>
      </div>
    </div>
  );
}
