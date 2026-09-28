import { useNavigate, useParams } from "react-router-dom";
import { areas, rolesSugeridos } from "@/lib/nexia-mock";
import { PrismaProgress, PriorityBadge, MatchScore, SectionHeader } from "@/components/nexia/primitives";
import { ToolLogo } from "@/components/nexia/ToolLogo";

export default function AreaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const area = areas.find((a) => a.id === id) || areas[0];

  const dimensiones = [
    { label: "Frecuencia de uso", val: 68 },
    { label: "Sofisticación de prompts", val: 35 },
    { label: "Iteración y refinamiento", val: 28 },
    { label: "Diversidad de herramientas", val: 41 },
    { label: "Evolución en el tiempo", val: 38 },
  ];

  const herramientasArea = [
    { nombre: "ChatGPT", usuarios: 38 },
    { nombre: "Copilot", usuarios: 12 },
    { nombre: "Claude", usuarios: 8 },
    { nombre: "Gemini", usuarios: 0 },
  ];

  const rolesArea = rolesSugeridos.filter((r) => r.area === area.nombre).slice(0, 3);
  const senalesArea = [
    { label: "Procesos automatizables", value: area.procesosAutomatizables, detail: "flujos detectados" },
    { label: "Uso incorrecto agregado", value: area.colaboradoresConErrores, detail: "señales del área" },
    { label: "Pérdida estimada mensual", value: `$${Math.round(area.roiPerdidoUsdMes / 1000)}K`, detail: "USD / mes" },
  ];

  const nivel = area.score >= 70 ? "Avanzado" : area.score >= 50 ? "Intermedio" : "Intermedio bajo";

  return (
    <div className="space-y-6">
      <SectionHeader
        title={`${area.nombre} — AI Maturity Score: ${area.score}`}
        subtitle={`${area.colaboradores} integrantes evaluados · indicadores agregados por área`}
      />
      <div>
        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-muted text-sm font-medium">Nivel: {nivel}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated p-6 space-y-6">
          <div className="flex items-center justify-center">
            <MatchScore score={area.score} size={180} />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">Desglose por dimensión</h3>
            {dimensiones.map((d) => (
              <div key={d.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{d.label}</span>
                  <span className="font-medium">{d.val}%</span>
                </div>
                <PrismaProgress percent={d.val} />
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-3">Herramientas activas</h3>
            <div className="space-y-2">
              {herramientasArea.map((h) => (
                <div key={h.nombre} className="flex justify-between items-center p-2.5 rounded-lg bg-muted/40">
                  <span className="text-sm font-medium flex items-center gap-2"><ToolLogo name={h.nombre} size={18} />{h.nombre}</span>
                  <span className="text-sm text-muted-foreground">{h.usuarios > 0 ? `${h.usuarios} usuarios` : "no conectada"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-4">Señales agregadas del área</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {senalesArea.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="text-2xl font-semibold tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs font-medium">{s.label}</div>
                  <div className="text-[11px] text-muted-foreground">{s.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-4">Roles recomendados</h3>
            <div className="space-y-2">
              {rolesArea.length > 0 ? rolesArea.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl border border-border">
                  <span className="font-medium text-sm">{r.titulo}</span>
                  <PriorityBadge priority={r.prioridad} />
                </div>
              )) : <p className="text-sm text-muted-foreground">Sin roles sugeridos para esta área.</p>}
            </div>
            <button onClick={() => navigate("/diagnostico/roles")} className="mt-4 text-sm font-medium hover:text-highlight">Ver detalle de roles →</button>
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-4">Plan de acción sugerido</h3>
            <ul className="space-y-2">
              {[
                { txt: "Iniciar ruta de upskilling para equipo de contenido", mod: "Módulo 03" },
                { txt: `Abrir búsqueda de ${rolesArea[0]?.titulo || "AI Specialist"}`, mod: "Módulo 02" },
                { txt: "Configurar integración faltante", mod: "Módulo 01" },
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border">
                  <input type="checkbox" className="mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{p.txt}</p>
                    <span className="text-xs text-muted-foreground">{p.mod}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
