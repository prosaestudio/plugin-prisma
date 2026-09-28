import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Building2, Palette, Bell, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#4F6BED");
  const [secondaryColor, setSecondaryColor] = useState("#F0F2F5");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingBrand, setSavingBrand] = useState(false);

  useEffect(() => {
    if (!user?.companyId) return;
    // Load company info
    supabase.from("companies").select("*").eq("id", user.companyId).single().then(({ data }) => {
      if (data) {
        setCompanyName(data.name);
        setDomain(data.domain || "");
      }
    });
    // Load brand settings
    supabase.from("company_brand_settings").select("*").eq("company_id", user.companyId).single().then(({ data }) => {
      if (data) {
        setPrimaryColor(data.primary_color || "#4F6BED");
        setSecondaryColor(data.secondary_color || "#F0F2F5");
        setWelcomeMessage(data.welcome_message || "");
        setLogoUrl(data.logo_url);
        setLogoPreview(data.logo_url);
      }
    });
  }, [user?.companyId]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSaveCompany = async () => {
    if (!user?.companyId) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("companies").update({
        name: companyName,
        domain: domain || null,
      }).eq("id", user.companyId);
      if (error) throw error;
      toast({ title: "Guardado", description: "Información de la empresa actualizada." });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBranding = async () => {
    if (!user?.companyId) return;
    setSavingBrand(true);
    try {
      let finalLogoUrl = logoUrl;

      // Upload logo if new file selected
      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `${user.companyId}/logo.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("company-logos")
          .upload(path, logoFile, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("company-logos").getPublicUrl(path);
        finalLogoUrl = urlData.publicUrl;
      }

      // Upsert brand settings
      const { error } = await supabase.from("company_brand_settings").upsert({
        company_id: user.companyId,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        welcome_message: welcomeMessage,
        logo_url: finalLogoUrl,
      }, { onConflict: "company_id" });
      if (error) throw error;

      setLogoUrl(finalLogoUrl);
      setLogoFile(null);
      toast({ title: "Marca guardada", description: "Los colores y logo se han actualizado." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSavingBrand(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="page-header">
        <h1 className="page-title">Configuración</h1>
        <p className="page-subtitle">Gestiona tu empresa y personaliza la plataforma</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList>
            <TabsTrigger value="company" className="gap-2">
              <Building2 className="w-4 h-4" /> Empresa
            </TabsTrigger>
            <TabsTrigger value="branding" className="gap-2">
              <Palette className="w-4 h-4" /> Marca
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" /> Notificaciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-6">
            <div className="card-elevated p-6 space-y-5">
              <h3 className="text-base font-semibold text-foreground">Información de la Empresa</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre de la Empresa</Label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label>Dominio</Label>
                  <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="empresa.com" className="h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Mensaje de Bienvenida</Label>
                <Textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} placeholder="¡Bienvenido a nuestra plataforma de aprendizaje!" className="min-h-20" />
              </div>
              <Button onClick={handleSaveCompany} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <div className="card-elevated p-6 space-y-5">
              <h3 className="text-base font-semibold text-foreground">Personalización de Marca</h3>

              {/* Logo */}
              <div className="space-y-2">
                <Label>Logo de la Empresa</Label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center hover:border-primary transition-colors overflow-hidden">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                      ) : (
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                  </label>
                  <div className="text-sm text-muted-foreground">
                    <p>Haz clic para subir tu logo</p>
                    <p className="text-xs mt-1">PNG, JPG o SVG. Máximo 2MB.</p>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Color Primario</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                    />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10" />
                  </div>
                  <div className="h-8 rounded-lg mt-1" style={{ backgroundColor: primaryColor }} />
                </div>
                <div className="space-y-2">
                  <Label>Color Secundario</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                    />
                    <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-10" />
                  </div>
                  <div className="h-8 rounded-lg mt-1" style={{ backgroundColor: secondaryColor }} />
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Vista Previa</Label>
                <div className="p-6 rounded-xl border border-border" style={{ backgroundColor: secondaryColor }}>
                  <div className="flex items-center gap-3 mb-4">
                    {logoPreview && <img src={logoPreview} alt="Logo" className="w-10 h-10 object-contain" />}
                    <span className="text-lg font-semibold" style={{ color: primaryColor }}>
                      {companyName || "Tu Empresa"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: primaryColor }}>
                      Botón Primario
                    </div>
                    <div className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: primaryColor, color: primaryColor }}>
                      Botón Secundario
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveBranding} disabled={savingBrand}>
                <Save className="w-4 h-4 mr-2" />
                {savingBrand ? "Guardando..." : "Guardar Marca"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="card-elevated p-6 space-y-5">
              <h3 className="text-base font-semibold text-foreground">Preferencias de Notificaciones</h3>
              {[
                { title: "Asignación de cursos", desc: "Recibe notificaciones cuando se asignen nuevos cursos" },
                { title: "Recordatorios de evaluaciones", desc: "Recuerda a los usuarios sobre evaluaciones pendientes" },
                { title: "Alertas de completado", desc: "Notifica a los admins cuando los usuarios completen cursos" },
                { title: "Resumen semanal", desc: "Resumen semanal de la actividad de aprendizaje" },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Guardar Preferencias
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
