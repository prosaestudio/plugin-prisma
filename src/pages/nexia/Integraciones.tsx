import { useState } from "react";
import { Plus, MoreVertical, ArrowRight, Check } from "lucide-react";
import { integraciones as initialIntegraciones, herramientasCatalogo, type Integracion } from "@/lib/nexia-mock";
import { EditorialHeader, PillButton, IntegrationStatus } from "@/components/nexia/primitives";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import aiAvatar from "@/assets/ai-avatar-bg.png";
import heroBg from "@/assets/hero-hills.png";

function ToolLogo({ logo, nombre }: { logo?: string; nombre: string }) {
  const [error, setError] = useState(false);
  if (!logo || error) {
    return (
      <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground shrink-0">
        {nombre.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <div className="w-11 h-11 rounded-xl bg-muted/40 border border-border flex items-center justify-center shrink-0 overflow-hidden">
      <img src={logo} alt={nombre} className="w-7 h-7 object-contain" onError={() => setError(true)} />
    </div>
  );
}

export default function Integraciones() {
  const [integraciones, setIntegraciones] = useState<Integracion[]>(initialIntegraciones);
  const [open, setOpen] = useState(false);

  const yaConectadas = new Set(integraciones.map((i) => i.id));
  const disponibles = herramientasCatalogo.filter((h) => !yaConectadas.has(h.id));

  const agregar = (h: typeof herramientasCatalogo[number]) => {
    setIntegraciones((prev) => [
      ...prev,
      { id: h.id, nombre: h.nombre, proveedor: h.proveedor, estado: "pending", logo: h.logo, categoria: h.categoria },
    ]);
    setOpen(false);
  };

  return (
    <div className="space-y-10">
      {/* Hero with hills bg + glass block */}
      <div
        className="rounded-3xl relative overflow-hidden p-8 lg:p-10 min-h-[360px] flex items-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 items-center w-full">
          {/* Glass text block */}
          <div className="rounded-2xl p-7 lg:p-8 bg-white/25 backdrop-blur-xl border border-white/40 shadow-[0_8px_40px_rgba(0,0,0,0.08)] text-foreground">
            <div className="text-[11px] uppercase tracking-[0.22em] text-foreground/70 mb-4">
              Diagnóstico de Ecosistema
            </div>
            <h1
              className="text-4xl lg:text-5xl leading-[1.1] text-foreground"
              style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
            >
              Prisma observa dónde
              <br />
              <em className="not-italic font-light text-foreground/70">ya ocurre la IA</em>
            </h1>
            <p className="text-sm text-foreground/75 mt-4 max-w-md">
              Conectamos con tus herramientas actuales para mapear el ADN digital de tu equipo sin fricción.
            </p>
          </div>

          {/* Glass status pills */}
          <div className="flex items-center justify-end gap-4 flex-wrap">
            <div className="w-20 h-20 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 flex items-center justify-center shadow-lg">
              <img src={aiAvatar} alt="" className="w-12 h-12" />
            </div>
            <div className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 text-xs text-foreground shadow-lg">
              Analizando flujos…
            </div>
            <div className="relative w-28 h-28 rounded-full bg-white/25 backdrop-blur-xl border border-white/40 flex flex-col items-center justify-center shadow-lg">
              <span
                className="text-3xl text-foreground"
                style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
              >
                88
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/70">
                Prisma Score
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Connected tools */}
      <div>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
              Herramientas Conectadas
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona las fuentes de datos de tu inteligencia colectiva.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" /> Nueva Conexión
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
                  Agregar herramienta al ecosistema
                </DialogTitle>
                <DialogDescription>
                  Selecciona una herramienta para que Prisma comience a observar la actividad del equipo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-1 mt-2">
                {disponibles.length === 0 && (
                  <div className="col-span-2 text-center text-sm text-muted-foreground py-8">
                    Todas las herramientas del catálogo ya están conectadas.
                  </div>
                )}
                {disponibles.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => agregar(h)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/40 transition-colors text-left"
                  >
                    <ToolLogo logo={h.logo} nombre={h.nombre} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{h.nombre}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{h.proveedor} · {h.categoria}</div>
                    </div>
                    <Plus className="w-4 h-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integraciones.map((i) => (
            <div key={i.id} className="card-elevated p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <ToolLogo logo={i.logo} nombre={i.nombre} />
                <IntegrationStatus status={i.estado} />
              </div>

              <div>
                <h3 className="font-semibold text-base">{i.nombre}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                  {i.estado === "connected"
                    ? `Análisis de patrones de prompting y resolución de problemas técnicos en tiempo real.`
                    : i.estado === "error"
                    ? "Reconecta para reanudar el monitoreo de actividad."
                    : i.estado === "pending"
                    ? "Procesando documentos extensos y razonamiento lógico avanzado."
                    : "Conecta esta herramienta para comenzar el monitoreo."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                <span>
                  {i.ultimaActividad ? `Last sync: ${i.ultimaActividad}` : "Sin sincronizar"}
                </span>
                <button className="hover:text-foreground"><MoreVertical className="w-4 h-4" /></button>
              </div>
            </div>
          ))}

          {/* Add tile */}
          <button
            onClick={() => setOpen(true)}
            className="rounded-2xl border-2 border-dashed border-border hover:border-foreground/40 hover:bg-muted/30 transition-all p-5 flex flex-col items-center justify-center gap-3 min-h-[180px] text-muted-foreground hover:text-foreground"
          >
            <div className="w-11 h-11 rounded-xl border border-dashed border-current flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium">Agregar herramienta</div>
            <div className="text-[11px] text-muted-foreground text-center max-w-[180px]">
              Conecta más fuentes para enriquecer el diagnóstico
            </div>
          </button>
        </div>
      </div>

      {/* Process flow */}
      <div className="card-elevated p-6">
        <h3 className="text-lg mb-5" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
          Cómo funciona la integración
        </h3>
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {["Herramientas de IA", "API Observer", "Prisma Intelligence Layer", "AI Maturity Score"].map((step, idx, arr) => (
            <div key={step} className="flex-1 flex items-center gap-3">
              <div className="flex-1 p-4 rounded-2xl border border-border bg-muted/30 text-center text-sm">{step}</div>
              {idx < arr.length - 1 && <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
