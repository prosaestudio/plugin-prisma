// Prisma — Mock data layer (no backend)

export const empresa = {
  nombre: "Enaex",
  industria: "Minería y Explosivos",
  pais: "Chile",
  tamano: "5.000 - 10.000 colaboradores",
  // Índice de Eficiencia IA (antes "AI Maturity Score")
  indiceEficienciaIA: 62,
  aiMaturityScore: 62, // alias legado
  scoreTrend: 8,
  colaboradores: { total: 412, evaluados: 347 },
  integraciones: { activas: 3, total: 6 },
  rolesCriticos: 12,
  plan: "DIAGNOSE + HUNT",
  roiRecuperableTotalUsd: 2_400_000,
  procesosAutomatizablesTotal: 23,
  areasAdopcionNula: 3,
  areasTotal: 8,
  colaboradoresConErrores: 147,
};

export const usuarioActual = {
  nombre: "Carolina Méndez",
  cargo: "People & AI Director",
  area: "RRHH",
  email: "carolina.mendez@santander.cl",
  avatar: "CM",
  avatarUrl: "https://i.pravatar.cc/160?img=47",
  rol: "Admin" as const,
};

// ───── ÁREAS ─────
export type Area = {
  id: string;
  nombre: string;
  responsable: string;
  colaboradores: number;
  score: number;
  tendencia: number;
  herramientasActivas: number;
  herramientasTotal: number;
  rolesSugeridos: number;
  roiPerdidoUsdMes: number;
  procesosAutomatizables: number;
  colaboradoresConErrores: number;
  adopcionNula: boolean;
};

export const areas: Area[] = [
  { id: "it", nombre: "IT", responsable: "Pablo Reyes", colaboradores: 45, score: 78, tendencia: 5, herramientasActivas: 4, herramientasTotal: 5, rolesSugeridos: 1, roiPerdidoUsdMes: 4000, procesosAutomatizables: 1, colaboradoresConErrores: 3, adopcionNula: false },
  { id: "producto", nombre: "Producto", responsable: "Ana García", colaboradores: 28, score: 65, tendencia: 12, herramientasActivas: 3, herramientasTotal: 5, rolesSugeridos: 2, roiPerdidoUsdMes: 9000, procesosAutomatizables: 2, colaboradoresConErrores: 6, adopcionNula: false },
  { id: "marketing", nombre: "Marketing", responsable: "Claudia López", colaboradores: 52, score: 42, tendencia: 0, herramientasActivas: 2, herramientasTotal: 5, rolesSugeridos: 3, roiPerdidoUsdMes: 22000, procesosAutomatizables: 3, colaboradoresConErrores: 19, adopcionNula: false },
  { id: "ventas", nombre: "Ventas", responsable: "Roberto Muñoz", colaboradores: 67, score: 49, tendencia: 3, herramientasActivas: 2, herramientasTotal: 5, rolesSugeridos: 2, roiPerdidoUsdMes: 15000, procesosAutomatizables: 2, colaboradoresConErrores: 21, adopcionNula: false },
  { id: "rrhh", nombre: "RRHH", responsable: "Valentina Soto", colaboradores: 31, score: 55, tendencia: 8, herramientasActivas: 3, herramientasTotal: 5, rolesSugeridos: 1, roiPerdidoUsdMes: 18000, procesosAutomatizables: 3, colaboradoresConErrores: 8, adopcionNula: false },
  { id: "operaciones", nombre: "Operaciones", responsable: "Diego Fuentes", colaboradores: 89, score: 38, tendencia: -2, herramientasActivas: 1, herramientasTotal: 5, rolesSugeridos: 4, roiPerdidoUsdMes: 38000, procesosAutomatizables: 5, colaboradoresConErrores: 34, adopcionNula: false },
  { id: "finanzas", nombre: "Finanzas", responsable: "Isabel Torres", colaboradores: 43, score: 31, tendencia: 0, herramientasActivas: 1, herramientasTotal: 5, rolesSugeridos: 3, roiPerdidoUsdMes: 41000, procesosAutomatizables: 6, colaboradoresConErrores: 24, adopcionNula: false },
  { id: "legal", nombre: "Legal", responsable: "Marcela Vega", colaboradores: 22, score: 22, tendencia: -1, herramientasActivas: 0, herramientasTotal: 5, rolesSugeridos: 2, roiPerdidoUsdMes: 48000, procesosAutomatizables: 4, colaboradoresConErrores: 0, adopcionNula: true },
];

// ───── INTEGRACIONES ─────
export type Integracion = {
  id: string;
  nombre: string;
  proveedor: string;
  estado: "connected" | "error" | "pending" | "disconnected";
  colaboradores?: number;
  ultimaActividad?: string;
  logo?: string;
  categoria?: "IA Generativa" | "Productividad" | "Diseño" | "Comunicación";
};

const icon = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

export const integraciones: Integracion[] = [
  { id: "chatgpt", nombre: "ChatGPT", proveedor: "OpenAI", estado: "connected", colaboradores: 187, ultimaActividad: "Hace 12 min", logo: icon("openai"), categoria: "IA Generativa" },
  { id: "copilot", nombre: "Microsoft Copilot", proveedor: "Microsoft", estado: "connected", colaboradores: 203, ultimaActividad: "Hace 3 min", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Microsoft_365_Copilot_Icon.svg", categoria: "IA Generativa" },
  { id: "claude", nombre: "Claude", proveedor: "Anthropic", estado: "connected", colaboradores: 94, ultimaActividad: "Hace 1h", logo: icon("anthropic"), categoria: "IA Generativa" },
  { id: "gemini", nombre: "Gemini", proveedor: "Google", estado: "error", ultimaActividad: "Hace 2 días", logo: icon("googlegemini"), categoria: "IA Generativa" },
  { id: "notion", nombre: "Notion AI", proveedor: "Notion", estado: "pending", logo: icon("notion"), categoria: "Productividad" },
  { id: "midjourney", nombre: "Midjourney", proveedor: "Midjourney", estado: "disconnected", logo: icon("midjourney"), categoria: "Diseño" },
  { id: "word", nombre: "Microsoft Word", proveedor: "Microsoft 365", estado: "connected", colaboradores: 312, ultimaActividad: "Hace 6 min", logo: icon("microsoftword"), categoria: "Productividad" },
  { id: "excel", nombre: "Microsoft Excel", proveedor: "Microsoft 365", estado: "connected", colaboradores: 278, ultimaActividad: "Hace 9 min", logo: icon("microsoftexcel"), categoria: "Productividad" },
  { id: "powerpoint", nombre: "Microsoft PowerPoint", proveedor: "Microsoft 365", estado: "connected", colaboradores: 156, ultimaActividad: "Hace 22 min", logo: icon("microsoftpowerpoint"), categoria: "Productividad" },
  { id: "outlook", nombre: "Microsoft Outlook", proveedor: "Microsoft 365", estado: "connected", colaboradores: 341, ultimaActividad: "Hace 1 min", logo: icon("microsoftoutlook"), categoria: "Comunicación" },
  { id: "teams", nombre: "Microsoft Teams", proveedor: "Microsoft 365", estado: "connected", colaboradores: 298, ultimaActividad: "Hace 4 min", logo: icon("microsoftteams"), categoria: "Comunicación" },
  { id: "onenote", nombre: "Microsoft OneNote", proveedor: "Microsoft 365", estado: "pending", logo: icon("microsoftonenote"), categoria: "Productividad" },
  { id: "onedrive", nombre: "Microsoft OneDrive", proveedor: "Microsoft 365", estado: "connected", colaboradores: 264, ultimaActividad: "Hace 14 min", logo: icon("microsoftonedrive"), categoria: "Productividad" },
  { id: "sharepoint", nombre: "Microsoft SharePoint", proveedor: "Microsoft 365", estado: "disconnected", logo: icon("microsoftsharepoint"), categoria: "Productividad" },
];

// Catálogo de herramientas disponibles para agregar
export const herramientasCatalogo = [
  { id: "perplexity", nombre: "Perplexity", proveedor: "Perplexity AI", logo: icon("perplexity"), categoria: "IA Generativa" as const },
  { id: "cursor", nombre: "Cursor", proveedor: "Cursor", logo: icon("cursor"), categoria: "IA Generativa" as const },
  { id: "github-copilot", nombre: "GitHub Copilot", proveedor: "GitHub", logo: icon("github"), categoria: "IA Generativa" as const },
  { id: "figma", nombre: "Figma", proveedor: "Figma", logo: icon("figma"), categoria: "Diseño" as const },
  { id: "slack", nombre: "Slack", proveedor: "Slack", logo: icon("slack"), categoria: "Comunicación" as const },
  { id: "zoom", nombre: "Zoom", proveedor: "Zoom", logo: icon("zoom"), categoria: "Comunicación" as const },
  { id: "google-workspace", nombre: "Google Workspace", proveedor: "Google", logo: icon("googleworkspace"), categoria: "Productividad" as const },
  { id: "miro", nombre: "Miro", proveedor: "Miro", logo: icon("miro"), categoria: "Diseño" as const },
  { id: "linear", nombre: "Linear", proveedor: "Linear", logo: icon("linear"), categoria: "Productividad" as const },
  { id: "jira", nombre: "Jira", proveedor: "Atlassian", logo: icon("jira"), categoria: "Productividad" as const },
];

// ───── COLABORADORES ─────
export type Colaborador = {
  id: string;
  nombre: string;
  rol: string;
  area: string;
  areaId: string;
  email: string;
  avatar: string;
  score: number;
  tendencia: number;
  herramientas: string[];
  nivel: "Inicial" | "Intermedio" | "Avanzado";
};

export const colaboradores: Colaborador[] = [
  { id: "jorge-soto", nombre: "Jorge Soto", rol: "Product Manager", area: "Producto", areaId: "producto", email: "jorge.soto@santander.cl", avatar: "JS", score: 71, tendencia: 12, herramientas: ["ChatGPT", "Claude", "Copilot"], nivel: "Avanzado" },
  { id: "camila-rivas", nombre: "Camila Rivas", rol: "Content Lead", area: "Marketing", areaId: "marketing", email: "camila.rivas@santander.cl", avatar: "CR", score: 58, tendencia: 6, herramientas: ["ChatGPT", "Claude"], nivel: "Intermedio" },
  { id: "pedro-alarcon", nombre: "Pedro Alarcón", rol: "Analista Financiero", area: "Finanzas", areaId: "finanzas", email: "pedro.alarcon@santander.cl", avatar: "PA", score: 31, tendencia: -3, herramientas: ["Copilot"], nivel: "Inicial" },
  { id: "maria-fernandez", nombre: "María Fernández", rol: "HR Business Partner", area: "RRHH", areaId: "rrhh", email: "maria.fernandez@santander.cl", avatar: "MF", score: 55, tendencia: 4, herramientas: ["ChatGPT", "Copilot"], nivel: "Intermedio" },
  { id: "sebastian-cruz", nombre: "Sebastián Cruz", rol: "Abogado Senior", area: "Legal", areaId: "legal", email: "sebastian.cruz@santander.cl", avatar: "SC", score: 22, tendencia: -1, herramientas: [], nivel: "Inicial" },
  { id: "andrea-pino", nombre: "Andrea Pino", rol: "Tech Lead", area: "IT", areaId: "it", email: "andrea.pino@santander.cl", avatar: "AP", score: 91, tendencia: 7, herramientas: ["ChatGPT", "Copilot", "Claude"], nivel: "Avanzado" },
  { id: "matias-rojas", nombre: "Matías Rojas", rol: "DevOps Engineer", area: "IT", areaId: "it", email: "matias.rojas@santander.cl", avatar: "MR", score: 84, tendencia: 9, herramientas: ["ChatGPT", "Copilot"], nivel: "Avanzado" },
  { id: "valentina-mora", nombre: "Valentina Mora", rol: "Senior Copywriter", area: "Marketing", areaId: "marketing", email: "valentina.mora@santander.cl", avatar: "VM", score: 76, tendencia: 11, herramientas: ["ChatGPT", "Claude"], nivel: "Avanzado" },
  { id: "felipe-parra", nombre: "Felipe Parra", rol: "Sales Manager", area: "Ventas", areaId: "ventas", email: "felipe.parra@santander.cl", avatar: "FP", score: 47, tendencia: 2, herramientas: ["ChatGPT"], nivel: "Intermedio" },
  { id: "renata-silva", nombre: "Renata Silva", rol: "UX Designer", area: "Producto", areaId: "producto", email: "renata.silva@santander.cl", avatar: "RS", score: 68, tendencia: 14, herramientas: ["ChatGPT", "Claude"], nivel: "Intermedio" },
  { id: "tomas-bravo", nombre: "Tomás Bravo", rol: "Operations Lead", area: "Operaciones", areaId: "operaciones", email: "tomas.bravo@santander.cl", avatar: "TB", score: 41, tendencia: 1, herramientas: ["Copilot"], nivel: "Intermedio" },
  { id: "javiera-leon", nombre: "Javiera León", rol: "CFO Analyst", area: "Finanzas", areaId: "finanzas", email: "javiera.leon@santander.cl", avatar: "JL", score: 18, tendencia: -2, herramientas: [], nivel: "Inicial" },
];

export const historialScore = [
  { mes: "Nov", score: 38 },
  { mes: "Dic", score: 42 },
  { mes: "Ene", score: 51 },
  { mes: "Feb", score: 59 },
  { mes: "Mar", score: 65 },
  { mes: "Abr", score: 71 },
];

// ───── ROLES SUGERIDOS ─────
export type RolSugerido = {
  id: string;
  titulo: string;
  area: string;
  porQue: string;
  prioridad: "Alta" | "Media" | "Baja";
  gap: number;
  estado: "Abierto" | "En proceso" | "Cubierto";
  costoBrechaUsdMes: number;
};

export const rolesSugeridos: RolSugerido[] = [
  { id: "ai-pm", titulo: "AI Product Manager", area: "Producto", porQue: "Prisma detectó 2 procesos sin liderazgo técnico para integrar IA al roadmap.", prioridad: "Alta", gap: 62, estado: "Abierto", costoBrechaUsdMes: 9000 },
  { id: "prompt-eng", titulo: "Prompt Engineer", area: "Marketing", porQue: "Prompts del equipo sin estructura — baja calidad de output detectada en 19 colaboradores.", prioridad: "Alta", gap: 71, estado: "En proceso", costoBrechaUsdMes: 22000 },
  { id: "ai-data", titulo: "AI Data Analyst", area: "Finanzas", porQue: "Adopción nula en análisis financiero — 6 procesos automatizables sin implementar.", prioridad: "Alta", gap: 68, estado: "Abierto", costoBrechaUsdMes: 41000 },
  { id: "mlops", titulo: "MLOps Engineer", area: "IT", porQue: "Necesario para industrializar modelos en producción.", prioridad: "Media", gap: 41, estado: "Abierto", costoBrechaUsdMes: 4000 },
  { id: "llm-spec", titulo: "LLM Specialist", area: "IT", porQue: "Implementar fine-tuning sobre modelos propios.", prioridad: "Media", gap: 45, estado: "Abierto", costoBrechaUsdMes: 4000 },
  { id: "ai-content", titulo: "AI Content Strategist", area: "Marketing", porQue: "Escalar producción de contenido con IA generativa.", prioridad: "Media", gap: 55, estado: "En proceso", costoBrechaUsdMes: 22000 },
  { id: "ai-trainer", titulo: "AI Trainer / RLHF", area: "Producto", porQue: "Mejora continua de modelos con feedback humano.", prioridad: "Media", gap: 38, estado: "Abierto", costoBrechaUsdMes: 9000 },
  { id: "legal-ai", titulo: "Legal AI Specialist", area: "Legal", porQue: "Adopción nula — ningún miembro del equipo usa IA. 4 procesos críticos sin automatizar.", prioridad: "Alta", gap: 78, estado: "Abierto", costoBrechaUsdMes: 48000 },
  { id: "ops-ai", titulo: "AI Process Analyst", area: "Operaciones", porQue: "Prisma detectó 8 procesos manuales automatizables. Se necesita alguien que los implemente.", prioridad: "Alta", gap: 66, estado: "Abierto", costoBrechaUsdMes: 38000 },
  { id: "hr-ai", titulo: "HR AI Coordinator", area: "RRHH", porQue: "Coordinar formación y adopción interna de IA.", prioridad: "Baja", gap: 29, estado: "Cubierto", costoBrechaUsdMes: 18000 },
  { id: "sales-ai", titulo: "AI Sales Enablement", area: "Ventas", porQue: "Habilitar al equipo comercial con tooling de IA.", prioridad: "Media", gap: 44, estado: "Abierto", costoBrechaUsdMes: 15000 },
  { id: "fin-ai", titulo: "Finance AI Analyst", area: "Finanzas", porQue: "Necesidad crítica de modelos predictivos.", prioridad: "Alta", gap: 61, estado: "Abierto", costoBrechaUsdMes: 41000 },
];

// ───── ALERTAS ─────
export const alertas = [
  { area: "Legal", brecha: "Adopción de IA nula — 0 colaboradores la usan", accion: "Iniciar diagnóstico de procesos legales", prioridad: "Alta", to: "/diagnostico/areas/legal" },
  { area: "Finanzas", brecha: "Procesos de reporte manual automatizables", accion: "Implementar flujo con Copilot para reportes", prioridad: "Alta", to: "/diagnostico/integraciones" },
  { area: "Operaciones", brecha: "IA usada incorrectamente para el rol", accion: "Corregir uso en 34 colaboradores vía Agente", prioridad: "Alta", to: "/diagnostico/areas/operaciones" },
  { area: "Marketing", brecha: "Prompts sin estructura — baja calidad de output", accion: "Sesión de corrección con Agente Prisma", prioridad: "Media", to: "/upskilling/agente" },
  { area: "RRHH", brecha: "Automatización de screening disponible no usada", accion: "Activar flujo de screening con IA", prioridad: "Media", to: "/diagnostico/areas/rrhh" },
];

// ───── ACTIVIDAD ─────
export const actividades = [
  { tipo: "info", texto: "Nueva integración: Notion AI conectada", tiempo: "hace 2h" },
  { tipo: "ok", texto: "Ruta completada: Prompt Engineering — Área Producto", tiempo: "hace 4h" },
  { tipo: "warn", texto: "Candidato preseleccionado: AI Data Analyst — Área Finanzas", tiempo: "ayer" },
  { tipo: "info", texto: "Score actualizado: Área de Producto subió a 65", tiempo: "ayer" },
  { tipo: "ok", texto: "Nueva contratación confirmada: ML Engineer", tiempo: "hace 3 días" },
  { tipo: "info", texto: "Diagnóstico inicial completado para Legal", tiempo: "hace 5 días" },
];

// ───── HUNTING ─────
export type Requerimiento = {
  id: string;
  rol: string;
  area: string;
  prioridad: "Alta" | "Media" | "Baja";
  candidatos: number;
  etapa: string;
  diasAbierto: number;
  descripcion: string;
  herramientas: string[];
  experiencia: number;
  rangoSalarial: { min: number; max: number };
};

export const requerimientos: Requerimiento[] = [
  { id: "req-prompt", rol: "Prompt Engineer", area: "Marketing", prioridad: "Alta", candidatos: 12, etapa: "Entrevista técnica", diasAbierto: 18, descripcion: "Especialista en diseño y optimización de prompts para flujos de contenido.", herramientas: ["ChatGPT", "Claude"], experiencia: 3, rangoSalarial: { min: 4500, max: 7000 } },
  { id: "req-data", rol: "AI Data Analyst", area: "Finanzas", prioridad: "Alta", candidatos: 8, etapa: "Evaluación inicial", diasAbierto: 7, descripcion: "Análisis financiero apalancado en LLMs y herramientas de BI con IA.", herramientas: ["ChatGPT", "Python"], experiencia: 4, rangoSalarial: { min: 5000, max: 8000 } },
  { id: "req-pm", rol: "AI Product Manager", area: "Producto", prioridad: "Alta", candidatos: 6, etapa: "Oferta enviada", diasAbierto: 31, descripcion: "PM con foco en productos AI-first, gestión de roadmap y métricas.", herramientas: ["ChatGPT", "Claude", "Copilot"], experiencia: 6, rangoSalarial: { min: 7000, max: 11000 } },
  { id: "req-legal", rol: "Legal AI Specialist", area: "Legal", prioridad: "Alta", candidatos: 4, etapa: "Screening", diasAbierto: 5, descripcion: "Abogado/a con experiencia en aplicar IA generativa a research legal.", herramientas: ["ChatGPT", "Claude"], experiencia: 5, rangoSalarial: { min: 6000, max: 9000 } },
  { id: "req-content", rol: "AI Content Strategist", area: "Marketing", prioridad: "Media", candidatos: 4, etapa: "Evaluación inicial", diasAbierto: 12, descripcion: "Lidera la estrategia de contenidos generados con IA y su distribución.", herramientas: ["ChatGPT", "Claude"], experiencia: 5, rangoSalarial: { min: 5500, max: 8500 } },
];

export type Candidato = {
  id: string;
  nombre: string;
  avatar: string;
  rolPostula: string;
  reqId: string;
  matchScore: number;
  habilidades: { nombre: string; valor: number }[];
  rolActual: string;
  experiencia: number;
  ubicacion: string;
  diasEnEtapa: number;
  etapa: "Nuevo" | "Screening" | "Evaluación técnica" | "Entrevista" | "Oferta" | "Contratado";
  porQueMatch: string[];
};

export const etapasPipeline: Candidato["etapa"][] = ["Nuevo", "Screening", "Evaluación técnica", "Entrevista", "Oferta", "Contratado"];

export const candidatos: Candidato[] = [
  { id: "valentina-mora-c", nombre: "Valentina Mora", avatar: "VM", rolPostula: "Prompt Engineer", reqId: "req-prompt", matchScore: 92, habilidades: [{ nombre: "Prompt Engineering", valor: 94 }, { nombre: "Uso de LLMs", valor: 87 }, { nombre: "AI Content", valor: 91 }, { nombre: "MLOps", valor: 12 }, { nombre: "Data Analysis", valor: 34 }], rolActual: "Senior Copywriter en Falabella", experiencia: 6, ubicacion: "Santiago, Chile", diasEnEtapa: 4, etapa: "Entrevista", porQueMatch: ["Uso avanzado de ChatGPT demostrado en portafolio", "Experiencia en iteración de prompts para e-commerce", "Background en copywriting y storytelling de marca", "Certificación en Prompt Engineering for Marketers", "Disponibilidad inmediata"] },
  { id: "ignacio-perez", nombre: "Ignacio Pérez", avatar: "IP", rolPostula: "AI Data Analyst", reqId: "req-data", matchScore: 88, habilidades: [{ nombre: "Data Analysis", valor: 92 }, { nombre: "Python", valor: 88 }, { nombre: "Uso de LLMs", valor: 76 }, { nombre: "Prompt Engineering", valor: 64 }, { nombre: "MLOps", valor: 41 }], rolActual: "Data Analyst en Falabella Financiero", experiencia: 4, ubicacion: "Santiago, Chile", diasEnEtapa: 2, etapa: "Evaluación técnica", porQueMatch: ["Sólida experiencia en banca", "Maneja Python + LangChain"] },
  { id: "francisca-rios", nombre: "Francisca Ríos", avatar: "FR", rolPostula: "AI Product Manager", reqId: "req-pm", matchScore: 95, habilidades: [{ nombre: "Product Management", valor: 96 }, { nombre: "Uso de LLMs", valor: 89 }, { nombre: "Prompt Engineering", valor: 78 }, { nombre: "MLOps", valor: 35 }, { nombre: "Data Analysis", valor: 67 }], rolActual: "Senior PM en Mercado Libre", experiencia: 8, ubicacion: "Buenos Aires, Argentina", diasEnEtapa: 6, etapa: "Oferta", porQueMatch: ["Lideró producto AI-first en MELI", "Track record de entregas"] },
  { id: "rodrigo-castro", nombre: "Rodrigo Castro", avatar: "RC", rolPostula: "Prompt Engineer", reqId: "req-prompt", matchScore: 81, habilidades: [{ nombre: "Prompt Engineering", valor: 85 }, { nombre: "Uso de LLMs", valor: 80 }, { nombre: "AI Content", valor: 70 }], rolActual: "Content Manager en Cencosud", experiencia: 5, ubicacion: "Santiago, Chile", diasEnEtapa: 3, etapa: "Evaluación técnica", porQueMatch: ["Background en retail", "Experiencia con Claude"] },
  { id: "ana-vidal", nombre: "Ana Vidal", avatar: "AV", rolPostula: "Legal AI Specialist", reqId: "req-legal", matchScore: 86, habilidades: [{ nombre: "Legal Research", valor: 95 }, { nombre: "Uso de LLMs", valor: 75 }, { nombre: "Prompt Engineering", valor: 68 }], rolActual: "Asociada Senior en Carey", experiencia: 7, ubicacion: "Santiago, Chile", diasEnEtapa: 1, etapa: "Screening", porQueMatch: ["Especialización fintech"] },
  { id: "diego-mella", nombre: "Diego Mella", avatar: "DM", rolPostula: "AI Data Analyst", reqId: "req-data", matchScore: 79, habilidades: [{ nombre: "Data Analysis", valor: 86 }, { nombre: "Python", valor: 82 }, { nombre: "Uso de LLMs", valor: 60 }], rolActual: "BI Analyst en BCI", experiencia: 3, ubicacion: "Santiago, Chile", diasEnEtapa: 1, etapa: "Nuevo", porQueMatch: ["Dominio SQL y BI"] },
  { id: "paula-soto", nombre: "Paula Soto", avatar: "PS", rolPostula: "AI Content Strategist", reqId: "req-content", matchScore: 84, habilidades: [{ nombre: "AI Content", valor: 90 }, { nombre: "Prompt Engineering", valor: 76 }], rolActual: "Brand Manager en Ripley", experiencia: 6, ubicacion: "Santiago, Chile", diasEnEtapa: 5, etapa: "Evaluación técnica", porQueMatch: ["Experiencia liderando equipos"] },
  { id: "luis-gomez", nombre: "Luis Gómez", avatar: "LG", rolPostula: "AI Product Manager", reqId: "req-pm", matchScore: 78, habilidades: [{ nombre: "Product Management", valor: 80 }, { nombre: "Uso de LLMs", valor: 70 }], rolActual: "PM en Globant", experiencia: 5, ubicacion: "Lima, Perú", diasEnEtapa: 2, etapa: "Entrevista", porQueMatch: ["Background técnico"] },
  { id: "carla-mendez", nombre: "Carla Méndez", avatar: "CM", rolPostula: "Prompt Engineer", reqId: "req-prompt", matchScore: 83, habilidades: [{ nombre: "Prompt Engineering", valor: 88 }], rolActual: "Freelance AI Consultant", experiencia: 4, ubicacion: "Remoto", diasEnEtapa: 1, etapa: "Nuevo", porQueMatch: ["Portfolio sólido"] },
  { id: "andres-jara", nombre: "Andrés Jara", avatar: "AJ", rolPostula: "AI Data Analyst", reqId: "req-data", matchScore: 75, habilidades: [{ nombre: "Data Analysis", valor: 82 }], rolActual: "Analyst en Banco Estado", experiencia: 3, ubicacion: "Santiago, Chile", diasEnEtapa: 2, etapa: "Screening", porQueMatch: ["Conocimiento del sector"] },
  { id: "sofia-vega", nombre: "Sofía Vega", avatar: "SV", rolPostula: "AI Content Strategist", reqId: "req-content", matchScore: 80, habilidades: [{ nombre: "AI Content", valor: 85 }], rolActual: "Editor en La Tercera", experiencia: 8, ubicacion: "Santiago, Chile", diasEnEtapa: 1, etapa: "Nuevo", porQueMatch: ["Editorial fuerte"] },
  { id: "jose-pinto", nombre: "José Pinto", avatar: "JP", rolPostula: "AI Product Manager", reqId: "req-pm", matchScore: 90, habilidades: [{ nombre: "Product Management", valor: 92 }], rolActual: "Group PM en Rappi", experiencia: 9, ubicacion: "Bogotá, Colombia", diasEnEtapa: 7, etapa: "Contratado", porQueMatch: ["Historial probado en escalar productos AI"] },
  { id: "pia-castro", nombre: "Pía Castro", avatar: "PC", rolPostula: "Legal AI Specialist", reqId: "req-legal", matchScore: 72, habilidades: [{ nombre: "Legal Research", valor: 78 }], rolActual: "Asociada en Bofill Mir", experiencia: 4, ubicacion: "Santiago, Chile", diasEnEtapa: 3, etapa: "Nuevo", porQueMatch: ["Conocimiento regulatorio"] },
  { id: "manuel-lara", nombre: "Manuel Lara", avatar: "ML", rolPostula: "Prompt Engineer", reqId: "req-prompt", matchScore: 70, habilidades: [{ nombre: "Prompt Engineering", valor: 72 }], rolActual: "AI Trainer en Globant", experiencia: 2, ubicacion: "Remoto", diasEnEtapa: 4, etapa: "Screening", porQueMatch: ["Junior con potencial"] },
  { id: "elisa-perez", nombre: "Elisa Pérez", avatar: "EP", rolPostula: "AI Data Analyst", reqId: "req-data", matchScore: 86, habilidades: [{ nombre: "Data Analysis", valor: 90 }], rolActual: "Senior Analyst en Itaú", experiencia: 6, ubicacion: "Santiago, Chile", diasEnEtapa: 5, etapa: "Entrevista", porQueMatch: ["Experiencia bancaria directa"] },
  { id: "marco-bravo", nombre: "Marco Bravo", avatar: "MB", rolPostula: "AI Product Manager", reqId: "req-pm", matchScore: 73, habilidades: [{ nombre: "Product Management", valor: 75 }], rolActual: "PM en Khipu", experiencia: 4, ubicacion: "Santiago, Chile", diasEnEtapa: 6, etapa: "Oferta", porQueMatch: ["Foco en fintech"] },
  { id: "natalia-cruz", nombre: "Natalia Cruz", avatar: "NC", rolPostula: "Legal AI Specialist", reqId: "req-legal", matchScore: 68, habilidades: [{ nombre: "Legal Research", valor: 72 }], rolActual: "Abogada Junior", experiencia: 2, ubicacion: "Santiago, Chile", diasEnEtapa: 1, etapa: "Nuevo", porQueMatch: ["Aprendizaje rápido"] },
  { id: "tomas-fuentes", nombre: "Tomás Fuentes", avatar: "TF", rolPostula: "AI Content Strategist", reqId: "req-content", matchScore: 77, habilidades: [{ nombre: "AI Content", valor: 80 }], rolActual: "Marketing Lead", experiencia: 5, ubicacion: "Santiago, Chile", diasEnEtapa: 3, etapa: "Screening", porQueMatch: ["Conoce frameworks IA"] },
];

// ───── UPSKILLING ─────
export type Ruta = {
  id: string;
  nombre: string;
  area: string;
  nivel: "Básico" | "Intermedio" | "Avanzado";
  inscritos: number;
  avance: number;
  duracion: string;
  descripcion: string;
};

export const rutas: Ruta[] = [
  { id: "prompt-basico", nombre: "Prompt Engineering Básico", area: "Todas las áreas", nivel: "Básico", inscritos: 23, avance: 67, duracion: "4h", descripcion: "Fundamentos de prompts efectivos para colaboradores de cualquier área." },
  { id: "ai-pm", nombre: "AI for Product Managers", area: "Producto", nivel: "Avanzado", inscritos: 8, avance: 45, duracion: "12h", descripcion: "Cómo usar IA para descubrimiento, priorización y entrega de producto. Cubre prompt engineering aplicado, análisis de datos asistido por IA y presentación de resultados con LLMs. Pensado para PMs que quieren liderar productos AI-first." },
  { id: "ia-finanzas", nombre: "IA para Finanzas", area: "Finanzas", nivel: "Intermedio", inscritos: 12, avance: 38, duracion: "8h", descripcion: "Análisis financiero con LLMs y herramientas de BI con IA." },
  { id: "chatgpt-mkt", nombre: "ChatGPT para Marketing", area: "Marketing", nivel: "Básico", inscritos: 18, avance: 72, duracion: "6h", descripcion: "Uso productivo de ChatGPT en campañas y contenido." },
  { id: "ai-legal", nombre: "AI Legal Research", area: "Legal", nivel: "Intermedio", inscritos: 5, avance: 21, duracion: "10h", descripcion: "Research legal asistido por IA y verificación de citas." },
  { id: "mlops", nombre: "MLOps Foundations", area: "IT", nivel: "Avanzado", inscritos: 6, avance: 55, duracion: "16h", descripcion: "Despliegue, observabilidad y mantenimiento de modelos." },
  { id: "ai-sales", nombre: "AI Sales Tools", area: "Ventas", nivel: "Básico", inscritos: 14, avance: 83, duracion: "5h", descripcion: "Aprovechar herramientas de IA en el ciclo comercial." },
  { id: "hr-ai", nombre: "HR con IA", area: "RRHH", nivel: "Básico", inscritos: 9, avance: 44, duracion: "6h", descripcion: "Aplicaciones de IA en gestión de personas." },
];

export const modulosRuta = [
  { id: "m1", titulo: "Fundamentos de IA para PMs", duracion: "45 min", estado: "completed" as const },
  { id: "m2", titulo: "Prompt Engineering para product discovery", duracion: "1h 20min", estado: "completed" as const },
  { id: "m3", titulo: "Análisis de datos con IA", duracion: "2h", estado: "current" as const },
  { id: "m4", titulo: "AI en roadmapping y priorización", duracion: "1h 30min", estado: "locked" as const },
  { id: "m5", titulo: "Presentar resultados con IA", duracion: "1h", estado: "locked" as const },
  { id: "m6", titulo: "Evaluación final", duracion: "30 min", estado: "locked" as const },
];

export const mensajesAgente = [
  { id: 1, autor: "agente" as const, hora: "10:23 AM", texto: "Hola, equipo de Producto. Prisma detectó 2 situaciones en el proceso del área esta semana que vale la pena trabajar." },
  { id: 2, autor: "agente" as const, hora: "10:23 AM", texto: "La primera: cuando el área pide análisis de datos a ChatGPT, los prompts no especifican el período de tiempo ni las métricas de comparación. Esto hace que el output sea genérico y el equipo tenga que reprocesarlo manualmente.\n\n¿Quieres que practiquemos cómo corregirlo?" },
  { id: 3, autor: "user" as const, hora: "10:24 AM", texto: "Sí, practiquemos" },
  { id: 4, autor: "agente" as const, hora: "10:24 AM", texto: "Perfecto. Aquí tienes un caso real basado en el tipo de trabajo del área: hay que analizar las ventas del Q1 vs Q2. Escribe el prompt que usaría el equipo normalmente — sin preocuparte si está bien o mal." },
  { id: 5, autor: "user" as const, hora: "10:26 AM", texto: "Analiza las ventas del primer trimestre y compáralas con el segundo" },
  { id: 6, autor: "agente" as const, hora: "10:26 AM", texto: "Buen intento. Ese prompt va a generar una respuesta muy general. El problema es que ChatGPT no sabe:\n· ¿Ventas de qué producto o línea?\n· ¿En qué unidad? (USD, unidades, margen)\n· ¿Qué quieres destacar en la comparación?\n\nPrueba esta versión mejorada como base y adáptala a tu caso real:\n\n```\nActúa como analista financiero. Analiza las ventas de [producto X] del Q1 2025 vs Q2 2025 en USD.\nIdentifica: (1) variación porcentual, (2) los 3 factores que más influyeron en la diferencia,\n(3) una recomendación para Q3. Formato: resumen ejecutivo de 150 palabras.\n```" },
  { id: 7, autor: "agente" as const, hora: "10:27 AM", texto: "¿Lo ves? Mismo pedido, 10 veces más útil el output. ¿Quieres intentarlo con un dato real del área?" },
];

export const upskillingColaboradores = [
  { id: "jorge-soto", nombre: "Jorge Soto", rol: "Product Manager", area: "Producto", ruta: "AI for PMs", avance: 68, ultimoAcceso: "Hoy, 10:24 AM", inactivo: false, score: 71 },
  { id: "camila-rivas", nombre: "Camila Rivas", rol: "Marketing Lead", area: "Marketing", ruta: "ChatGPT Marketing", avance: 83, ultimoAcceso: "Hoy, 09:15 AM", inactivo: false, score: 58 },
  { id: "pedro-alarcon", nombre: "Pedro Alarcón", rol: "Finance Analyst", area: "Finanzas", ruta: "IA para Finanzas", avance: 22, ultimoAcceso: "Hace 5 días", inactivo: true, score: 31 },
  { id: "maria-fernandez", nombre: "María Fernández", rol: "HR Business Partner", area: "RRHH", ruta: "HR con IA", avance: 91, ultimoAcceso: "Ayer, 18:12", inactivo: false, score: 55 },
  { id: "sebastian-cruz", nombre: "Sebastián Cruz", rol: "Legal Counsel", area: "Legal", ruta: "AI Legal Research", avance: 15, ultimoAcceso: "Hace 8 días", inactivo: true, score: 22 },
  { id: "andrea-pino", nombre: "Andrea Pino", rol: "MLOps Engineer", area: "IT", ruta: "MLOps Foundations", avance: 76, ultimoAcceso: "Hoy, 08:40 AM", inactivo: false, score: 91 },
  { id: "felipe-parra", nombre: "Felipe Parra", rol: "Sales Executive", area: "Ventas", ruta: "AI Sales Tools", avance: 64, ultimoAcceso: "Ayer, 14:30", inactivo: false, score: 47 },
  { id: "renata-silva", nombre: "Renata Silva", rol: "Associate PM", area: "Producto", ruta: "AI for PMs", avance: 33, ultimoAcceso: "Hace 3 días", inactivo: true, score: 68 },
];

// ───── DASHBOARD CHART ─────
export const scorePorAreaChart = areas.map((a) => ({ area: a.nombre, score: a.score }));

// ───── FACTURACIÓN ─────
export const facturas = [
  { id: "INV-2025-04", fecha: "15 abr 2025", monto: 30883, estado: "Pagada" },
  { id: "INV-2025-03", fecha: "15 mar 2025", monto: 29412, estado: "Pagada" },
  { id: "INV-2025-02", fecha: "15 feb 2025", monto: 28109, estado: "Pagada" },
  { id: "INV-2025-01", fecha: "15 ene 2025", monto: 27450, estado: "Pagada" },
];

export const usuariosPlataforma = [
  { id: "u1", nombre: "Carolina Méndez", email: "carolina.mendez@santander.cl", rol: "Admin", estado: "Activo" },
  { id: "u2", nombre: "Pablo Reyes", email: "pablo.reyes@santander.cl", rol: "Manager", estado: "Activo" },
  { id: "u3", nombre: "Ana García", email: "ana.garcia@santander.cl", rol: "Manager", estado: "Activo" },
  { id: "u4", nombre: "Diego Fuentes", email: "diego.fuentes@santander.cl", rol: "Viewer", estado: "Pendiente" },
  { id: "u5", nombre: "Marcela Vega", email: "marcela.vega@santander.cl", rol: "Viewer", estado: "Activo" },
];
