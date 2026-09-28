import { useState } from "react";
import { Search, FileText, Video, Music2, BookOpen, ExternalLink, Sparkles, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ContentType = "paper" | "video" | "tiktok" | "articulo" | "curso";

type CuratedItem = {
  id: string;
  tipo: ContentType;
  titulo: string;
  fuente: string;
  duracion?: string;
  skill: string;
  url: string;
  thumb?: string;
};

const ALL_CONTENT: CuratedItem[] = [
  { id: "1", tipo: "paper", titulo: "Chain-of-Thought Prompting Elicits Reasoning in LLMs", fuente: "arXiv · Wei et al. 2022", duracion: "12 min lectura", skill: "Prompt engineering avanzado", url: "https://arxiv.org/abs/2201.11903" },
  { id: "2", tipo: "video", titulo: "Cómo analizar datasets reales con ChatGPT + Code Interpreter", fuente: "YouTube · DataCamp", duracion: "8:42", skill: "Análisis de datos con IA", url: "#", thumb: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600" },
  { id: "3", tipo: "tiktok", titulo: "3 prompts que cambian cómo analizas feedback de usuarios", fuente: "@aiproductlab", duracion: "0:58", skill: "Análisis de datos con IA", url: "#", thumb: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400" },
  { id: "4", tipo: "paper", titulo: "ReAct: Synergizing Reasoning and Acting in Language Models", fuente: "ICLR 2023", duracion: "18 min lectura", skill: "Automatización con agentes", url: "https://arxiv.org/abs/2210.03629" },
  { id: "5", tipo: "video", titulo: "Construye tu primer agente autónomo en 10 minutos", fuente: "YouTube · LangChain", duracion: "11:20", skill: "Automatización con agentes", url: "#", thumb: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600" },
  { id: "6", tipo: "articulo", titulo: "Cómo evaluar la calidad de outputs de un LLM (rúbricas y métricas)", fuente: "Anthropic Blog", duracion: "9 min lectura", skill: "Evaluación de outputs LLM", url: "#" },
  { id: "7", tipo: "tiktok", titulo: "El error #1 al evaluar respuestas de IA", fuente: "@promptqueen", duracion: "0:42", skill: "Evaluación de outputs LLM", url: "#", thumb: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400" },
  { id: "8", tipo: "curso", titulo: "Prompt Engineering for Developers (DeepLearning.AI)", fuente: "Andrew Ng · Isa Fulford", duracion: "1h 30m", skill: "Prompt engineering avanzado", url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/" },
  { id: "9", tipo: "video", titulo: "5 técnicas avanzadas de prompting que sí funcionan", fuente: "YouTube · AI Explained", duracion: "14:05", skill: "Prompt engineering avanzado", url: "#", thumb: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600" },
  { id: "10", tipo: "paper", titulo: "A Survey on Evaluation of Large Language Models", fuente: "ACM Computing Surveys 2024", duracion: "25 min lectura", skill: "Evaluación de outputs LLM", url: "#" },
  { id: "11", tipo: "tiktok", titulo: "Pega esto en ChatGPT para limpiar tu Excel en 5 segundos", fuente: "@aitools.daily", duracion: "0:35", skill: "Análisis de datos con IA", url: "#", thumb: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400" },
  { id: "12", tipo: "articulo", titulo: "Diseñando workflows multi-agente para ops y back-office", fuente: "Towards Data Science", duracion: "11 min lectura", skill: "Automatización con agentes", url: "#" },
  { id: "13", tipo: "tiktok", titulo: "Esta función de Claude nadie la usa (y es oro)", fuente: "@ai.shorts", duracion: "0:48", skill: "Prompt engineering avanzado", url: "#", thumb: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400" },
  { id: "14", tipo: "video", titulo: "Evaluando agentes con LangSmith de punta a punta", fuente: "YouTube · LangChain", duracion: "22:10", skill: "Automatización con agentes", url: "#", thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600" },
  { id: "15", tipo: "tiktok", titulo: "El prompt que uso para resumir reuniones largas", fuente: "@productivity.ai", duracion: "0:52", skill: "Prompt engineering avanzado", url: "#", thumb: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400" },
];

const TIPO_META: Record<ContentType, { label: string; icon: typeof FileText; color: string; chipBg: string }> = {
  paper: { label: "Paper", icon: FileText, color: "text-blue-600 dark:text-blue-400", chipBg: "bg-blue-500/10" },
  video: { label: "Video", icon: Video, color: "text-red-600 dark:text-red-400", chipBg: "bg-red-500/10" },
  tiktok: { label: "TikTok", icon: Music2, color: "text-pink-600 dark:text-pink-400", chipBg: "bg-pink-500/10" },
  articulo: { label: "Artículo", icon: BookOpen, color: "text-amber-600 dark:text-amber-400", chipBg: "bg-amber-500/10" },
  curso: { label: "Curso", icon: Sparkles, color: "text-emerald-600 dark:text-emerald-400", chipBg: "bg-emerald-500/10" },
};

const FILTROS: { key: "all" | ContentType; label: string }[] = [
  { key: "all", label: "Todo" },
  { key: "paper", label: "Papers" },
  { key: "video", label: "Videos" },
  { key: "tiktok", label: "TikToks" },
  { key: "articulo", label: "Artículos" },
  { key: "curso", label: "Cursos" },
];

function CarouselRow({ title, subtitle, children, accent }: { title: string; subtitle?: string; children: React.ReactNode; accent?: string }) {
  const scrollRef = (dir: "l" | "r") => (e: React.MouseEvent) => {
    const container = (e.currentTarget.closest(".carousel-row") as HTMLElement)?.querySelector(".carousel-scroll") as HTMLElement | null;
    if (!container) return;
    container.scrollBy({ left: dir === "r" ? container.clientWidth * 0.7 : -container.clientWidth * 0.7, behavior: "smooth" });
  };
  return (
    <div className="carousel-row space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h4 className="text-sm font-medium tracking-tight flex items-center gap-2">
            <span className={cn("inline-block w-1.5 h-1.5 rounded-full", accent)} />
            {title}
          </h4>
          {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex gap-1">
          <button onClick={scrollRef("l")} className="w-8 h-8 rounded-full border border-border hover:bg-muted flex items-center justify-center transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={scrollRef("r")} className="w-8 h-8 rounded-full border border-border hover:bg-muted flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="carousel-scroll flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-1 px-1">
        {children}
      </div>
    </div>
  );
}

function TikTokCard({ item }: { item: CuratedItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative shrink-0 w-[180px] aspect-[9/16] rounded-2xl overflow-hidden snap-start bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-border"
    >
      {item.thumb && (
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${item.thumb})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
        <Music2 className="w-3 h-3 text-white" />
        <span className="text-[10px] font-medium text-white">{item.duracion}</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
          <Play className="w-5 h-5 text-black fill-black ml-0.5" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <div className="text-xs font-medium leading-snug line-clamp-3 mb-1.5">{item.titulo}</div>
        <div className="text-[10px] opacity-80">{item.fuente}</div>
      </div>
    </a>
  );
}

function VideoCard({ item }: { item: CuratedItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group shrink-0 w-[300px] snap-start space-y-2"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border">
        {item.thumb && (
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url(${item.thumb})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
          {item.duracion}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
          </div>
        </div>
      </div>
      <div className="px-1">
        <div className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-foreground">{item.titulo}</div>
        <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
          <span>{item.fuente}</span>
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5 truncate">→ {item.skill}</div>
      </div>
    </a>
  );
}

function TextCard({ item }: { item: CuratedItem }) {
  const meta = TIPO_META[item.tipo];
  const Icon = meta.icon;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-3 p-3.5 rounded-xl border border-border hover:bg-muted/40 hover:border-foreground/20 transition-all"
    >
      <div className={cn("w-12 h-12 rounded-lg shrink-0 flex items-center justify-center", meta.chipBg, meta.color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", meta.chipBg, meta.color)}>
            {meta.label}
          </span>
          {item.duracion && <span className="text-[10px] text-muted-foreground">{item.duracion}</span>}
        </div>
        <div className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-foreground">
          {item.titulo}
        </div>
        <div className="flex items-center justify-between mt-1.5 gap-2">
          <div className="text-[11px] text-muted-foreground truncate">{item.fuente}</div>
          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
        <div className="text-[10px] text-muted-foreground mt-1 truncate">
          → Refuerza: <span className="text-foreground/80">{item.skill}</span>
        </div>
      </div>
    </a>
  );
}

export default function CuratedContentFeed() {
  const [query, setQuery] = useState("");
  const [filtro, setFiltro] = useState<"all" | ContentType>("all");

  const items = ALL_CONTENT.filter(
    (i) =>
      (filtro === "all" || i.tipo === filtro) &&
      (query.trim() === "" ||
        i.titulo.toLowerCase().includes(query.toLowerCase()) ||
        i.skill.toLowerCase().includes(query.toLowerCase()) ||
        i.fuente.toLowerCase().includes(query.toLowerCase())),
  );

  const tiktoks = items.filter((i) => i.tipo === "tiktok");
  const videos = items.filter((i) => i.tipo === "video");
  const textuales = items.filter((i) => i.tipo === "paper" || i.tipo === "articulo" || i.tipo === "curso");

  return (
    <div className="card-elevated p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Contenido curado para ti
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Papers, videos, TikToks y cursos seleccionados según tus debilidades detectadas
          </p>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca por skill, tema o fuente — ej. 'prompt engineering', 'agentes'..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full border transition-colors",
              filtro === f.key
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground">
          Sin resultados para "{query}".
        </div>
      ) : (
        <div className="space-y-7">
          {/* TikToks carousel */}
          {tiktoks.length > 0 && (
            <CarouselRow
              title="TikToks · píldoras de 1 minuto"
              subtitle="Tips rápidos y trucos accionables"
              accent="bg-pink-500"
            >
              {tiktoks.map((it) => (
                <TikTokCard key={it.id} item={it} />
              ))}
            </CarouselRow>
          )}

          {/* Videos carousel */}
          {videos.length > 0 && (
            <CarouselRow
              title="Videos · tutoriales y deep dives"
              subtitle="Explicaciones a fondo y demos en vivo"
              accent="bg-red-500"
            >
              {videos.map((it) => (
                <VideoCard key={it.id} item={it} />
              ))}
            </CarouselRow>
          )}

          {/* Contenido escrito · grid */}
          {textuales.length > 0 && (
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium tracking-tight flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Lectura · papers, artículos y cursos
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Para cuando quieras profundizar con tiempo
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {textuales.map((it) => (
                  <TextCard key={it.id} item={it} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
