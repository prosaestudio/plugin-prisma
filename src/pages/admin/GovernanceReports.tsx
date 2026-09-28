import { SectionHeader } from "@/components/nexia/primitives";
import { reportesCatalogo } from "@/lib/prisma-admin-mock";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GovernanceReports() {
  const { toast } = useToast();
  const descargar = (id: string, nombre: string, tipo: "PDF" | "XLSX") => {
    const blob = new Blob(
      [`Reporte simulado: ${nombre}\nGenerado: ${new Date().toISOString()}\nFormato: ${tipo}\n\n(este contenido es un mock; en producción sale del pipeline de reporting)`],
      { type: "text/plain" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${id}.${tipo.toLowerCase()}.txt`;
    a.click();
    toast({ title: "Reporte generado", description: `${nombre} — ${tipo}` });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Reportes exportables"
        subtitle="Reportes listos para reuniones de gerencia. PDF para lectura, XLSX para análisis."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportesCatalogo.map((r) => (
          <div key={r.id} className="card-elevated p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <FileDown className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium">{r.nombre}</div>
                <div className="text-sm text-muted-foreground">{r.desc}</div>
                <div className="text-[11px] uppercase text-muted-foreground mt-1 tracking-wider">{r.formato}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => descargar(r.id, r.nombre, "PDF")}
                className="flex-1 inline-flex items-center justify-center gap-2 h-9 rounded-xl border border-border text-sm font-medium hover:bg-muted"
              >
                <FileText className="w-4 h-4" /> PDF
              </button>
              {r.formato.includes("XLSX") && (
                <button
                  onClick={() => descargar(r.id, r.nombre, "XLSX")}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-9 rounded-xl bg-foreground text-background text-sm font-medium"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Excel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
