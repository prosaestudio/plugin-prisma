import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import prosaLogo from "@/assets/logo-prisma-full.png";
import authBg from "@/assets/auth-bg.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
      <img src={authBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
          <div className="flex items-center gap-2.5 mb-10">
            <img src={prosaLogo} alt="Prosa Learning" className="h-8" />
          </div>

          {sent ? (
            <div>
              <h2 className="text-2xl  mb-2 text-foreground">Revisa tu correo</h2>
              <p className="text-muted-foreground mb-8">Hemos enviado un enlace de restablecimiento a <strong>{email}</strong></p>
              <Link to="/login" className="text-foreground font-medium hover:underline flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl  mb-2 text-foreground">Restablecer contraseña</h2>
              <p className="text-muted-foreground mb-8">Ingresa tu correo y te enviaremos un enlace de restablecimiento</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" placeholder="tu@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl" required />
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar enlace"}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-8">
                <Link to="/login" className="text-foreground font-medium hover:underline flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
