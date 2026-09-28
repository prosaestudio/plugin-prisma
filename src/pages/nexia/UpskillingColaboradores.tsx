import { useNavigate } from "react-router-dom";
import { Filter, Download, ArrowRight, Users, GraduationCap } from "lucide-react";
import { areas, colaboradores, rutas, upskillingColaboradores } from "@/lib/nexia-mock";
import { PrismaProgress, SectionHeader } from "@/components/nexia/primitives";
import { Button } from "@/components/ui/button";

type Fila = {
  areaId: string;
  area: string;
  enFormacion: number;
  inactivos: number;
  avancePromedio: number;
  scorePromedio: number;
  rutaPrincipal?: { id: string; nombre: string; nivel: string };
};

export default function UpskillingColaboradores() {
  const navigate = useNavigate();

  const filas: Fila[] = areas.map((a) => {
    const colabsArea = colaboradores.filter((c) => c.areaId === a.id);
    const upArea = upskillingColaboradores.filter((u) => u.area === a.nombre);
    const inactivos = upArea.filter((u) => u.inactivo).length;
    const avance = upArea.length
      ? Math.round(upArea.reduce((s, u) => s + u.avance, 0) / upArea.length)
      : 0;
    const ruta = rutas.find((r) => r.area === a.nombre);
    const score = colabsArea.length
      ? Math.round(colabsArea.reduce((s, c) => s + c.score, 0) / colabsArea.length)
      : a.score;
    return {
      areaId: a.id,
      area: a.nombre,
      enFormacion: upArea.length,
      inactivos,
      avancePromedio: avance,
      scorePromedio: score,
      rutaPrincipal: ruta && { id: ruta.id, nombre: ruta.nombre, nivel: ruta.nivel },
    };
  });

  const totalEnFormacion = filas.reduce((s, f) => s + f.enFormacion, 0);
  const avanceGlobal = Math.round(
    filas.reduce((s, f) => s + f.avancePromedio, 0) / filas.length,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <SectionHeader
          title="Aprendizaje por Área"
          subtitle="Avance de formación agregado por área. Los indicadores se muestran a nivel de equipo, no individual."
        />
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full h-11 px-5 gap-2">
            <Filter className="w-4 h-4" /> Filtrar
          </Button>
          <Button className="rounded-full h-11 px-5 gap-2">
            <Download className="w-4 h-4" /> Exportar Reporte
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-elevated p-5 flex items-center gap-4">
          <Users className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="text-3xl tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
              {totalEnFormacion}
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">En formación</div>
          </div>
        </div>
        <div className="card-elevated p-5 flex items-center gap-4">
          <GraduationCap className="w-5 h-5 text-muted-foreground" />
          <div>
            <div className="text-3xl tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
              {filas.filter((f) => f.rutaPrincipal).length}
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Áreas con ruta activa</div>
          </div>
        </div>
        <div className="card-elevated p-5 flex items-center gap-4">
          <div className="w-5 h-5" />
          <div className="flex-1">
            <div className="text-3xl tabular-nums" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
              {avanceGlobal}%
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Avance promedio global</div>
            <PrismaProgress percent={avanceGlobal} />
          </div>
        </div>
      </div>

      <div className="card-elevated p-2 sm:p-4">
        <div className="hidden md:grid grid-cols-[1.2fr_1.4fr_0.9fr_1.6fr_1fr_0.4fr] gap-4 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground border-b border-border">
          <div>Área</div>
          <div>Ruta principal</div>
          <div>En formación</div>
          <div>Avance promedio</div>
          <div>Score IA del área</div>
          <div></div>
        </div>

        <div className="flex flex-col gap-1 mt-2">
          {filas.map((f) => (
            <button
              key={f.areaId}
              onClick={() => navigate(`/diagnostico/areas/${f.areaId}`)}
              className="grid grid-cols-1 md:grid-cols-[1.2fr_1.4fr_0.9fr_1.6fr_1fr_0.4fr] gap-4 items-center px-4 py-4 rounded-2xl text-left hover:bg-muted/40 transition-colors border border-transparent hover:border-border"
            >
              <div>
                <div className="font-semibold" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
                  {f.area}
                </div>
                <div className="text-xs text-muted-foreground">Indicadores agregados del área</div>
              </div>

              <div className="min-w-0">
                {f.rutaPrincipal ? (
                  <div>
                    <div className="text-sm truncate">{f.rutaPrincipal.nombre}</div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {f.rutaPrincipal.nivel}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">Sin ruta asignada</span>
                )}
              </div>

              <div className="text-sm tabular-nums">
                {f.enFormacion}
                {f.inactivos > 0 && (
                  <span className="text-xs text-destructive ml-2">· {f.inactivos} inactivos</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <PrismaProgress percent={f.avancePromedio} className="flex-1" />
                <span className="text-xs font-medium w-10 text-right tabular-nums">{f.avancePromedio}%</span>
              </div>

              <div>
                <span className="inline-flex items-center justify-center min-w-[52px] px-3 py-1 rounded-full border border-border bg-background text-sm tabular-nums">
                  {f.scorePromedio}
                </span>
              </div>

              <div className="flex justify-end text-muted-foreground">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
