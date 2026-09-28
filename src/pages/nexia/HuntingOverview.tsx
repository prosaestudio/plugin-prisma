import { useNavigate } from "react-router-dom";
import { Filter, ArrowRight, MoreVertical, SearchCheck, Users, MessageCircle, BadgeCheck } from "lucide-react";
import { requerimientos } from "@/lib/nexia-mock";
import { EditorialHeader, PillButton, PrismaProgress } from "@/components/nexia/primitives";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarFor } from "@/lib/avatar";

const stats = [
  { icon: SearchCheck, hint: "+2 este mes", value: 5, label: "Búsquedas activas actualmente" },
  { icon: Users, hint: "Tendencia ↑", value: 34, label: "Candidatos en pipeline total" },
  { icon: MessageCircle, hint: "86% Tasa resp.", value: 8, label: "Entrevistas agendadas esta semana" },
  { icon: BadgeCheck, hint: "Q3 Meta: 12", value: 2, label: "Contrataciones cerradas este mes" },
];

const etapaToProgress = (etapa: string) => {
  const order = ["Sourcing", "Screening", "Evaluación inicial", "Entrevista técnica", "Oferta enviada"];
  const idx = order.findIndex((o) => etapa.toLowerCase().includes(o.toLowerCase()));
  return ((idx + 1) / order.length) * 100;
};

export default function HuntingOverview() {
  const navigate = useNavigate();

  return (
    <div className="space-y-10">
      <EditorialHeader
        title="Talent Hunting"
        description="Gestión estratégica de procesos de selección activos y análisis de embudo de contratación."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card-elevated p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                <s.icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <span className="text-xs text-muted-foreground">{s.hint}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
                {s.value}
              </span>
              <span className="text-sm">{s.label.split(" ")[0]}</span>
            </div>
            <div className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mt-1">
              {s.label.split(" ").slice(1).join(" ")}
            </div>
          </div>
        ))}
      </div>

      {/* Active searches */}
      <div className="card-elevated p-2 sm:p-4">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
            Búsquedas activas
          </h2>
          <div className="flex items-center gap-3">
            <PillButton><Filter className="w-4 h-4" /> Filtrar</PillButton>
            <PillButton variant="solid" onClick={() => navigate("/hunting/candidatos")}>
              Ver pipeline completo <ArrowRight className="w-4 h-4" />
            </PillButton>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-[1.6fr_1fr_1fr_1.4fr_0.8fr_0.3fr] gap-4 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground border-y border-border">
          <div>Rol de búsqueda</div>
          <div>Área</div>
          <div>Candidatos</div>
          <div>Etapa actual</div>
          <div>Días abierta</div>
          <div></div>
        </div>

        <div>
          {requerimientos.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1.4fr_0.8fr_0.3fr] gap-4 items-center px-4 py-5 border-b border-border last:border-0"
            >
              <div>
                <div className="font-semibold text-sm">{r.rol}</div>
                <div className="text-xs text-muted-foreground">Remote · Full-time</div>
              </div>

              <div>
                <span className="text-xs px-3 py-1 rounded-full bg-muted">{r.area}</span>
              </div>

              <div className="flex items-center -space-x-2">
                {Array.from({ length: Math.min(2, r.candidatos) }).map((_, i) => (
                  <Avatar key={i} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={avatarFor(`${r.id}-${i}`)} alt="" />
                    <AvatarFallback className="bg-muted text-foreground text-xs">{String.fromCharCode(65 + i)}{String.fromCharCode(70 + i)}</AvatarFallback>
                  </Avatar>
                ))}
                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                  +{Math.max(0, r.candidatos - 2)}
                </div>
              </div>

              <div className="space-y-1.5 max-w-[220px]">
                <div className="text-sm">{r.etapa}</div>
                <PrismaProgress percent={etapaToProgress(r.etapa)} />
              </div>

              <div className="text-sm tabular-nums">{r.diasAbierto}</div>

              <button onClick={() => navigate("/hunting/candidatos")} className="text-muted-foreground hover:text-foreground justify-self-end">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
