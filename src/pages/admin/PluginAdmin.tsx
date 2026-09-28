import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, Copy, ExternalLink, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import prismaLogo from "@/assets/logo-prisma-white.png.asset.json";
import logoClaude from "@/assets/logo-claude.svg";
import logoCursor from "@/assets/logo-cursor.svg";
import logoVscode from "@/assets/logo-vscode.svg";
import logoWindsurf from "@/assets/logo-windsurf.svg";
import logoGemini from "@/assets/logo-googlegemini.svg";
import logoOpenai from "@/assets/logo-openai.svg";
import logoGoogle from "@/assets/logo-google.svg";

const TABS = [
  { id: "resumen", label: "Resumen" },
  { id: "conectar", label: "Conectar" },
  { id: "accesos", label: "Accesos OAuth" },
  { id: "modulos", label: "Módulos y límites" },
  { id: "licencia", label: "Sitio y cupos" },
  { id: "actualizaciones", label: "Actualizaciones" },
  { id: "endpoint", label: "Endpoint MCP" },
  { id: "actividad", label: "Actividad" },
  { id: "soporte", label: "Reportar problema" },
] as const;

const ENDPOINT = "https://tusitio.cl/wp-json/prisma-mcp/v1/mcp";

function Card({ eyebrow, title, action, children, className }: { eyebrow?: string; title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("card-elevated p-6", className)}>
      {(eyebrow || title || action) && (
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            {eyebrow && <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">{eyebrow}</p>}
            {title && <h2 className="font-display text-xl font-semibold">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function Tag({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "ok" | "err" | "warn" }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border",
      tone === "ok" && "border-emerald-500/30 text-emerald-600 bg-emerald-500/10",
      tone === "err" && "border-destructive/30 text-destructive bg-destructive/10",
      tone === "warn" && "border-amber-500/30 text-amber-600 bg-amber-500/10",
      tone === "muted" && "border-border text-muted-foreground bg-muted/40")}>{children}</span>
  );
}

/* ---------- Resumen ---------- */
function Resumen({ go }: { go: (t: string) => void }) {
  const estados = [
    { k: "Servidor MCP", v: "Activo", d: "Tus clientes IA pueden conectarse a este sitio.", ok: true },
    { k: "Estado", v: "Disponible", d: "Última verificación hace 2 min.", ok: true },
    { k: "Page builder", v: "No instalado", d: "Funciones de diseño visual desactivadas.", ok: false },
    { k: "Actualización", v: "Disponible", d: "Versión 1.4.2 lista para instalar.", ok: true },
  ];
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-center justify-between gap-4">
        <div className="flex gap-3 items-start">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium">No te pierdas la nueva versión de Prisma MCP</p>
            <p className="text-xs text-muted-foreground">Incluye mejoras de rendimiento y nuevas herramientas para tus agentes.</p>
          </div>
        </div>
        <Button size="sm" onClick={() => go("actualizaciones")}>Actualizar ahora</Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {estados.map((e) => (
          <div key={e.k} className="card-elevated p-5">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{e.k}</p>
            <p className={cn("mt-2 font-display text-lg font-semibold", e.ok ? "text-foreground" : "text-muted-foreground")}>
              <span className={cn("inline-block w-2 h-2 rounded-full mr-2 align-middle", e.ok ? "bg-emerald-500" : "bg-muted-foreground/40")} />
              {e.v}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{e.d}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card eyebrow="Consumo" title="Este mes" className="lg:col-span-1">
          {[["Plugin", "$ 20,0"], ["Tokens", "412k"], ["Llamadas", "1.284"], ["MCP", "Incluido"]].map(([a, b]) => (
            <div key={a} className="flex justify-between py-2 border-b border-border last:border-0 text-sm"><span className="text-muted-foreground">{a}</span><span className="font-medium">{b}</span></div>
          ))}
        </Card>
        <Card eyebrow="Primeros pasos" title="Conecta tu sitio en un minuto" className="lg:col-span-2" action={<Button size="sm" onClick={() => go("conectar")}>Empezar</Button>}>
          <p className="text-sm text-muted-foreground">Elige tu cliente IA, define qué puede hacer y autoriza el acceso desde el navegador. Sin contraseñas, sin configuración manual.</p>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Conectar ---------- */
const CLIENTES: { nombre: string; logo: string | null }[] = [
  { nombre: "Claude Code", logo: logoClaude },
  { nombre: "Cursor", logo: logoCursor },
  { nombre: "VS Code", logo: logoVscode },
  { nombre: "Windsurf", logo: logoWindsurf },
  { nombre: "Gemini CLI", logo: logoGemini },
  { nombre: "Codex", logo: logoOpenai },
  { nombre: "Antigravity", logo: logoGoogle },
  { nombre: "Otro cliente", logo: null },
];
function Conectar() {
  const [cliente, setCliente] = useState("Claude Code");
  const [modo, setModo] = useState<"lectura" | "editar">("editar");
  return (
    <Card eyebrow="Conexión asistida" title="Conecta tu sitio en un minuto" action={<Tag tone="warn">Beta</Tag>}>
      <ol className="space-y-8">
        <li>
          <p className="text-sm font-medium mb-1">1. ¿Con qué IA quieres conectar?</p>
          <p className="text-xs text-muted-foreground mb-3">Elige tu cliente; adaptamos las instrucciones.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {CLIENTES.map((c) => (
              <button key={c.nombre} onClick={() => setCliente(c.nombre)}
                className={cn("flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  cliente === c.nombre ? "border-foreground bg-muted/50" : "border-border hover:bg-muted/30")}>
                <span className="w-8 h-8 rounded-lg bg-muted/60 grid place-items-center shrink-0">
                  {c.logo
                    ? <img src={c.logo} alt="" className="w-5 h-5 object-contain" />
                    : <span className="text-[10px] font-semibold text-muted-foreground">{c.nombre.slice(0, 2).toUpperCase()}</span>}
                </span>
                <span className="text-sm flex-1">{c.nombre}</span>
                {cliente === c.nombre && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </li>
        <li>
          <p className="text-sm font-medium mb-3">2. Elige qué podrá hacer la IA</p>
          <div className="grid md:grid-cols-2 gap-3">
            {([["lectura", "Solo revisar", "Puede leer contenido y ajustes, sin cambios."], ["editar", "Revisar y editar", "Puede crear y modificar contenido. Las acciones destructivas siguen bloqueadas."]] as const).map(([id, t, d]) => (
              <button key={id} onClick={() => setModo(id)}
                className={cn("rounded-xl border p-4 text-left", modo === id ? "border-foreground bg-muted/50" : "border-border hover:bg-muted/30")}>
                <p className="text-sm font-medium">{t}</p><p className="text-xs text-muted-foreground mt-1">{d}</p>
              </button>
            ))}
          </div>
        </li>
        <li>
          <p className="text-sm font-medium mb-3">3. Sigue el método recomendado</p>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3"><span className="text-sm font-medium">{cliente}</span><Tag>1 paso</Tag></div>
            <div className="bg-foreground text-background px-4 py-4 flex items-center justify-between gap-4">
              <p className="text-xs opacity-80">Abre {cliente}, pega el comando y autoriza en el navegador cuando se abra.</p>
              <Button size="sm" variant="secondary" onClick={() => { navigator.clipboard.writeText(`claude mcp add prisma ${ENDPOINT}`); toast.success("Comando copiado"); }}>Copiar y conectar</Button>
            </div>
          </div>
        </li>
        <li>
          <p className="text-sm font-medium mb-1">4. Autoriza en el navegador</p>
          <p className="text-xs text-muted-foreground">Inicia sesión con tu cuenta de administrador y acepta los permisos. Listo.</p>
        </li>
      </ol>
    </Card>
  );
}

/* ---------- Accesos ---------- */
const SCOPES = ["read:posts", "write:posts", "read:pages", "write:pages", "read:media", "read:settings", "read:plugins", "read:users", "read:woocommerce", "write:menus"];
function Accesos() {
  const [accesos, setAccesos] = useState([{ c: "Claude Code", u: "admin · hace 2 días" }, { c: "Cursor", u: "editor · hace 1 semana" }]);
  return (
    <Card eyebrow="Conexiones autorizadas" title="Accesos vigentes por OAuth">
      {accesos.length === 0 && <p className="text-sm text-muted-foreground">No hay accesos vigentes.</p>}
      <div className="space-y-3">
        {accesos.map((a) => (
          <div key={a.c} className="rounded-xl border border-border p-4">
            <div className="flex justify-between items-start gap-4">
              <div><p className="text-sm font-medium">{a.c}</p><p className="text-xs text-muted-foreground">{a.u}</p></div>
              <Button size="sm" variant="outline" onClick={() => setAccesos((x) => x.filter((y) => y.c !== a.c))}>Revocar</Button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">{SCOPES.map((s) => <Tag key={s}>{s}</Tag>)}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- Módulos ---------- */
const MODULOS = [
  { k: "Servidor MCP", d: "Activa el endpoint para clientes IA.", on: true },
  { k: "Herramientas de contenido", d: "Entradas, páginas, medios y menús.", on: true },
  { k: "Contenido avanzado", d: "Campos personalizados y tipos de contenido.", on: true },
  { k: "SEO técnico", d: "Metadatos, sitemap y redirecciones.", on: true },
  { k: "Apariencia global", d: "Colores, tipografías y ajustes del tema.", on: true },
  { k: "Mantenimiento de plugins", d: "Actualizar o desactivar plugins.", on: false, tone: "warn" },
  { k: "Modo solo lectura", d: "Bloquea toda escritura desde la IA.", on: false },
  { k: "Crear sitio borrador", d: "Permite clonar el sitio en un entorno de prueba.", on: false },
  { k: "Purgar caché al guardar", d: "Limpia la caché tras cada cambio hecho por la IA.", on: true },
  { k: "Publicación remota", d: "Permite publicar sin revisión previa.", on: true, tone: "warn" },
  { k: "Acciones destructivas", d: "Borrar contenido, usuarios o archivos.", on: false, tone: "err" },
];
function Modulos() {
  const [st, setSt] = useState(MODULOS.map((m) => m.on));
  return (
    <Card eyebrow="Política operativa" title="Módulos y límites" action={<Button size="sm" variant="outline">Restablecer</Button>}>
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex gap-3 mb-5">
        <ShieldAlert className="w-4 h-4 text-destructive mt-0.5" />
        <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Protección para sitios en producción.</span> Las acciones sensibles están limitadas por defecto. Actívalas solo si sabes lo que haces.</p>
      </div>
      <div className="divide-y divide-border">
        {MODULOS.map((m, i) => (
          <div key={m.k} className={cn("flex items-center justify-between gap-4 py-3 px-2 -mx-2 rounded-lg",
            m.tone === "warn" && "bg-amber-500/5", m.tone === "err" && "bg-destructive/5")}>
            <div><p className="text-sm font-medium">{m.k}</p><p className="text-xs text-muted-foreground">{m.d}</p></div>
            <Switch checked={st[i]} onCheckedChange={(v) => setSt((s) => s.map((x, j) => (j === i ? v : x)))} />
          </div>
        ))}
      </div>
      <div className="mt-5">
        <p className="text-sm font-medium mb-2">Dirección pública del conector</p>
        <Input defaultValue={ENDPOINT} />
        <p className="text-xs text-muted-foreground mt-1">Cámbiala solo si tu sitio está detrás de un proxy o CDN.</p>
      </div>
      <Button className="mt-5" onClick={() => toast.success("Configuración guardada")}>Guardar configuración</Button>
    </Card>
  );
}

/* ---------- Licencia / Actualizaciones / Endpoint ---------- */
function Licencia() {
  return (
    <Card eyebrow="Licencia" title="Este sitio y tus cupos" action={<Button size="sm" variant="outline">Ver licencias</Button>}>
      <div className="rounded-xl border border-border bg-muted/30 p-4 flex justify-between items-center">
        <div><p className="text-sm font-medium">tusitio.cl</p><p className="text-xs text-muted-foreground">Plan Pro · 3 de 5 sitios usados</p></div>
        <Tag tone="ok">● Activo</Tag>
      </div>
      <div className="flex gap-2 mt-4"><Button size="sm" variant="outline">Cambiar licencia</Button><Button size="sm" variant="outline">Desconectar este sitio</Button></div>
      <p className="text-xs text-muted-foreground mt-4">Al desconectar, liberas el cupo para usarlo en otro sitio.</p>
    </Card>
  );
}
function Actualizaciones() {
  return (
    <Card eyebrow="Versión" title="Estás al día" action={<Tag tone="ok">Al día</Tag>}>
      <div className="rounded-xl border border-border bg-muted/30 p-4 flex justify-between items-center">
        <div><p className="text-sm font-medium">1.4.1</p><p className="text-xs text-muted-foreground">Última verificación: hoy 18:02</p></div>
        <Tag tone="ok">● Al día</Tag>
      </div>
      <Button size="sm" variant="outline" className="mt-4" onClick={() => toast("Buscando actualizaciones…")}>Buscar actualizaciones</Button>
      <p className="text-xs text-muted-foreground mt-4">Las actualizaciones seguras se instalan solas. Te avisamos si una requiere tu revisión.</p>
    </Card>
  );
}
function Endpoint() {
  return (
    <Card eyebrow="Conexión" title="Endpoint MCP">
      <div className="flex gap-2">
        <Input readOnly value={ENDPOINT} className="font-mono text-xs" />
        <Button variant="outline" onClick={() => { navigator.clipboard.writeText(ENDPOINT); toast.success("Copiado"); }}><Copy className="w-4 h-4 mr-1" />Copiar</Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">Requiere HTTPS. Usa OAuth o una contraseña de aplicación asociada a un usuario administrador.</p>
    </Card>
  );
}

/* ---------- Actividad ---------- */
const ACCIONES = ["auth", "list_posts", "get_page_structure", "list_plugins", "update_post", "get_site_info"];
const ACTIVIDAD = Array.from({ length: 22 }, (_, i) => ({
  f: `2026-09-${String(28 - Math.floor(i / 4)).padStart(2, "0")} ${String(18 - (i % 10)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}:12`,
  u: i % 3 === 0 ? "—" : "#2",
  a: ACCIONES[i % ACCIONES.length],
  ok: i % 9 !== 7,
}));
function Actividad() {
  return (
    <Card eyebrow="Trazabilidad" title="Actividad reciente" action={<Button size="sm" variant="outline">Exportar</Button>}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[10px] uppercase tracking-[0.14em] text-muted-foreground border-b border-border">
            <th className="py-2 font-medium">Fecha UTC</th><th className="font-medium">Usuario</th><th className="font-medium">Acción</th><th className="font-medium">Estado</th></tr></thead>
          <tbody>
            {ACTIVIDAD.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="py-2 text-xs text-muted-foreground font-mono">{r.f}</td><td className="text-xs">{r.u}</td>
                <td><code className="text-xs bg-muted/50 rounded px-1.5 py-0.5">{r.a}</code></td>
                <td><Tag tone={r.ok ? "ok" : "err"}>{r.ok ? "success" : "error"}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ---------- Soporte ---------- */
function Soporte() {
  const [tipo, setTipo] = useState("falla");
  return (
    <Card eyebrow="Soporte" title="Reportar un problema" action={<Button size="sm" variant="outline"><ExternalLink className="w-3.5 h-3.5 mr-1" />Centro de ayuda</Button>}>
      <p className="text-sm text-muted-foreground mb-4">Cuéntanos qué falló. Adjuntamos automáticamente el diagnóstico técnico del sitio.</p>
      <p className="text-sm font-medium mb-2">¿Qué quieres reportar?</p>
      <div className="flex gap-4 mb-4 text-sm">
        {[["falla", "Algo falló"], ["sugerencia", "Tengo una sugerencia"]].map(([id, l]) => (
          <label key={id} className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={tipo === id} onChange={() => setTipo(id)} />{l}</label>
        ))}
      </div>
      <p className="text-sm font-medium mb-2">Cuéntanos más</p>
      <Textarea rows={5} placeholder="Qué intentabas hacer, qué esperabas y qué ocurrió en su lugar." />
      <p className="text-xs text-muted-foreground mt-1">Máximo 2.000 caracteres.</p>
      <div className="rounded-xl border border-border bg-muted/30 p-4 mt-4">
        <p className="text-xs font-medium mb-2">Se adjuntará al mensaje:</p>
        <pre className="text-[11px] text-muted-foreground font-mono whitespace-pre-wrap">{`Sitio: tusitio.cl\nPlugin: Prisma MCP 1.4.1 · WordPress 6.6 · PHP 8.2\nMódulos activos: 8 de 11\nÚltimo error: list_plugins (2026-09-27)`}</pre>
      </div>
      <Button className="mt-4" onClick={() => toast.success("Reporte enviado")}>Enviar reporte</Button>
    </Card>
  );
}

export default function PluginAdmin() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") ?? "resumen";
  const go = (t: string) => setParams({ tab: t });

  return (
    <div className="space-y-6">
      <header className="rounded-2xl bg-foreground text-background p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-prisma" />
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="mb-3">
              <img src={prismaLogo.url} alt="Prisma" className="h-8 w-auto" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.18em] opacity-60">Etapa actual</p>
            <p className="font-display text-lg">06 / Operación</p>
          </div>
        </div>
      </header>

      <Tabs value={tab} onValueChange={go}>
        <TabsList className="h-auto flex-wrap justify-start bg-muted/50 p-1 rounded-xl">
          {TABS.map((t) => <TabsTrigger key={t.id} value={t.id} className="rounded-lg text-xs">{t.label}</TabsTrigger>)}
        </TabsList>
        <div className="mt-6">
          <TabsContent value="resumen"><Resumen go={go} /></TabsContent>
          <TabsContent value="conectar"><Conectar /></TabsContent>
          <TabsContent value="accesos"><Accesos /></TabsContent>
          <TabsContent value="modulos"><Modulos /></TabsContent>
          <TabsContent value="licencia"><Licencia /></TabsContent>
          <TabsContent value="actualizaciones"><Actualizaciones /></TabsContent>
          <TabsContent value="endpoint"><Endpoint /></TabsContent>
          <TabsContent value="actividad"><Actividad /></TabsContent>
          <TabsContent value="soporte"><Soporte /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
