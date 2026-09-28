import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionHeader, IntegrationStatus } from "@/components/nexia/primitives";
import { empresa, integraciones, usuariosPlataforma, facturas } from "@/lib/nexia-mock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarFor, initialsFromName } from "@/lib/avatar";
import { Upload, Plus } from "lucide-react";

export default function Configuracion() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Configuración" subtitle="Gestiona empresa, integraciones, usuarios y plan" />

      <Tabs defaultValue="empresa" className="space-y-6">
        <TabsList className="bg-muted rounded-xl p-1">
          <TabsTrigger value="empresa" className="rounded-lg">Empresa</TabsTrigger>
          <TabsTrigger value="integraciones" className="rounded-lg">Integraciones</TabsTrigger>
          <TabsTrigger value="usuarios" className="rounded-lg">Usuarios & Permisos</TabsTrigger>
          <TabsTrigger value="notificaciones" className="rounded-lg">Notificaciones</TabsTrigger>
          <TabsTrigger value="plan" className="rounded-lg">Plan & Facturación</TabsTrigger>
        </TabsList>

        <TabsContent value="empresa">
          <div className="card-elevated p-6 max-w-2xl space-y-4">
            <div>
              <Label>Logo de la empresa</Label>
              <button className="mt-1 w-full h-32 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/40">
                <Upload className="w-5 h-5" /><span className="text-sm">Subir logo</span>
              </button>
            </div>
            <div><Label>Nombre</Label><Input defaultValue={empresa.nombre} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Industria</Label><Input defaultValue={empresa.industria} /></div>
              <div><Label>Tamaño</Label><Input defaultValue={empresa.tamano} /></div>
            </div>
            <div><Label>País</Label><Input defaultValue={empresa.pais} /></div>
            <button className="px-4 py-2 rounded-xl bg-foreground text-background font-medium">Guardar</button>
          </div>
        </TabsContent>

        <TabsContent value="integraciones">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integraciones.map((i) => (
              <div key={i.id} className="card-elevated p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{i.nombre}</h3>
                    <p className="text-xs text-muted-foreground">{i.proveedor}</p>
                  </div>
                  <IntegrationStatus status={i.estado} />
                </div>
                <div className="space-y-2">
                  <div><Label className="text-xs">API Key</Label><Input type="password" defaultValue="sk-************************" /></div>
                  <div><Label className="text-xs">Webhook URL</Label><Input defaultValue={`https://nexia.io/wh/${i.id}`} /></div>
                  <div><Label className="text-xs">Frecuencia</Label><Input defaultValue="Cada 15 min" /></div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usuarios">
          <div className="card-elevated overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold">Usuarios de la plataforma</h3>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground text-background text-sm font-medium"><Plus className="w-4 h-4" /> Invitar usuario</button>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border bg-muted/30"><th className="py-3 px-4 font-medium">Nombre</th><th className="py-3 px-4 font-medium">Email</th><th className="py-3 px-4 font-medium">Rol</th><th className="py-3 px-4 font-medium">Estado</th></tr></thead>
              <tbody>
                {usuariosPlataforma.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={avatarFor(u.id)} alt={u.nombre} />
                          <AvatarFallback className="bg-muted text-foreground text-xs">{initialsFromName(u.nombre)}</AvatarFallback>
                        </Avatar>
                        <span>{u.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                    <td className="py-3 px-4"><span className="text-xs px-2 py-0.5 rounded-md bg-muted">{u.rol}</span></td>
                    <td className="py-3 px-4"><span className={`text-xs ${u.estado === "Activo" ? "text-success" : "text-warning"}`}>{u.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="notificaciones">
          <div className="card-elevated p-6 max-w-2xl space-y-3">
            {["Score actualizado de un área","Nuevo candidato preseleccionado","Colaborador completa una ruta","Error de integración","Resumen semanal"].map((n) => (
              <label key={n} className="flex items-center justify-between p-3 rounded-xl border border-border">
                <span className="text-sm">{n}</span>
                <input type="checkbox" defaultChecked />
              </label>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="plan">
          <div className="card-elevated p-6 mb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Plan actual</div>
                <div className="text-2xl font-semibold mt-1">{empresa.plan}</div>
                <div className="text-sm text-muted-foreground">$89 USD / usuario / mes</div>
              </div>
              <div className="grid grid-cols-3 gap-6 text-sm">
                <div><div className="text-xs uppercase text-muted-foreground">Usuarios</div><div className="font-semibold">347</div></div>
                <div><div className="text-xs uppercase text-muted-foreground">Factura mensual</div><div className="font-semibold">$30.883 USD</div></div>
                <div><div className="text-xs uppercase text-muted-foreground">Próximo cobro</div><div className="font-semibold">15 jun 2025</div></div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-foreground text-background font-medium">Actualizar a Full Suite</button>
            </div>
          </div>

          <div className="card-elevated overflow-hidden">
            <div className="p-4 border-b border-border"><h3 className="font-semibold">Historial de facturas</h3></div>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border bg-muted/30"><th className="py-3 px-4 font-medium">ID</th><th className="py-3 px-4 font-medium">Fecha</th><th className="py-3 px-4 font-medium">Monto</th><th className="py-3 px-4 font-medium">Estado</th></tr></thead>
              <tbody>
                {facturas.map((f) => (
                  <tr key={f.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 font-mono text-xs">{f.id}</td>
                    <td className="py-3 px-4">{f.fecha}</td>
                    <td className="py-3 px-4">${f.monto.toLocaleString()} USD</td>
                    <td className="py-3 px-4 text-success font-medium text-xs">{f.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
