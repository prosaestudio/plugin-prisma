import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { requerimientos, areas } from "@/lib/nexia-mock";
import { PriorityBadge, SectionHeader } from "@/components/nexia/primitives";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ToolLogo } from "@/components/nexia/ToolLogo";

export default function Requerimientos() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [exp, setExp] = useState([3]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Requerimientos de talento"
        subtitle="Perfiles abiertos en búsqueda activa"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90">
                <Plus className="w-4 h-4" /> Nuevo requerimiento
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Nuevo requerimiento de talento</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Rol buscado</Label><Input placeholder="Ej: Prompt Engineer" /></div>
                <div><Label>Área solicitante</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Selecciona área" /></SelectTrigger>
                    <SelectContent>{areas.map((a) => <SelectItem key={a.id} value={a.id}>{a.nombre}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Prioridad</Label>
                  <div className="flex gap-3 mt-1">{["Alta","Media","Baja"].map(p => <label key={p} className="inline-flex items-center gap-1.5 text-sm"><input type="radio" name="prio" /> {p}</label>)}</div>
                </div>
                <div><Label>Descripción del perfil</Label><Textarea rows={3} /></div>
                <div><Label>Herramientas requeridas</Label>
                  <div className="flex flex-wrap gap-3 mt-1">{["ChatGPT","Copilot","Claude","Python","Otros"].map(h => <label key={h} className="inline-flex items-center gap-1.5 text-sm"><Checkbox /> <ToolLogo name={h} size={14} /> {h}</label>)}</div>
                </div>
                <div><Label>Años de experiencia: {exp[0]}</Label><Slider value={exp} onValueChange={setExp} min={0} max={10} step={1} className="mt-2" /></div>
                <div className="grid grid-cols-2 gap-3"><div><Label>Salario min (USD)</Label><Input type="number" placeholder="3000" /></div><div><Label>Salario max (USD)</Label><Input type="number" placeholder="6000" /></div></div>
                <button onClick={() => setOpen(false)} className="w-full py-2.5 rounded-xl bg-foreground text-background font-medium">Crear requerimiento</button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="space-y-3">
        {requerimientos.map((r) => (
          <div key={r.id} className="card-elevated p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="font-semibold">{r.rol}</h3>
                <p className="text-xs text-muted-foreground">{r.area} · {r.experiencia}+ años · USD {r.rangoSalarial.min}-{r.rangoSalarial.max}</p>
              </div>
              <PriorityBadge priority={r.prioridad} />
            </div>
            <p className="text-sm text-muted-foreground mb-3">{r.descripcion}</p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {r.herramientas.map((h) => <span key={h} className="inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-md bg-muted"><ToolLogo name={h} size={12} />{h}</span>)}
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">{r.candidatos} candidatos · {r.etapa}</span>
                <button onClick={() => navigate("/hunting/candidatos")} className="font-medium hover:text-highlight">Ver candidatos →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
