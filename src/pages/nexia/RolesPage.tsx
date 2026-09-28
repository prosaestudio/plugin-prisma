import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Filter, Download, Sparkles } from "lucide-react";
import { rolesSugeridos, areas, type RolSugerido } from "@/lib/nexia-mock";
import { EditorialHeader, PillButton } from "@/components/nexia/primitives";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

// Prisma palette per area — soft blurred blobs (pomodorini aesthetic)
const AREA_COLORS: Record<string, { core: string; halo: string }> = {
  Producto:    { core: "#8aa9e8", halo: "#c98ad6" },
  Marketing:   { core: "#f08aa0", halo: "#f7a87a" },
  Finanzas:    { core: "#c98ad6", halo: "#8aa9e8" },
  IT:          { core: "#8ed8c4", halo: "#8aa9e8" },
  Legal:       { core: "#f08aa0", halo: "#c98ad6" },
  Operaciones: { core: "#f7a87a", halo: "#f08aa0" },
  RRHH:        { core: "#8ed8c4", halo: "#f7a87a" },
  Ventas:      { core: "#8aa9e8", halo: "#8ed8c4" },
};
const DEFAULT_COLOR = { core: "#c98ad6", halo: "#f08aa0" };

// Deterministic positioning within a cluster
function clusterPositions(n: number, w: number, h: number, seed: number) {
  const pts: Array<{ x: number; y: number }> = [];
  let s = seed * 9301 + 49297;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < n; i++) {
    pts.push({
      x: 20 + rand() * (w - 40),
      y: 20 + rand() * (h - 40),
    });
  }
  return pts;
}

function Blob({
  rol,
  x,
  y,
  size,
}: {
  rol: RolSugerido;
  x: number;
  y: number;
  size: number;
}) {
  const colors = AREA_COLORS[rol.area] || DEFAULT_COLOR;
  const navigate = useNavigate();
  const isCubierto = rol.estado === "Cubierto";

  return (
    <HoverCard openDelay={80} closeDelay={60}>
      <HoverCardTrigger asChild>
        <button
          onClick={() => navigate("/hunting/requerimientos")}
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 rounded-full"
          style={{ left: x, top: y, width: size, height: size }}
          aria-label={rol.titulo}
        >
          <span
            className="absolute inset-0 block rounded-full"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${colors.core} 0%, ${colors.core} 22%, ${colors.halo} 55%, rgba(255,255,255,0) 78%)`,
              filter: "blur(6px)",
            }}
          />
          <span
            className="absolute inset-0 flex items-center justify-center text-center px-2 leading-tight pointer-events-none"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              color: "#1a1a1a",
              fontSize: Math.max(9, Math.min(13, size / 12)),
              textShadow: "0 1px 2px rgba(255,255,255,0.6)",
            }}
          >
            {rol.titulo}
          </span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 overflow-hidden z-[100]" side="top" sideOffset={8}>
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, ${colors.core}, ${colors.halo})` }}
        />
        <div className="p-4 space-y-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {rol.area} · {rol.prioridad}
            </div>
            <h4 className="text-base font-semibold leading-tight mt-1" style={{ fontFamily: "var(--font-display)" }}>
              {rol.titulo}
            </h4>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground italic leading-relaxed">
            <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0 text-foreground/60" />
            <span>"{rol.porQue}"</span>
          </div>
          <div className="pt-2 border-t border-border">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Brecha estimada</div>
            <div className="text-sm font-semibold tabular-nums">
              ${(rol.costoBrechaUsdMes / 1000).toFixed(0)}K
              <span className="text-[10px] font-normal text-muted-foreground">/mes</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function RolesPage() {
  const [areaFilter, setAreaFilter] = useState("all");

  const filtered = useMemo(
    () => rolesSugeridos.filter((r) => areaFilter === "all" || r.area === areaFilter),
    [areaFilter],
  );

  // Group by area
  const grouped = useMemo(() => {
    const map = new Map<string, RolSugerido[]>();
    filtered.forEach((r) => {
      if (!map.has(r.area)) map.set(r.area, []);
      map.get(r.area)!.push(r);
    });
    return Array.from(map.entries())
      .map(([area, roles]) => {
        const areaInfo = areas.find((a) => a.nombre === area);
        const totalBrecha = roles.reduce((s, r) => s + r.costoBrechaUsdMes, 0);
        return { area, roles, areaInfo, totalBrecha };
      })
      .sort((a, b) => b.totalBrecha - a.totalBrecha);
  }, [filtered]);

  const totalGap = filtered.reduce((s, r) => s + r.costoBrechaUsdMes, 0);
  const altaCount = filtered.filter((r) => r.prioridad === "Alta").length;

  return (
    <div className="space-y-8">
      <EditorialHeader
        eyebrow="Intelligence Engine"
        title="Posibles roles"
        description="Cada burbuja es un rol que Prisma sugiere abrir — su tamaño refleja el costo de la brecha detectada en los dolores y debilidades del área."
        action={
          <>
            <PillButton><Filter className="w-4 h-4" /> Filtrar</PillButton>
            <PillButton variant="solid"><Download className="w-4 h-4" /> Exportar</PillButton>
          </>
        }
      />

      {/* Indicador resumen basado en dolores y debilidades */}
      <div className="card-elevated p-5 flex flex-wrap items-center gap-x-10 gap-y-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Brechas detectadas</div>
          <div className="text-2xl font-semibold tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
            {filtered.length} <span className="text-sm font-normal text-muted-foreground">roles sugeridos</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Costo total brecha</div>
          <div className="text-2xl font-semibold tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
            ${(totalGap / 1000).toFixed(0)}K<span className="text-sm font-normal text-muted-foreground">/mes</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Prioridad alta</div>
          <div className="text-2xl font-semibold tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
            {altaCount}
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Distribución por área</div>
          <div className="flex h-2 rounded-full overflow-hidden bg-muted">
            {grouped.map(({ area, totalBrecha }) => {
              const c = AREA_COLORS[area] || DEFAULT_COLOR;
              return (
                <div
                  key={area}
                  title={`${area} · $${(totalBrecha / 1000).toFixed(0)}K/mes`}
                  style={{
                    width: `${(totalBrecha / totalGap) * 100}%`,
                    background: `linear-gradient(90deg, ${c.core}, ${c.halo})`,
                  }}
                />
              );
            })}
          </div>
        </div>
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="w-44 rounded-full h-10"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las áreas</SelectItem>
            {areas.map((a) => <SelectItem key={a.id} value={a.nombre}>{a.nombre}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Single floating orbit — todas las burbujas en un mismo canvas */}
      <div
        className="relative rounded-3xl border border-border overflow-hidden"
        style={{ background: "#fdf6f1", height: 560 }}
      >
        {(() => {
          const W = 1100;
          const H = 560;
          const positions = clusterPositions(filtered.length, W, H, 7);
          return (
            <div className="absolute inset-0">
              {filtered.map((r, i) => {
                const size = 70 + (r.costoBrechaUsdMes / 48000) * 100;
                const xPct = (positions[i].x / W) * 100;
                const yPct = (positions[i].y / H) * 100;
                return (
                  <div
                    key={r.id}
                    className="absolute"
                    style={{
                      left: `${xPct}%`,
                      top: `${yPct}%`,
                      animation: `float-orbit ${8 + (i % 5) * 1.5}s ease-in-out ${i * 0.3}s infinite alternate`,
                    }}
                  >
                    <Blob rol={r} x={0} y={0} size={size} />
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Legend — area color dots */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-x-3 gap-y-1.5 max-w-[70%] z-10">
          {grouped.map(({ area }) => {
            const c = AREA_COLORS[area] || DEFAULT_COLOR;
            return (
              <div key={area} className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em]" style={{ color: "#5a5a5a" }}>
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${c.core}, ${c.halo})` }}
                />
                {area}
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-3 right-4 text-[10px] uppercase tracking-[0.18em] z-10" style={{ color: "#9a9a9a" }}>
          Hover sobre cada burbuja para ver el porqué
        </div>
      </div>

      <style>{`
        @keyframes float-orbit {
          0%   { transform: translate(0, 0); }
          50%  { transform: translate(8px, -10px); }
          100% { transform: translate(-6px, 6px); }
        }
      `}</style>
    </div>
  );
}
