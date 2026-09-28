import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Upload, Palette, Users, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OnboardingProps {
  onComplete: () => void;
}

export function CompanyOnboarding({ onComplete }: OnboardingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#4F6BED");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const steps = [
    { icon: Building2, title: "Tu Empresa", subtitle: "Cuéntanos sobre tu organización" },
    { icon: Palette, title: "Tu Marca", subtitle: "Personaliza los colores y logo" },
    { icon: Sparkles, title: "¡Todo listo!", subtitle: "Tu plataforma está configurada" },
  ];

  const onboardingStorageKey = user?.companyId ? `onboarding_completed_${user.companyId}` : null;

  const markOnboardingCompleted = () => {
    if (onboardingStorageKey) {
      localStorage.setItem(onboardingStorageKey, "true");
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleComplete = async () => {
    if (!user?.companyId) {
      markOnboardingCompleted();
      onComplete();
      return;
    }

    setSaving(true);

    try {
      // Update company name
      if (companyName) {
        await supabase.from("companies").update({ name: companyName, domain: domain || null }).eq("id", user.companyId);
      }

      // Upload logo and save brand
      let logoUrl: string | null = null;
      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `${user.companyId}/logo.${ext}`;
        await supabase.storage.from("company-logos").upload(path, logoFile, { upsert: true });
        const { data } = supabase.storage.from("company-logos").getPublicUrl(path);
        logoUrl = data.publicUrl;
      }

      await supabase.from("company_brand_settings").upsert({
        company_id: user.companyId,
        primary_color: primaryColor,
        logo_url: logoUrl,
      }, { onConflict: "company_id" });

      markOnboardingCompleted();
      toast({ title: "¡Bienvenido!", description: "Tu empresa ha sido configurada exitosamente." });
      onComplete();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    markOnboardingCompleted();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-card rounded-3xl border border-border overflow-hidden"
        style={{ boxShadow: "0 25px 80px -20px rgba(0,0,0,0.2)" }}
      >
        {/* Progress */}
        <div className="flex gap-1.5 p-6 pb-0">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-primary/10">
                {(() => { const Icon = steps[step].icon; return <Icon className="w-6 h-6 text-primary" />; })()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{steps[step].title}</h2>
                <p className="text-sm text-muted-foreground">{steps[step].subtitle}</p>
              </div>
            </div>

            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <Label>Nombre de la Empresa</Label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Ej: Acme Corp" className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label>Dominio web (opcional)</Label>
                  <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="empresa.com" className="mt-1.5 h-11" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label>Logo de la Empresa</Label>
                  <label className="mt-1.5 flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-12 h-12 object-contain rounded-lg" />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground">{logoFile ? logoFile.name : "Sube tu logo (PNG, JPG, SVG)"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                  </label>
                </div>
                <div>
                  <Label>Color Primario</Label>
                  <div className="flex gap-2 mt-1.5">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-11 h-11 rounded-lg border border-border cursor-pointer" />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-11" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-center py-6">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                  <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                </motion.div>
                <h3 className="text-base font-semibold text-foreground">¡Tu plataforma está lista!</h3>
                <p className="text-sm text-muted-foreground mt-2">Puedes empezar a crear cursos, invitar usuarios y personalizar todo desde Configuración.</p>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 0 ? (
                <Button variant="ghost" onClick={() => setStep(s => s - 1)}>Anterior</Button>
              ) : (
                <Button variant="ghost" onClick={handleSkip}>Omitir</Button>
              )}
              {step < 2 ? (
                <Button onClick={() => setStep(s => s + 1)}>
                  Siguiente <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={saving}>
                  {saving ? "Guardando..." : "Comenzar"} <Sparkles className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
