import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, Building2, ArrowRight } from "lucide-react";
import { colaboradores, areas } from "@/lib/nexia-mock";
import { ScoreBadge, TrendBadge, PrismaProgress, SectionHeader } from "@/components/nexia/primitives";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AreaDiagnostico = {
  id: string;
  nombre: string;
  colaboradores: number;
  score: number;
  tendencia: number;
  herramientas: string[];
  erroresUso: number;
  procesosAutomatizables: number;
  roiPerdidoUsdMes: number;
};

export default function ColaboradoresGrid() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [areaId, setAreaId] = useState("all");

  const areaRows: AreaDiagnostico[] = areas.map((area) => {
    const colabsArea = colaboradores.filter((c) => c.areaId === area.id);
    const herramientas = Array.from(new Set(colabsArea.flatMap((c) => c.herramientas))).slice(0, 4);

    return {
      id: area.id,
      nombre: area.nombre,
      colaboradores: area.colaboradores,
      score: area.score,
      tendencia: area.tendencia,
      herramientas,
      erroresUso: area.colaboradoresConErrores,
      procesosAutomatizables: area.procesosAutomatizables,
      roiPerdidoUsdMes: area.roiPerdidoUsdMes,
    };
  });

  const filtered = areaRows.filter((a) =>
    a.nombre.toLowerCase().includes(q.toLowerCase()) && (areaId === "all" || a.id === areaId)
  );

  return (
    <div className="space-y-6">
      <SectionHeader title="Diagnóstico por área" subtitle="Indicadores agregados por equipo. No se individualiza ningún dato de colaborador." />

      <div className="flex flex-col md:flex-row gap-3">
        <Select value={areaId} onValueChange={setAreaId}>
          <SelectTrigger className="w-full md:w-48 rounded-xl"><SelectValue placeholder="Área" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las áreas</SelectItem>
            {areas.map((a) => <SelectItem key={a.id} value={a.id}>{a.nombre}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar área..." className="pl-9 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((area) => (
          <button key={area.id} onClick={() => navigate(`/diagnostico/areas/${area.id}`)} className="card-elevated p-5 text-left">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{area.nombre}</div>
                <div className="text-xs text-muted-foreground truncate">{area.colaboradores} integrantes evaluados</div>
                <div className="text-xs text-muted-foreground">{area.procesosAutomatizables} procesos automatizables</div>
              </div>
              <ScoreBadge score={area.score} size="sm" />
            </div>
            <PrismaProgress percent={area.score} className="mb-3" />
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1">
                {area.herramientas.map((h) => (
                  <span key={h} className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">{h}</span>
                ))}
                {area.herramientas.length === 0 && <span className="text-[10px] text-muted-foreground">Sin herramientas activas</span>}
              </div>
              <TrendBadge value={area.tendencia} />
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>{area.erroresUso} señales de uso incorrecto</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-2 pt-2">
        {["Anterior", "1", "2", "3", "Siguiente"].map((p, i) => (
          <button key={i} className={`px-3 py-1.5 text-sm rounded-lg border border-border ${p === "1" ? "bg-foreground text-background" : "hover:bg-muted"}`}>{p}</button>
        ))}
      </div>
    </div>
  );
}
