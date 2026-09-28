import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "@/components/nexia/primitives";
import { AREAS, documentos, type DocStatus, type PrismaDoc, type DocType } from "@/lib/prisma-admin-mock";
import { Input } from "@/components/ui/input";
import { Search, Upload, Filter, ArrowUpRight, LayoutGrid, List, FileText, Video, ListChecks, ClipboardList, HelpCircle, MoreVertical, Clock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import previewManual from "@/assets/doc-preview-manual.jpg";
import previewVideo from "@/assets/doc-preview-video.jpg";
import previewChecklist from "@/assets/doc-preview-checklist.jpg";
import previewProcedimiento from "@/assets/doc-preview-procedimiento.jpg";
import previewFaq from "@/assets/doc-preview-faq.jpg";

const estadoStyle: Record<DocStatus, string> = {
  publicado: "text-success bg-success/10",
  indexando: "text-warning bg-warning/10",
  subido: "text-muted-foreground bg-muted",
  error: "text-destructive bg-destructive/10",
  obsoleto: "text-muted-foreground bg-muted line-through decoration-1",
  borrador: "text-muted-foreground bg-muted",
  revision: "text-warning bg-warning/10",
};

const critColor = { Alta: "bg-destructive", Media: "bg-warning", Baja: "bg-muted-foreground/50" };

const tipoIcon: Record<DocType, React.ComponentType<{ className?: string }>> = {
  manual: FileText,
  video: Video,
  checklist: ListChecks,
  procedimiento: ClipboardList,
  faq: HelpCircle,
};

const tipoPreview: Record<DocType, string> = {
  manual: previewManual,
  video: previewVideo,
  checklist: previewChecklist,
  procedimiento: previewProcedimiento,
  faq: previewFaq,
};

const tipoLabel: Record<DocType, string> = {
  manual: "PDF",
  video: "MP4",
  checklist: "LIST",
  procedimiento: "SOP",
  faq: "FAQ",
};

function DocThumb({ doc, size = "md" }: { doc: PrismaDoc; size?: "sm" | "md" }) {
  const Icon = tipoIcon[doc.tipo];
  const preview = tipoPreview[doc.tipo];
  const isVideo = doc.tipo === "video";
  const heights = { sm: "h-24", md: "h-36" };
  return (
    <div className={cn("relative w-full rounded-lg overflow-hidden bg-muted border border-border", heights[size])}>
      <img
        src={preview}
        alt={doc.titulo}
        loading="lazy"
        className={cn(
          "absolute inset-0 w-full h-full",
          isVideo ? "object-cover" : "object-cover object-top"
        )}
      />
      {/* subtle top gradient so labels stay readable */}
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </div>
        </div>
      )}
      {/* type badge */}
      <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 bg-black/75 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
        <Icon className="w-3 h-3" />
        {tipoLabel[doc.tipo]}
      </div>
      {doc.criticidad === "Alta" && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive ring-2 ring-white/70" title="Criticidad alta" />
      )}
    </div>
  );
}

export default function DocsLibrary() {
  const [q, setQ] = useState("");
  const [area, setArea] = useState<string>("todas");
  const [estado, setEstado] = useState<string>("todos");
  const [tipo, setTipo] = useState<string>("todos");
  const [view, setView] = useState<"grid" | "list">("grid");

  const rows = useMemo(() => {
    const nq = q.toLowerCase();
    return documentos.filter((d) => {
      if (area !== "todas" && d.area !== area) return false;
      if (estado !== "todos" && d.estado !== estado) return false;
      if (tipo !== "todos" && d.tipo !== tipo) return false;
      if (nq && !(`${d.titulo} ${d.proceso} ${d.maquina ?? ""}`.toLowerCase().includes(nq))) return false;
      return true;
    });
  }, [q, area, estado, tipo]);

  const recientes = useMemo(
    () => [...documentos].sort((a, b) => b.actualizado.localeCompare(a.actualizado)).slice(0, 4),
    []
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Biblioteca documental"
        subtitle="Todos los documentos que alimentan al agente Prisma. Filtra por área, proceso, tipo o estado."
        action={
          <Link
            to="/docs/upload"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90"
          >
            <Upload className="w-4 h-4" /> Cargar documentos
          </Link>
        }
      />

      {/* Recientes / rápido acceso */}
      {q === "" && area === "todas" && estado === "todos" && tipo === "todos" && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Recientes</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recientes.map((d) => (
              <Link key={d.id} to={`/docs/${d.id}`} className="card-elevated p-3 hover:bg-muted/30 transition-colors group">
                <DocThumb doc={d} size="sm" />
                <div className="mt-2 min-w-0">
                  <div className="text-sm font-medium truncate">{d.titulo}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{d.area} · {d.version}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Filtros + toggle vista */}
      <div className="card-elevated p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, proceso o máquina…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="todas">Todas las áreas</option>
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="todos">Todos los tipos</option>
            <option value="manual">Manual</option>
            <option value="video">Video</option>
            <option value="checklist">Checklist</option>
            <option value="procedimiento">Procedimiento</option>
            <option value="faq">FAQ</option>
          </select>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="todos">Todos los estados</option>
            <option value="publicado">Publicado</option>
            <option value="indexando">Indexando</option>
            <option value="revision">En revisión</option>
            <option value="borrador">Borrador</option>
            <option value="error">Error</option>
            <option value="obsoleto">Obsoleto</option>
          </select>
        </div>
        <div className="text-xs text-muted-foreground ml-auto">{rows.length} de {documentos.length}</div>
        <div className="inline-flex items-center rounded-xl border border-border bg-background p-1">
          <button
            onClick={() => setView("grid")}
            className={cn("p-1.5 rounded-lg transition-colors", view === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}
            title="Vista cuadrícula"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("p-1.5 rounded-lg transition-colors", view === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}
            title="Vista lista"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid vista Drive */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {rows.map((d) => (
            <Link
              key={d.id}
              to={`/docs/${d.id}`}
              className="card-elevated p-3 hover:bg-muted/30 transition-colors group relative"
            >
              <DocThumb doc={d} />
              <div className="mt-3 flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium leading-tight line-clamp-2">{d.titulo}</div>
                  <div className="text-[11px] text-muted-foreground mt-1 truncate">{d.area} · {d.proceso}</div>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); }}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground shrink-0"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px]">
                <span className={cn("font-medium px-1.5 py-0.5 rounded capitalize", estadoStyle[d.estado])}>{d.estado}</span>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <span className={cn("w-1.5 h-1.5 rounded-full", critColor[d.criticidad])} />
                    {d.criticidad}
                  </span>
                  <span>·</span>
                  <span>{d.usos30d} usos</span>
                </div>
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground truncate">
                {d.version} · actualizado {d.actualizado}
              </div>
            </Link>
          ))}
          {rows.length === 0 && (
            <div className="col-span-full text-center text-sm text-muted-foreground py-12">
              Sin documentos con estos filtros.
            </div>
          )}
        </div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
                <th className="py-3 px-4 font-medium">Documento</th>
                <th className="py-3 px-4 font-medium">Área · Proceso</th>
                <th className="py-3 px-4 font-medium">Tipo</th>
                <th className="py-3 px-4 font-medium">Crit.</th>
                <th className="py-3 px-4 font-medium">Estado</th>
                <th className="py-3 px-4 font-medium">Versión</th>
                <th className="py-3 px-4 font-medium">Próx. revisión</th>
                <th className="py-3 px-4 font-medium text-right">Usos 30d</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d: PrismaDoc) => (
                <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden shrink-0 border border-border">
                        <img src={tipoPreview[d.tipo]} alt="" loading="lazy" className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate">{d.titulo}</div>
                        <div className="text-xs text-muted-foreground truncate">{d.autor} · {d.idioma}{d.maquina ? ` · ${d.maquina}` : ""}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{d.area}<div className="text-xs">{d.proceso}</div></td>
                  <td className="py-3 px-4 capitalize">{d.tipo}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className={cn("w-2 h-2 rounded-full", critColor[d.criticidad])} />
                      {d.criticidad}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn("text-xs font-medium px-2 py-1 rounded-lg capitalize", estadoStyle[d.estado])}>{d.estado}</span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{d.version}</td>
                  <td className="py-3 px-4 text-muted-foreground">{d.proximaRevision}</td>
                  <td className="py-3 px-4 text-right font-medium">{d.usos30d}</td>
                  <td className="py-3 px-4 text-right">
                    <Link to={`/docs/${d.id}`} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      Abrir <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
