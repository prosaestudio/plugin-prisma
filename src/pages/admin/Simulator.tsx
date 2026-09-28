import { useState } from "react";
import { SectionHeader } from "@/components/nexia/primitives";
import { Sparkles, Send, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import prismaAvatar from "@/assets/ball-prisma.png.asset.json";

interface Respuesta {
  texto: string;
  fuente: string;
  confianza: number;
}

function fakeResponder(q: string, borrador: boolean): Respuesta {
  const base = q.toLowerCase();
  if (base.includes("línea 3") || base.includes("formato")) {
    return {
      texto: borrador
        ? "Con el borrador v4.3 activo, el cambio de formato se realiza en 4 pasos: 1) activar modo semi-automático, 2) esperar retorno del pistón, 3) desmontar guía, 4) confirmar HMI."
        : "Según el manual v4.2 vigente, el cambio de formato requiere detener el ciclo y cambiar la guía manualmente. Nota: el agente detecta baja confianza sobre paso 3.",
      fuente: borrador ? "Manual Línea 3 v4.3 (borrador)" : "Manual Línea 3 v4.2",
      confianza: borrador ? 94 : 71,
    };
  }
  if (base.includes("licencia") || base.includes("matrimonio")) {
    return {
      texto: borrador
        ? "Con la política actualizada, corresponden 5 días hábiles de licencia por matrimonio."
        : "La documentación vigente no especifica claramente los días. El agente escala a RRHH.",
      fuente: borrador ? "Política vacaciones v2.1 (borrador)" : "Política vacaciones v2.0",
      confianza: borrador ? 96 : 42,
    };
  }
  return {
    texto: borrador
      ? "Con el contenido en borrador, encontré una respuesta que citaría el documento actualizado."
      : "No tengo información suficiente para responder con confianza; recomendaría escalar a un experto humano.",
    fuente: borrador ? "Contenido en borrador" : "Sin fuente adecuada",
    confianza: borrador ? 82 : 38,
  };
}

export default function Simulator() {
  const [q, setQ] = useState("¿Cómo cambio el formato en la Línea 3?");
  const [current, setCurrent] = useState<Respuesta | null>(null);
  const [draft, setDraft] = useState<Respuesta | null>(null);

  const run = () => {
    setCurrent(fakeResponder(q, false));
    setDraft(fakeResponder(q, true));
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Simulador del agente"
        subtitle="Prueba cómo respondería Prisma con la documentación actual vs. con tus cambios en borrador — antes de publicar."
      />

      <div className="card-elevated p-5">
        <div className="flex gap-3">
          <Textarea
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Escribe la pregunta que un colaborador le haría al agente…"
            className="rounded-xl min-h-[80px]"
          />
          <button
            onClick={run}
            className="self-start inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-foreground text-background text-sm font-medium"
          >
            <Send className="w-4 h-4" /> Ejecutar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { label: "Documentación actual", tone: "muted",  data: current },
          { label: "Con cambios en borrador", tone: "highlight", data: draft },
        ].map((col) => (
          <div key={col.label} className="card-elevated p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <img src={prismaAvatar.url} alt="" className="w-6 h-6 rounded-full object-cover" />
                <div>
                  <div className="font-medium text-sm">Prisma</div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{col.label}</div>
                </div>
              </div>
              {col.tone === "highlight" && (
                <span className="inline-flex items-center gap-1 text-xs text-warning bg-warning/10 px-2 py-0.5 rounded-md">
                  <Sparkles className="w-3 h-3" /> Preview
                </span>
              )}
            </div>

            {col.data ? (
              <div className="space-y-4">
                <div className="text-sm leading-relaxed">{col.data.texto}</div>
                <div className="rounded-xl border border-border p-3 flex items-center gap-3 bg-muted/30">
                  <FileText className="w-4 h-4" />
                  <div className="text-xs">
                    <div className="text-muted-foreground">Fuente citada</div>
                    <div className="font-medium">{col.data.fuente}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-xs text-muted-foreground">Confianza</div>
                    <div className="text-lg font-semibold">{col.data.confianza}%</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">Ejecuta la simulación para ver la respuesta.</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
