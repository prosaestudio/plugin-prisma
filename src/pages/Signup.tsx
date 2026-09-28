import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import prosaLogo from "@/assets/logo-prisma-full.png";
import authBg from "@/assets/auth-bg.png";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, name);
      toast({
        title: "¡Cuenta creada!",
        description: "Revisa tu correo para confirmar tu cuenta o inicia sesión directamente.",
      });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Error al registrarse",
        description: err.message || "No se pudo crear la cuenta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
      <img src={authBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md relative z-10">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
          <div className="flex items-center gap-2.5 mb-10">
            <img src={prosaLogo} alt="Prosa Learning" className="h-8" />
          </div>

          <h2 className="text-2xl  mb-2 text-foreground">Crea tu cuenta</h2>
          <p className="text-muted-foreground mb-8">Comienza tu camino de aprendizaje hoy</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" placeholder="Juan Pérez" value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="tu@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl" required minLength={6} />
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-foreground font-medium hover:underline">Iniciar sesión</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
