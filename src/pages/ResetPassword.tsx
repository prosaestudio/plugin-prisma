import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import prosaLogo from "@/assets/logo-prisma-full.png";
import authBg from "@/assets/auth-bg.png";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" && session) {
          setSessionReady(true);
          setChecking(false);
        } else if (event === "SIGNED_IN" && session) {
          const hash = window.location.hash;
          if (hash.includes("type=recovery")) {
            setSessionReady(true);
            setChecking(false);
          }
        }
      }
    );

    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessionReady(true);
      }
      setChecking(false);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Las contraseñas no coinciden", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "¡Contraseña actualizada!", description: "Ya puedes iniciar sesión con tu nueva contraseña." });
      await supabase.auth.signOut();
      navigate("/login");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <img src={authBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 animate-pulse text-muted-foreground">Verificando enlace...</div>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 relative">
        <img src={authBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-lg text-center">
            <h2 className="text-2xl  mb-2 text-foreground">Enlace inválido o expirado</h2>
            <p className="text-muted-foreground mb-6">Solicita un nuevo enlace de restablecimiento de contraseña.</p>
            <Button onClick={() => navigate("/forgot-password")} className="w-full h-11 rounded-xl">
              Solicitar nuevo enlace
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
      <img src={authBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
          <div className="flex items-center gap-2.5 mb-10">
            <img src={prosaLogo} alt="Prosa Learning" className="h-8" />
          </div>

          <h2 className="text-2xl  mb-2 text-foreground">Nueva contraseña</h2>
          <p className="text-muted-foreground mb-8">Ingresa tu nueva contraseña</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl" required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar contraseña</Label>
              <Input id="confirm" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-11 rounded-xl" required minLength={6} />
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
