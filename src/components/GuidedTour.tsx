import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface TourStep {
 target: string;
 title: string;
 description: string;
 position?: "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
 {
 target: '[data-tour="sidebar"]',
 title: "Navegación Principal",
 description: "Desde aquí accedes a todas las secciones: cursos, evaluaciones, programas, analíticas, usuarios y configuración. Cada sección está organizada según tu rol.",
 position: "right",
 },
 {
 target: '[data-tour="topbar"]',
 title: "Barra Superior",
 description: "Usa el buscador para encontrar cursos rápidamente, revisa notificaciones y accede a tu perfil desde aquí.",
 position: "bottom",
 },
 {
 target: '[data-tour="dashboard-hero"]',
 title: "Tu Panel Principal",
 description: "Aquí verás un saludo personalizado, tu progreso general y accesos directos para explorar cursos o ver analíticas.",
 position: "bottom",
 },
 {
 target: '[data-tour="welcome-panel"]',
 title: "Pasos de Inicio",
 description: "Este panel te guía en tus primeros pasos: completar tu perfil, explorar cursos y conocer el asistente. Marca cada paso cuando lo completes.",
 position: "bottom",
 },
 {
 target: '[data-tour="courses-section"]',
 title: "Tus Cursos",
 description: "Aquí encuentras los cursos que tienes en progreso y los destacados. Haz clic en cualquiera para ver sus módulos, videos y materiales.",
 position: "top",
 },
 {
 target: '[data-tour="assistant"]',
 title: "Asistente IA",
 description: "Tu asistente personal con inteligencia artificial. Pregúntale sobre cualquier curso, obtén resúmenes o resuelve dudas al instante. ¡Está siempre disponible!",
 position: "left",
 },
];

export function GuidedTour({ disabled = false }: { disabled?: boolean }) {
 const { user, isAuthenticated, isLoading } = useAuth();
 const [isActive, setIsActive] = useState(false);
 const [currentStep, setCurrentStep] = useState(0);
 const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
 const [validSteps, setValidSteps] = useState<TourStep[]>([]);

 const TOUR_KEY = user?.id ? `learnhub_tour_completed_${user.id}` : "learnhub_tour_completed";

 useEffect(() => {
 if (disabled) {
 setIsActive(false);
 setCurrentStep(0);
 setValidSteps([]);
 return;
 }

 if (isLoading || !isAuthenticated || !user?.id) return;

 const completed = localStorage.getItem(TOUR_KEY);
 if (!completed) {
 const timer = setTimeout(() => {
 const available = tourSteps.filter((s) => document.querySelector(s.target));
 if (available.length > 0) {
 setValidSteps(available);
 setIsActive(true);
 }
 }, 1800);
 return () => clearTimeout(timer);
 }
 }, [TOUR_KEY, disabled, isLoading, isAuthenticated, user?.id]);

 const updatePosition = useCallback(() => {
 if (!isActive || validSteps.length === 0) return;
 const step = validSteps[currentStep];
 const el = document.querySelector(step.target);
 if (el) {
 const rect = el.getBoundingClientRect();
 setPosition({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
 }
 }, [currentStep, isActive, validSteps]);

 useEffect(() => {
 updatePosition();
 window.addEventListener("resize", updatePosition);
 window.addEventListener("scroll", updatePosition, true);
 return () => {
 window.removeEventListener("resize", updatePosition);
 window.removeEventListener("scroll", updatePosition, true);
 };
 }, [updatePosition]);

 const handleNext = () => {
 if (currentStep < validSteps.length - 1) {
 setCurrentStep((s) => s + 1);
 } else {
 handleComplete();
 }
 };

 const handlePrev = () => {
 if (currentStep > 0) setCurrentStep((s) => s - 1);
 };

 const handleComplete = () => {
 setIsActive(false);
 localStorage.setItem(TOUR_KEY, "true");
 };

 if (!isActive || validSteps.length === 0) return null;

 const step = validSteps[currentStep];
 const tooltipStyle: React.CSSProperties = {};
 const pad = 16;

 if (step.position === "right") {
 tooltipStyle.top = position.top + position.height / 2 - 80;
 tooltipStyle.left = position.left + position.width + pad;
 } else if (step.position === "bottom") {
 tooltipStyle.top = position.top + position.height + pad;
 tooltipStyle.left = position.left + position.width / 2 - 170;
 } else if (step.position === "left") {
 tooltipStyle.top = position.top + position.height / 2 - 80;
 tooltipStyle.left = position.left - 360;
 } else {
 tooltipStyle.top = position.top - 160;
 tooltipStyle.left = position.left + position.width / 2 - 170;
 }

 // Clamp to viewport
 tooltipStyle.left = Math.max(16, Math.min(tooltipStyle.left as number, window.innerWidth - 360));
 tooltipStyle.top = Math.max(16, tooltipStyle.top as number);

 return (
 <>
 {/* Overlay */}
 <div className="fixed inset-0 z-[9998] bg-foreground/40 backdrop-blur-sm" onClick={handleComplete} />

 {/* Highlight cutout */}
 <div
 className="fixed z-[9999] rounded-xl ring-4 ring-primary/60 pointer-events-none transition-all duration-500 ease-out"
 style={{
 top: position.top - 6,
 left: position.left - 6,
 width: position.width + 12,
 height: position.height + 12,
 }}
 />

 {/* Tooltip */}
 <AnimatePresence mode="wait">
 <motion.div
 key={currentStep}
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -8 }}
 className="fixed z-[10000] w-[340px] bg-card rounded-2xl border border-border p-5"
 style={{ ...tooltipStyle, boxShadow: "0 20px 60px -15px rgba(0,0,0,0.3)" }}
 >
 <button onClick={handleComplete} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
 <X className="w-4 h-4" />
 </button>

 <div className="flex items-center gap-2 mb-3">
 <Sparkles className="w-4 h-4 text-primary" />
 <span className="text-xs font-medium text-primary">Paso {currentStep + 1} de {validSteps.length}</span>
 </div>

 {/* Progress dots */}
 <div className="flex gap-1.5 mb-3">
 {validSteps.map((_, i) => (
 <div
 key={i}
 className={`h-1 flex-1 rounded-full transition-all duration-300 ${
 i <= currentStep ? "bg-primary" : "bg-border"
 }`}
 />
 ))}
 </div>

 <h3 className="text-sm font-semibold text-foreground mb-1.5">{step.title}</h3>
 <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>

 <div className="flex items-center justify-between mt-5">
 <Button variant="ghost" size="sm" onClick={handlePrev} disabled={currentStep === 0} className="text-xs">
 <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Anterior
 </Button>
 <Button size="sm" onClick={handleNext} className="text-xs">
 {currentStep === validSteps.length - 1 ? "¡Empezar! " : "Siguiente"}
 {currentStep < validSteps.length - 1 && <ChevronRight className="w-3.5 h-3.5 ml-1" />}
 </Button>
 </div>
 </motion.div>
 </AnimatePresence>
 </>
 );
}

export function TourTrigger() {
 const { user } = useAuth();

 const resetTour = () => {
 const tourKey = user?.id ? `learnhub_tour_completed_${user.id}` : "learnhub_tour_completed";
 localStorage.removeItem(tourKey);
 window.location.reload();
 };
 return (
 <button onClick={resetTour} className="text-xs text-muted-foreground hover:text-primary transition-colors">
 <Sparkles className="w-3.5 h-3.5 inline mr-1" />
 Repetir tour
 </button>
 );
}
