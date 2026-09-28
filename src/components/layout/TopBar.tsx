import { useState } from "react";
import { Bell, Building2, Menu, UserCircle2, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationsPanel, useNotifications } from "@/components/NotificationsPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "@/components/nexia/Breadcrumbs";
import { NexiaSearch } from "@/components/nexia/NexiaSearch";
import { empresa } from "@/lib/nexia-mock";
import { useViewMode } from "@/lib/view-mode";

export function TopBar() {
  const { logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const { data: notifications } = useNotifications();
  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useViewMode();
  const toggleView = () => {
    const next = viewMode === "admin" ? "user" : "admin";
    setViewMode(next);
    navigate(next === "user" ? "/me" : "/dashboard");
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 z-30 border-b border-border bg-background">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground">
          <Menu className="w-5 h-5" />
        </SidebarTrigger>
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-3">
        <NexiaSearch />

        <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          {empresa.integraciones.activas} integraciones activas
        </div>

        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-highlight text-primary-foreground text-[10px] font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground">{empresa.nombre}</p>
            <p className="text-xs text-muted-foreground">Panel organizacional</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <span className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-foreground text-background">
                  <Building2 className="h-4 w-4" />
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuItem onClick={toggleView} className="cursor-pointer">
                {viewMode === "admin" ? (
                  <><UserCircle2 className="w-4 h-4 mr-2" /> Ver como usuario</>
                ) : (
                  <><Shield className="w-4 h-4 mr-2" /> Ver como admin</>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/configuracion")} className="cursor-pointer">
                <User className="w-4 h-4 mr-2" /> Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/configuracion")} className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" /> Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-destructive">
                <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
