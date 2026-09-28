import { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, ArrowRight, Users, Briefcase, Layers, Plug, UserSearch, Route, LayoutDashboard, FileSearch, Settings, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarFor, initialsFromName } from "@/lib/avatar";
import { useNavigate } from "react-router-dom";
import {
  areas,
  colaboradores,
  candidatos,
  integraciones,
  rutas,
  rolesSugeridos,
  requerimientos,
} from "@/lib/nexia-mock";

type ResultType = "area" | "colaborador" | "candidato" | "integracion" | "ruta" | "rol" | "modulo" | "requerimiento";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: ResultType;
  to: string;
  thumb?: string; // image url (logo / avatar)
  gradient?: string; // tailwind gradient classes for visual block
  icon?: typeof Users;
  initials?: string;
}

const typeMeta: Record<ResultType, { label: string; icon: typeof Users }> = {
  area: { label: "Área", icon: Layers },
  colaborador: { label: "Colaborador", icon: Users },
  candidato: { label: "Candidato", icon: UserSearch },
  integracion: { label: "Integración", icon: Plug },
  ruta: { label: "Ruta", icon: Route },
  rol: { label: "Rol sugerido", icon: Briefcase },
  modulo: { label: "Módulo", icon: LayoutDashboard },
  requerimiento: { label: "Requerimiento", icon: FileSearch },
};

// Soft, distinct gradients per module / category
const moduleGradients: Record<string, string> = {
  "m-dashboard": "from-sky-200 via-indigo-200 to-violet-200",
  "m-diagnostico": "from-emerald-200 via-teal-200 to-cyan-200",
  "m-hunting": "from-amber-200 via-orange-200 to-rose-200",
  "m-upskilling": "from-fuchsia-200 via-pink-200 to-rose-200",
  "m-agente": "from-violet-300 via-indigo-200 to-sky-200",
  "m-config": "from-slate-200 via-stone-200 to-neutral-200",
};

const moduleIcons: Record<string, typeof Users> = {
  "m-dashboard": LayoutDashboard,
  "m-diagnostico": Layers,
  "m-hunting": UserSearch,
  "m-upskilling": Route,
  "m-agente": Sparkles,
  "m-config": Settings,
};

// Per-module miniature screenshots — zoomed-in fragment with fade
function ModuleMockup({ id }: { id: string }) {
  const common = "absolute inset-0 origin-top-left scale-[1.35] -translate-x-2 -translate-y-1";
  if (id === "m-dashboard") {
    return (
      <div className={common}>
        <div className="p-2 space-y-1.5">
          <div className="flex gap-1.5">
            {[0,1,2,3].map(i => (
              <div key={i} className="flex-1 h-10 rounded-md bg-white/70 border border-white/80 p-1">
                <div className="h-1 w-6 rounded bg-foreground/30 mb-1" />
                <div className="h-2 w-8 rounded bg-foreground/70" />
              </div>
            ))}
          </div>
          <div className="h-20 rounded-md bg-white/70 border border-white/80 p-1.5 flex items-end gap-1">
            {[40,65,30,80,55,70,45,90,60,75].map((h,i) => (
              <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-violet-400 to-sky-300" style={{height: `${h}%`}} />
            ))}
          </div>
          <div className="h-12 rounded-md bg-white/70 border border-white/80" />
        </div>
      </div>
    );
  }
  if (id === "m-diagnostico") {
    return (
      <div className={common}>
        <div className="p-2 grid grid-cols-3 gap-1.5">
          {Array.from({length: 9}).map((_,i) => (
            <div key={i} className="aspect-square rounded-md bg-white/70 border border-white/80 p-1 flex flex-col justify-between">
              <div className="h-1 w-4 rounded bg-foreground/40" />
              <div className={`h-1.5 rounded ${["bg-emerald-400","bg-amber-400","bg-rose-400"][i%3]}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (id === "m-hunting") {
    return (
      <div className={common}>
        <div className="p-2 flex gap-1.5 h-full">
          {[3,2,4].map((n,c) => (
            <div key={c} className="flex-1 space-y-1">
              <div className="h-2 rounded bg-white/80" />
              {Array.from({length:n}).map((_,i) => (
                <div key={i} className="h-8 rounded-md bg-white/70 border border-white/80 p-1">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-300 to-rose-400" />
                    <div className="h-1 flex-1 rounded bg-foreground/30" />
                  </div>
                  <div className="h-1 w-8 rounded bg-foreground/20 mt-1" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (id === "m-upskilling") {
    return (
      <div className={common}>
        <div className="p-2 space-y-1.5">
          {[80,55,35,70].map((p,i) => (
            <div key={i} className="rounded-md bg-white/70 border border-white/80 p-1.5">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-fuchsia-300 to-pink-400" />
                <div className="h-1.5 flex-1 rounded bg-foreground/40" />
              </div>
              <div className="h-1 rounded-full bg-foreground/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-400" style={{width: `${p}%`}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (id === "m-agente") {
    return (
      <div className={common}>
        <div className="p-2 space-y-1.5">
          <div className="flex justify-center py-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 via-sky-300 to-emerald-300 blur-[1px]" />
          </div>
          {[
            { me:false, w:"85%" },
            { me:true,  w:"60%" },
            { me:false, w:"70%" },
            { me:true,  w:"45%" },
          ].map((m,i) => (
            <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
              <div className={`h-3 rounded-md ${m.me ? "bg-foreground/80" : "bg-white/80 border border-white/80"}`} style={{width: m.w}} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (id === "m-config") {
    return (
      <div className={common}>
        <div className="p-2 flex gap-1.5 h-full">
          <div className="w-1/3 space-y-1">
            {Array.from({length:5}).map((_,i)=>(
              <div key={i} className={`h-3 rounded ${i===1?"bg-foreground/70":"bg-white/70 border border-white/80"}`} />
            ))}
          </div>
          <div className="flex-1 space-y-1">
            <div className="h-3 rounded bg-white/80" />
            <div className="h-2 w-3/4 rounded bg-white/70" />
            <div className="h-2 w-1/2 rounded bg-white/70" />
            <div className="h-6 rounded-md bg-white/70 border border-white/80 mt-1" />
            <div className="h-6 rounded-md bg-white/70 border border-white/80" />
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// Extended description shown in the side preview panel
const modulePreview: Record<string, { description: string; features: string[] }> = {
  "m-dashboard": {
    description: "Tu panel ejecutivo. Visualiza el AI Maturity Score, evolución mensual, integraciones activas y alertas críticas en un solo lugar.",
    features: ["AI Maturity Score", "Radar de adopción", "Alertas y acciones", "Integraciones activas"],
  },
  "m-diagnostico": {
    description: "Mide la madurez IA de tu organización por área, colaborador e integración. Identifica brechas y oportunidades antes de actuar.",
    features: ["Score por área", "Mapa de colaboradores", "Roles críticos", "Integraciones SaaS"],
  },
  "m-hunting": {
    description: "Encuentra y evalúa talento AI-ready. Gestiona requerimientos, screening de candidatos y matching automático con tus roles abiertos.",
    features: ["Requerimientos abiertos", "Kanban de candidatos", "Match score IA", "Pipeline visual"],
  },
  "m-upskilling": {
    description: "Activa rutas formativas personalizadas. El agente Prisma adapta el contenido a cada colaborador según su rol y nivel actual.",
    features: ["Rutas personalizadas", "Agente Prisma", "Progreso en tiempo real", "Microlearning"],
  },
  "m-agente": {
    description: "Asistente conversacional que observa tu trabajo, detecta oportunidades de upskilling y te guía en cada paso de tu ruta.",
    features: ["Contexto observado", "Objetivos de sesión", "Quick actions", "Práctica de prompts"],
  },
  "m-config": {
    description: "Ajusta la identidad de tu empresa, gestiona usuarios, integraciones, branding y permisos del workspace.",
    features: ["Datos de empresa", "Usuarios y roles", "Branding", "Integraciones"],
  },
};

const modulos: SearchResult[] = [
  { id: "m-dashboard", title: "Dashboard", subtitle: "Resumen ejecutivo de madurez IA", type: "modulo", to: "/dashboard" },
  { id: "m-diagnostico", title: "Módulo 01 — Diagnóstico", subtitle: "Score, áreas, colaboradores, integraciones", type: "modulo", to: "/diagnostico" },
  { id: "m-hunting", title: "Módulo 02 — Hunting", subtitle: "Requerimientos y candidatos AI", type: "modulo", to: "/hunting" },
  { id: "m-upskilling", title: "Módulo 03 — Upskilling", subtitle: "Rutas formativas y agente IA", type: "modulo", to: "/upskilling" },
  { id: "m-agente", title: "Agente Prisma", subtitle: "Asistente conversacional de aprendizaje", type: "modulo", to: "/upskilling/agente" },
  { id: "m-config", title: "Configuración", subtitle: "Ajustes de cuenta y empresa", type: "modulo", to: "/configuracion" },
].map((m) => ({ ...m, type: "modulo" as const, gradient: moduleGradients[m.id], icon: moduleIcons[m.id] }));

// Stable gradient for any string id
const gradientPool = [
  "from-rose-200 via-pink-200 to-fuchsia-200",
  "from-amber-200 via-orange-200 to-red-200",
  "from-emerald-200 via-green-200 to-teal-200",
  "from-sky-200 via-cyan-200 to-blue-200",
  "from-violet-200 via-purple-200 to-indigo-200",
  "from-yellow-200 via-amber-200 to-orange-200",
  "from-lime-200 via-emerald-200 to-cyan-200",
  "from-fuchsia-200 via-violet-200 to-blue-200",
];
const pickGradient = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return gradientPool[h % gradientPool.length];
};


export function NexiaSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<SearchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const index = useMemo<SearchResult[]>(() => {
    return [
      ...modulos,
      ...areas.map((a) => ({
        id: a.id, title: a.nombre, subtitle: `${a.colaboradores} colaboradores · score ${a.score}`,
        type: "area" as const, to: `/diagnostico/areas/${a.id}`,
        gradient: pickGradient(a.id), initials: initialsFromName(a.nombre),
      })),
      ...colaboradores.map((c) => ({
        id: c.id, title: c.nombre, subtitle: `${c.rol} · ${c.area}`,
        type: "colaborador" as const, to: `/diagnostico/colaboradores/${c.id}`,
        thumb: avatarFor(c.id), initials: c.avatar,
      })),
      ...candidatos.map((c) => ({
        id: c.id, title: c.nombre, subtitle: `${c.rolPostula} · ${c.etapa} · match ${c.matchScore}`,
        type: "candidato" as const, to: `/hunting/candidatos/${c.id}`,
        thumb: avatarFor(c.id), initials: c.avatar,
      })),
      ...requerimientos.map((r) => ({
        id: r.id, title: r.rol, subtitle: `${r.area} · ${r.candidatos} candidatos · ${r.etapa}`,
        type: "requerimiento" as const, to: `/hunting/requerimientos`,
        gradient: pickGradient(r.id),
      })),
      ...integraciones.map((i) => ({
        id: i.id, title: i.nombre, subtitle: `${i.proveedor} · ${i.estado}`,
        type: "integracion" as const, to: `/diagnostico/integraciones`,
        thumb: i.logo,
      })),
      ...rutas.map((r) => ({
        id: r.id, title: r.nombre, subtitle: `${r.area} · ${r.duracion} · ${r.nivel}`,
        type: "ruta" as const, to: `/upskilling/rutas/${r.id}`,
        gradient: pickGradient(r.id), initials: initialsFromName(r.nombre),
      })),
      ...rolesSugeridos.map((r) => ({
        id: r.id, title: r.titulo, subtitle: `${r.area} · ${r.prioridad}`,
        type: "rol" as const, to: `/diagnostico/roles`,
        gradient: pickGradient(r.id),
      })),
    ];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .filter((r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query, index]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSelect = (item: SearchResult) => {
    setOpen(false);
    navigate(item.to);
  };

  return (
    <div ref={containerRef} className="hidden sm:block relative z-40">
      <motion.div
        animate={{ width: open ? 480 : 240 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative"
      >
        <div
          className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200 ${
            open ? "bg-background border border-border shadow-lg" : "bg-muted hover:bg-accent cursor-pointer"
          }`}
          onClick={() => !open && setOpen(true)}
        >
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          {open ? (
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar áreas, colaboradores, candidatos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
          ) : (
            <span className="text-sm text-muted-foreground flex-1">Buscar...</span>
          )}
          {open ? (
            <button onClick={(e) => { e.stopPropagation(); setOpen(false); }} className="p-0.5 rounded hover:bg-muted text-muted-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="ml-auto text-[10px] bg-background px-1.5 py-0.5 rounded border border-border font-mono text-muted-foreground">⌘K</kbd>
          )}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{ transformOrigin: "top" }}
              className="absolute top-full left-0 mt-1 bg-background rounded-xl border border-border shadow-2xl overflow-hidden flex"
            >
              {/* Results list */}
              <div className="w-[480px] max-h-[60vh] overflow-y-auto" onMouseLeave={() => setHovered(null)}>
                {!query && (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Escribe para buscar en toda la plataforma
                  </div>
                )}
                {query && results.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No se encontraron resultados para "{query}"
                  </div>
                )}
                {results.length > 0 && (
                  <div className="py-1.5">
                    {results.map((item) => {
                      const Icon = item.icon ?? typeMeta[item.type].icon;
                      const isPerson = item.type === "colaborador" || item.type === "candidato";
                      const isLogo = item.type === "integracion" && item.thumb;
                      const isCover = item.type === "modulo" || item.type === "ruta" || item.type === "area" || item.type === "rol" || item.type === "requerimiento";

                      return (
                        <button
                          key={`${item.type}-${item.id}`}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => item.type === "modulo" && setHovered(item)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors text-left group"
                        >
                          {isPerson ? (
                            <Avatar className="h-12 w-12 shrink-0 ring-1 ring-border">
                              <AvatarImage src={item.thumb} alt={item.title} className="object-cover" />
                              <AvatarFallback className="bg-muted text-foreground text-xs">{item.initials ?? initialsFromName(item.title)}</AvatarFallback>
                            </Avatar>
                          ) : isLogo ? (
                            <div className="w-12 h-12 rounded-lg bg-white border border-border flex items-center justify-center shrink-0 overflow-hidden">
                              <img src={item.thumb} alt={item.title} className="w-7 h-7 object-contain" loading="lazy" />
                            </div>
                          ) : isCover ? (
                            <div className={`w-16 h-12 rounded-lg shrink-0 relative overflow-hidden bg-gradient-to-br ${item.gradient ?? "from-muted to-background"} flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-foreground/70 absolute top-1.5 left-1.5" />
                              {item.initials && (
                                <span className="text-foreground/80 font-semibold text-sm tracking-tight">{item.initials}</span>
                              )}
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                          </div>
                          <span className="text-[10px] uppercase tracking-wide text-muted-foreground shrink-0">
                            {typeMeta[item.type].label}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Module preview pane */}
              <AnimatePresence>
                {hovered && hovered.type === "modulo" && modulePreview[hovered.id] && (
                  <motion.div
                    key={hovered.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-[300px] border-l border-border bg-muted/20 p-4 flex flex-col gap-3"
                  >
                    {/* Big thumb — zoomed-in fragment of the module with fade */}
                    <div className={`relative h-40 rounded-xl overflow-hidden bg-gradient-to-br ${hovered.gradient ?? "from-muted to-background"} ring-1 ring-border/60`}>
                      <ModuleMockup id={hovered.id} />
                      {/* Fade overlays to suggest "extracto" */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-background/90 via-background/0 to-transparent pointer-events-none" />
                      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                      <span className="absolute top-2 left-2 text-[9px] uppercase tracking-[0.18em] text-foreground/70 bg-background/70 backdrop-blur px-1.5 py-0.5 rounded z-10">
                        {typeMeta.modulo.label}
                      </span>
                      {(() => {
                        const Icon = hovered.icon ?? LayoutDashboard;
                        return (
                          <div className="absolute bottom-2 right-2 w-7 h-7 rounded-md bg-background/80 backdrop-blur flex items-center justify-center z-10">
                            <Icon className="w-3.5 h-3.5 text-foreground/80" strokeWidth={1.6} />
                          </div>
                        );
                      })()}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold leading-tight">{hovered.title}</h4>
                      <p className="text-xs text-muted-foreground leading-snug mt-1.5">
                        {modulePreview[hovered.id].description}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">Incluye</div>
                      <ul className="space-y-1">
                        {modulePreview[hovered.id].features.map((f) => (
                          <li key={f} className="text-xs flex items-start gap-1.5">
                            <span className="mt-1 w-1 h-1 rounded-full bg-foreground/60 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSelect(hovered)}
                      className="mt-auto w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-foreground text-background text-xs font-medium hover:opacity-90"
                    >
                      Abrir módulo <ArrowRight className="w-3 h-3" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 -z-10"
            style={{ zIndex: -1 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
