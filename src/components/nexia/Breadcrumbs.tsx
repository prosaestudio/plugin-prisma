import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  diagnostico: "Diagnóstico",
  integraciones: "Integraciones",
  areas: "Por área",
  colaboradores: "Por área",
  flujos: "Flujos",
  seguridad: "Seguridad IA",
  roles: "Roles sugeridos",
  hunting: "Talent Hunting",
  requerimientos: "Requerimientos",
  candidatos: "Candidatos",
  upskilling: "Upskilling",
  rutas: "Rutas",
  agente: "Agente IA",
  configuracion: "Configuración",
};

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <nav className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
      {parts.map((part, i) => {
        const href = "/" + parts.slice(0, i + 1).join("/");
        const label = labelMap[part] || decodeURIComponent(part);
        const isLast = i === parts.length - 1;
        return (
          <span key={href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
            {isLast ? (
              <span className="text-foreground font-medium capitalize">{label}</span>
            ) : (
              <Link to={href} className="hover:text-foreground transition-colors capitalize">{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
