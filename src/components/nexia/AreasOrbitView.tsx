import { useNavigate } from "react-router-dom";
import { areas as areasData } from "@/lib/nexia-mock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, TrendingDown, Users } from "lucide-react";
import prismaOrb from "@/assets/prisma-orb.png";

const avatarFor = (name: string) =>
  `https://i.pravatar.cc/120?u=${encodeURIComponent(name.replace(/\s+/g, ""))}`;

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

type Area = (typeof areasData)[number];

// Distribute areas into rings by score: best (>=70) inner, mid (50-69), critical (<50) outer
function ringFor(score: number): 0 | 1 | 2 {
  if (score >= 70) return 0;
  if (score >= 50) return 1;
  return 2;
}

const RING_RADII = [130, 215, 305];
const RING_DURATIONS = [55, 80, 110]; // seconds — slower further out
const RING_DIRECTIONS: ("orbit-cw" | "orbit-ccw")[] = ["orbit-cw", "orbit-ccw", "orbit-cw"];

export default function AreasOrbitView() {
  const navigate = useNavigate();

  const grouped: Area[][] = [[], [], []];
  areasData.forEach((a) => grouped[ringFor(a.score)].push(a));

  return (
    <div className="card-elevated p-6 lg:p-10 overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Orbit canvas */}
        <div className="flex-1 flex justify-center min-h-[680px]">
          <div className="relative orbit-pause" style={{ width: 680, height: 680, maxWidth: "100%" }}>
            {/* Ring guides */}
            {RING_RADII.map((r, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-border/60"
                style={{
                  width: r * 2,
                  height: r * 2,
                  left: `calc(50% - ${r}px)`,
                  top: `calc(50% - ${r}px)`,
                  borderStyle: i === 2 ? "dashed" : "solid",
                }}
              />
            ))}

            {/* Center prisma orb */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden shadow-[0_0_60px_rgba(180,120,255,0.35)]"
              style={{ width: 180, height: 180 }}
            >
              <img src={prismaOrb} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 rounded-full ring-1 ring-white/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/70">Prisma</span>
                <span className="text-3xl text-foreground" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
                  Core
                </span>
              </div>
            </div>

            {/* Orbiting nodes */}
            {grouped.map((items, ringIdx) => {
              const radius = RING_RADII[ringIdx];
              const duration = RING_DURATIONS[ringIdx];
              const direction = RING_DIRECTIONS[ringIdx];
              const counter = direction === "orbit-cw" ? "orbit-ccw" : "orbit-cw";
              return (
                <div
                  key={ringIdx}
                  className={`absolute inset-0 ${direction}`}
                  style={{ animationDuration: `${duration}s` }}
                >
                  {items.map((a, idx) => {
                    const angle = (idx / Math.max(1, items.length)) * Math.PI * 2;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return (
                      <div
                        key={a.id}
                        className="absolute"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {/* Counter-rotation keeps card upright */}
                        <div
                          className={counter}
                          style={{ animationDuration: `${duration}s` }}
                        >
                          <OrbitNode area={a} onClick={() => navigate(`/diagnostico/areas/${a.id}`)} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <aside className="w-full lg:w-64 shrink-0 space-y-5 text-sm">
          <div>
            <h4
              className="text-lg mb-1"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Órbita de áreas
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Las áreas con mayor adopción de IA orbitan más cerca del núcleo Prisma. Pasa el cursor para detenerla y ver el detalle.
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              { label: "Núcleo · score ≥ 70", color: "bg-emerald-500" },
              { label: "Órbita media · 50–69", color: "bg-amber-500" },
              { label: "Periferia · < 50", color: "bg-rose-500" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={`inline-block w-2 h-2 rounded-full ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border text-[11px] text-muted-foreground leading-relaxed">
            Cada nodo representa un área. Al hacer hover se expande con el detalle del responsable, equipo y herramientas activas.
          </div>
        </aside>
      </div>
    </div>
  );
}

function OrbitNode({ area, onClick }: { area: Area; onClick: () => void }) {
  const ring = ringFor(area.score);
  const ringColor =
    ring === 0
      ? "ring-emerald-400/60"
      : ring === 1
      ? "ring-amber-400/60"
      : "ring-rose-400/60";
  const dotColor = ring === 0 ? "bg-emerald-500" : ring === 1 ? "bg-amber-500" : "bg-rose-500";

  return (
    <button
      onClick={onClick}
      className="group relative block focus:outline-none"
      aria-label={area.nombre}
    >
      {/* Compact pill */}
      <div
        className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-background border border-border shadow-sm hover:shadow-md transition-all hover:scale-105 ${ringColor} ring-1`}
      >
        <Avatar className="h-7 w-7">
          <AvatarImage src={avatarFor(area.responsable)} alt={area.responsable} />
          <AvatarFallback className="text-[10px]">{initials(area.responsable)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[11px] font-medium tracking-tight">{area.nombre}</span>
          <span className="text-[9px] text-muted-foreground tabular-nums flex items-center gap-1">
            <span className={`w-1 h-1 rounded-full ${dotColor}`} />
            {area.score}
          </span>
        </div>
      </div>

      {/* Hover expanded detail */}
      <div className="absolute left-1/2 top-full -translate-x-1/2 mt-2 w-60 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-30">
        <div className="card-elevated p-3.5 text-left bg-background shadow-xl">
          <div className="flex items-center gap-2.5 mb-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatarFor(area.responsable)} alt={area.responsable} />
              <AvatarFallback className="text-xs">{initials(area.responsable)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div
                className="text-sm leading-tight truncate"
                style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
              >
                {area.nombre}
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {area.responsable}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center mt-2">
            <div>
              <div className="text-base tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>{area.score}</div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Score IA</div>
            </div>
            <div>
              <div className="text-base tabular-nums flex items-center justify-center gap-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
                {area.tendencia >= 0 ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-rose-500" />}
                {Math.abs(area.tendencia)}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Tend.</div>
            </div>
            <div>
              <div className="text-base tabular-nums flex items-center justify-center gap-0.5" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
                <Users className="w-3 h-3 text-muted-foreground" />
                {area.colaboradores}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Equipo</div>
            </div>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-border text-[11px] text-muted-foreground">
            {area.herramientasActivas} de {area.herramientasTotal} herramientas activas · {area.rolesSugeridos} rol{area.rolesSugeridos === 1 ? "" : "es"} sugerido{area.rolesSugeridos === 1 ? "" : "s"}
          </div>
        </div>
      </div>
    </button>
  );
}
