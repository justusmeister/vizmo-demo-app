import { cx } from "@/lib/cx";

export function Progress({ value, max, label, className }: { value: number; max: number; label: string; className?: string }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cx("h-1.5 overflow-hidden rounded-full bg-line", className)}
    >
      <div className="h-full rounded-full bg-blue transition-[width] duration-300" style={{ width: `${percent}%` }} />
    </div>
  );
}
