import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import loginHero from "@/assets/login-hero.png";
import skyHero from "@/assets/login-slide-sky.png";

type ChatMsg =
  | { kind: "tools"; text: string }
  | { kind: "ai"; text: string }
  | { kind: "userChoice"; options: string[]; selected: number };

const conversation: ChatMsg[] = [
  { kind: "tools", text: "Analizando tu trabajo hoy…" },
  { kind: "ai", text: "Gerardo, acabo de consolidar las ventas de hoy.\n¿Quieres que te enseñe cómo lo hice?" },
  { kind: "userChoice", options: ["Obvio", "Después"], selected: 1 },
  { kind: "ai", text: "Perfecto, te mostraré las herramientas que he utilizado luego de analizar tu trabajo hoy." },
];

const SLIDE_DURATION = 12000;

function SkySlideChat() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    conversation.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), 1100 + i * 1700));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col justify-center px-10 lg:px-16 gap-4 pointer-events-none">
      {conversation.slice(0, step).map((msg, idx) => {
        const isUser = msg.kind === "userChoice";
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            {msg.kind === "tools" && (
              <div className="rounded-2xl bg-white/30 backdrop-blur-xl border border-white/50 px-5 py-4 shadow-lg max-w-[78%]">
                <div className="flex items-center gap-2.5 mb-2.5">
                  {[
                    "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
                    "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
                    "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
                    "https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg",
                  ].map((src, i) => (
                    <motion.img
                      key={i}
                      src={src}
                      alt=""
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + i * 0.1, duration: 0.3 }}
                      className="w-6 h-6 object-contain"
                    />
                  ))}
                </div>
                <div className="text-[13px] text-foreground/90 leading-snug">{msg.text}</div>
              </div>
            )}

            {msg.kind === "ai" && (
              <div className="rounded-2xl bg-white/40 backdrop-blur-xl border border-white/50 px-5 py-4 shadow-lg max-w-[80%]">
                <div className="text-[13px] text-foreground whitespace-pre-line leading-relaxed">
                  {msg.text}
                </div>
              </div>
            )}

            {msg.kind === "userChoice" && (
              <div className="flex gap-2.5 items-center">
                {msg.options.map((opt, i) => (
                  <div
                    key={opt}
                    className={`relative rounded-full px-5 py-2.5 text-[13px] backdrop-blur-xl border shadow-md ${
                      i === msg.selected
                        ? "bg-white/70 border-white/70 text-foreground"
                        : "bg-white/30 border-white/40 text-foreground/80"
                    }`}
                  >
                    {opt}
                    {i === msg.selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow"
                      >
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6.5L5 9.5L10 3" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function ClassicSlide() {
  return (
    <div className="absolute inset-0 flex items-start p-16">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 text-background max-w-lg">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 leading-[1.1] tracking-tight text-4xl text-white"
        >
          Potencia a tu equipo con aprendizaje inteligente
        </motion.h1>
      </div>
    </div>
  );
}

const slides = [
  { id: "classic", bg: loginHero, render: () => <ClassicSlide /> },
  { id: "sky", bg: skyHero, render: () => <SkySlideChat /> },
];

export default function LoginHeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_DURATION);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden">
      <AnimatePresence mode="sync">
        {slides.map((slide, i) =>
          i === index ? (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img src={slide.bg} alt="" className="absolute inset-0 w-full h-full object-cover" />
              {slide.render()}
            </motion.div>
          ) : null,
        )}
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-white" : "w-1.5 bg-white/50"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
