import {
  LayoutDashboard,
  Settings,
  ChevronDown,
  GraduationCap,
  MessageSquare,
  Library,
  UploadCloud,
  GitPullRequest,
  Stethoscope,
  BarChart3,
  Activity,
  FileWarning,
  Sparkles,
  Users2,
  FileDown,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { empresa } from "@/lib/nexia-mock";
import { useViewMode } from "@/lib/view-mode";
import logoPrisma from "@/assets/logo-prisma.png";
import logoPrismaCollapsed from "@/assets/logo-prisma-collapsed.png";
import logoEnaexAsset from "@/assets/logo-enaex.png.asset.json";
const logoEnaex = logoEnaexAsset.url;
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type Item = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };
type Section = { label: string; key: string; items: Item[] };

// ADMIN — reorganizado para Prisma (gestión documental + indicadores del agente)
const adminSections: Section[] = [
  {
    label: "Plugin",
    key: "overview",
    items: [{ title: "Prisma MCP", url: "/dashboard", icon: LayoutDashboard }],
  },
];

const userSections: Section[] = [
  {
    label: "Inicio",
    key: "overview",
    items: [{ title: "Mi espacio", url: "/me", icon: LayoutDashboard }],
  },
  {
    label: "Mi camino",
    key: "user-main",
    items: [
      { title: "Aprendizaje", url: "/me/aprendizaje", icon: GraduationCap },
      { title: "Agente IA", url: "/upskilling/agente", icon: MessageSquare },
    ],
  },
];


export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const [viewMode] = useViewMode();
  const sections = viewMode === "user" ? userSections : adminSections;

  // Determine which section contains the active route
  const activeKey = sections.find((s) => s.items.some((i) => pathname.startsWith(i.url) && i.url !== "/dashboard")) ?.key
    || (pathname === "/dashboard" ? "overview" : "");

  const [open, setOpen] = useState<Record<string, boolean>>({
    overview: true,
    docs: true,
    insights: true,
    tools: true,
    gobernanza: true,
    "user-main": true,
  });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        {!collapsed ? (
          <img src={logoPrisma} alt="Prisma" className="h-7 w-auto" />
        ) : (
          <img src={logoPrismaCollapsed} alt="Prisma" className="h-7 w-auto mx-auto object-contain" />
        )}
      </div>

      <SidebarContent className="pt-2">
        {sections.map((section) => (
          <SidebarGroup key={section.key}>
            {!collapsed && section.key !== "overview" && (
              <button
                onClick={() => setOpen((o) => ({ ...o, [section.key]: !o[section.key] }))}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{section.label}</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", !open[section.key] && "-rotate-90")} />
              </button>
            )}
            {(collapsed || section.key === "overview" || open[section.key]) && (
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => {
                    const isActive =
                      item.url === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname === item.url || (item.url !== "/diagnostico" && item.url !== "/hunting" && item.url !== "/upskilling" && pathname.startsWith(item.url + "/"))
                          || pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={item.url}
                            end={item.url === "/diagnostico" || item.url === "/hunting" || item.url === "/upskilling"}
                            className={({ isActive: navActive }) =>
                              cn(
                                "sidebar-item relative",
                                (navActive || isActive) && "sidebar-item-active before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded-r-full before:bg-foreground"
                              )
                            }
                          >
                            <item.icon className="h-[18px] w-[18px] shrink-0" />
                            {!collapsed && <span>{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/configuracion"
                    className={({ isActive }) =>
                      cn(
                        "sidebar-item relative",
                        isActive && "sidebar-item-active before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded-r-full before:bg-foreground"
                      )
                    }
                  >
                    <Settings className="h-[18px] w-[18px] shrink-0" />
                    {!collapsed && <span>Configuración</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="px-2 py-2 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Empresa</div>
            <img src={logoEnaex} alt={empresa.nombre} className="h-6 w-auto object-contain" />
            <div className="text-[11px] text-muted-foreground">Plan {empresa.plan}</div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mx-auto overflow-hidden">
            <img src={logoEnaex} alt={empresa.nombre} className="w-6 h-6 object-contain" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
