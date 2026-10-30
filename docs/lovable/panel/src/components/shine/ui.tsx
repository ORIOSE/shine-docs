import { forwardRef, useEffect, useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  ArrowDown, ArrowUp, Archive, BookOpen, Brain, CheckCircle2, Ear, Eye, Info, Loader2, Minus, PauseCircle, SpellCheck, Sparkles, X, AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AREAS, areaName, type AreaId, type Status, type Trend } from "@/data/mock";

/* ---------- Button ---------- */
const buttonVariants = cva(
  "press inline-flex items-center justify-center gap-2 rounded-md font-bold whitespace-nowrap disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-teal text-on-teal hover:bg-teal-dark active:bg-teal-dark",
        secondary: "border-2 border-teal bg-surface text-teal-dark hover:bg-teal-tint",
        destructive: "border-2 border-error bg-surface text-error hover:bg-shell",
        ghost: "text-teal-dark hover:bg-teal-tint",
      },
      size: {
        md: "h-12 px-6 text-lg",
        sm: "h-10 px-4 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, loading, children, disabled, ...p }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} disabled={disabled || loading} aria-busy={loading} {...p}>
    {loading && <Loader2 className="animate-spin" aria-hidden />}
    {children}
  </button>
));
Button.displayName = "Button";
export { buttonVariants };

/* ---------- Card ---------- */
export function Card({ className, pressable, children, ...p }: React.HTMLAttributes<HTMLDivElement> & { pressable?: boolean }) {
  return (
    <div className={cn("rounded-lg bg-surface p-4 shadow-card", pressable && "press-card cursor-pointer hover:shadow-raised", className)} {...p}>
      {children}
    </div>
  );
}

/* ---------- StatTile ---------- */
const tones = {
  amber: "bg-amber-tint text-amber-dark",
  teal: "bg-teal-tint text-teal-dark",
  success: "bg-success-tint text-success-dark",
};
export function StatTile({ icon: Icon, value, label, tone = "teal" }: { icon: LucideIcon; value: ReactNode; label: string; tone?: keyof typeof tones }) {
  return (
    <Card className="flex flex-col gap-3">
      <span className={cn("flex size-10 items-center justify-center rounded-md", tones[tone])}>
        <Icon className="size-5" strokeWidth={2.25} aria-hidden />
      </span>
      <div>
        <div className="stat-num">{value}</div>
        <div className="label-text">{label}</div>
      </div>
    </Card>
  );
}

/* ---------- ProgressBar ---------- */
export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex flex-col gap-2">
      <div className="h-3 w-full overflow-hidden rounded-full bg-track" role="progressbar" aria-valuenow={value} aria-valuemax={max} aria-label={label}>
        <div className="h-full rounded-full bg-amber" style={{ width: `${pct}%` }} />
      </div>
      <span className="label-text">{label}</span>
    </div>
  );
}

/* ---------- LevelChip ---------- */
export function levelBand(n: number) {
  if (n <= 3) return { name: "Inicial", cls: "bg-lvl-ini-bg text-lvl-ini-fg" };
  if (n <= 6) return { name: "Intermedio", cls: "bg-lvl-int-bg text-lvl-int-fg" };
  return { name: "Avanzado", cls: "bg-lvl-adv-bg text-lvl-adv-fg" };
}
export function LevelChip({ level, compact }: { level: number; compact?: boolean }) {
  const b = levelBand(level);
  return (
    <span className={cn("inline-flex items-center rounded-full px-[14px] py-[6px] text-sm leading-none font-bold whitespace-nowrap", b.cls)}>
      {compact ? `${level} · ${b.name}` : `Nivel ${level} · ${b.name}`}
    </span>
  );
}

/* ---------- Area ---------- */
export const AREA_ICON: Record<AreaId, LucideIcon> = { fon: Ear, vis: Eye, mem: Brain, ort: SpellCheck, flu: BookOpen };
export function AreaChip({ area, active, onClick, short }: { area: AreaId; active?: boolean; onClick?: () => void; short?: boolean }) {
  const Icon = AREA_ICON[area];
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      className={cn(
        "shine-t inline-flex items-center gap-1.5 rounded-full border-[1.5px] px-3 py-1.5 text-sm font-semibold whitespace-nowrap",
        active ? "border-teal bg-teal-tint text-teal-dark" : "border-line bg-surface text-ink",
        onClick && "min-h-12 cursor-pointer hover:bg-teal-tint",
      )}
    >
      <Icon className="size-[18px]" aria-hidden />
      {short ? AREAS.find((a) => a.id === area)!.short : areaName(area)}
    </Tag>
  );
}

/* ---------- MotivationCard ---------- */
export function MotivationCard({ title, children, icon: Icon = Sparkles }: { title: string; children: ReactNode; icon?: LucideIcon }) {
  return (
    <div className="flex gap-3 rounded-md border-l-4 border-teal bg-teal-tint p-4">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface text-amber">
        <Icon className="size-[18px]" strokeWidth={2.25} aria-hidden />
      </span>
      <div>
        <p className="font-bold">{title}</p>
        <p>{children}</p>
      </div>
    </div>
  );
}

/* ---------- EmptyState ---------- */
export function EmptyState({ icon: Icon, title, message, action }: { icon: LucideIcon; title: string; message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
      <span className="flex size-[88px] items-center justify-center rounded-full bg-teal-tint text-teal">
        <Icon className="size-10" aria-hidden />
      </span>
      <h2>{title}</h2>
      <p className="max-w-md text-ink-muted">{message}</p>
      {action}
    </div>
  );
}

/* ---------- Status badge ---------- */
const statusMap: Record<Status, { label: string; icon: LucideIcon; cls: string }> = {
  activo: { label: "Activo", icon: CheckCircle2, cls: "bg-success-tint text-success-dark" },
  pausa: { label: "En pausa", icon: PauseCircle, cls: "bg-amber-tint text-amber-dark" },
  archivado: { label: "Archivado", icon: Archive, cls: "bg-shell text-ink-muted" },
};
export function StatusBadge({ status }: { status: Status }) {
  const s = statusMap[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold whitespace-nowrap", s.cls)}>
      <s.icon className="size-4" aria-hidden />
      {s.label}
    </span>
  );
}
export function Badge({ children, tone = "neutral", icon: Icon }: { children: ReactNode; tone?: "neutral" | "teal" | "amber" | "success"; icon?: LucideIcon }) {
  const c = { neutral: "bg-shell text-ink-muted", teal: "bg-teal-tint text-teal-dark", amber: "bg-amber-tint text-amber-dark", success: "bg-success-tint text-success-dark" }[tone];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold whitespace-nowrap", c)}>
      {Icon && <Icon className="size-4" aria-hidden />}
      {children}
    </span>
  );
}

/* ---------- Trend ---------- */
export function TrendIndicator({ trend }: { trend: Trend }) {
  const m = {
    sube: { icon: ArrowUp, label: "Sube", cls: "text-teal-dark" },
    estable: { icon: Minus, label: "Estable", cls: "text-ink-muted" },
    baja: { icon: ArrowDown, label: "Baja", cls: "text-amber-dark" },
  }[trend];
  return (
    <span className={cn("inline-flex items-center gap-1 text-base font-semibold", m.cls)}>
      <m.icon className="size-4" strokeWidth={2.25} aria-hidden />
      {m.label}
    </span>
  );
}

/* ---------- Avatar ---------- */
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full font-extrabold"
      style={{ width: size, height: size, fontSize: size * 0.4, background: `oklch(0.92 0.05 ${h})`, color: `oklch(0.38 0.08 ${h})` }}
    >
      {initials}
    </span>
  );
}

/* ---------- Modal ---------- */
export function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={onClose}>
      <div role="dialog" aria-modal aria-label={title} className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-surface p-6 shadow-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2>{title}</h2>
          <button onClick={onClose} className="press flex size-12 items-center justify-center rounded-md hover:bg-teal-tint" aria-label="Cerrar">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex flex-col gap-4">{children}</div>
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

/* ---------- Forms ---------- */
const inputCls = "shine-t h-12 w-full rounded-md border border-line bg-surface px-4 text-lg text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/40";
export function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">{label}</label>
      {children(id)}
      {hint && <span className="label-text">{hint}</span>}
    </div>
  );
}
export const Input = (p: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cn(inputCls, p.className)} />;
export const Select = (p: SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} className={cn(inputCls, "pr-10", p.className)} />;
export const Textarea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={cn(inputCls, "h-auto min-h-28 py-3", p.className)} />;

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-between gap-4">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("shine-t relative h-8 w-14 shrink-0 rounded-full", checked ? "bg-teal" : "bg-track")}
      >
        <span className={cn("shine-t absolute top-1 size-6 rounded-full bg-surface shadow-card", checked ? "left-7" : "left-1")} />
        <span className="sr-only">{checked ? "Activado" : "Desactivado"}</span>
      </button>
    </label>
  );
}

/* ---------- Alert ---------- */
export function Alert({ tone = "info", title, children, action }: { tone?: "info" | "warning"; title: string; children?: ReactNode; action?: ReactNode }) {
  const Icon = tone === "warning" ? AlertTriangle : Info;
  return (
    <div className={cn("flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-center", tone === "warning" ? "bg-amber-tint" : "bg-teal-tint")}>
      <Icon className={cn("size-6 shrink-0", tone === "warning" ? "text-amber-dark" : "text-teal-dark")} aria-hidden />
      <div className="flex-1">
        <p className="font-bold">{title}</p>
        {children && <div className="text-base">{children}</div>}
      </div>
      {action}
    </div>
  );
}

/* ---------- Tabs ---------- */
export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string; icon?: LucideIcon }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="tablist" className="no-scrollbar no-print flex gap-1 overflow-x-auto border-b border-line">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "shine-t -mb-px flex min-h-12 items-center gap-2 border-b-[3px] px-4 text-base font-semibold whitespace-nowrap hover:bg-teal-tint",
            value === t.id ? "border-teal text-teal-dark" : "border-transparent text-ink-muted",
          )}
        >
          {t.icon && <t.icon className="size-[18px]" strokeWidth={value === t.id ? 2.25 : 2} aria-hidden />}
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="no-print flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export function Wordmark() {
  return (
    <span className="inline-flex items-baseline text-[26px] font-extrabold tracking-tight text-teal">
      Shine<span className="ml-0.5 inline-block size-2 rounded-full bg-amber" aria-hidden />
    </span>
  );
}
