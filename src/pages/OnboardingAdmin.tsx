import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Plus, Trash2, Loader2, Send, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import aiAvatarBg from "@/assets/ai-avatar-bg.png";
import logoPrisma from "@/assets/logo-prisma-full.png";
import onboardingBg from "@/assets/onboarding-bg.png";

// ---------- Config ----------
const industrias = ["Banca", "Retail", "Minería", "Salud", "Tecnología", "Servicios", "Otra"];
const tamanos = ["1–50", "51–200", "201–1.000", "Más de 1.000"];
const objetivosOpts = [
  "Reducir costos operativos",
  "Aumentar productividad",
  "Reducir errores de proceso",
  "Automatizar tareas repetitivas",
  "Mejorar calidad de output",
  "Todos los anteriores",
];
const horizontes = ["30 días", "90 días", "6 meses"];
const herramientasOpts = ["ChatGPT", "Microsoft Copilot", "Claude", "Gemini", "Notion AI", "Midjourney", "Ninguna aún", "Otras"];

type Cargo = { id: string; nombre: string; tareas: string };
type AreaSetup = { id: string; nombre: string; cargos: Cargo[] };
type FormState = {
  empresa: string;
  industria: string;
  tamano: string;
  areasSetup: AreaSetup[];
  objetivo: string;
  prioritarias: string[];
  horizonte: string;
  herramientasSel: string[];
};

const emptyForm: FormState = {
  empresa: "",
  industria: "",
  tamano: "",
  areasSetup: [],
  objetivo: "",
  prioritarias: [],
  horizonte: "",
  herramientasSel: [],
};

type StepDef = {
  id: string;
  message: (f: FormState) => string;
  aiField?: string; // key to ask AI to fill
  isComplete: (f: FormState) => boolean;
};

const steps: StepDef[] = [
  {
    id: "welcome",
    message: () =>
      "Hola 👋 Soy **Prisma**, tu asistente. Te voy a acompañar a configurar tu organización en unos minutos. Si en algún momento no sabes qué responder, pídeme que lo sugiera yo. ¿Listo?",
    isComplete: () => true,
  },
  {
    id: "empresa",
    message: () => "Para empezar: **¿cómo se llama tu empresa?**",
    aiField: "empresa",
    isComplete: (f) => f.empresa.trim().length > 0,
  },
  {
    id: "industria",
    message: (f) => `Perfecto${f.empresa ? `, ${f.empresa}` : ""}. **¿A qué industria perteneces?**`,
    aiField: "industria",
    isComplete: (f) => !!f.industria,
  },
  {
    id: "tamano",
    message: () => "¿Cuántas personas son en el equipo?",
    aiField: "tamano",
    isComplete: (f) => !!f.tamano,
  },
  {
    id: "areas",
    message: () =>
      "Ahora viene lo importante: **define las áreas de tu organización y los cargos que tienen**. Esto me sirve para saber qué es correcto e incorrecto para cada rol. Puedes pedirme que las sugiera por ti.",
    aiField: "areas",
    isComplete: (f) => f.areasSetup.length > 0 && f.areasSetup.every((a) => a.nombre.trim()),
  },
  {
    id: "objetivo",
    message: () => "¿Cuál es tu **objetivo principal** al adoptar IA?",
    aiField: "objetivo",
    isComplete: (f) => !!f.objetivo,
  },
  {
    id: "prioritarias",
    message: () => "¿Qué **áreas son prioritarias** para empezar el diagnóstico? (elige una o varias)",
    aiField: "prioritarias",
    isComplete: (f) => f.prioritarias.length > 0,
  },
  {
    id: "horizonte",
    message: () => "¿En qué **horizonte de tiempo** quieres ver mejoras?",
    aiField: "horizonte",
    isComplete: (f) => !!f.horizonte,
  },
  {
    id: "herramientas",
    message: () => "Por último: **¿qué herramientas de IA usa tu equipo hoy?** Elige todas las que apliquen.",
    aiField: "herramientas",
    isComplete: () => true,
  },
  {
    id: "done",
    message: (f) =>
      `Listo${f.empresa ? `, ${f.empresa}` : ""}. Tengo todo lo que necesito para empezar a observar tus procesos y detectar dónde estás perdiendo valor. ✨`,
    isComplete: () => true,
  },
];

// ---------- Sphere ----------
function PulsingSphere({ speaking, size = 220 }: { speaking: boolean; size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Pulse rings */}
      <AnimatePresence>
        {speaking && (
          <>
            {[0, 0.6, 1.2].map((delay) => (
              <motion.div
                key={delay}
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 1.6, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, repeat: Infinity, delay, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-foreground/30"
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Sphere */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden shadow-2xl"
        animate={
          speaking
            ? { scale: [1, 1.04, 1], y: [0, -4, 0] }
            : { scale: [1, 1.015, 1], y: [0, -3, 0] }
        }
        transition={{
          duration: speaking ? 1.1 : 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img src={aiAvatarBg} alt="Prisma" className="w-full h-full object-cover" style={{ filter: "saturate(1.25)" }} />
      </motion.div>

      {/* Soft glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: speaking
            ? "0 0 80px 8px rgba(255,255,255,0.12), 0 0 160px 20px rgba(255,255,255,0.06)"
            : "0 0 60px 4px rgba(255,255,255,0.06)",
          transition: "box-shadow .4s",
        }}
      />
    </div>
  );
}

// ---------- Typing text ----------
function TypingMessage({ text, onDone }: { text: string; onDone: () => void }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone();
      }
    }, 18);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Render with simple **bold** support
  const parts = useMemo(() => {
    const out: { bold: boolean; t: string }[] = [];
    const re = /\*\*(.+?)\*\*/g;
    let last = 0, m: RegExpExecArray | null;
    while ((m = re.exec(shown))) {
      if (m.index > last) out.push({ bold: false, t: shown.slice(last, m.index) });
      out.push({ bold: true, t: m[1] });
      last = m.index + m[0].length;
    }
    if (last < shown.length) out.push({ bold: false, t: shown.slice(last) });
    return out;
  }, [shown]);

  return (
    <span>
      {parts.map((p, i) =>
        p.bold ? (
          <strong key={i} className="font-semibold">{p.t}</strong>
        ) : (
          <span key={i}>{p.t}</span>
        )
      )}
    </span>
  );
}

// ---------- Main ----------
export default function OnboardingAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [stepIdx, setStepIdx] = useState(0);
  const [speaking, setSpeaking] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const step = steps[stepIdx];
  const total = steps.length;

  // Trigger speaking pulse on step change
  useEffect(() => {
    setSpeaking(true);
  }, [stepIdx]);

  // Auto-suggest organigrama when entering "areas" step
  useEffect(() => {
    if (steps[stepIdx]?.id === "areas" && form.areasSetup.length === 0 && !aiLoading) {
      callAI("Genera un organigrama COMPLETO y realista para mi empresa según industria y tamaño: incluye TODAS las áreas típicas (Dirección, Comercial, Marketing, Operaciones, Tecnología, Finanzas, RRHH, Legal, Customer Success, etc. — las que apliquen), y para cada área los cargos jerárquicos en proporción al tamaño del equipo, con descripción corta de tareas. Devuelve TODO en areasSetup.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx]);


  const next = () => setStepIdx((i) => Math.min(steps.length - 1, i + 1));
  const back = () => setStepIdx((i) => Math.max(0, i - 1));

  const finish = () => {
    localStorage.setItem("prisma_admin_onboarded", "true");
    localStorage.setItem("prisma_admin_onboarding_data", JSON.stringify(form));
    navigate("/dashboard", { replace: true });
  };

  // Local setters
  const setField = (k: keyof FormState, v: any) => setForm((p) => ({ ...p, [k]: v }));
  const toggleArr = (k: "prioritarias" | "herramientasSel", v: string) =>
    setForm((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));

  const addArea = () =>
    setForm((p) => ({ ...p, areasSetup: [...p.areasSetup, { id: crypto.randomUUID(), nombre: "", cargos: [] }] }));
  const removeArea = (id: string) => setForm((p) => ({ ...p, areasSetup: p.areasSetup.filter((a) => a.id !== id) }));
  const updateArea = (id: string, nombre: string) =>
    setForm((p) => ({ ...p, areasSetup: p.areasSetup.map((a) => (a.id === id ? { ...a, nombre } : a)) }));
  const addCargo = (areaId: string) =>
    setForm((p) => ({
      ...p,
      areasSetup: p.areasSetup.map((a) =>
        a.id === areaId ? { ...a, cargos: [...a.cargos, { id: crypto.randomUUID(), nombre: "", tareas: "" }] } : a
      ),
    }));
  const updateCargo = (aid: string, cid: string, patch: Partial<Cargo>) =>
    setForm((p) => ({
      ...p,
      areasSetup: p.areasSetup.map((a) =>
        a.id === aid ? { ...a, cargos: a.cargos.map((c) => (c.id === cid ? { ...c, ...patch } : c)) } : a
      ),
    }));
  const removeCargo = (aid: string, cid: string) =>
    setForm((p) => ({
      ...p,
      areasSetup: p.areasSetup.map((a) => (a.id === aid ? { ...a, cargos: a.cargos.filter((c) => c.id !== cid) } : a)),
    }));

  // AI patch
  const applyPatch = (patch: any) => {
    if (!patch) return;
    setForm((prev) => {
      const next = { ...prev };
      if (typeof patch.empresa === "string" && patch.empresa) next.empresa = patch.empresa;
      if (typeof patch.industria === "string" && patch.industria) next.industria = patch.industria;
      if (typeof patch.tamano === "string" && patch.tamano) next.tamano = patch.tamano;
      if (typeof patch.objetivo === "string" && patch.objetivo) next.objetivo = patch.objetivo;
      if (typeof patch.horizonte === "string" && patch.horizonte) next.horizonte = patch.horizonte;
      if (Array.isArray(patch.prioritarias)) next.prioritarias = patch.prioritarias;
      if (Array.isArray(patch.herramientasSel)) next.herramientasSel = patch.herramientasSel;
      if (Array.isArray(patch.areasSetup)) {
        const byName = new Map<string, AreaSetup>();
        for (const a of next.areasSetup) byName.set(a.nombre.toLowerCase(), a);
        for (const a of patch.areasSetup) {
          if (!a?.nombre) continue;
          const key = a.nombre.toLowerCase();
          const existing = byName.get(key);
          const cargos: Cargo[] = (a.cargos || []).map((c: any) => ({
            id: crypto.randomUUID(),
            nombre: c.nombre || "",
            tareas: c.tareas || "",
          }));
          if (existing) {
            const cm = new Map(existing.cargos.map((c) => [c.nombre.toLowerCase(), c]));
            for (const c of cargos) cm.set(c.nombre.toLowerCase(), c);
            byName.set(key, { ...existing, cargos: Array.from(cm.values()) });
          } else {
            byName.set(key, { id: crypto.randomUUID(), nombre: a.nombre, cargos });
          }
        }
        next.areasSetup = Array.from(byName.values());
      }
      return next;
    });
  };

  const callAI = async (userMsg: string) => {
    setAiLoading(true);
    setSpeaking(true);
    try {
      const { data } = await supabase.functions.invoke("onboarding-assistant", {
        body: {
          messages: [{ role: "user", content: userMsg }],
          currentData: form,
        },
      });
      applyPatch(data?.patch);
    } catch {
      /* no-op */
    } finally {
      setAiLoading(false);
    }
  };

  const suggest = () => {
    if (!step.aiField) return;
    const prompts: Record<string, string> = {
      empresa: "Sugiéreme un nombre de empresa de ejemplo coherente.",
      industria: "Según el nombre de mi empresa, ¿qué industria me corresponde?",
      tamano: "Sugiéreme un tamaño de equipo razonable.",
      areas: "Sugiéreme 3 áreas típicas para mi organización con sus cargos principales y tareas, ya rellenadas.",
      objetivo: "¿Cuál crees que debería ser mi objetivo principal con IA?",
      prioritarias: "Según mis áreas, ¿cuáles debería priorizar?",
      horizonte: "¿Qué horizonte de mejora me recomiendas?",
      herramientas: "Sugiéreme qué herramientas de IA seleccionar según mi industria.",
    };
    callAI(prompts[step.aiField] || `Ayúdame con ${step.aiField}.`);
  };

  const sendCustom = () => {
    if (!customInput.trim()) return;
    callAI(customInput.trim());
    setCustomInput("");
  };

  const canAdvance = step.isComplete(form);
  const isLast = stepIdx === steps.length - 1;

  return (
    <div className="fixed inset-0 bg-background text-foreground flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="relative z-10 px-6 lg:px-10 h-16 flex items-center justify-between">
        <img src={logoPrisma} alt="Prisma" className="h-7 opacity-80" />
        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground tabular-nums">
            {String(stepIdx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
          <div className="hidden sm:flex w-48 h-[3px] rounded-full bg-border overflow-hidden">
            <motion.div
              className="h-full bg-foreground"
              initial={false}
              animate={{ width: `${((stepIdx + 1) / total) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </header>

      {/* Center stage — wide rectangle with background image + dark overlay */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 lg:px-8 pt-4 pb-24 overflow-y-auto">
        <div className="relative w-full max-w-6xl rounded-[32px] overflow-hidden shadow-2xl border border-white/15">

          {/* bg image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${onboardingBg})` }}
          />
          {/* black opacity overlay */}
          <div className="absolute inset-0 bg-black/55" />

          {/* Content */}
          <div className="relative flex flex-col items-center px-8 lg:px-14 py-8 lg:py-10 min-h-[460px]">
            <PulsingSphere speaking={speaking || aiLoading} size={160} />



            {/* Message */}
            <div className="mt-8 w-full max-w-xl text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={step.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="text-[17px] lg:text-[20px] leading-relaxed text-white"
                  style={{ fontFamily: "var(--font-display, inherit)", fontWeight: 300, letterSpacing: "-0.01em" }}
                >
                  <TypingMessage text={step.message(form)} onDone={() => setSpeaking(false)} />
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Step input */}
            <motion.div
              key={`input-${step.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-5 w-full max-w-xl"
            >
              <StepInput
                step={step}
                form={form}
                setField={setField}
                toggleArr={toggleArr}
                addArea={addArea}
                removeArea={removeArea}
                updateArea={updateArea}
                addCargo={addCargo}
                updateCargo={updateCargo}
                removeCargo={removeCargo}
              />

              {step.aiField && (
                <div className="mt-6 flex flex-col items-center gap-3">
                  <button
                    onClick={suggest}
                    disabled={aiLoading}
                    className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    {aiLoading ? "Pensando…" : "Sugiéreme tú"}
                  </button>

                  <div className="w-full max-w-md flex items-center gap-2">
                    <input
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendCustom()}
                      placeholder="O escríbeme algo más específico…"
                      disabled={aiLoading}
                      className="flex-1 h-10 px-4 rounded-full bg-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <button
                      onClick={sendCustom}
                      disabled={!customInput.trim() || aiLoading}
                      className="h-10 w-10 rounded-full bg-white text-black inline-flex items-center justify-center disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>


      {/* Footer nav */}
      <footer className="absolute bottom-0 inset-x-0 z-10 px-6 lg:px-10 py-5 flex items-center justify-between">
        <button
          onClick={back}
          disabled={stepIdx === 0}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ArrowLeft className="w-4 h-4" /> Atrás
        </button>

        {isLast ? (
          <button
            onClick={finish}
            className="inline-flex items-center gap-2 rounded-full px-6 h-11 bg-foreground text-background text-sm font-medium hover:opacity-90"
          >
            <Check className="w-4 h-4" /> Empezar diagnóstico
          </button>
        ) : (
          <button
            onClick={next}
            disabled={!canAdvance}
            className="inline-flex items-center gap-2 rounded-full px-6 h-11 bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-40"
          >
            Continuar <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </footer>

      <style>{`
        .input-base {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          background: hsl(var(--background));
          font-size: 14px;
          outline: none;
          transition: border-color .15s;
        }
        textarea.input-base { height: auto; padding: 10px 14px; }
        .input-base:focus { border-color: hsl(var(--foreground) / .5); }
      `}</style>
    </div>
  );
}

// ---------- Step input variants ----------
function StepInput({
  step, form, setField, toggleArr,
  addArea, removeArea, updateArea, addCargo, updateCargo, removeCargo,
}: any) {
  switch (step.id) {
    case "welcome":
      return (
        <p className="text-center text-sm text-white/80">
          Toca <strong className="text-white">Continuar</strong> cuando estés listo.
        </p>

      );

    case "empresa":
      return (
        <input
          autoFocus
          value={form.empresa}
          onChange={(e) => setField("empresa", e.target.value)}
          placeholder="Ej: Enaex"
          className="input-base h-14 text-lg text-center rounded-2xl"
        />
      );

    case "industria":
      return <ChipsGrid options={industrias} value={form.industria} onSelect={(v) => setField("industria", v)} />;

    case "tamano":
      return <ChipsGrid options={tamanos} value={form.tamano} onSelect={(v) => setField("tamano", v)} />;

    case "areas":
      if (form.areasSetup.length === 0) {
        return (
          <p className="text-center text-sm text-white/70 py-4 inline-flex items-center justify-center gap-2 w-full">
            <Loader2 className="w-4 h-4 animate-spin" /> Prisma está armando un organigrama sugerido…
          </p>
        );
      }
      return (
        <div className="space-y-2.5 max-h-[44vh] overflow-y-auto pr-1">
          {form.areasSetup.map((a: AreaSetup) => (
            <div key={a.id} className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">{a.nombre}</h4>
                <button
                  onClick={() => removeArea(a.id)}
                  className="text-[11px] text-white/50 hover:text-white transition-colors"
                  title="Quitar área"
                >
                  Quitar
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {a.cargos.map((c: Cargo) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-white/10 hover:bg-white/15 text-xs text-white border border-white/10"
                  >
                    {c.nombre}
                    <button
                      onClick={() => removeCargo(a.id, c.id)}
                      className="text-white/50 hover:text-white leading-none text-sm"
                      title="Quitar cargo"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );


    case "objetivo":
      return <ChipsGrid options={objetivosOpts} value={form.objetivo} onSelect={(v) => setField("objetivo", v)} />;

    case "prioritarias": {
      const opts = form.areasSetup.filter((a: AreaSetup) => a.nombre).map((a: AreaSetup) => a.nombre);
      if (opts.length === 0) return <p className="text-center text-sm text-muted-foreground">Vuelve al paso de áreas para definirlas primero.</p>;
      return (
        <div className="flex flex-wrap justify-center gap-2">
          {opts.map((o: string) => (
            <Chip key={o} active={form.prioritarias.includes(o)} onClick={() => toggleArr("prioritarias", o)}>{o}</Chip>
          ))}
        </div>
      );
    }

    case "horizonte":
      return <ChipsGrid options={horizontes} value={form.horizonte} onSelect={(v) => setField("horizonte", v)} />;

    case "herramientas":
      return (
        <div className="flex flex-wrap justify-center gap-2">
          {herramientasOpts.map((o) => (
            <Chip key={o} active={form.herramientasSel.includes(o)} onClick={() => toggleArr("herramientasSel", o)}>{o}</Chip>
          ))}
        </div>
      );

    case "done":
      return (
        <div className="text-center text-sm text-white/80">
          Empresa <strong className="text-white">{form.empresa}</strong> · {form.industria} · {form.tamano}

          <br />
          {form.areasSetup.length} área{form.areasSetup.length !== 1 ? "s" : ""} configurada{form.areasSetup.length !== 1 ? "s" : ""}
        </div>
      );

    default:
      return null;
  }
}

function ChipsGrid({ options, value, onSelect }: { options: string[]; value: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {options.map((o) => (
        <Chip key={o} active={value === o} onClick={() => onSelect(o)}>{o}</Chip>
      ))}
    </div>
  );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 h-11 rounded-full text-sm border transition-all ${
        active
          ? "bg-foreground text-background border-foreground scale-[1.02]"
          : "bg-background/50 text-foreground border-border hover:bg-muted hover:border-foreground/30"
      }`}
    >
      {children}
    </button>
  );
}
