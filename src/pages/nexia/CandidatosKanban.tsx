import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { candidatos, etapasPipeline } from "@/lib/nexia-mock";
import { EditorialHeader } from "@/components/nexia/primitives";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarFor } from "@/lib/avatar";

export default function CandidatosKanban() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <EditorialHeader
        title="Pipeline"
        description="Gestiona el flujo completo de selección de talento por etapa."
      />

      <div className="overflow-x-auto pb-4 rounded-2xl bg-muted/60 p-6">
        <div className="flex gap-6 min-w-max">
          {etapasPipeline.slice(0, 5).map((etapa) => {
            const cards = candidatos.filter((c) => c.etapa === etapa);
            return (
              <div key={etapa} className="w-80 shrink-0">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-lg" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
                    {etapa}
                  </h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full tabular-nums">
                    {cards.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[200px]">
                  {cards.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => navigate(`/hunting/candidatos/${c.id}`)}
                      className="w-full text-left card-elevated p-4 hover:shadow-md transition-shadow relative"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={avatarFor(c.id)} alt={c.nombre} />
                          <AvatarFallback className="bg-muted text-foreground text-xs">{c.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{c.nombre}</div>
                          <div className="text-xs text-muted-foreground truncate">{c.rolActual.split(" en ")[0]}</div>
                        </div>
                        {c.matchScore >= 90 && <Sparkles className="w-4 h-4 text-foreground/60 shrink-0" />}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-full bg-foreground text-background">
                          {c.matchScore}% MATCH
                        </span>
                        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          {c.diasEnEtapa}d in stage
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {c.habilidades.slice(0, 2).map((h) => (
                          <span key={h.nombre} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                            {h.nombre}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
