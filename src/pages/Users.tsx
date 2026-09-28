import { useUsers } from "@/hooks/useData";
import { mockUsers } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function UsersPage() {
  const { data: dbUsers } = useUsers();
  const users = dbUsers?.length ? dbUsers.map((u: any) => ({
    id: u.id,
    name: u.full_name,
    email: u.email,
    role: u.user_roles?.[0]?.role || "learner",
    status: "activo" as const,
    lastActive: u.updated_at?.split("T")[0] || "—",
  })) : mockUsers;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Usuarios</h1>
          <p className="page-subtitle">Gestiona los miembros de tu equipo y su acceso</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Invitar Usuario</Button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar usuarios..." className="pl-9 h-10" />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-elevated overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Usuario</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Rol</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Estado</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Última Actividad</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {(user.name || "U").split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground capitalize">{(user.role || "learner").replace("_", " ")}</span>
                </td>
                <td className="p-4">
                  <Badge variant="default" className="text-xs">{user.status}</Badge>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{user.lastActive}</td>
                <td className="p-4">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
