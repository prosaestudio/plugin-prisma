import { useNavigate } from "react-router-dom";
import { ArrowRight, XCircle, Settings2, CheckCircle2, TrendingDown, DollarSign } from "lucide-react";
import { SectionHeader } from "@/components/nexia/primitives";

export default function DiagnosticoOverview() {
  const navigate = useNavigate();

  const detecta = [
    { icon: XCircle, titulo: "Errores de uso por rol", desc: "Un error para un abogado no es el mismo que para un vendedor. Prisma lo sabe." },
    { icon: Settings2, titulo: "Procesos sin automatizar", desc: "Tareas manuales que la IA podría reemplazar completamente en el flujo del colaborador." },
    { icon: CheckCircle2, titulo: "Buenas prácticas emergentes", desc: "Lo que hace diferente el colaborador más eficiente del mismo rol." },
    { icon: TrendingDown, titulo: "Adopción nula o insuficiente", desc: "Áreas donde la IA no se usa aunque debería integrarse en los procesos clave." },
    { icon: DollarSign, titulo: "ROI perdido y recuperable", desc: "Cuánto vale en dinero y tiempo corregir cada brecha detectada." },
  ];

  const flujo = [
    "Herramientas de IA del equipo",
    "Capa 1: Integración API al flujo de trabajo",
    "Capa 2: Contexto de rol de cada colaborador",
    "Prisma Intelligence Layer",
    "Errores detectados + ROI proyectado + Plan de acción",
  ];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="space-y-4 max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Módulo 01 — Diagnóstico</div>
        <h1
          className="text-4xl lg:text-5xl leading-[1.1]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
        >
          Prisma detecta dónde está el valor perdido
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Se integra a tu flujo de trabajo real, entiende el rol de cada colaborador y detecta — sin encuestas — qué procesos
          necesitan IA, cuáles la usan mal y cuánto cuesta cada brecha.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <button onClick={() => navigate("/diagnostico/areas")} className="inline-flex items-center gap-2 rounded-full px-5 h-11 bg-foreground text-background text-sm font-medium hover:opacity-90">
            Ver diagnóstico por área <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => navigate("/diagnostico/integraciones")} className="inline-flex items-center gap-2 rounded-full px-5 h-11 border border-border text-sm font-medium hover:bg-muted">
            Conectar más herramientas
          </button>
        </div>
      </section>

      {/* ¿Qué detecta Prisma? */}
      <div>
        <SectionHeader title="¿Qué detecta Prisma?" subtitle="Sin encuestas. Basado en tu proceso de trabajo real." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          {detecta.map((s) => (
            <div key={s.titulo} className="card-elevated p-5">
              <s.icon className="w-5 h-5 text-foreground mb-3" />
              <h4 className="font-medium text-sm mb-1">{s.titulo}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Flujo */}
      <div>
        <SectionHeader title="Cómo funciona" subtitle="De la herramienta al plan de acción accionable." />
        <div className="mt-6 card-elevated p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-stretch gap-3">
            {flujo.map((nodo, i) => (
              <div key={i} className="flex items-center gap-3 flex-1">
                <div className="flex-1 rounded-2xl border border-border bg-muted/40 px-4 py-5 text-center">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Paso {i + 1}</div>
                  <div className="text-sm font-medium leading-snug">{nodo}</div>
                </div>
                {i < flujo.length - 1 && (
                  <ArrowRight className="hidden lg:block w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
