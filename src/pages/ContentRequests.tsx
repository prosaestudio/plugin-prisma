import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

import styleFlatDesign from "@/assets/styles/style-flat-design.jpg";
import style3dCartoon from "@/assets/styles/style-3d-cartoon.jpg";
import styleMotionGraphics from "@/assets/styles/style-motion-graphics.jpg";
import styleIsometric from "@/assets/styles/style-isometric.jpg";
import styleCinematic from "@/assets/styles/style-cinematic.jpg";
import styleRetro from "@/assets/styles/style-retro.jpg";
import styleWatercolor from "@/assets/styles/style-watercolor.jpg";
import stylePapercut from "@/assets/styles/style-papercut.jpg";
import styleFlatCorporate from "@/assets/styles/style-flat-corporate.jpg";
import style3dRender from "@/assets/styles/style-3d-render.jpg";
import styleMotionAbstract from "@/assets/styles/style-motion-abstract.jpg";
import styleIsometricTech from "@/assets/styles/style-isometric-tech.jpg";
import styleNeonCyber from "@/assets/styles/style-neon-cyber.jpg";
import styleLowPoly from "@/assets/styles/style-low-poly.jpg";
import styleCollage from "@/assets/styles/style-collage.jpg";
import styleLineArt from "@/assets/styles/style-line-art.jpg";
import styleGradientAurora from "@/assets/styles/style-gradient-aurora.jpg";
import styleComicPop from "@/assets/styles/style-comic-pop.jpg";
import styleClaymation from "@/assets/styles/style-claymation.jpg";
import styleInfographic from "@/assets/styles/style-infographic.jpg";
import styleHandDrawn from "@/assets/styles/style-hand-drawn.jpg";
import styleMinimalistGeo from "@/assets/styles/style-minimalist-geo.jpg";
import styleGlassmorphism from "@/assets/styles/style-glassmorphism.jpg";
import stylePixelArt from "@/assets/styles/style-pixel-art.jpg";
import stylePhotorealism from "@/assets/styles/style-photorealism.jpg";
import styleRealisticIllustration from "@/assets/styles/style-realistic-illustration.jpg";
import styleCorporate3d from "@/assets/styles/style-corporate-3d.jpg";
import style3dKids from "@/assets/styles/style-3d-kids.jpg";
import styleCelShading from "@/assets/styles/style-cel-shading.jpg";
import styleMemphis from "@/assets/styles/style-memphis.jpg";
import styleArtDeco from "@/assets/styles/style-art-deco.jpg";
import styleVaporwave from "@/assets/styles/style-vaporwave.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import {
 Plus, Video, Sparkles, FileText, Send, Package, Eye,
 Pencil, Check, Clock, Loader2, ChevronRight, Palette,
 Target, Users as UsersIcon, Timer, MessageSquare, CheckCircle2,
 XCircle, ArrowLeft, BookOpen, Library, CalendarIcon
} from "lucide-react";
import { AiAvatar } from "@/components/AiAvatar";

type ContentRequest = {
 id: string; title: string; description: string | null; objectives: string | null;
 target_audience: string | null; video_duration: string | null; animation_style: string | null;
 selected_style: any; script_blocks: any; status: string; assigned_course_id: string | null;
 delivery_url: string | null; delivery_notes: string | null; corrections: any;
 finalized_at: string | null; created_at: string; company_id: string; requested_by: string;
};

type StyleSuggestion = {
 id: string; name: string; description: string; keywords: string;
 color_palette: string[]; example_prompt: string; image_url?: string;
};

type ScriptBlock = {
 id: string; title: string; duration: string; narration: string;
 visual_notes: string; transition: string;
};

type Correction = {
 id: string; block_id?: string; type: string; comment: string;
 resolved: boolean; created_at: string;
};

const FALLBACK_STYLES: StyleSuggestion[] = [
 { id: "fb_1", name: "Flat Design Moderno", description: "Estilo limpio con formas geométricas, líneas definidas y colores pasteles vibrantes. Ideal para conceptos claros y directos.", keywords: "flat, minimalista, geométrico, limpio", color_palette: ["#A8D8EA", "#AA96DA", "#FCBAD3", "#FFFFD2"], example_prompt: "", image_url: styleFlatDesign },
 { id: "fb_2", name: "3D Cartoon Pixar", description: "Personajes 3D estilo Pixar con colores vibrantes y iluminación suave. Genera cercanía y engagement con la audiencia.", keywords: "3D, cartoon, Pixar, personajes", color_palette: ["#4A90D9", "#F5A623", "#7ED321", "#E8727A"], example_prompt: "", image_url: style3dCartoon },
 { id: "fb_3", name: "Motion Graphics Cinético", description: "Formas abstractas en movimiento, gradientes dinámicos y tipografía cinética. Ideal para datos y procesos.", keywords: "motion, abstracto, gradientes, dinámico", color_palette: ["#2D1B69", "#4A3AFF", "#00D4FF", "#FF00E5"], example_prompt: "", image_url: styleMotionGraphics },
 { id: "fb_4", name: "Isométrico Técnico", description: "Ilustraciones en vista isométrica con profundidad y detalle. Perfecto para mostrar espacios, flujos y sistemas.", keywords: "isométrico, 3D, vectorial, espacios", color_palette: ["#E8F4FD", "#B8D4E3", "#6B9EC2", "#2C5F8A"], example_prompt: "", image_url: styleIsometric },
 { id: "fb_5", name: "Cinematic Dramático", description: "Iluminación dramática estilo cinematográfico con atmósferas impactantes. Ideal para temas de liderazgo y alto impacto.", keywords: "cinematic, dramático, spotlight, película", color_palette: ["#0A0A0A", "#1A1A2E", "#E94560", "#FFD700"], example_prompt: "", image_url: styleCinematic },
 { id: "fb_6", name: "Retro Synthwave 80s", description: "Estética retro años 80 con neones, grids y colores vibrantes. Genera nostalgia y capta la atención rápidamente.", keywords: "retro, 80s, neon, synthwave", color_palette: ["#FF006E", "#8338EC", "#3A86FF", "#06D6A0"], example_prompt: "", image_url: styleRetro },
 { id: "fb_7", name: "Acuarela Artística", description: "Texturas suaves de acuarela con tonos orgánicos y delicados. Ideal para contenido de bienestar, cultura y soft skills.", keywords: "acuarela, artístico, suave, orgánico", color_palette: ["#FFB5C2", "#F0E4D7", "#A7C7E7", "#C5E1A5"], example_prompt: "", image_url: styleWatercolor },
 { id: "fb_8", name: "Paper Cut Craft", description: "Efecto de recortes de papel con capas y profundidad. Creativo y llamativo, ideal para temas de innovación y creatividad.", keywords: "paper cut, capas, recorte, craft", color_palette: ["#00BCD4", "#FF5722", "#FFC107", "#4CAF50"], example_prompt: "", image_url: stylePapercut },
 { id: "fb_9", name: "Flat Corporate Infográfico", description: "Diseño flat corporativo con gráficos de datos, dashboards y visualización de información clara y profesional.", keywords: "corporate, datos, dashboard, profesional", color_palette: ["#1E3A5F", "#4A90D9", "#E8F1FA", "#F39C12"], example_prompt: "", image_url: styleFlatCorporate },
 { id: "fb_10", name: "3D Render Realista", description: "Renderizado 3D con iluminación realista, texturas y sombras. Ideal para productos, arquitectura y visualización técnica.", keywords: "3D, render, realista, producto", color_palette: ["#2C3E50", "#ECF0F1", "#3498DB", "#E74C3C"], example_prompt: "", image_url: style3dRender },
 { id: "fb_11", name: "Neón Futurista", description: "Estilo futurista con brillos neón sobre fondos oscuros. Perfecto para tecnología, innovación y temas digitales.", keywords: "neon, futurista, glow, cyberpunk", color_palette: ["#0D0D0D", "#00F5FF", "#FF00FF", "#39FF14"], example_prompt: "", image_url: styleNeonCyber },
 { id: "fb_12", name: "Low Poly Abstracto", description: "Formas poligonales con degradados suaves que crean paisajes y figuras abstractas. Moderno y visualmente llamativo.", keywords: "low poly, poligonal, abstracto, geométrico", color_palette: ["#E8B4CB", "#C490D1", "#7B68C8", "#4A47A3"], example_prompt: "", image_url: styleLowPoly },
 { id: "fb_13", name: "Collage Mixed Media", description: "Mezcla de fotografías, texturas, recortes e ilustraciones. Estilo editorial y artístico que rompe con lo convencional.", keywords: "collage, mixed media, editorial, texturas", color_palette: ["#D4A373", "#FAEDCD", "#CCD5AE", "#E9EDC9"], example_prompt: "", image_url: styleCollage },
 { id: "fb_14", name: "Line Art Minimalista", description: "Ilustraciones de línea continua con estilo elegante y minimalista. Ideal para storytelling sutil y sofisticado.", keywords: "line art, minimal, trazo, elegante", color_palette: ["#1A1A1A", "#FFFFFF", "#F0F0F0", "#CCCCCC"], example_prompt: "", image_url: styleLineArt },
 { id: "fb_15", name: "Gradiente Aurora", description: "Fondos con gradientes tipo aurora boreal, colores fluidos y transiciones suaves. Ideal para temas de bienestar y transformación.", keywords: "gradiente, aurora, fluido, transición", color_palette: ["#667EEA", "#764BA2", "#F093FB", "#F5576C"], example_prompt: "", image_url: styleGradientAurora },
 { id: "fb_16", name: "Comic Pop Art", description: "Estilo cómic con colores primarios, tramas de puntos y efectos pop art. Enérgico y divertido para engagement alto.", keywords: "comic, pop art, vibrante, puntos", color_palette: ["#FF0000", "#FFFF00", "#0000FF", "#FF69B4"], example_prompt: "", image_url: styleComicPop },
 { id: "fb_17", name: "Claymation Stop Motion", description: "Estética de plastilina y stop motion con texturas táctiles. Cálido y artesanal, ideal para onboarding y cultura.", keywords: "claymation, plastilina, stop motion, táctil", color_palette: ["#FF7043", "#FFD54F", "#81C784", "#64B5F6"], example_prompt: "", image_url: styleClaymation },
 { id: "fb_18", name: "Infográfico Animado", description: "Visualización de datos con gráficos animados, íconos y números en movimiento. Perfecto para reportes y KPIs.", keywords: "infográfico, datos, gráficos, métricas", color_palette: ["#26547C", "#EF476F", "#FFD166", "#06D6A0"], example_prompt: "", image_url: styleInfographic },
 { id: "fb_19", name: "Hand Drawn Sketch", description: "Estilo dibujado a mano con trazos imperfectos y orgánicos. Transmite cercanía, autenticidad y enfoque humano.", keywords: "sketch, dibujado, orgánico, humano", color_palette: ["#2D2D2D", "#F5F0E8", "#C9B99A", "#8B7355"], example_prompt: "", image_url: styleHandDrawn },
 { id: "fb_20", name: "Minimalista Geométrico", description: "Composiciones con formas geométricas puras, mucho espacio en blanco y paleta limitada. Sofisticado y contemporáneo.", keywords: "minimalista, geométrico, clean, espacio", color_palette: ["#FAFAFA", "#333333", "#FF6B6B", "#4ECDC4"], example_prompt: "", image_url: styleMinimalistGeo },
 { id: "fb_21", name: "Glassmorphism UI", description: "Efecto de cristal esmerilado con transparencias y blur. Tendencia visual moderna ideal para temas tech y digital.", keywords: "glass, blur, transparencia, moderno", color_palette: ["#667EEA", "#FFFFFF80", "#764BA2", "#E8E8E8"], example_prompt: "", image_url: styleGlassmorphism },
 { id: "fb_22", name: "Pixel Art Retro", description: "Estética de videojuegos retro con píxeles visibles. Divertido y nostálgico, excelente para gamificación y engagement.", keywords: "pixel, retro, gaming, 8-bit", color_palette: ["#0F380F", "#306230", "#8BAC0F", "#9BBC0F"], example_prompt: "", image_url: stylePixelArt },
 { id: "fb_23", name: "Motion Abstract Vibrante", description: "Animación abstracta con colores vibrantes y composiciones dinámicas. Impacto visual alto para intros y transiciones.", keywords: "abstracto, vibrante, dinámico, impacto", color_palette: ["#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9"], example_prompt: "", image_url: styleMotionAbstract },
 { id: "fb_24", name: "Isométrico Tech", description: "Vista isométrica con estética tecnológica, circuitos y elementos digitales. Ideal para temas de IT, ciberseguridad y datos.", keywords: "isométrico, tech, circuitos, digital", color_palette: ["#0D1B2A", "#1B2838", "#2EC4B6", "#E8FDF5"], example_prompt: "", image_url: styleIsometricTech },
 { id: "fb_25", name: "Foto Realismo", description: "Escenas fotorrealistas con personas reales en entornos corporativos. Máxima credibilidad y conexión emocional directa.", keywords: "foto, realismo, personas, corporativo", color_palette: ["#2C3E50", "#BDC3C7", "#F39C12", "#E74C3C"], example_prompt: "", image_url: stylePhotorealism },
 { id: "fb_26", name: "Ilustración Realista", description: "Estilo de ilustración digital semi-realista con pinceladas visibles. Combina la calidez artística con la claridad profesional.", keywords: "ilustración, realista, pintura, editorial", color_palette: ["#D4A574", "#8FA5B2", "#E8C8A0", "#5B7B8A"], example_prompt: "", image_url: styleRealisticIllustration },
 { id: "fb_27", name: "Corporativo 3D", description: "Personajes 3D profesionales en entornos de oficina. Estilo pulido y corporativo, ideal para capacitaciones formales.", keywords: "3D, corporativo, profesional, oficina", color_palette: ["#1A365D", "#4A90D9", "#EDF2F7", "#2D3748"], example_prompt: "", image_url: styleCorporate3d },
 { id: "fb_28", name: "3D Infantil Kawaii", description: "Personajes 3D adorables con ojos grandes y colores candy. Ideal para contenido educativo lúdico y gamificación.", keywords: "3D, infantil, kawaii, cute", color_palette: ["#FFB6C1", "#87CEEB", "#98FB98", "#FFD700"], example_prompt: "", image_url: style3dKids },
 { id: "fb_29", name: "Cel Shading Anime", description: "Estilo anime con sombreado plano y contornos marcados. Dinámico y expresivo, ideal para narrativas con personajes.", keywords: "anime, cel shading, japón, expresivo", color_palette: ["#F4A261", "#E76F51", "#264653", "#2A9D8F"], example_prompt: "", image_url: styleCelShading },
 { id: "fb_30", name: "Memphis Design", description: "Patrón Memphis con formas geométricas audaces, colores primarios y líneas zigzag. Divertido y energético.", keywords: "memphis, 90s, geométrico, audaz", color_palette: ["#FF0054", "#FFD600", "#00B4D8", "#9B5DE5"], example_prompt: "", image_url: styleMemphis },
 { id: "fb_31", name: "Art Deco Elegante", description: "Diseño Art Deco con patrones dorados y geométricos sobre fondo oscuro. Sofisticado y premium, ideal para liderazgo.", keywords: "art deco, dorado, elegante, lujo", color_palette: ["#0D0D0D", "#D4AF37", "#1A5653", "#F5F5DC"], example_prompt: "", image_url: styleArtDeco },
 { id: "fb_32", name: "Vaporwave Estético", description: "Estética vaporwave con tonos rosa y púrpura, elementos retro digitales y atmósfera nostálgica. Único y llamativo.", keywords: "vaporwave, retro, digital, estético", color_palette: ["#FF71CE", "#B967FF", "#01CDFE", "#05FFA1"], example_prompt: "", image_url: styleVaporwave },
];

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
 draft: { label: "Borrador", color: "bg-muted text-muted-foreground", icon: <FileText className="h-3 w-3" /> },
 submitted: { label: "Enviada", color: "bg-muted text-foreground", icon: <Send className="h-3 w-3" /> },
 received: { label: "Recibida", color: "bg-muted text-foreground", icon: <Package className="h-3 w-3" /> },
 in_progress: { label: "En ejecución", color: "bg-foreground text-background", icon: <Loader2 className="h-3 w-3 animate-spin" /> },
 delivered: { label: "Entregada", color: "bg-muted text-foreground", icon: <Eye className="h-3 w-3" /> },
 corrections: { label: "En correcciones", color: "bg-highlight/10 text-highlight", icon: <Pencil className="h-3 w-3" /> },
 finalized: { label: "Finalizada", color: "bg-foreground text-background", icon: <CheckCircle2 className="h-3 w-3" /> },
};

export default function ContentRequests() {
 const { user } = useAuth();
 const { toast } = useToast();
 const [requests, setRequests] = useState<ContentRequest[]>([]);
 const [loading, setLoading] = useState(true);
 const [activeView, setActiveView] = useState<"list" | "create" | "detail">("list");
 const [selectedRequest, setSelectedRequest] = useState<ContentRequest | null>(null);
 const [createStep, setCreateStep] = useState(0);

 const [form, setForm] = useState({
 title: "", description: "", objectives: "", target_audience: "", video_duration: "2-3 minutos", deadline: undefined as Date | undefined, deadlineTime: "18:00",
 });

 const [styles, setStyles] = useState<StyleSuggestion[]>([]);
 const [selectedStyle, setSelectedStyle] = useState<StyleSuggestion | null>(null);
 const [scriptBlocks, setScriptBlocks] = useState<ScriptBlock[]>([]);
 const [aiLoading, setAiLoading] = useState(false);

 const [newCorrection, setNewCorrection] = useState("");
 const [correctionBlockId, setCorrectionBlockId] = useState<string>("");
 const [correctionType, setCorrectionType] = useState("general");

 const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
 const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false);
 const [finalizeTarget, setFinalizeTarget] = useState<"course" | "library">("library");
 const [selectedCourseId, setSelectedCourseId] = useState("");

 // AI Spec Assistant state
 const [specMessages, setSpecMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
 const [specInput, setSpecInput] = useState("");
 const [specLoading, setSpecLoading] = useState(false);
 const [specOpen, setSpecOpen] = useState(true);
 const specChatEndRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 specChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
 }, [specMessages]);

 useEffect(() => { fetchRequests(); fetchCourses(); }, []);

 async function fetchRequests() {
 setLoading(true);
 const { data, error } = await supabase.from("content_requests").select("*").order("created_at", { ascending: false });
 if (!error && data) setRequests(data as unknown as ContentRequest[]);
 setLoading(false);
 }

 async function fetchCourses() {
 const { data } = await supabase.from("courses").select("id, title");
 if (data) setCourses(data);
 }

 async function suggestStyles() {
 setAiLoading(true);
 setSelectedStyle(null);
 try {
 const { data, error } = await supabase.functions.invoke("content-ai", { body: { action: "suggest_styles", data: form } });
 if (error) throw error;
 if (data?.result && data.result.length > 0) {
 setStyles(data.result);
 generateStyleImages(data.result);
 } else throw new Error("No styles returned");
 } catch (e: any) {
 toast({ title: "Usando estilos de referencia", description: "Se muestran estilos prediseñados como guía visual." });
 setStyles(FALLBACK_STYLES);
 }
 setAiLoading(false);
 }

 async function generateStyleImages(styleList: StyleSuggestion[]) {
 // Generate images 2 at a time to avoid rate limits
 for (let i = 0; i < styleList.length; i += 2) {
 const batch = styleList.slice(i, i + 2);
 await Promise.allSettled(
 batch.map(async (style) => {
 try {
 const { data } = await supabase.functions.invoke("content-ai", {
 body: { action: "generate_style_image", data: { prompt: `${style.example_prompt}. Style: ${style.name}` } },
 });
 if (data?.image_url) {
 setStyles((prev) =>
 prev.map((s) => s.id === style.id ? { ...s, image_url: data.image_url } : s)
 );
 }
 } catch {
 // Image generation failed - gradient fallback will show
 }
 })
 );
 }
 }

 async function generateScript() {
 if (!selectedStyle) return;
 setAiLoading(true);
 try {
 const { data, error } = await supabase.functions.invoke("content-ai", { body: { action: "generate_script", data: { ...form, style_name: selectedStyle.name } } });
 if (error) throw error;
 if (data?.result) setScriptBlocks(data.result); else throw new Error("No script returned");
 } catch (e: any) {
 toast({ title: "Error generando guión", description: e.message, variant: "destructive" });
 }
 setAiLoading(false);
 }

 async function submitRequest() {
 if (!user?.companyId) return;
 const { error } = await supabase.from("content_requests").insert({
 company_id: user.companyId, requested_by: user.id, title: form.title,
 description: form.description, objectives: form.objectives,
 target_audience: form.target_audience, video_duration: form.video_duration,
 animation_style: selectedStyle?.name || null, selected_style: selectedStyle as any,
 script_blocks: scriptBlocks as any, status: "submitted",
 deadline: form.deadline ? `${format(form.deadline, "yyyy-MM-dd")}T${form.deadlineTime}:00` : null,
 } as any);
 if (error) {
 toast({ title: "Error", description: error.message, variant: "destructive" });
 } else {
 toast({ title: "¡Solicitud enviada!" });
 resetForm(); fetchRequests(); setActiveView("list");
 }
 }

 function resetForm() {
 setForm({ title: "", description: "", objectives: "", target_audience: "", video_duration: "2-3 minutos", deadline: undefined, deadlineTime: "18:00" });
 setStyles([]); setSelectedStyle(null); setScriptBlocks([]); setCreateStep(0);
 setSpecMessages([]); setSpecInput(""); setSpecOpen(true);
 }

 async function sendSpecAssist() {
 if (!specInput.trim() || specLoading) return;
 const userMsg = { role: "user" as const, content: specInput.trim() };
 const newMessages = [...specMessages, userMsg];
 setSpecMessages(newMessages);
 setSpecInput("");
 setSpecLoading(true);
 try {
 const { data, error } = await supabase.functions.invoke("content-ai", {
 body: { action: "spec_assist", data: { messages: newMessages, form } },
 });
 if (error) throw error;
 setSpecMessages([...newMessages, { role: "assistant", content: data.reply || "No pude procesar tu mensaje." }]);
 } catch {
 setSpecMessages([...newMessages, { role: "assistant", content: "Error al procesar. Intenta de nuevo." }]);
 } finally {
 setSpecLoading(false);
 }
 }

 async function addCorrection() {
 if (!selectedRequest || !newCorrection.trim()) return;
 const existing = (selectedRequest.corrections as Correction[]) || [];
 const correction: Correction = {
 id: crypto.randomUUID(), block_id: correctionBlockId || undefined,
 type: correctionType, comment: newCorrection, resolved: false, created_at: new Date().toISOString(),
 };
 const updated = [...existing, correction];
 const { error } = await supabase.from("content_requests")
 .update({ corrections: updated as any, status: "corrections" } as any).eq("id", selectedRequest.id);
 if (!error) {
 setSelectedRequest({ ...selectedRequest, corrections: updated, status: "corrections" });
 setNewCorrection(""); setCorrectionBlockId(""); toast({ title: "Corrección agregada" }); fetchRequests();
 }
 }

 async function toggleCorrectionResolved(corrId: string) {
 if (!selectedRequest) return;
 const corrections = ((selectedRequest.corrections as Correction[]) || []).map((c) =>
 c.id === corrId ? { ...c, resolved: !c.resolved } : c
 );
 await supabase.from("content_requests").update({ corrections: corrections as any } as any).eq("id", selectedRequest.id);
 setSelectedRequest({ ...selectedRequest, corrections }); fetchRequests();
 }

 async function finalizeRequest() {
 if (!selectedRequest) return;
 const updateData: any = { status: "finalized", finalized_at: new Date().toISOString() };
 if (finalizeTarget === "course" && selectedCourseId) updateData.assigned_course_id = selectedCourseId;
 await supabase.from("content_requests").update(updateData).eq("id", selectedRequest.id);
 toast({ title: "¡Contenido finalizado!" });
 setFinalizeDialogOpen(false); setSelectedRequest(null); setActiveView("list"); fetchRequests();
 }

 const steps = ["Especificaciones", "Estilos con IA", "Guión con IA", "Revisar y Enviar"];

 // LIST VIEW
 if (activeView === "list") {
 return (
 <div className="space-y-8">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">Solicitudes de Contenido</h1>
 <p className="text-muted-foreground mt-2 text-base">Solicita y gestiona la producción de videos educativos</p>
 </div>
 <Button onClick={() => setActiveView("create")} className="gap-2 rounded-full h-11 px-6">
 <Plus className="h-4 w-4" /> Nueva Solicitud
 </Button>
 </div>

 {loading ? (
 <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
 ) : requests.length === 0 ? (
 <div className="rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center py-20 text-center">
 <Video className="h-12 w-12 text-muted-foreground/40 mb-4" />
 <h3 className="text-xl font-semibold mb-2">Sin solicitudes aún</h3>
 <p className="text-muted-foreground mb-6">Crea tu primera solicitud de video educativo con ayuda de IA</p>
 <Button onClick={() => setActiveView("create")} variant="outline" className="gap-2 rounded-full">
 <Sparkles className="h-4 w-4" /> Crear con IA
 </Button>
 </div>
 ) : (
 <div className="space-y-3">
 {requests.map((req) => {
 const st = STATUS_MAP[req.status] || STATUS_MAP.draft;
 return (
 <motion.div key={req.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
 className="rounded-2xl border border-border bg-card cursor-pointer hover:bg-muted/50 transition-colors p-5"
 onClick={() => { setSelectedRequest(req); setActiveView("detail"); }}
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4 flex-1 min-w-0">
 <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
 <Video className="h-5 w-5 text-muted-foreground" />
 </div>
 <div className="min-w-0">
 <h3 className="font-semibold text-foreground truncate">{req.title}</h3>
 <p className="text-sm text-muted-foreground truncate">{req.description || "Sin descripción"}</p>
 </div>
 </div>
 <div className="flex items-center gap-3 shrink-0">
 <Badge variant="secondary" className={`${st.color} gap-1 rounded-full`}>{st.icon} {st.label}</Badge>
 <span className="text-xs text-muted-foreground">{new Date(req.created_at).toLocaleDateString()}</span>
 <ChevronRight className="h-4 w-4 text-muted-foreground" />
 </div>
 </div>
 </motion.div>
 );
 })}
 </div>
 )}
 </div>
 );
 }

 // CREATE VIEW
 if (activeView === "create") {
 return (
 <div className="space-y-8">
 <div className="flex items-center gap-3">
 <Button variant="ghost" size="icon" onClick={() => { resetForm(); setActiveView("list"); }} className="rounded-full">
 <ArrowLeft className="h-4 w-4" />
 </Button>
 <div>
 <h1 className="text-3xl font-semibold text-foreground tracking-tight">Nueva Solicitud de Video</h1>
 <p className="text-muted-foreground mt-1">Asistente inteligente de producción</p>
 </div>
 </div>

 {/* Stepper */}
 <div className="flex items-center gap-2">
 {steps.map((step, i) => (
 <div key={step} className="flex items-center gap-2 flex-1">
 <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors w-full ${
 i === createStep ? "bg-foreground text-background" : i < createStep ? "bg-muted text-foreground" : "bg-muted text-muted-foreground"
 }`}>
 <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
 i === createStep ? "bg-background/20" : "bg-foreground/10"
 }`}>{i + 1}</span>
 <span className="hidden sm:inline">{step}</span>
 </div>
 {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
 </div>
 ))}
 </div>

 <AnimatePresence mode="wait">
 {createStep === 0 && (
 <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
 <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
 {/* Form */}
 <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-8">
 <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-1"><Target className="h-5 w-5" /> Especificaciones del Video</h2>
 <p className="text-muted-foreground mb-6">Define qué necesitas para tu video educativo</p>
 <div className="space-y-5">
 <div>
 <label className="text-sm font-medium text-foreground">Título del video *</label>
 <Input placeholder="Ej: Introducción a la Ciberseguridad" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 h-11 rounded-xl" />
 </div>
 <div>
 <label className="text-sm font-medium text-foreground">Descripción</label>
 <Textarea placeholder="Describe brevemente el contenido del video..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 rounded-xl" />
 </div>
 <div>
 <label className="text-sm font-medium text-foreground flex items-center gap-1"><Target className="h-3.5 w-3.5" /> Objetivos de aprendizaje</label>
 <Textarea placeholder={"1. El alumno comprenderá...\n2. Será capaz de identificar...\n3. Podrá aplicar..."} value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} rows={4} className="mt-1 rounded-xl" />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-sm font-medium text-foreground flex items-center gap-1"><UsersIcon className="h-3.5 w-3.5" /> Audiencia objetivo</label>
 <Input placeholder="Ej: Nuevos empleados del área de TI" value={form.target_audience} onChange={(e) => setForm({ ...form, target_audience: e.target.value })} className="mt-1 h-11 rounded-xl" />
 </div>
 <div>
 <label className="text-sm font-medium text-foreground flex items-center gap-1"><Timer className="h-3.5 w-3.5" /> Duración estimada</label>
 <Select value={form.video_duration} onValueChange={(v) => setForm({ ...form, video_duration: v })}>
 <SelectTrigger className="mt-1 h-11 rounded-xl"><SelectValue /></SelectTrigger>
 <SelectContent>
 <SelectItem value="1-2 minutos">1-2 minutos</SelectItem>
 <SelectItem value="2-3 minutos">2-3 minutos</SelectItem>
 <SelectItem value="3-5 minutos">3-5 minutos</SelectItem>
 <SelectItem value="5-10 minutos">5-10 minutos</SelectItem>
 <SelectItem value="10-15 minutos">10-15 minutos</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>
 <div>
 <label className="text-sm font-medium text-foreground flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" /> Fecha límite de entrega</label>
 <div className="flex gap-2 mt-1">
 <Popover>
 <PopoverTrigger asChild>
 <Button variant="outline" className={`h-11 rounded-xl flex-1 justify-start text-left font-normal ${!form.deadline ? "text-muted-foreground" : ""}`}>
 <CalendarIcon className="mr-2 h-4 w-4" />
 {form.deadline ? format(form.deadline, "dd/MM/yyyy") : "Seleccionar fecha"}
 </Button>
 </PopoverTrigger>
 <PopoverContent className="w-auto p-0" align="start">
 <Calendar
 mode="single"
 selected={form.deadline}
 onSelect={(d) => setForm({ ...form, deadline: d || undefined })}
 disabled={(date) => date < new Date()}
 initialFocus
 className="p-3 pointer-events-auto"
 />
 </PopoverContent>
 </Popover>
 <Input
 type="time"
 value={form.deadlineTime}
 onChange={(e) => setForm({ ...form, deadlineTime: e.target.value })}
 className="h-11 rounded-xl w-32"
 />
 </div>
 </div>
 <div className="flex justify-end">
 <Button onClick={() => { if (!form.title) { toast({ title: "Ingresa un título", variant: "destructive" }); return; } setCreateStep(1); suggestStyles(); }} className="gap-2 rounded-full h-11 px-6">
 Siguiente: Estilos con IA <Sparkles className="h-4 w-4" />
 </Button>
 </div>
 </div>
 </div>

 {/* AI Assistant Panel */}
 <div className="lg:col-span-2 rounded-2xl border border-border bg-card flex flex-col h-[600px]">
 <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
 <AiAvatar size={32} animate={false} />
 <div className="flex-1">
 <p className="text-sm font-semibold text-foreground">Asistente de Contenido</p>
 <p className="text-xs text-muted-foreground">Te ayudo a escribir las especificaciones</p>
 </div>
 </div>

 <ScrollArea className="flex-1 p-4">
 <div className="space-y-3">
 {specMessages.length === 0 && (
 <div className="text-center py-6 space-y-3">
 <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
 <Sparkles className="h-6 w-6 text-muted-foreground" />
 </div>
 <p className="text-sm text-muted-foreground">Pregúntame lo que necesites. Puedo ayudarte a:</p>
 <div className="space-y-1.5">
 {[
 "Sugerir un título atractivo",
 "Redactar objetivos de aprendizaje",
 "Definir la audiencia ideal",
 "Recomendar la duración",
 ].map((hint) => (
 <button
 key={hint}
 onClick={() => { setSpecInput(hint); }}
 className="block w-full text-left text-xs px-3 py-2 rounded-xl bg-muted hover:bg-accent text-foreground transition-colors"
 >
 {hint}
 </button>
 ))}
 </div>
 </div>
 )}
 {specMessages.map((msg, i) => (
 <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
 <div className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm ${
 msg.role === "user"
 ? "bg-foreground text-background rounded-br-md"
 : "bg-muted text-foreground rounded-bl-md"
 }`}>
 {msg.role === "assistant" ? (
 <div className="prose prose-sm max-w-none [&_p]:m-0 [&_ul]:my-1 [&_li]:m-0 [&_ol]:my-1">
 <ReactMarkdown>{msg.content}</ReactMarkdown>
 </div>
 ) : msg.content}
 </div>
 </div>
 ))}
 {specLoading && (
 <div className="flex justify-start">
 <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
 <motion.div className="flex gap-1" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}>
 <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
 <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
 <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
 </motion.div>
 </div>
 </div>
 )}
 <div ref={specChatEndRef} />
 </div>
 </ScrollArea>

 <div className="border-t border-border p-3">
 <form onSubmit={(e) => { e.preventDefault(); sendSpecAssist(); }} className="flex items-center gap-2">
 <input
 value={specInput}
 onChange={(e) => setSpecInput(e.target.value)}
 placeholder="Ej: Sugiere objetivos para un curso de ciberseguridad..."
 className="flex-1 bg-muted rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
 disabled={specLoading}
 />
 <button
 type="submit"
 disabled={!specInput.trim() || specLoading}
 className="p-2.5 rounded-xl bg-foreground text-background disabled:opacity-40 transition-opacity hover:opacity-80"
 >
 <Send className="w-4 h-4" />
 </button>
 </form>
 </div>
 </div>
 </div>
 </motion.div>
 )}

 {createStep === 1 && (
 <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
 <div className="rounded-2xl border border-border bg-card p-8">
 <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-1"><Palette className="h-5 w-5" /> Estilos Visuales</h2>
 <p className="text-muted-foreground mb-2">La IA sugiere estilos basados en tu brief. Selecciona el que prefieras.</p>
 <div className="rounded-xl bg-muted/50 border border-border px-4 py-3 mb-6">
 <p className="text-xs text-muted-foreground"> <strong>Estas imágenes son solo una guía de referencia.</strong> En base al estilo que elijas, nuestro equipo creará un imaginario visual particular y especial diseñado exclusivamente para tu solicitud.</p>
 </div>
 {aiLoading ? (
 <div className="flex flex-col items-center justify-center py-20">
 <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-3" />
 <p className="text-muted-foreground">Generando estilos con IA...</p>
 </div>
 ) : (
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
 {styles.map((style, styleIdx) => (
 <div
 key={style.id}
 className={`cursor-pointer rounded-2xl border-2 overflow-hidden transition-all ${
 selectedStyle?.id === style.id ? "border-foreground" : "border-border hover:border-muted-foreground/30"
 }`}
 onClick={() => setSelectedStyle(style)}
 >
 <div className="relative aspect-[16/10] overflow-hidden bg-muted">
 {style.image_url ? (
 <img
 src={style.image_url}
 alt={style.name}
 className="w-full h-full object-cover"
 loading="lazy"
 />
 ) : (
 <div
 className="w-full h-full flex items-center justify-center"
 style={{
 background: style.color_palette?.length >= 2
 ? `linear-gradient(135deg, ${style.color_palette.join(", ")})`
 : undefined,
 }}
 >
 <div className="flex flex-col items-center gap-1">
 <Loader2 className="h-5 w-5 animate-spin text-white/60" />
 <span className="text-[10px] text-white/50">Generando...</span>
 </div>
 </div>
 )}
 {selectedStyle?.id === style.id && (
 <div className="absolute top-3 right-3 bg-foreground text-background rounded-full p-1.5">
 <CheckCircle2 className="h-4 w-4" />
 </div>
 )}
 </div>
 <div className="p-4 space-y-2">
 <h4 className="font-semibold text-foreground">{style.name}</h4>
 <p className="text-sm text-muted-foreground line-clamp-2">{style.description}</p>
 <div className="flex gap-1.5">
 {style.color_palette?.map((c, i) => (
 <div key={i} className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: c }} />
 ))}
 </div>
 <p className="text-xs text-muted-foreground">{style.keywords}</p>
 </div>
 </div>
 ))}
 </div>
 )}
 <div className="flex justify-between mt-8">
 <Button variant="outline" onClick={() => setCreateStep(0)} className="rounded-full">Atrás</Button>
 <div className="flex gap-2">
 <Button variant="outline" onClick={suggestStyles} disabled={aiLoading} className="gap-1 rounded-full"><Sparkles className="h-3.5 w-3.5" /> Regenerar</Button>
 <Button disabled={!selectedStyle} onClick={() => { setCreateStep(2); generateScript(); }} className="gap-2 rounded-full">
 Siguiente: Guión <FileText className="h-4 w-4" />
 </Button>
 </div>
 </div>
 </div>
 </motion.div>
 )}

 {createStep === 2 && (
 <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
 <div className="rounded-2xl border border-border bg-card p-8">
 <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-1"><FileText className="h-5 w-5" /> Guión por Bloques</h2>
 <p className="text-muted-foreground mb-6">Guión generado con IA. Puedes editarlo antes de enviar.</p>
 {aiLoading ? (
 <div className="flex flex-col items-center justify-center py-20">
 <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-3" />
 <p className="text-muted-foreground">Escribiendo guión con IA...</p>
 </div>
 ) : (
 <div className="space-y-4">
 {scriptBlocks.map((block, idx) => (
 <div key={block.id} className="rounded-xl bg-muted p-5 space-y-3">
 <div className="flex items-center justify-between">
 <h4 className="font-semibold text-foreground flex items-center gap-2">
 <span className="bg-foreground text-background w-6 h-6 rounded-full flex items-center justify-center text-xs">{idx + 1}</span>
 {block.title}
 </h4>
 <Badge variant="outline" className="gap-1 rounded-full"><Clock className="h-3 w-3" /> {block.duration}</Badge>
 </div>
 <div>
 <p className="text-xs font-medium text-muted-foreground mb-1">Narración:</p>
 <Textarea value={block.narration} onChange={(e) => { const u = [...scriptBlocks]; u[idx] = { ...block, narration: e.target.value }; setScriptBlocks(u); }} rows={2} className="text-sm rounded-xl" />
 </div>
 <div>
 <p className="text-xs font-medium text-muted-foreground mb-1">Notas visuales:</p>
 <Textarea value={block.visual_notes} onChange={(e) => { const u = [...scriptBlocks]; u[idx] = { ...block, visual_notes: e.target.value }; setScriptBlocks(u); }} rows={2} className="text-sm rounded-xl" />
 </div>
 {block.transition && <p className="text-xs text-muted-foreground">Transición: {block.transition}</p>}
 </div>
 ))}
 </div>
 )}
 <div className="flex justify-between mt-8">
 <Button variant="outline" onClick={() => setCreateStep(1)} className="rounded-full">Atrás</Button>
 <div className="flex gap-2">
 <Button variant="outline" onClick={generateScript} disabled={aiLoading} className="gap-1 rounded-full"><Sparkles className="h-3.5 w-3.5" /> Regenerar</Button>
 <Button disabled={scriptBlocks.length === 0} onClick={() => setCreateStep(3)} className="gap-2 rounded-full">
 Revisar y Enviar <Send className="h-4 w-4" />
 </Button>
 </div>
 </div>
 </div>
 </motion.div>
 )}

 {createStep === 3 && (
 <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
 <div className="rounded-2xl border border-border bg-card p-8">
 <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-1"><Package className="h-5 w-5" /> Resumen de Solicitud</h2>
 <p className="text-muted-foreground mb-6">Revisa todos los detalles antes de enviar al equipo</p>
 <div className="space-y-5">
 <div className="grid grid-cols-2 gap-4">
 <div><p className="text-xs font-medium text-muted-foreground">Título</p><p className="font-semibold text-foreground mt-1">{form.title}</p></div>
 <div><p className="text-xs font-medium text-muted-foreground">Duración</p><p className="text-foreground mt-1">{form.video_duration}</p></div>
 <div><p className="text-xs font-medium text-muted-foreground">Estilo</p><p className="text-foreground mt-1">{selectedStyle?.name || "—"}</p></div>
 <div><p className="text-xs font-medium text-muted-foreground">Audiencia</p><p className="text-foreground mt-1">{form.target_audience || "—"}</p></div>
 <div><p className="text-xs font-medium text-muted-foreground">Fecha límite</p><p className="text-foreground mt-1">{form.deadline ? `${format(form.deadline, "dd/MM/yyyy")} a las ${form.deadlineTime}` : "Sin definir"}</p></div>
 </div>
 <Separator />
 <div><p className="text-xs font-medium text-muted-foreground mb-1">Objetivos</p><p className="text-sm text-foreground whitespace-pre-line">{form.objectives}</p></div>
 <Separator />
 <div>
 <p className="text-xs font-medium text-muted-foreground mb-2">Guión: {scriptBlocks.length} bloques</p>
 {scriptBlocks.map((b, i) => (
 <p key={b.id} className="text-sm text-foreground"><strong>{i + 1}. {b.title}</strong> ({b.duration})</p>
 ))}
 </div>
 <div className="flex justify-between mt-6">
 <Button variant="outline" onClick={() => setCreateStep(2)} className="rounded-full">Atrás</Button>
 <Button onClick={submitRequest} className="gap-2 rounded-full h-11 px-6">
 <Send className="h-4 w-4" /> Enviar Solicitud
 </Button>
 </div>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
 }

 // DETAIL VIEW
 if (activeView === "detail" && selectedRequest) {
 const st = STATUS_MAP[selectedRequest.status] || STATUS_MAP.draft;
 const reqCorrections = (selectedRequest.corrections as Correction[]) || [];
 const reqScriptBlocks = (selectedRequest.script_blocks as ScriptBlock[]) || [];
 const reqStyle = selectedRequest.selected_style as StyleSuggestion | null;
 const isDelivered = ["delivered", "corrections", "finalized"].includes(selectedRequest.status);
 const deadlineStr = (selectedRequest as any).deadline;

 return (
 <div className="space-y-8">
 <div className="flex items-center gap-3">
 <Button variant="ghost" size="icon" onClick={() => { setSelectedRequest(null); setActiveView("list"); }} className="rounded-full">
 <ArrowLeft className="h-4 w-4" />
 </Button>
 <div className="flex-1">
 <h1 className="text-3xl font-semibold text-foreground tracking-tight">{selectedRequest.title}</h1>
 <div className="flex items-center gap-2 mt-2">
 <Badge variant="secondary" className={`${st.color} gap-1 rounded-full`}>{st.icon} {st.label}</Badge>
 <span className="text-sm text-muted-foreground">{new Date(selectedRequest.created_at).toLocaleDateString()}</span>
 {deadlineStr && (
 <Badge variant="outline" className="gap-1 rounded-full">
 <CalendarIcon className="h-3 w-3" /> Deadline: {new Date(deadlineStr).toLocaleDateString()} {new Date(deadlineStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </Badge>
 )}
 </div>
 </div>
 {isDelivered && selectedRequest.status !== "finalized" && (
 <Button onClick={() => setFinalizeDialogOpen(true)} className="gap-2 rounded-full h-11 px-6">
 <Check className="h-4 w-4" /> Finalizar
 </Button>
 )}
 </div>

 <Tabs defaultValue="details">
 <TabsList className="rounded-full bg-muted p-1">
 <TabsTrigger value="details" className="rounded-full">Detalles</TabsTrigger>
 <TabsTrigger value="script" className="rounded-full">Guión</TabsTrigger>
 <TabsTrigger value="delivery" className="rounded-full">Entrega</TabsTrigger>
 <TabsTrigger value="corrections" className="rounded-full gap-1">
 Correcciones
 {reqCorrections.length > 0 && (
 <span className="ml-1 bg-foreground text-background rounded-full w-5 h-5 flex items-center justify-center text-xs">{reqCorrections.length}</span>
 )}
 </TabsTrigger>
 </TabsList>

 <TabsContent value="details" className="mt-6">
 <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div><p className="text-xs text-muted-foreground">Descripción</p><p className="text-sm text-foreground mt-1">{selectedRequest.description || "—"}</p></div>
 <div><p className="text-xs text-muted-foreground">Audiencia</p><p className="text-sm text-foreground mt-1">{selectedRequest.target_audience || "—"}</p></div>
 <div><p className="text-xs text-muted-foreground">Duración</p><p className="text-sm text-foreground mt-1">{selectedRequest.video_duration || "—"}</p></div>
 <div><p className="text-xs text-muted-foreground">Estilo</p><p className="text-sm text-foreground mt-1">{selectedRequest.animation_style || "—"}</p></div>
 </div>
 {selectedRequest.objectives && (
 <div><p className="text-xs text-muted-foreground">Objetivos</p><p className="text-sm text-foreground whitespace-pre-line mt-1">{selectedRequest.objectives}</p></div>
 )}
 {reqStyle && (
 <div className="flex gap-1.5 mt-2">
 {reqStyle.color_palette?.map((c, i) => (
 <div key={i} className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: c }} />
 ))}
 </div>
 )}
 </div>
 </TabsContent>

 <TabsContent value="script" className="mt-6 space-y-3">
 {reqScriptBlocks.map((block, idx) => (
 <div key={block.id} className="rounded-xl bg-muted p-5 space-y-2">
 <div className="flex items-center justify-between">
 <h4 className="font-semibold text-foreground flex items-center gap-2">
 <span className="bg-foreground text-background w-6 h-6 rounded-full flex items-center justify-center text-xs">{idx + 1}</span>
 {block.title}
 </h4>
 <Badge variant="outline" className="gap-1 rounded-full"><Clock className="h-3 w-3" /> {block.duration}</Badge>
 </div>
 <p className="text-sm text-foreground">{block.narration}</p>
 <p className="text-xs text-muted-foreground">{block.visual_notes}</p>
 </div>
 ))}
 </TabsContent>

 <TabsContent value="delivery" className="mt-6">
 <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
 {deadlineStr && (
 <div>
 <p className="text-xs text-muted-foreground mb-1">Fecha límite de entrega</p>
 <p className="text-sm text-foreground font-medium flex items-center gap-2">
 <CalendarIcon className="h-4 w-4" /> {new Date(deadlineStr).toLocaleDateString()} a las {new Date(deadlineStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </p>
 </div>
 )}
 {selectedRequest.delivery_url ? (
 <div>
 <p className="text-xs text-muted-foreground mb-1">URL de entrega</p>
 <a href={selectedRequest.delivery_url} target="_blank" rel="noopener" className="text-foreground underline text-sm">{selectedRequest.delivery_url}</a>
 </div>
 ) : (
 <p className="text-muted-foreground text-sm">Pendiente de entrega por el equipo de producción.</p>
 )}
 {selectedRequest.delivery_notes && (
 <div>
 <p className="text-xs text-muted-foreground mb-1">Notas de entrega</p>
 <p className="text-sm text-foreground">{selectedRequest.delivery_notes}</p>
 </div>
 )}
 </div>
 </TabsContent>

 <TabsContent value="corrections" className="mt-6 space-y-4">
 {selectedRequest.status !== "finalized" && (
 <div className="rounded-2xl border-2 border-dashed border-border p-5 space-y-3">
 <h4 className="font-medium text-foreground flex items-center gap-2"><Pencil className="h-4 w-4" /> Agregar corrección</h4>
 <div className="grid grid-cols-2 gap-3">
 <Select value={correctionType} onValueChange={setCorrectionType}>
 <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
 <SelectContent>
 <SelectItem value="general">General</SelectItem>
 <SelectItem value="narration">Narración</SelectItem>
 <SelectItem value="visual">Visual</SelectItem>
 <SelectItem value="timing">Timing</SelectItem>
 <SelectItem value="audio">Audio</SelectItem>
 </SelectContent>
 </Select>
 <Select value={correctionBlockId || "none"} onValueChange={(v) => setCorrectionBlockId(v === "none" ? "" : v)}>
 <SelectTrigger className="rounded-xl"><SelectValue placeholder="Bloque (opcional)" /></SelectTrigger>
 <SelectContent>
 <SelectItem value="none">General</SelectItem>
 {reqScriptBlocks.map((b, i) => (
 <SelectItem key={b.id} value={b.id}>Bloque {i + 1}: {b.title}</SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>
 <Textarea placeholder="Describe la corrección necesaria..." value={newCorrection} onChange={(e) => setNewCorrection(e.target.value)} rows={2} className="rounded-xl" />
 <Button size="sm" onClick={addCorrection} disabled={!newCorrection.trim()} className="gap-1 rounded-full">
 <MessageSquare className="h-3.5 w-3.5" /> Agregar
 </Button>
 </div>
 )}

 {reqCorrections.length === 0 ? (
 <p className="text-center text-muted-foreground py-10">Sin correcciones</p>
 ) : (
 <ScrollArea className="max-h-[400px]">
 <div className="space-y-2">
 {reqCorrections.map((corr) => (
 <div key={corr.id} className={`rounded-xl border border-border p-4 flex items-start gap-3 ${corr.resolved ? "opacity-50" : ""}`}>
 <button onClick={() => toggleCorrectionResolved(corr.id)} className="mt-0.5">
 {corr.resolved ? <CheckCircle2 className="h-5 w-5 text-foreground" /> : <XCircle className="h-5 w-5 text-muted-foreground" />}
 </button>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2">
 <Badge variant="outline" className="text-xs rounded-full">{corr.type}</Badge>
 {corr.block_id && <Badge variant="secondary" className="text-xs rounded-full">Bloque</Badge>}
 </div>
 <p className={`text-sm mt-1 ${corr.resolved ? "line-through text-muted-foreground" : "text-foreground"}`}>{corr.comment}</p>
 </div>
 </div>
 ))}
 </div>
 </ScrollArea>
 )}
 </TabsContent>
 </Tabs>

 <Dialog open={finalizeDialogOpen} onOpenChange={setFinalizeDialogOpen}>
 <DialogContent className="rounded-2xl">
 <DialogHeader>
 <DialogTitle>Finalizar contenido</DialogTitle>
 </DialogHeader>
 <div className="space-y-4">
 <p className="text-sm text-muted-foreground">¿Dónde deseas guardar este contenido finalizado?</p>
 <div className="grid grid-cols-2 gap-3">
 <div
 className={`cursor-pointer rounded-2xl border-2 p-5 text-center transition-all ${finalizeTarget === "course" ? "border-foreground" : "border-border"}`}
 onClick={() => setFinalizeTarget("course")}
 >
 <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
 <p className="font-medium text-foreground text-sm">Asignar a un curso</p>
 </div>
 <div
 className={`cursor-pointer rounded-2xl border-2 p-5 text-center transition-all ${finalizeTarget === "library" ? "border-foreground" : "border-border"}`}
 onClick={() => setFinalizeTarget("library")}
 >
 <Library className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
 <p className="font-medium text-foreground text-sm">Librería de recursos</p>
 </div>
 </div>
 {finalizeTarget === "course" && (
 <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
 <SelectTrigger className="rounded-xl"><SelectValue placeholder="Selecciona un curso" /></SelectTrigger>
 <SelectContent>
 {courses.map((c) => (
 <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
 ))}
 </SelectContent>
 </Select>
 )}
 </div>
 <DialogFooter>
 <Button variant="outline" onClick={() => setFinalizeDialogOpen(false)} className="rounded-full">Cancelar</Button>
 <Button onClick={finalizeRequest} className="gap-2 rounded-full">
 <Check className="h-4 w-4" /> Confirmar
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 </div>
 );
 }

 return null;
}
