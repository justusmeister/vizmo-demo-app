import { cx } from "@/lib/cx";

// Section edge in the shape of the vizmo mark: the section above reaches down into the next
// one as a wide, shallow V edged in Vizmo Blau, and a Lavendel chevron follows below it, like
// the double chevron of the logo. Used at two transitions only (hero → problem, comparison →
// trust), so it stays a signature, not a pattern. Decorative.

const fills = { white: "text-white", surface: "text-surface" } as const;

export function ChevronEdge({ from, className }: { from: keyof typeof fills; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      className={cx("pointer-events-none absolute inset-x-0 -top-px h-16 w-full sm:h-24 lg:h-40", fills[from], className)}
    >
      <polygon points="0,-2 1440,-2 1440,0 720,96 0,0" fill="currentColor" />
      <polyline points="0,0 720,96 1440,0" fill="none" className="stroke-blue" strokeWidth={5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      <polyline points="0,44 720,140 1440,44" fill="none" className="stroke-lavender" strokeWidth={5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
