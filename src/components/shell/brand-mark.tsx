import { cx } from "@/lib/cx";

// PLACEHOLDER until official logo files arrive (design doc 9.1): the double chevron
// redrawn from the Markenhandbuch, upper chevron Vizmo Blau, lower Lavendel. Never
// recolor or swap them. Below 80px the mark is used alone, always on a Nachtblau tile.
// The "vizmo" wordmark must not be typeset in a font, so it isn't rendered here.

export function BrandMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <span
      role="img"
      aria-label="vizmo"
      className={cx("inline-flex shrink-0 items-center justify-center rounded-button bg-night", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="size-3/4">
        <polyline points="6 5.5 12 11.5 18 5.5" className="stroke-blue" />
        <polyline points="6 11.5 12 17.5 18 11.5" className="stroke-lavender" />
      </svg>
    </span>
  );
}
