import { useEffect, useState, useMemo } from "react";
import { areas } from "@/lib/nexia-mock";

/**
 * AmoebaAdoption — Visualización tipo radar / mapa de calor
 * con un blob orgánico animado ("ameba") cuyo radio en cada eje
 * representa el grado de adopción de IA por área.
 */
export default function AmoebaAdoption() {
  const size = 460;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 40;

  const data = areas.map((a) => ({ label: a.nombre, score: a.score, id: a.id }));
  const n = data.length;

  // Pequeña animación: oscilación orgánica del radio
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const points = useMemo(() => {
    return data.map((d, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const wobble = Math.sin(t * 1.2 + i) * 4 + Math.cos(t * 0.8 + i * 1.7) * 3;
      const r = (d.score / 100) * maxR + wobble;
      return {
        ...d,
        angle,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        labelX: cx + Math.cos(angle) * (maxR + 22),
        labelY: cy + Math.sin(angle) * (maxR + 22),
      };
    });
  }, [data, t, n, cx, cy, maxR]);

  // Path suave (Catmull-Rom → Bezier) cerrado
  const path = useMemo(() => {
    const pts = points;
    let d = "";
    for (let i = 0; i < pts.length; i++) {
      const p0 = pts[(i - 1 + pts.length) % pts.length];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % pts.length];
      const p3 = pts[(i + 2) % pts.length];
      if (i === 0) d += `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} `;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += `C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} `;
    }
    return d + "Z";
  }, [points]);

  const promedio = Math.round(data.reduce((s, d) => s + d.score, 0) / n);

  return (
    <div className="card-elevated p-6">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold">Radar de adopción de IA</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Visualización orgánica del grado de adopción por área · mapa de calor
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Adopción promedio</div>
          <div className="text-2xl font-semibold">{promedio}%</div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[460px]">
          <defs>
            {/* Heatmap radial con paleta Prisma */}
            <radialGradient id="heatmap" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f5d3a8" stopOpacity="0.35" />
              <stop offset="35%" stopColor="#f08aa0" stopOpacity="0.28" />
              <stop offset="70%" stopColor="#c98ad6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#8aa9e8" stopOpacity="0.18" />
            </radialGradient>
            <radialGradient id="amoebaFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f7a87a" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#f08aa0" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#8aa9e8" stopOpacity="0.35" />
            </radialGradient>
            <filter id="blur"><feGaussianBlur stdDeviation="6" /></filter>
            {/* Borde con los colores del prisma */}
            <linearGradient id="prismaAmoebaStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f5d3a8" />
              <stop offset="20%" stopColor="#f7a87a" />
              <stop offset="40%" stopColor="#f08aa0" />
              <stop offset="60%" stopColor="#c98ad6" />
              <stop offset="80%" stopColor="#8aa9e8" />
              <stop offset="100%" stopColor="#8ed8c4" />
            </linearGradient>
          </defs>


          {/* Aros del heatmap */}
          {[1, 0.75, 0.5, 0.25].map((k, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={maxR * k}
              fill="url(#heatmap)"
              opacity={0.55 - i * 0.08}
            />
          ))}

          {/* Grid radial */}
          {[0.25, 0.5, 0.75, 1].map((k) => (
            <circle
              key={k}
              cx={cx}
              cy={cy}
              r={maxR * k}
              fill="none"
              stroke="hsl(var(--border))"
              strokeDasharray="2 4"
              opacity={0.6}
            />
          ))}

          {/* Ejes */}
          {points.map((p, i) => (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(p.angle) * maxR}
              y2={cy + Math.sin(p.angle) * maxR}
              stroke="hsl(var(--border))"
              strokeWidth={1}
              opacity={0.5}
            />
          ))}

          {/* Glow de la ameba */}
          <path d={path} fill="url(#amoebaFill)" filter="url(#blur)" opacity={0.7} />
          {/* Borde de la ameba con colores del prisma */}
          <path
            d={path}
            fill="url(#amoebaFill)"
            stroke="url(#prismaAmoebaStroke)"
            strokeWidth={2.5}
            strokeLinejoin="round"
            opacity={0.95}
          />

          {/* Puntos por área */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={4}
                fill="hsl(var(--background))"
                stroke="hsl(var(--foreground))"
                strokeWidth={1.5}
              />
            </g>
          ))}

          {/* Labels */}
          {points.map((p, i) => {
            const anchor =
              p.labelX < cx - 8 ? "end" : p.labelX > cx + 8 ? "start" : "middle";
            return (
              <g key={`l-${i}`}>
                <text
                  x={p.labelX}
                  y={p.labelY}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  className="fill-foreground"
                  style={{ fontSize: 11, fontWeight: 500 }}
                >
                  {p.label}
                </text>
                <text
                  x={p.labelX}
                  y={p.labelY + 12}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: 10 }}
                >
                  {p.score}%
                </text>
              </g>
            );
          })}
        </svg>

        {/* Leyenda */}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#f7a87a" }} /> Bajo (&lt;50)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#c98ad6" }} /> Medio (50–69)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#8ed8c4" }} /> Alto (≥70)
          </div>
        </div>

      </div>
    </div>
  );
}
