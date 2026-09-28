import { useNavigate, useParams } from "react-router-dom";
import { rutas, modulosRuta, areas } from "@/lib/nexia-mock";
import { PrismaProgress, SectionHeader } from "@/components/nexia/primitives";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Lock, PlayCircle, MessageSquare, Building2 } from "lucide-react";

export default function RutaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const r = rutas.find((x) => x.id === id) || rutas[1];
  const areasInscritas = areas
    .filter((area) => r.area === "Todas las áreas" || area.nombre === r.area)
    .slice(0, Math.max(1, Math.min(4, areas.length)));

  return (
    <div className="space-y-6">
      <SectionHeader title={r.nombre} subtitle={`${r.nivel} · ${r.area} · ${r.inscritos} colaboradores inscritos`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-3">Descripción</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.descripcion}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              Diseñada para colaboradores con experiencia previa que quieran integrar IA generativa en su trabajo diario.
              Combina teoría aplicada, ejercicios prácticos y un agente IA tutor disponible 24/7.
            </p>
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-3">Módulos del programa</h3>
            <Accordion type="single" collapsible defaultValue="m3">
              {modulosRuta.map((m, i) => {
                const Icon = m.estado === "completed" ? CheckCircle2 : m.estado === "current" ? PlayCircle : Lock;
                const color = m.estado === "completed" ? "text-success" : m.estado === "current" ? "text-foreground" : "text-muted-foreground";
                return (
                  <AccordionItem key={m.id} value={m.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <Icon className={`w-5 h-5 ${color} shrink-0`} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{i + 1}. {m.titulo}</div>
                          <div className="text-xs text-muted-foreground">{m.duracion}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Contenido del módulo con ejercicios prácticos y validación con el Agente IA.
                      {m.estado !== "locked" && (
                        <div className="mt-2"><button className="text-foreground font-medium hover:text-highlight">Ir al módulo →</button></div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>

        <div className="space-y-6 bg-muted/30 rounded-3xl p-5">
          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-2">Tu progreso</h3>
            <div className="text-3xl font-semibold mb-2" style={{fontFamily:"var(--font-display)"}}>{r.avance}%</div>
            <PrismaProgress percent={r.avance} className="mb-4" />
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Último acceso: hace 2 horas</div>
              <div>Tiempo invertido: 4h 23min</div>
              <div>Próximo módulo: Análisis de datos con IA</div>
            </div>
            <button onClick={() => navigate("/upskilling/agente")} className="mt-4 w-full py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 inline-flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" /> Continuar con el Agente IA
            </button>
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-3">Áreas inscritas</h3>
            <ul className="space-y-2.5">
              {areasInscritas.map((area) => (
                <li key={area.id} className="flex items-center gap-2.5">
                  <span className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{area.nombre}</div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{area.score}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
