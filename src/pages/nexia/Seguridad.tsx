import { useState } from "react";
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle, Lock, Eye, FileWarning, Users, CheckCircle2, ChevronRight } from "lucide-react";
import { EditorialHeader, KpiCard, PriorityBadge } from "@/components/nexia/primitives";
import { Breadcrumbs } from "@/components/nexia/Breadcrumbs";
import { cn } from "@/lib/utils";

type Severidad = "Alta" | "Media" | "Baja";
type Estado = "Abierto" | "Mitigado" | "En revisión";

type Riesgo = {
  id: string;
  app: string;
  categoria: string;
  area: string;
  riesgo: string;
  descripcion: string;
  severidad: Severidad;
  impacto: string;
  probabilidad: "Alta" | "Media" | "Baja";
  estado: Estado;
  recomendaciones: string[];
  normativa: string[];
};

const APPS: Record<string, { color: string; icon: typeof Shield }> = {
  "ChatGPT": { color: "#10A37F", icon: Shield },
  "Microsoft Copilot": { color: "#0078D4", icon: Shield },
  "Gemini": { color: "#4285F4", icon: Shield },
  "Claude": { color: "#D97757", icon: Shield },
  "Midjourney": { color: "#000000", icon: Shield },
  "GitHub Copilot": { color: "#24292E", icon: Shield },
  "Notion AI": { color: "#000000", icon: Shield },
  "Perplexity": { color: "#1FB6FF", icon: Shield },
};

const riesgos: Riesgo[] = [
  {
    id: "r1",
    app: "ChatGPT",
    categoria: "Fuga de datos",
    area: "Legal",
    riesgo: "Carga de contratos confidenciales en cuenta personal",
    descripcion: "Colaboradores del área legal están pegando cláusulas de contratos con datos de clientes en cuentas personales de ChatGPT sin plan Enterprise, exponiendo información sensible al entrenamiento del modelo.",
    severidad: "Alta",
    impacto: "Filtración de datos PII y secretos comerciales. Sanciones bajo Ley 19.628 y posible incumplimiento de cláusulas NDA con clientes corporativos.",
    probabilidad: "Alta",
    estado: "Abierto",
    recomendaciones: [
      "Migrar al plan ChatGPT Enterprise con cláusula de no entrenamiento (zero data retention)",
      "Bloquear chat.openai.com desde red corporativa y forzar SSO a la versión empresarial",
      "Capacitar al equipo legal en clasificación de datos antes de prompts",
      "Implementar DLP (Data Loss Prevention) para detectar PII en tráfico saliente",
    ],
    normativa: ["Ley 19.628 (CL)", "ISO 27001 A.8.2", "GDPR Art. 32"],
  },
  {
    id: "r2",
    app: "GitHub Copilot",
    categoria: "Propiedad intelectual",
    area: "IT",
    riesgo: "Sugerencias de código con licencias incompatibles",
    descripcion: "Copilot puede sugerir snippets derivados de código con licencias GPL/AGPL, contaminando el repositorio propietario del banco.",
    severidad: "Media",
    impacto: "Riesgo legal de tener que liberar código bajo licencia copyleft. Auditorías de cumplimiento fallidas.",
    probabilidad: "Media",
    estado: "En revisión",
    recomendaciones: [
      "Habilitar filtro 'duplication detection' en GitHub Copilot Business",
      "Bloquear sugerencias que coincidan con código público (≥150 caracteres)",
      "Revisión por SCA (Software Composition Analysis) en CI/CD",
      "Política firmada de uso aceptable de asistentes de código",
    ],
    normativa: ["ISO 27001 A.5.32", "OWASP LLM03"],
  },
  {
    id: "r3",
    app: "Microsoft Copilot",
    categoria: "Acceso indebido",
    area: "RRHH",
    riesgo: "Acceso transversal a documentos sensibles via M365",
    descripcion: "Copilot indexa todo SharePoint accesible al usuario. Permisos heredados mal configurados permiten que cualquiera consulte salarios, evaluaciones y planes de despido.",
    severidad: "Alta",
    impacto: "Exposición masiva de datos de RRHH a través de prompts simples. Riesgo reputacional y demandas laborales.",
    probabilidad: "Alta",
    estado: "Abierto",
    recomendaciones: [
      "Auditoría de permisos SharePoint con Microsoft Purview antes de habilitar Copilot",
      "Aplicar etiquetas de sensibilidad (Confidencial RRHH) a sitios críticos",
      "Restringir Copilot a grupos piloto hasta sanear permisos",
      "Activar logs de auditoría y revisión semanal de prompts inusuales",
    ],
    normativa: ["Ley 19.628 (CL)", "ISO 27001 A.5.15", "SOC 2 CC6.1"],
  },
  {
    id: "r4",
    app: "Gemini",
    categoria: "Cumplimiento",
    area: "Finanzas",
    riesgo: "Generación de proyecciones financieras sin trazabilidad",
    descripcion: "Análisis financieros generados por Gemini se incluyen en reportes regulatorios sin marcar el origen IA ni validar cálculos.",
    severidad: "Alta",
    impacto: "Incumplimiento normativa CMF. Reportes auditados con datos no trazables pueden derivar en multas.",
    probabilidad: "Media",
    estado: "Abierto",
    recomendaciones: [
      "Política obligatoria de etiquetado: todo output IA debe declararse en el documento",
      "Doble validación humana para cifras enviadas a CMF",
      "Versionado de prompts y respuestas en repositorio auditado",
      "Restringir Gemini a tareas de redacción, no de cálculo financiero",
    ],
    normativa: ["NCG CMF 461", "ISO 42001"],
  },
  {
    id: "r5",
    app: "Midjourney",
    categoria: "Propiedad intelectual",
    area: "Marketing",
    riesgo: "Uso de imágenes generadas sin verificar derechos",
    descripcion: "Diseñadores usan Midjourney plan personal cuyo output puede no ser comercialmente utilizable y puede infringir estilos de artistas vivos.",
    severidad: "Media",
    impacto: "Demandas por infracción de copyright. Retirada de campañas publicadas.",
    probabilidad: "Media",
    estado: "Mitigado",
    recomendaciones: [
      "Migrar a plan Pro/Mega con derechos comerciales explícitos",
      "Prohibir prompts con nombres de artistas o estilos protegidos",
      "Registro de prompts usados en cada pieza publicada",
      "Revisión legal de campañas con contenido 100% generado",
    ],
    normativa: ["Ley 17.336 (CL)", "WIPO Copyright Treaty"],
  },
  {
    id: "r6",
    app: "Notion AI",
    categoria: "Fuga de datos",
    area: "Producto",
    riesgo: "Workspaces personales con roadmap interno",
    descripcion: "PMs duplican páginas del roadmap a workspaces Notion personales para usar Notion AI sin restricciones del workspace empresarial.",
    severidad: "Media",
    impacto: "Exposición de estrategia de producto a terceros. Pérdida de ventaja competitiva.",
    probabilidad: "Media",
    estado: "En revisión",
    recomendaciones: [
      "SSO obligatorio para Notion, bloquear cuentas personales en dominio corporativo",
      "Habilitar Notion AI en plan Business con compromiso de no entrenamiento",
      "Monitoreo de export/copy masivo desde el workspace",
    ],
    normativa: ["ISO 27001 A.5.10"],
  },
  {
    id: "r7",
    app: "ChatGPT",
    categoria: "Sesgo & ética",
    area: "RRHH",
    riesgo: "Screening de CVs con sesgo algorítmico",
    descripcion: "Reclutadores usan ChatGPT para puntuar CVs sin auditar sesgo de género, edad o nacionalidad en las respuestas.",
    severidad: "Alta",
    impacto: "Discriminación laboral. Riesgo de demandas y daño reputacional.",
    probabilidad: "Media",
    estado: "Abierto",
    recomendaciones: [
      "Prohibir uso de LLMs como filtro automático de candidatos",
      "Usar IA solo como apoyo, con decisión final humana documentada",
      "Auditoría de sesgo trimestral sobre decisiones asistidas por IA",
      "Adopción de marco ISO 42001 para gestión de IA",
    ],
    normativa: ["EU AI Act (alto riesgo)", "ISO 42001", "Ley 21.643"],
  },
  {
    id: "r8",
    app: "Perplexity",
    categoria: "Alucinaciones",
    area: "Ventas",
    riesgo: "Datos inventados en propuestas comerciales",
    descripcion: "Ejecutivos comerciales copian respuestas de Perplexity con estadísticas no verificadas a propuestas enviadas a clientes.",
    severidad: "Media",
    impacto: "Daño reputacional, pérdida de credibilidad ante clientes corporativos, posibles reclamos.",
    probabilidad: "Alta",
    estado: "Abierto",
    recomendaciones: [
      "Política: toda cifra externa debe tener fuente citada y verificada",
      "Capacitación en verificación de fuentes IA",
      "Plantillas de propuestas con checklist de validación previo a envío",
    ],
    normativa: ["ISO 9001", "Código de ética interno"],
  },
  {
    id: "r9",
    app: "Claude",
    categoria: "Shadow AI",
    area: "Operaciones",
    riesgo: "Uso no autorizado de API con tarjeta personal",
    descripcion: "Equipo de operaciones automatizó procesos críticos con API de Claude pagada con tarjeta personal, sin contrato corporativo ni respaldo.",
    severidad: "Alta",
    impacto: "Continuidad operativa en riesgo si el colaborador sale. Sin SLA ni soporte. Datos en jurisdicción no aprobada.",
    probabilidad: "Alta",
    estado: "Abierto",
    recomendaciones: [
      "Inventario obligatorio de toda app IA en uso (catálogo aprobado)",
      "Contrato corporativo con Anthropic con DPA firmado",
      "Bloqueo de pagos personales reembolsados para servicios cloud/IA",
      "Comité de gobernanza IA con aprobación previa de nuevos casos de uso",
    ],
    normativa: ["ISO 27001 A.5.23", "ISO 42001"],
  },
];

const categoriaIconos: Record<string, typeof Shield> = {
  "Fuga de datos": FileWarning,
  "Propiedad intelectual": Lock,
  "Acceso indebido": Eye,
  "Cumplimiento": ShieldCheck,
  "Sesgo & ética": Users,
  "Alucinaciones": AlertTriangle,
  "Shadow AI": ShieldAlert,
};

const severidadColor: Record<Severidad, string> = {
  Alta: "text-destructive bg-destructive/10 border-destructive/20",
  Media: "text-warning bg-warning/10 border-warning/20",
  Baja: "text-muted-foreground bg-muted border-border",
};

const estadoColor: Record<Estado, string> = {
  Abierto: "text-destructive bg-destructive/10",
  "En revisión": "text-warning bg-warning/10",
  Mitigado: "text-success bg-success/10",
};

export default function Seguridad() {
  const [filtro, setFiltro] = useState<"Todos" | Severidad>("Todos");
  const [seleccion, setSeleccion] = useState<string | null>(riesgos[0].id);

  const filtrados = filtro === "Todos" ? riesgos : riesgos.filter((r) => r.severidad === filtro);
  const actual = riesgos.find((r) => r.id === seleccion) ?? riesgos[0];

  const total = riesgos.length;
  const altas = riesgos.filter((r) => r.severidad === "Alta").length;
  const abiertas = riesgos.filter((r) => r.estado === "Abierto").length;
  const apps = new Set(riesgos.map((r) => r.app)).size;

  return (
    <div className="space-y-8">
      <Breadcrumbs />

      <EditorialHeader
        eyebrow="Gobernanza IA"
        title="Seguridad y control de IA"
        description="Inventario de riesgos detectados en el uso de aplicaciones de IA, con recomendaciones para mitigarlos y mantener cumplimiento normativo."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Riesgos detectados" value={total} hint={`${apps} apps de IA monitoreadas`} />
        <KpiCard label="Severidad alta" value={altas} hint="Requieren acción inmediata" />
        <KpiCard label="Abiertos" value={abiertas} hint="Sin plan de mitigación activo" />
        <KpiCard label="Áreas afectadas" value={new Set(riesgos.map((r) => r.area)).size} hint="Distribución transversal" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {(["Todos", "Alta", "Media", "Baja"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={cn(
              "px-4 h-9 rounded-full text-sm font-medium border transition-colors",
              filtro === f ? "bg-foreground text-background border-foreground" : "border-border bg-background hover:bg-muted"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
        {/* Lista */}
        <div className="space-y-2">
          {filtrados.map((r) => {
            const Icon = categoriaIconos[r.categoria] ?? Shield;
            const active = r.id === seleccion;
            return (
              <button
                key={r.id}
                onClick={() => setSeleccion(r.id)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border transition-all",
                  active ? "border-foreground bg-card shadow-sm" : "border-border bg-card/50 hover:bg-card"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${APPS[r.app]?.color ?? "#000"}15`, color: APPS[r.app]?.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-foreground">{r.app}</span>
                      <span className="text-xs text-muted-foreground">· {r.area}</span>
                      <span className={cn("text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border", severidadColor[r.severidad])}>
                        {r.severidad}
                      </span>
                    </div>
                    <div className="mt-1 text-sm font-medium text-foreground line-clamp-2">{r.riesgo}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={cn("inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full", estadoColor[r.estado])}>
                        {r.estado}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detalle */}
        <div className="card-elevated p-6 lg:p-8 space-y-6 h-fit lg:sticky lg:top-20">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: `${APPS[actual.app]?.color ?? "#000"}15`, color: APPS[actual.app]?.color }}
              >
                <Shield className="w-3.5 h-3.5" />
                {actual.app}
              </span>
              <span className="text-xs text-muted-foreground">{actual.categoria} · {actual.area}</span>
              <span className={cn("text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border", severidadColor[actual.severidad])}>
                Severidad {actual.severidad}
              </span>
              <span className={cn("inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full", estadoColor[actual.estado])}>
                {actual.estado}
              </span>
            </div>
            <h2 className="text-2xl font-semibold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              {actual.riesgo}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{actual.descripcion}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Probabilidad</div>
              <PriorityBadge priority={actual.probabilidad} />
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Severidad</div>
              <PriorityBadge priority={actual.severidad} />
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Impacto potencial
            </div>
            <p className="text-sm text-foreground leading-relaxed">{actual.impacto}</p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Recomendaciones
            </div>
            <ul className="space-y-2">
              {actual.recomendaciones.map((rec, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-semibold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Normativa relacionada</div>
            <div className="flex flex-wrap gap-2">
              {actual.normativa.map((n) => (
                <span key={n} className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted/40 text-foreground">
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
