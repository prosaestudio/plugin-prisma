import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface AvatarConfig {
  bodyColor: string;
  eyeStyle: "round" | "happy" | "sleepy" | "angry";
  mouthStyle: "smile" | "open" | "flat" | "teeth";
  hat: "none" | "tophat" | "cap" | "beanie" | "crown";
  accessory: "none" | "mustache" | "glasses" | "monocle" | "bowtie";
  bodyShape: "round" | "oval" | "square";
}

export const defaultAvatarConfig: AvatarConfig = {
  bodyColor: "#6366f1",
  eyeStyle: "round",
  mouthStyle: "smile",
  hat: "none",
  accessory: "none",
  bodyShape: "round",
};

const BODY_COLORS = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#ef4444"];

function Eyes({ style, cx, cy }: { style: string; cx: number; cy: number }) {
  const leftX = cx - 12;
  const rightX = cx + 12;
  switch (style) {
    case "happy":
      return (
        <>
          <path d={`M${leftX - 5} ${cy} Q${leftX} ${cy - 7} ${leftX + 5} ${cy}`} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d={`M${rightX - 5} ${cy} Q${rightX} ${cy - 7} ${rightX + 5} ${cy}`} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      );
    case "sleepy":
      return (
        <>
          <line x1={leftX - 4} y1={cy} x2={leftX + 4} y2={cy} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={rightX - 4} y1={cy} x2={rightX + 4} y2={cy} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    case "angry":
      return (
        <>
          <circle cx={leftX} cy={cy} r="4" fill="white" />
          <circle cx={rightX} cy={cy} r="4" fill="white" />
          <line x1={leftX - 5} y1={cy - 7} x2={leftX + 3} y2={cy - 4} stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1={rightX + 5} y1={cy - 7} x2={rightX - 3} y2={cy - 4} stroke="white" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    default:
      return (
        <>
          <circle cx={leftX} cy={cy} r="4.5" fill="white" />
          <circle cx={leftX + 1} cy={cy + 1} r="2" fill="#1e1e2e" />
          <circle cx={rightX} cy={cy} r="4.5" fill="white" />
          <circle cx={rightX + 1} cy={cy + 1} r="2" fill="#1e1e2e" />
        </>
      );
  }
}

function Mouth({ style, cx, cy }: { style: string; cx: number; cy: number }) {
  switch (style) {
    case "open":
      return <ellipse cx={cx} cy={cy} rx="6" ry="5" fill="#1e1e2e" />;
    case "flat":
      return <line x1={cx - 7} y1={cy} x2={cx + 7} y2={cy} stroke="white" strokeWidth="2" strokeLinecap="round" />;
    case "teeth":
      return (
        <>
          <path d={`M${cx - 8} ${cy - 2} Q${cx} ${cy + 8} ${cx + 8} ${cy - 2}`} fill="#1e1e2e" />
          <rect x={cx - 3} y={cy - 2} width="6" height="4" fill="white" rx="1" />
        </>
      );
    default:
      return <path d={`M${cx - 8} ${cy} Q${cx} ${cy + 10} ${cx + 8} ${cy}`} stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />;
  }
}

function Hat({ style, cx }: { style: string; cx: number }) {
  switch (style) {
    case "tophat":
      return (
        <>
          <rect x={cx - 16} y={2} width="32" height="20" rx="3" fill="#1e1e2e" />
          <rect x={cx - 22} y={20} width="44" height="5" rx="2" fill="#1e1e2e" />
          <rect x={cx - 14} y={16} width="28" height="3" rx="1" fill="#f59e0b" />
        </>
      );
    case "cap":
      return (
        <>
          <ellipse cx={cx} cy={24} rx="26" ry="10" fill="#ef4444" />
          <rect x={cx - 2} y={22} width="28" height="4" rx="2" fill="#b91c1c" />
        </>
      );
    case "beanie":
      return (
        <>
          <ellipse cx={cx} cy={22} rx="22" ry="14" fill="#10b981" />
          <circle cx={cx} cy={8} r="4" fill="#10b981" />
          <rect x={cx - 22} y={20} width="44" height="6" rx="3" fill="#059669" />
        </>
      );
    case "crown":
      return (
        <>
          <polygon points={`${cx - 18},28 ${cx - 14},10 ${cx - 6},20 ${cx},6 ${cx + 6},20 ${cx + 14},10 ${cx + 18},28`} fill="#f59e0b" />
          <rect x={cx - 18} y={26} width="36" height="5" rx="2" fill="#d97706" />
          <circle cx={cx} cy={18} r="2" fill="#ef4444" />
        </>
      );
    default:
      return null;
  }
}

function Accessory({ style, cx, cy }: { style: string; cx: number; cy: number }) {
  switch (style) {
    case "mustache":
      return (
        <path
          d={`M${cx - 12} ${cy + 3} Q${cx - 6} ${cy + 10} ${cx} ${cy + 5} Q${cx + 6} ${cy + 10} ${cx + 12} ${cy + 3}`}
          fill="#4a3728"
          stroke="#3a2718"
          strokeWidth="0.5"
        />
      );
    case "glasses":
      return (
        <>
          <circle cx={cx - 12} cy={cy - 10} r="8" fill="none" stroke="white" strokeWidth="2" />
          <circle cx={cx + 12} cy={cy - 10} r="8" fill="none" stroke="white" strokeWidth="2" />
          <line x1={cx - 4} y1={cy - 10} x2={cx + 4} y2={cy - 10} stroke="white" strokeWidth="2" />
        </>
      );
    case "monocle":
      return (
        <>
          <circle cx={cx + 12} cy={cy - 10} r="9" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <line x1={cx + 12} y1={cy - 1} x2={cx + 14} y2={cy + 20} stroke="#f59e0b" strokeWidth="1.5" />
        </>
      );
    case "bowtie":
      return (
        <>
          <polygon points={`${cx - 12},${cy + 18} ${cx},${cy + 14} ${cx},${cy + 22}`} fill="#ef4444" />
          <polygon points={`${cx + 12},${cy + 18} ${cx},${cy + 14} ${cx},${cy + 22}`} fill="#ef4444" />
          <circle cx={cx} cy={cy + 18} r="2.5" fill="#b91c1c" />
        </>
      );
    default:
      return null;
  }
}

export function MonsterAvatar({
  config,
  size = 80,
  animate = false,
  className = "",
}: {
  config: AvatarConfig;
  size?: number;
  animate?: boolean;
  className?: string;
}) {
  const cx = 50;
  const eyeY = config.hat !== "none" ? 42 : 38;
  const mouthY = eyeY + 16;

  const body =
    config.bodyShape === "oval" ? (
      <ellipse cx={cx} cy={55} rx="30" ry="35" fill={config.bodyColor} />
    ) : config.bodyShape === "square" ? (
      <rect x={20} y={20} width="60" height="60" rx="14" fill={config.bodyColor} />
    ) : (
      <circle cx={cx} cy={50} r="32" fill={config.bodyColor} />
    );

  const svg = (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      {body}
      <Hat style={config.hat} cx={cx} />
      <Eyes style={config.eyeStyle} cx={cx} cy={eyeY} />
      <Mouth style={config.mouthStyle} cx={cx} cy={mouthY} />
      <Accessory style={config.accessory} cx={cx} cy={mouthY} />
    </svg>
  );

  if (animate) {
    return (
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {svg}
      </motion.div>
    );
  }

  return svg;
}

// ========== Avatar Editor ==========

interface AvatarEditorProps {
  config: AvatarConfig;
  onChange: (config: AvatarConfig) => void;
}

export function AvatarEditor({ config, onChange }: AvatarEditorProps) {
  const set = <K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) =>
    onChange({ ...config, [key]: value });

  const optionBtn = (label: string, active: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active ? "bg-primary text-primary-foreground shadow-sm" : "bg-accent text-accent-foreground hover:bg-accent/80"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-5">
      {/* Preview */}
      <div className="flex justify-center py-4">
        <MonsterAvatar config={config} size={120} animate />
      </div>

      {/* Color */}
      <div>
        <label className="text-xs font-semibold text-foreground mb-2 block">Color</label>
        <div className="flex gap-2 flex-wrap">
          {BODY_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => set("bodyColor", c)}
              className={`w-8 h-8 rounded-full transition-all ${config.bodyColor === c ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" : "hover:scale-105"}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Body shape */}
      <div>
        <label className="text-xs font-semibold text-foreground mb-2 block">Forma</label>
        <div className="flex gap-2 flex-wrap">
          {(["round", "oval", "square"] as const).map((s) =>
            optionBtn(s === "round" ? "Redondo" : s === "oval" ? "Ovalado" : "Cuadrado", config.bodyShape === s, () => set("bodyShape", s))
          )}
        </div>
      </div>

      {/* Eyes */}
      <div>
        <label className="text-xs font-semibold text-foreground mb-2 block">Ojos</label>
        <div className="flex gap-2 flex-wrap">
          {(["round", "happy", "sleepy", "angry"] as const).map((s) =>
            optionBtn(s === "round" ? "Normal" : s === "happy" ? "Feliz" : s === "sleepy" ? "Dormilón" : "Enojado", config.eyeStyle === s, () => set("eyeStyle", s))
          )}
        </div>
      </div>

      {/* Mouth */}
      <div>
        <label className="text-xs font-semibold text-foreground mb-2 block">Boca</label>
        <div className="flex gap-2 flex-wrap">
          {(["smile", "open", "flat", "teeth"] as const).map((s) =>
            optionBtn(s === "smile" ? "Sonrisa" : s === "open" ? "Abierta" : s === "flat" ? "Seria" : "Dientes", config.mouthStyle === s, () => set("mouthStyle", s))
          )}
        </div>
      </div>

      {/* Hat */}
      <div>
        <label className="text-xs font-semibold text-foreground mb-2 block">Gorro</label>
        <div className="flex gap-2 flex-wrap">
          {(["none", "tophat", "cap", "beanie", "crown"] as const).map((s) =>
            optionBtn(
              s === "none" ? "Ninguno" : s === "tophat" ? "Copa" : s === "cap" ? "Gorra" : s === "beanie" ? "Gorro" : "Corona",
              config.hat === s,
              () => set("hat", s)
            )
          )}
        </div>
      </div>

      {/* Accessory */}
      <div>
        <label className="text-xs font-semibold text-foreground mb-2 block">Accesorio</label>
        <div className="flex gap-2 flex-wrap">
          {(["none", "mustache", "glasses", "monocle", "bowtie"] as const).map((s) =>
            optionBtn(
              s === "none" ? "Ninguno" : s === "mustache" ? "Bigote" : s === "glasses" ? "Lentes" : s === "monocle" ? "Monóculo" : "Corbatín",
              config.accessory === s,
              () => set("accessory", s)
            )
          )}
        </div>
      </div>
    </div>
  );
}
