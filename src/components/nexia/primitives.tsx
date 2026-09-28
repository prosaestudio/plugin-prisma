import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus, CheckCircle2, AlertTriangle, RefreshCw, Plus } from "lucide-react";
import * as React from "react";
import { ReactNode } from "react";

// ───── ScoreBadge ─────
export function ScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const color = score >= 70 ? "text-success bg-success/10" : score >= 50 ? "text-warning bg-warning/10" : "text-destructive bg-destructive/10";
  const sizes = { sm: "text-xs px-2 py-0.5", md: "text-sm px-2.5 py-1", lg: "text-base px-3 py-1.5" };
  return <span className={cn("inline-flex items-center font-semibold rounded-lg", color, sizes[size])}>{score}</span>;
}

// ───── TrendBadge ─────
export function TrendBadge({ value }: { value: number }) {
  if (value === 0) return <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"><Minus className="w-3 h-3" /> 0</span>;
  const positive = value > 0;
  const Icon = positive ? ArrowUp : ArrowDown;
  const color = positive ? "text-success" : "text-destructive";
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", color)}>
      <Icon className="w-3 h-3" />
      {positive ? "+" : ""}{value}
    </span>
  );
}

// ───── ProgressBar (prisma gradient — más oscuro/intenso = crítico) ─────
export function PrismaProgress({ percent, className }: { percent: number; className?: string }) {
  const p = Math.min(100, Math.max(0, percent));
  // Lower % → más saturado y más oscuro. Higher % → más claro y desaturado.
  const t = p / 100; // 0 crítico, 1 excelente
  const saturate = (1.7 - t * 1.1).toFixed(2); // 1.7 → 0.6
  const brightness = (0.72 + t * 0.43).toFixed(2); // 0.72 → 1.15
  return (
    <div className={cn("w-full h-2 bg-muted rounded-full overflow-hidden", className)}>
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${p}%`,
          backgroundImage: "var(--gradient-prisma)",
          backgroundSize: "200% 100%",
          backgroundPosition: "left center",
          filter: `saturate(${saturate}) brightness(${brightness})`,
        }}
      />
    </div>
  );
}

// ───── MatchScore (gauge circular) ─────
export function MatchScore({ score, size = 120 }: { score: number; size?: number }) {
  const color = "hsl(var(--foreground))";
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth="8" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{score}%</span>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">match</span>
      </div>
    </div>
  );
}

// ───── IntegrationStatus ─────
export function IntegrationStatus({ status }: { status: "connected" | "error" | "pending" | "disconnected" }) {
  const map = {
    connected: { icon: CheckCircle2, label: "Conectada", className: "text-success bg-success/10" },
    error: { icon: AlertTriangle, label: "Error", className: "text-destructive bg-destructive/10" },
    pending: { icon: RefreshCw, label: "Conectando...", className: "text-warning bg-warning/10" },
    disconnected: { icon: Plus, label: "No conectada", className: "text-muted-foreground bg-muted" },
  } as const;
  const { icon: Icon, label, className } = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg", className)}>
      <Icon className={cn("w-3.5 h-3.5", status === "pending" && "animate-spin")} />
      {label}
    </span>
  );
}

// ───── PriorityBadge ─────
export function PriorityBadge({ priority }: { priority: "Alta" | "Media" | "Baja" }) {
  const map = {
    Alta: "text-destructive bg-destructive/10",
    Media: "text-warning bg-warning/10",
    Baja: "text-muted-foreground bg-muted",
  };
  return <span className={cn("inline-flex items-center text-xs font-medium px-2 py-1 rounded-lg", map[priority])}>{priority}</span>;
}

// ───── KpiCard ─────
export function KpiCard({ label, value, trend, hint }: { label: string; value: string | number; trend?: number; hint?: string }) {
  return (
    <div className="card-stat">
      <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{value}</span>
        {typeof trend === "number" && <TrendBadge value={trend} />}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

// ───── SectionHeader ─────
export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ───── EditorialHeader (eyebrow + serif title + paragraph) ─────
export function EditorialHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div className="max-w-2xl">
        {eyebrow && (
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">{eyebrow}</div>
        )}
        <h1 className="page-title leading-[1.05]">{title}</h1>
        {description && <p className="page-subtitle mt-3 max-w-xl">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  );
}

// ───── PillButton (rounded-full minimalist button) ─────
export function PillButton({
  children,
  variant = "outline",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "outline" | "solid" }) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 h-11 text-sm font-medium transition-colors",
        variant === "solid"
          ? "bg-foreground text-background hover:opacity-90"
          : "border border-border bg-background hover:bg-muted",
        className,
      )}
    >
      {children}
    </button>
  );
}
