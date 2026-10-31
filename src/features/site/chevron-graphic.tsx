import { cx } from "@/lib/cx";

// Brand supergraphic (Markenhandbuch): the double chevron, cropped large, in slightly
// lightened Nachtblau. Decorative only.
export function ChevronGraphic({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="200 220 620 580" fill="none" className={cx("pointer-events-none", className)}>
      <g strokeWidth={100} strokeLinecap="round" strokeLinejoin="round" className="stroke-white/[0.06]">
        <polyline points="255,274 512,531 769,274" />
        <polyline points="255,492 512,749 769,492" />
      </g>
    </svg>
  );
}
