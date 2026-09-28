import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AvatarEditor, AvatarConfig, defaultAvatarConfig, MonsterAvatar } from "@/components/MonsterAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Save, User, Mail, Building2, Shield, BookOpen, Clock,
  Award, CheckCircle2, Calendar, Edit2, X, Camera,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import profileHeroBg from "@/assets/profile-hero-bg.png";

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(defaultAvatarConfig);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [editingInfo, setEditingInfo] = useState(false);
  const [fullName, setFullName] = useState("");
  const [savingInfo, setSavingInfo] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("profiles")
      .select("avatar_config, full_name, avatar_url")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.avatar_config && typeof data.avatar_config === "object") {
          setAvatarConfig({ ...defaultAvatarConfig, ...(data.avatar_config as Partial<AvatarConfig>) });
        }
        if (data?.full_name) setFullName(data.full_name);
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
      });
  }, [user?.id]);

  const { data: enrollments } = useQuery({
    queryKey: ["profile-enrollments", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("enrollments").select("id").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: quizResults } = useQuery({
    queryKey: ["profile-quiz-results", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("quiz_results").select("score, total_questions").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: progressData } = useQuery({
    queryKey: ["profile-progress", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("progress_tracking").select("completed").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const totalEnrollments = enrollments?.length || 0;
  const completedModules = progressData?.filter((p) => p.completed).length || 0;
  const totalModules = progressData?.length || 0;
  const avgScore = quizResults?.length
    ? Math.round(quizResults.reduce((a, r) => a + (r.total_questions > 0 ? (r.score / r.total_questions) * 100 : 0), 0) / quizResults.length)
    : 0;
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  const handleSaveAvatar = async () => {
    if (!user?.id) return;
    setSavingAvatar(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_config: avatarConfig as any })
        .eq("user_id", user.id);
      if (error) throw error;
      toast({ title: "¡Avatar guardado!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSavingAvatar(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    setUploadingPhoto(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${publicUrl}?t=${Date.now()}`;
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("user_id", user.id);
      if (updateError) throw updateError;
      setAvatarUrl(url);
      await refreshUser();
      toast({ title: "¡Foto actualizada!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveInfo = async () => {
    if (!user?.id) return;
    setSavingInfo(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("user_id", user.id);
      if (error) throw error;
      toast({ title: "Perfil actualizado" });
      setEditingInfo(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSavingInfo(false);
    }
  };

  const roleName = user?.role === "super_admin" ? "Super Administrador" : user?.role === "company_admin" ? "Administrador" : "Aprendiz";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground mt-2 text-base">Gestiona tu información personal y personaliza tu avatar</p>
      </div>

      {/* Hero card */}
      <motion.div {...fadeIn} className="rounded-2xl overflow-hidden mb-8 relative">
        <img src={profileHeroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative z-10 p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative group">
            <div className="bg-background rounded-2xl p-3">
              {avatarUrl ? (
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl} alt={user?.name} />
                  <AvatarFallback><MonsterAvatar config={avatarConfig} size={80} /></AvatarFallback>
                </Avatar>
              ) : (
                <MonsterAvatar config={avatarConfig} size={80} />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-background">{user?.name}</h2>
            <p className="text-background/60 mt-1">{user?.email}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-background/10 text-background">
                <Shield className="w-3 h-3" /> {roleName}
              </span>
              {user?.companyName && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-background/10 text-background">
                  <Building2 className="w-3 h-3" /> {user.companyName}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Cursos Inscritos", value: totalEnrollments, icon: BookOpen },
          { label: "Módulos Completados", value: completedModules, icon: CheckCircle2 },
          { label: "Promedio Quizzes", value: `${avgScore}%`, icon: Award },
          { label: "Progreso Global", value: `${overallProgress}%`, icon: Clock },
        ].map((stat, i) => (
          <motion.div key={stat.label} {...fadeIn} transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-muted p-5"
          >
            <stat.icon className="w-5 h-5 text-muted-foreground mb-3" />
            <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal info */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Información Personal</h3>
            {!editingInfo ? (
              <Button variant="ghost" size="sm" onClick={() => setEditingInfo(true)} className="rounded-full">
                <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Editar
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setEditingInfo(false)} className="rounded-full">
                <X className="w-3.5 h-3.5 mr-1.5" /> Cancelar
              </Button>
            )}
          </div>

          {editingInfo ? (
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Nombre completo</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 h-11 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm">Email</Label>
                <Input value={user?.email || ""} disabled className="mt-1 h-11 rounded-xl opacity-60" />
                <p className="text-xs text-muted-foreground mt-1">El email no se puede cambiar</p>
              </div>
              <Button onClick={handleSaveInfo} disabled={savingInfo} className="w-full rounded-xl h-11">
                <Save className="w-4 h-4 mr-2" />
                {savingInfo ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { icon: User, label: "Nombre", value: user?.name },
                { icon: Mail, label: "Email", value: user?.email },
                { icon: Shield, label: "Rol", value: roleName },
                { icon: Building2, label: "Empresa", value: user?.companyName || "—" },
                { icon: Calendar, label: "Miembro desde", value: "Marzo 2026" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                  <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-5 rounded-2xl bg-muted">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">Progreso General</p>
              <p className="text-sm font-semibold text-foreground">{overallProgress}%</p>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">{completedModules} de {totalModules} módulos completados</p>
          </div>
        </motion.div>

        {/* Avatar editor */}
        <motion.div {...fadeIn} transition={{ delay: 0.15 }} className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-5">Personaliza tu Avatar</h3>
          <AvatarEditor config={avatarConfig} onChange={setAvatarConfig} />
          <Button className="w-full mt-6 rounded-xl h-11" onClick={handleSaveAvatar} disabled={savingAvatar}>
            <Save className="w-4 h-4 mr-2" />
            {savingAvatar ? "Guardando..." : "Guardar Avatar"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
