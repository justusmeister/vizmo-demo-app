import { cx } from "@/lib/cx";

// Section edge in the shape of the vizmo mark: the section above reaches down into the next
// one as a wide, shallow V edged in Vizmo Blau, and a Lavendel chevron follows below it, like
// the double chevron of the logo. The arms start below the section boundary and fade in from
// the page edges, so the V grows out of the surface instead of being cut off at the top. Used
// at two transitions only (hero → problem, comparison → trust), so it stays a signature, not a
// pattern. Decorative.

const fills = { white: "text-white", surface: "text-surface" } as const;

function Fade({ id, color }: { id: string; color: string }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1440" y2="0">
      <stop offset="0" stopColor={color} stopOpacity="0" />
      <stop offset="0.22" stopColor={color} />
      <stop offset="0.78" stopColor={color} />
      <stop offset="1" stopColor={color} stopOpacity="0" />
    </linearGradient>
  );
}

export function ChevronEdge({ from, className }: { from: keyof typeof fills; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      className={cx("pointer-events-none absolute inset-x-0 -top-px h-16 w-full sm:h-24 lg:h-40", fills[from], className)}
    >
      {/* Same ids in every instance on purpose: the definitions are identical. */}
      <defs>
        <Fade id="chevron-edge-blue" color="var(--color-blue)" />
        <Fade id="chevron-edge-lavender" color="var(--color-lavender)" />
      </defs>
      <polygon points="0,-2 1440,-2 1440,28 720,100 0,28" fill="currentColor" />
      <polyline points="0,28 720,100 1440,28" fill="none" stroke="url(#chevron-edge-blue)" strokeWidth={5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      <polyline points="0,72 720,144 1440,72" fill="none" stroke="url(#chevron-edge-lavender)" strokeWidth={5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
