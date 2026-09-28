import { useNavigate } from "react-router-dom";
import { Search, Filter, MoreHorizontal, LayoutGrid, Orbit } from "lucide-react";
import { useState } from "react";
import { areas } from "@/lib/nexia-mock";
import { EditorialHeader, PillButton, ScoreBadge, TrendBadge } from "@/components/nexia/primitives";
import { Input } from "@/components/ui/input";
import AreasOrbitView from "@/components/nexia/AreasOrbitView";
import { cn } from "@/lib/utils";

export default function AreasPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [view, setView] = useState<"list" | "orbit">("orbit");
  const filtered = areas.filter((a) => a.nombre.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-8">
      <EditorialHeader
        eyebrow="Estructura organizacional"
        title="Diagnóstico por Área"
        description="Un análisis exhaustivo del rendimiento y la integración tecnológica por departamento. Visualice las brechas de talento y el impacto de la IA en cada unidad de negocio."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="inline-flex p-1 rounded-full border border-border bg-background">
            {[
              { key: "orbit" as const, label: "Órbita", icon: Orbit },
              { key: "list" as const, label: "Listado", icon: LayoutGrid },
            ].map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.key}
                  onClick={() => setView(opt.key)}
                  className={cn(
                    "px-4 py-1.5 text-xs rounded-full flex items-center gap-1.5 transition-colors",
                    view === opt.key
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {opt.label}
                </button>
              );
            })}
          </div>
          <PillButton><Filter className="w-4 h-4" /> Filtros</PillButton>
          <PillButton>Últimos 30 días</PillButton>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Mostrar {filtered.length} departamentos</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar área..." className="pl-9 h-10 rounded-full w-56" />
          </div>
        </div>
      </div>

      {view === "orbit" ? (
        <AreasOrbitView />
      ) : (
        <div className="card-elevated p-2 sm:p-4">
          <div className="hidden md:grid grid-cols-[1.4fr_1.4fr_1fr_0.8fr_1fr_1.2fr_0.4fr] gap-4 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground border-b border-border">
            <div>Área</div>
            <div>Indicador</div>
            <div>Colaboradores</div>
            <div>Score IA</div>
            <div>Tendencia</div>
            <div>Herramientas</div>
            <div></div>
          </div>

          <div className="flex flex-col gap-1 mt-2">
            {filtered.map((a) => (
              <button
                key={a.id}
                onClick={() => navigate(`/diagnostico/areas/${a.id}`)}
                className="grid grid-cols-1 md:grid-cols-[1.4fr_1.4fr_1fr_0.8fr_1fr_1.2fr_0.4fr] gap-4 items-center px-4 py-4 rounded-2xl text-left hover:bg-muted/40 transition-colors border border-transparent hover:border-border"
              >
                <div className="font-semibold" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
                  {a.nombre}
                </div>

                <div className="text-sm text-muted-foreground truncate">Equipo completo</div>

                <div className="text-sm tabular-nums">{a.colaboradores}</div>
                <div><ScoreBadge score={a.score} /></div>
                <div><TrendBadge value={a.tendencia} /></div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-muted text-foreground truncate max-w-[80px]">
                    {["ChatGPT", "Copilot", "Claude", "Gemini"][parseInt(a.id.charCodeAt(0).toString()) % 4]}
                  </span>
                  <span className="text-xs text-muted-foreground">+{a.herramientasActivas}</span>
                </div>

                <div className="flex justify-end text-muted-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

