// ────────────────────────────────────────────────────────────────
// Prisma Admin — Mock data
// Principio de gobernanza: TODOS los indicadores están agregados por
// área / tópico / turno / máquina. Nunca por persona individual.
// ────────────────────────────────────────────────────────────────

export const AREAS = [
  "Producción",
  "Operaciones",
  "RRHH",
  "Legal",
  "Finanzas",
  "Marketing",
  "Ventas",
  "IT",
] as const;
export type Area = (typeof AREAS)[number];

export type DocStatus =
  | "subido"
  | "indexando"
  | "publicado"
  | "error"
  | "obsoleto"
  | "borrador"
  | "revision";

export type DocType = "manual" | "video" | "checklist" | "procedimiento" | "faq";
export type Criticidad = "Alta" | "Media" | "Baja";

export interface PrismaDoc {
  id: string;
  titulo: string;
  area: Area;
  proceso: string;
  tipo: DocType;
  criticidad: Criticidad;
  idioma: "ES" | "EN" | "PT";
  maquina?: string;
  estado: DocStatus;
  version: string;
  autor: string;
  actualizado: string;      // ISO date
  proximaRevision: string;  // ISO date
  usos30d: number;          // # consultas del agente que citaron este doc
  videoVinculado?: string;
}

export const documentos: PrismaDoc[] = [
  { id: "d-001", titulo: "Manual de operación — Línea 3 (Envasadora)", area: "Producción", proceso: "Envasado", tipo: "manual", criticidad: "Alta", idioma: "ES", maquina: "L3-ENV-02", estado: "publicado", version: "v4.2", autor: "M. Ríos", actualizado: "2026-05-14", proximaRevision: "2026-11-14", usos30d: 412, videoVinculado: "Tutorial cambio de formato L3" },
  { id: "d-002", titulo: "Procedimiento de bloqueo y etiquetado (LOTO)", area: "Producción", proceso: "Seguridad", tipo: "procedimiento", criticidad: "Alta", idioma: "ES", estado: "publicado", version: "v2.1", autor: "SST", actualizado: "2026-01-08", proximaRevision: "2026-07-08", usos30d: 287 },
  { id: "d-003", titulo: "Checklist arranque diario turno mañana", area: "Operaciones", proceso: "Arranque", tipo: "checklist", criticidad: "Media", idioma: "ES", estado: "publicado", version: "v1.6", autor: "T. Kim", actualizado: "2026-06-01", proximaRevision: "2026-12-01", usos30d: 654 },
  { id: "d-004", titulo: "Onboarding nuevo colaborador — Semana 1", area: "RRHH", proceso: "Onboarding", tipo: "manual", criticidad: "Media", idioma: "ES", estado: "publicado", version: "v3.0", autor: "RRHH", actualizado: "2026-04-22", proximaRevision: "2026-10-22", usos30d: 198 },
  { id: "d-005", titulo: "Política de vacaciones y ausencias", area: "RRHH", proceso: "Beneficios", tipo: "manual", criticidad: "Baja", idioma: "ES", estado: "publicado", version: "v2.0", autor: "RRHH", actualizado: "2025-11-10", proximaRevision: "2026-05-10", usos30d: 76 },
  { id: "d-006", titulo: "Cierre contable mensual — SAP", area: "Finanzas", proceso: "Cierre", tipo: "procedimiento", criticidad: "Alta", idioma: "ES", estado: "publicado", version: "v5.1", autor: "M. Duarte", actualizado: "2026-05-30", proximaRevision: "2026-11-30", usos30d: 122 },
  { id: "d-007", titulo: "Guía anti-corrupción y compliance", area: "Legal", proceso: "Compliance", tipo: "manual", criticidad: "Alta", idioma: "ES", estado: "publicado", version: "v1.4", autor: "Legal", actualizado: "2026-02-18", proximaRevision: "2026-08-18", usos30d: 43 },
  { id: "d-008", titulo: "Playbook campañas performance", area: "Marketing", proceso: "Adquisición", tipo: "manual", criticidad: "Media", idioma: "ES", estado: "publicado", version: "v2.3", autor: "Marketing", actualizado: "2026-03-11", proximaRevision: "2026-09-11", usos30d: 89 },
  { id: "d-009", titulo: "Script llamada frío — Enterprise", area: "Ventas", proceso: "Prospección", tipo: "manual", criticidad: "Baja", idioma: "ES", estado: "publicado", version: "v1.2", autor: "Ventas", actualizado: "2025-09-05", proximaRevision: "2026-03-05", usos30d: 34 },
  { id: "d-010", titulo: "Runbook incidentes Severidad 1", area: "IT", proceso: "SRE", tipo: "procedimiento", criticidad: "Alta", idioma: "ES", estado: "publicado", version: "v3.4", autor: "IT Ops", actualizado: "2026-06-20", proximaRevision: "2026-12-20", usos30d: 156 },
  { id: "d-011", titulo: "Video: cambio de formato Línea 3", area: "Producción", proceso: "Envasado", tipo: "video", criticidad: "Alta", idioma: "ES", maquina: "L3-ENV-02", estado: "publicado", version: "v1.0", autor: "M. Ríos", actualizado: "2026-05-14", proximaRevision: "2027-05-14", usos30d: 231 },
  { id: "d-012", titulo: "Manual antiguo Línea 3 (obsoleto)", area: "Producción", proceso: "Envasado", tipo: "manual", criticidad: "Media", idioma: "ES", estado: "obsoleto", version: "v3.9", autor: "M. Ríos", actualizado: "2025-04-01", proximaRevision: "2025-10-01", usos30d: 2 },
  { id: "d-013", titulo: "Checklist calidad — Envasado", area: "Producción", proceso: "Calidad", tipo: "checklist", criticidad: "Alta", idioma: "ES", estado: "indexando", version: "v1.0", autor: "Calidad", actualizado: "2026-07-06", proximaRevision: "2027-01-06", usos30d: 0 },
  { id: "d-014", titulo: "SOP mantenimiento preventivo compresores", area: "Operaciones", proceso: "Mantenimiento", tipo: "procedimiento", criticidad: "Media", idioma: "ES", maquina: "CMP-A1", estado: "error", version: "v0.9", autor: "Mtto.", actualizado: "2026-07-01", proximaRevision: "2027-01-01", usos30d: 0 },
  { id: "d-015", titulo: "Manual devoluciones e-commerce", area: "Ventas", proceso: "Postventa", tipo: "manual", criticidad: "Media", idioma: "ES", estado: "revision", version: "v2.0", autor: "Ventas", actualizado: "2026-07-04", proximaRevision: "2027-01-04", usos30d: 0 },
  { id: "d-016", titulo: "Guía firma electrónica proveedores", area: "Legal", proceso: "Contratos", tipo: "manual", criticidad: "Baja", idioma: "ES", estado: "borrador", version: "v0.3", autor: "Legal", actualizado: "2026-07-03", proximaRevision: "2027-01-03", usos30d: 0 },
];

// ───── Conectores ─────
export type ConectorEstado = "connected" | "error" | "pending" | "disconnected";
export interface Conector {
  id: string;
  nombre: string;
  proveedor: string;
  estado: ConectorEstado;
  ultimaSync: string;
  frecuencia: string;
  archivos: number;
}
export const conectores: Conector[] = [
  { id: "gdrive", nombre: "Google Drive", proveedor: "Google", estado: "connected", ultimaSync: "hace 12 min", frecuencia: "Cada 15 min", archivos: 1842 },
  { id: "sharepoint", nombre: "Microsoft SharePoint", proveedor: "Microsoft", estado: "connected", ultimaSync: "hace 3 min", frecuencia: "Cada 10 min", archivos: 964 },
  { id: "confluence", nombre: "Confluence", proveedor: "Atlassian", estado: "pending", ultimaSync: "sincronizando…", frecuencia: "Cada 30 min", archivos: 512 },
  { id: "onedrive", nombre: "OneDrive corporativo", proveedor: "Microsoft", estado: "disconnected", ultimaSync: "—", frecuencia: "—", archivos: 0 },
];

// ───── FAQs sugeridas por IA ─────
export const faqsSugeridas = [
  { q: "¿Cómo cambio el formato en la Línea 3 sin detener el ciclo?", a: "Se debe activar el modo semi-automático desde el HMI, esperar a que el pistón regrese al punto muerto superior…", doc: "d-001" },
  { q: "¿Cada cuánto se lubrica el compresor CMP-A1?", a: "Cada 250 horas de operación efectiva o 45 días, lo primero que ocurra.", doc: "d-014" },
  { q: "¿Qué hago si el sensor óptico marca error E-14?", a: "Limpiar la lente con paño de microfibra, verificar alineación y reiniciar el PLC.", doc: "d-001" },
];

// ───── Aprobaciones (kanban) ─────
export type AprobEstado = "borrador" | "revision" | "publicado";
export interface Aprobacion {
  id: string;
  titulo: string;
  area: Area;
  tipo: DocType;
  autor: string;
  revisor: string;
  estado: AprobEstado;
  actualizado: string;
}
export const aprobaciones: Aprobacion[] = [
  { id: "a-1", titulo: "Guía firma electrónica proveedores", area: "Legal", tipo: "manual", autor: "P. Núñez", revisor: "C. Ávila", estado: "borrador", actualizado: "hace 2 h" },
  { id: "a-2", titulo: "Manual devoluciones e-commerce v2", area: "Ventas", tipo: "manual", autor: "L. Ortiz", revisor: "S. Herrera", estado: "revision", actualizado: "hace 6 h" },
  { id: "a-3", titulo: "Checklist calidad envasado", area: "Producción", tipo: "checklist", autor: "M. Ríos", revisor: "J. Peña", estado: "revision", actualizado: "hace 1 día" },
  { id: "a-4", titulo: "Runbook incidentes Sev-1 (menor)", area: "IT", tipo: "procedimiento", autor: "IT Ops", revisor: "CTO", estado: "publicado", actualizado: "ayer" },
  { id: "a-5", titulo: "Onboarding Semana 1 v3.0", area: "RRHH", tipo: "manual", autor: "RRHH", revisor: "Gerencia", estado: "publicado", actualizado: "hace 3 días" },
  { id: "a-6", titulo: "SOP mantenimiento compresores", area: "Operaciones", tipo: "procedimiento", autor: "Mtto.", revisor: "Ing. Planta", estado: "borrador", actualizado: "hace 30 min" },
];

// ───── Vencimientos ─────
export interface Vencimiento {
  docId: string;
  titulo: string;
  area: Area;
  diasRestantes: number; // negativo = vencido
  criticidad: Criticidad;
}
export const vencimientos: Vencimiento[] = [
  { docId: "d-005", titulo: "Política de vacaciones y ausencias", area: "RRHH", diasRestantes: -12, criticidad: "Baja" },
  { docId: "d-002", titulo: "Procedimiento LOTO", area: "Producción", diasRestantes: 3, criticidad: "Alta" },
  { docId: "d-007", titulo: "Guía anti-corrupción y compliance", area: "Legal", diasRestantes: 21, criticidad: "Alta" },
  { docId: "d-009", titulo: "Script llamada frío — Enterprise", area: "Ventas", diasRestantes: -45, criticidad: "Baja" },
  { docId: "d-008", titulo: "Playbook campañas performance", area: "Marketing", diasRestantes: 34, criticidad: "Media" },
];

// ───── Duplicados / contradicciones ─────
export interface Duplicado {
  a: string;
  b: string;
  similitud: number; // 0–100
  motivo: string;
  tipo: "duplicado" | "contradiccion";
}
export const duplicados: Duplicado[] = [
  { a: "Manual de operación — Línea 3 (Envasadora)", b: "Manual antiguo Línea 3 (obsoleto)", similitud: 94, motivo: "Contenido casi idéntico; la versión antigua sigue indexada", tipo: "duplicado" },
  { a: "Checklist arranque diario turno mañana", b: "Checklist arranque turno tarde", similitud: 82, motivo: "Difieren en el paso 4 (torque) — valores contradictorios", tipo: "contradiccion" },
  { a: "Política de vacaciones y ausencias", b: "Manual de beneficios — RRHH", similitud: 71, motivo: "Ambos definen días de licencia con cifras distintas", tipo: "contradiccion" },
];

// ───── Tópicos consultados ─────
export interface TopicoRow {
  topico: string;
  area: Area;
  consultas30d: number;
  trendPct: number;      // % vs 30d anteriores
  tendencia: number[];   // 12 puntos para sparkline
  escalamiento: number;  // % que terminaron en humano
  confianza: number;     // % promedio de confianza del agente
}
const spark = (base: number, jitter = 0.35) =>
  Array.from({ length: 12 }, (_, i) =>
    Math.max(0, Math.round(base * (1 + Math.sin(i / 2) * jitter + (Math.random() - 0.5) * jitter)))
  );

export const topicos: TopicoRow[] = [
  { topico: "Cambio de formato Línea 3", area: "Producción", consultas30d: 412, trendPct: 18, tendencia: spark(35), escalamiento: 6, confianza: 88 },
  { topico: "Arranque turno mañana", area: "Operaciones", consultas30d: 654, trendPct: 4, tendencia: spark(55), escalamiento: 3, confianza: 92 },
  { topico: "Bloqueo y etiquetado (LOTO)", area: "Producción", consultas30d: 287, trendPct: -8, tendencia: spark(28), escalamiento: 11, confianza: 79 },
  { topico: "Onboarding semana 1", area: "RRHH", consultas30d: 198, trendPct: 22, tendencia: spark(18), escalamiento: 4, confianza: 90 },
  { topico: "Cierre contable SAP", area: "Finanzas", consultas30d: 122, trendPct: -3, tendencia: spark(12), escalamiento: 14, confianza: 74 },
  { topico: "Incidentes Sev-1", area: "IT", consultas30d: 156, trendPct: 12, tendencia: spark(15), escalamiento: 9, confianza: 83 },
  { topico: "Vacaciones y ausencias", area: "RRHH", consultas30d: 76, trendPct: 45, tendencia: spark(7), escalamiento: 22, confianza: 61 },
  { topico: "Mantenimiento compresores", area: "Operaciones", consultas30d: 88, trendPct: 30, tendencia: spark(8), escalamiento: 28, confianza: 58 },
  { topico: "Devoluciones e-commerce", area: "Ventas", consultas30d: 64, trendPct: 9, tendencia: spark(6), escalamiento: 12, confianza: 81 },
  { topico: "Playbook performance", area: "Marketing", consultas30d: 89, trendPct: -14, tendencia: spark(9), escalamiento: 7, confianza: 86 },
];

// ───── Dolores principales (mal resueltas) ─────
export interface Dolor {
  pregunta: string;
  area: Area;
  volumen: number;
  confianza: number;
  feedbackNeg: number;
  escalamiento: number;
}
export const dolores: Dolor[] = [
  { pregunta: "¿Cuántos días de licencia por matrimonio corresponden?", area: "RRHH", volumen: 41, confianza: 42, feedbackNeg: 63, escalamiento: 72 },
  { pregunta: "¿Cómo lubricar CMP-A1 sin detener producción?", area: "Operaciones", volumen: 33, confianza: 38, feedbackNeg: 71, escalamiento: 80 },
  { pregunta: "¿Qué torque aplicar al ajuste del turno tarde?", area: "Producción", volumen: 28, confianza: 44, feedbackNeg: 58, escalamiento: 55 },
  { pregunta: "¿Se puede firmar contrato con proveedor sin sello físico?", area: "Legal", volumen: 22, confianza: 51, feedbackNeg: 47, escalamiento: 44 },
  { pregunta: "¿Cómo revertir un asiento contable ya publicado?", area: "Finanzas", volumen: 19, confianza: 55, feedbackNeg: 39, escalamiento: 40 },
];

// ───── Salud documental ─────
export const kpisSalud = {
  vigentes: 78,
  vencidos: 12,
  zombies: 34,
  gaps: 9,
  totalDocs: 312,
};

export interface Gap {
  tema: string;
  area: Area;
  volumen: number;
  descripcion: string;
}
export const gaps: Gap[] = [
  { tema: "Cambio de formato Línea 5 (nueva)", area: "Producción", volumen: 87, descripcion: "Alta demanda, no existe manual ni video para la línea instalada en junio" },
  { tema: "Política de trabajo remoto híbrido", area: "RRHH", volumen: 62, descripcion: "Consultas frecuentes, sólo hay una comunicación de correo del 2024" },
  { tema: "Facturación clientes internacionales", area: "Finanzas", volumen: 44, descripcion: "El agente responde con información desactualizada" },
  { tema: "Migración a Salesforce (post go-live)", area: "Ventas", volumen: 39, descripcion: "Sin runbook oficial" },
  { tema: "Onboarding perfil planta bilingüe", area: "RRHH", volumen: 31, descripcion: "No existe versión EN del onboarding" },
];

export interface DocUsoRow {
  titulo: string;
  area: Area;
  consultas: number;
}
export const docsMasUsados: DocUsoRow[] = documentos
  .filter((d) => d.estado === "publicado")
  .sort((a, b) => b.usos30d - a.usos30d)
  .slice(0, 8)
  .map((d) => ({ titulo: d.titulo, area: d.area, consultas: d.usos30d }));

export const docsZombie: DocUsoRow[] = [
  { titulo: "Manual antiguo Línea 3 (obsoleto)", area: "Producción", consultas: 2 },
  { titulo: "Guía uso Skype for Business", area: "IT", consultas: 0 },
  { titulo: "Política dress code oficina 2019", area: "RRHH", consultas: 0 },
  { titulo: "Manual sucursal Puerto Montt (cerrada)", area: "Operaciones", consultas: 1 },
  { titulo: "Playbook campañas Q1 2024", area: "Marketing", consultas: 1 },
];

// ───── Heatmap actividad área × día ─────
export const heatmap: { area: Area; dias: number[] }[] = [
  { area: "Producción",  dias: [82, 91, 88, 94, 78, 42, 31] },
  { area: "Operaciones", dias: [70, 76, 74, 80, 71, 38, 22] },
  { area: "RRHH",        dias: [45, 52, 44, 41, 39, 12,  8] },
  { area: "Legal",       dias: [21, 19, 24, 22, 20,  6,  3] },
  { area: "Finanzas",    dias: [38, 41, 46, 52, 44, 11,  4] },
  { area: "Marketing",   dias: [29, 33, 41, 38, 44, 15, 10] },
  { area: "Ventas",      dias: [31, 44, 52, 48, 61, 24, 12] },
  { area: "IT",          dias: [52, 48, 55, 61, 58, 30, 24] },
];
export const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// ───── Líneas / máquinas ─────
export const maquinas = [
  { nombre: "Línea 3 — Envasadora", ubicacion: "Planta A", consultas: 412 },
  { nombre: "Línea 5 — Etiquetado",  ubicacion: "Planta A", consultas: 287 },
  { nombre: "CMP-A1 — Compresor",    ubicacion: "Planta B", consultas: 156 },
  { nombre: "Línea 1 — Mezcla",       ubicacion: "Planta A", consultas: 122 },
  { nombre: "Caldera 2",              ubicacion: "Planta B", consultas: 78 },
  { nombre: "Línea 2 — Llenado",      ubicacion: "Planta A", consultas: 64 },
];

// ───── Turnos ─────
export const turnos = [
  { turno: "Mañana (06-14h)", consultas: 1240 },
  { turno: "Tarde  (14-22h)", consultas: 980 },
  { turno: "Noche  (22-06h)", consultas: 420 },
];

// ───── Picos anómalos ─────
export interface Pico {
  area: Area;
  tema: string;
  ubicacion: string;
  turno: string;
  delta: number; // % vs baseline
  cuando: string;
}
export const picosAnomalos: Pico[] = [
  { area: "Producción",  tema: "Error E-14 sensor óptico", ubicacion: "Línea 3", turno: "Noche", delta: 340, cuando: "hoy 03:22" },
  { area: "Operaciones", tema: "Presión baja compresor",   ubicacion: "CMP-A1",  turno: "Tarde", delta: 180, cuando: "ayer 17:40" },
  { area: "RRHH",        tema: "Licencia matrimonio",      ubicacion: "Global",  turno: "Mañana", delta: 120, cuando: "esta semana" },
];

// ───── Aprendizaje ─────
export const avanceRutas = AREAS.map((a, i) => ({
  area: a,
  avance: [72, 68, 81, 58, 66, 74, 63, 79][i],
}));

export const kpisAprendizaje = {
  tiempoPromedio: "1m 42s",
  ratingProm: 4.4,
  ratingDist: [3, 5, 9, 38, 45], // % 1-5
};

// ───── Roles ─────
export const rolesMatriz = [
  { rol: "Editor documental",     subir: true,  aprobar: false, verMetricas: true,  admin: false },
  { rol: "Revisor / L&D lead",     subir: true,  aprobar: true,  verMetricas: true,  admin: false },
  { rol: "Analista de operaciones", subir: false, aprobar: false, verMetricas: true,  admin: false },
  { rol: "Administrador Prisma",   subir: true,  aprobar: true,  verMetricas: true,  admin: true  },
  { rol: "Solo lectura",           subir: false, aprobar: false, verMetricas: true,  admin: false },
];

// ───── Reportes exportables ─────
export const reportesCatalogo = [
  { id: "uso-mensual",   nombre: "Uso mensual del agente",         desc: "Volumen, tópicos y áreas — últimos 30 días", formato: "PDF · XLSX" },
  { id: "salud-doc",     nombre: "Salud documental",               desc: "Vigencia, zombies, duplicados y gaps",          formato: "PDF · XLSX" },
  { id: "dolores-area",  nombre: "Dolores por área",               desc: "Preguntas mal resueltas + escalamientos",       formato: "PDF · XLSX" },
  { id: "onboarding",    nombre: "Avance de onboarding",           desc: "% de rutas completadas por área",               formato: "PDF · XLSX" },
  { id: "picos",         nombre: "Alertas y picos anómalos",       desc: "Detecciones de la semana",                       formato: "PDF" },
];

// ───── Oportunidades de mejora ─────
export type OportunidadImpacto = "Alto" | "Medio" | "Bajo";
export interface Oportunidad {
  id: string;
  titulo: string;
  detalle: string;
  area: Area;
  impacto: OportunidadImpacto;
  esfuerzo: "Bajo" | "Medio" | "Alto";
  consultasAfectadas: number;
  accion: string;
}
export const oportunidades: Oportunidad[] = [
  { id: "op-1", titulo: "Crear manual de Línea 5", detalle: "87 consultas sin fuente en 30 días. La línea entró en junio y sigue sin documentación oficial.", area: "Producción", impacto: "Alto", esfuerzo: "Medio", consultasAfectadas: 87, accion: "Asignar redactor" },
  { id: "op-2", titulo: "Actualizar política de licencias RRHH", detalle: "63% feedback negativo en preguntas de matrimonio, paternidad y estudios. Documento vencido hace 12 días.", area: "RRHH", impacto: "Alto", esfuerzo: "Bajo", consultasAfectadas: 41, accion: "Republicar v3" },
  { id: "op-3", titulo: "Video corto: cambio de formato L3", detalle: "18% de las consultas de Línea 3 piden explicación visual. El manual actual solo tiene texto.", area: "Producción", impacto: "Medio", esfuerzo: "Medio", consultasAfectadas: 74, accion: "Grabar tutorial 3-5 min" },
  { id: "op-4", titulo: "Resolver contradicción arranque tarde vs mañana", detalle: "Dos checklists conviven con torques distintos en paso 4. Genera consultas repetidas.", area: "Operaciones", impacto: "Medio", esfuerzo: "Bajo", consultasAfectadas: 28, accion: "Unificar procedimiento" },
  { id: "op-5", titulo: "Traducir onboarding a EN para planta bilingüe", detalle: "31 consultas de perfiles nuevos que no encuentran contenido en inglés.", area: "RRHH", impacto: "Medio", esfuerzo: "Alto", consultasAfectadas: 31, accion: "Traducción + revisión" },
  { id: "op-6", titulo: "Publicar runbook post-migración Salesforce", detalle: "Consultas suben 30% cada mes; el agente responde con info de la herramienta anterior.", area: "Ventas", impacto: "Alto", esfuerzo: "Medio", consultasAfectadas: 39, accion: "Documentar flujos nuevos" },
  { id: "op-7", titulo: "Retirar docs zombies (5 candidatos)", detalle: "5 documentos con 0-2 usos en 30 días y contenido reemplazado. Ensucian resultados del agente.", area: "IT", impacto: "Bajo", esfuerzo: "Bajo", consultasAfectadas: 4, accion: "Archivar" },
];

// ───── Serie temporal — consultas diarias últimos 90 días ─────
// Determinista para no re-render valores en cada mount
function seriePseudo(seed: number, base: number, n: number, growth = 1) {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const noise = (s / 233280 - 0.5) * 0.4;
    const trend = 1 + (i / n) * (growth - 1);
    const weekly = Math.sin((i / 7) * Math.PI * 2) * 0.12;
    out.push(Math.max(0, Math.round(base * trend * (1 + noise + weekly))));
  }
  return out;
}
export const serieConsultas90d = seriePseudo(42, 380, 90, 1.35);

// ───── Distribución horaria (24h) ─────
export const distribHoraria = [
  8, 6, 5, 4, 4, 6, 18, 42, 78, 92, 88, 76,
  64, 68, 72, 74, 62, 48, 30, 22, 18, 14, 12, 10,
];

// ───── Distribución de feedback (1-5 estrellas) global ─────
export const feedbackDist = { 1: 3, 2: 6, 3: 12, 4: 34, 5: 45 };

// ───── Consultas por tipo (voz / texto / mobile / desktop) ─────
export const consultasPorCanal = [
  { canal: "Voz — mobile", pct: 42 },
  { canal: "Texto — mobile", pct: 31 },
  { canal: "Texto — desktop", pct: 19 },
  { canal: "Voz — desktop", pct: 8 },
];

// ───── Documentos con thumbnails (para vista Drive) ─────
export const tipoIconColor: Record<DocType, { grad: string; label: string }> = {
  manual:        { grad: "linear-gradient(135deg,#f4c9a3,#e28b6d)", label: "PDF" },
  video:         { grad: "linear-gradient(135deg,#c9d9f4,#6d8fe2)", label: "MP4" },
  checklist:     { grad: "linear-gradient(135deg,#d3f4c9,#7ed26d)", label: "LIST" },
  procedimiento: { grad: "linear-gradient(135deg,#f4c9e6,#e26db2)", label: "SOP" },
  faq:           { grad: "linear-gradient(135deg,#f4eec9,#e2c26d)", label: "FAQ" },
};
