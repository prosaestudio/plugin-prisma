import { useState } from "react";
import { motion } from "framer-motion";
import { Plug, ExternalLink, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Integration {
 id: string;
 name: string;
 description: string;
 icon: string;
 connected: boolean;
}

const defaultIntegrations: Integration[] = [
 { id: "gdrive", name: "Google Drive", description: "Importa documentos y presentaciones desde Drive.", icon: "", connected: false },
 { id: "notion", name: "Notion", description: "Sincroniza bases de conocimiento de Notion.", icon: "", connected: false },
 { id: "confluence", name: "Confluence", description: "Conecta la wiki corporativa de Atlassian.", icon: "", connected: false },
 { id: "slack", name: "Slack", description: "Notificaciones y micro-aprendizaje directo en Slack.", icon: "", connected: false },
 { id: "whatsapp", name: "WhatsApp Business", description: "Envía píldoras de aprendizaje y recordatorios.", icon: "", connected: false },
 { id: "teams", name: "Microsoft Teams", description: "Integración con el ecosistema Microsoft 365.", icon: "", connected: false },
 { id: "zapier", name: "Zapier", description: "Conecta con +5000 apps mediante automatizaciones.", icon: "", connected: false },
 { id: "sap", name: "SAP SuccessFactors", description: "Sincroniza datos de RRHH y evaluaciones.", icon: "", connected: false },
];

export default function Integrations() {
 const { toast } = useToast();
 const [integrations, setIntegrations] = useState(defaultIntegrations);

 const toggle = (id: string) => {
 setIntegrations((prev) =>
 prev.map((int) => {
 if (int.id !== id) return int;
 const next = !int.connected;
 toast({
 title: next ? `${int.name} conectado` : `${int.name} desconectado`,
 description: next
 ? "La integración se activó correctamente (simulación)."
 : "La integración fue desactivada.",
 });
 return { ...int, connected: next };
 })
 );
 };

 const connectedCount = integrations.filter((i) => i.connected).length;

 return (
 <div className="max-w-5xl mx-auto">
 <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
 <div className="flex items-center gap-3 mb-2">
 <div className="p-2.5 rounded-xl bg-primary/10">
 <Plug className="w-6 h-6 text-primary" />
 </div>
 <h1 className="text-3xl font-semibold text-foreground">Integraciones</h1>
 {connectedCount > 0 && (
 <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
 {connectedCount} activas
 </span>
 )}
 </div>
 <p className="text-muted-foreground text-lg mt-2 max-w-2xl">
 Conecta las fuentes de conocimiento de tu empresa para que la IA responda con información viva, no solo con cursos formales.
 </p>
 </motion.div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 {integrations.map((int, i) => (
 <motion.div
 key={int.name}
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.04 }}
 className={`rounded-2xl border p-5 flex items-start gap-4 transition-all ${
 int.connected ? "border-primary/30 bg-primary/5" : "border-border hover:border-primary/30"
 }`}
 >
 <div className="text-3xl shrink-0">{int.icon}</div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <h3 className="text-sm font-semibold text-foreground">{int.name}</h3>
 {int.connected ? (
 <CheckCircle2 className="w-4 h-4 text-green-500" />
 ) : (
 <Circle className="w-4 h-4 text-muted-foreground/30" />
 )}
 </div>
 <p className="text-xs text-muted-foreground mb-3">{int.description}</p>
 <Button
 variant={int.connected ? "outline" : "default"}
 size="sm"
 className="rounded-full text-xs gap-1.5"
 onClick={() => toggle(int.id)}
 >
 {int.connected ? "Desconectar" : "Conectar"} <ExternalLink className="w-3 h-3" />
 </Button>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 );
}