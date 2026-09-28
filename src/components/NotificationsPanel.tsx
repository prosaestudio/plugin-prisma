import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BookOpen, Shield, Users, Award, ClipboardCheck, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  course: BookOpen,
  system: Shield,
  user: Users,
  achievement: Award,
  quiz: ClipboardCheck,
};

const typeColors: Record<string, string> = {
  course: "bg-blue-500/10 text-blue-500",
  system: "bg-primary/10 text-primary",
  user: "bg-green-500/10 text-green-500",
  achievement: "bg-amber-500/10 text-amber-500",
  quiz: "bg-purple-500/10 text-purple-500",
};

export function useNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: notifications } = useNotifications();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const markAllRead = async () => {
    if (!user?.id) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-96 max-h-[480px] bg-card rounded-2xl border border-border z-50 overflow-hidden"
            style={{ boxShadow: "0 20px 60px -15px rgba(0,0,0,0.2)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">Notificaciones</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">{unreadCount}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline px-2 py-1">
                    Marcar todo leído
                  </button>
                )}
                <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[400px]">
              {!notifications?.length ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No hay notificaciones</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const Icon = typeIcons[notif.type] || Bell;
                  const color = typeColors[notif.type] || "bg-muted text-muted-foreground";
                  return (
                    <div
                      key={notif.id}
                      className={`flex gap-3 p-4 border-b border-border last:border-0 hover:bg-accent/50 transition-colors ${
                        !notif.is_read ? "bg-primary/[0.03]" : ""
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          {notif.link ? (
                            <Link to={notif.link} onClick={onClose} className="text-sm font-medium text-foreground hover:text-primary line-clamp-1">
                              {notif.title}
                            </Link>
                          ) : (
                            <p className="text-sm font-medium text-foreground line-clamp-1">{notif.title}</p>
                          )}
                          {!notif.is_read && (
                            <button onClick={() => markAsRead(notif.id)} className="shrink-0 p-0.5 text-muted-foreground hover:text-primary" title="Marcar como leído">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{notif.message}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: es })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
