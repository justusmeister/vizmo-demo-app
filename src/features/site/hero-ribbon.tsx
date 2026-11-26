import type { CSSProperties } from "react";

// Homepage hero graphic: the vizmo double chevron, drawn as a ribbon of fine parallel
// strands (upper chevron Vizmo Blau into Lavendel, lower chevron Lavendel into Nebel, as in
// the mark). The strands draw themselves once on load, upper chevron first: "two guided
// steps that arrive". No motion under prefers-reduced-motion. Decorative only.

const strands = Array.from({ length: 11 }, (_, i) => (i - 5) * 22);

function chevron(apexY: number, dy: number) {
  return `60,${apexY - 440 + dy} 500,${apexY + dy} 940,${apexY - 440 + dy}`;
}

function Strands({ apexY, gradient, delay }: { apexY: number; gradient: string; delay: number }) {
  return (
    <g stroke={`url(#${gradient})`}>
      {strands.map((dy, i) => (
        <polyline
          key={dy}
          points={chevron(apexY, dy)}
          pathLength={1}
          strokeDasharray="1 1"
          className="animate-draw motion-reduce:animate-none"
          style={{ animationDelay: `${delay + i * 0.04}s` } as CSSProperties}
        />
      ))}
    </g>
  );
}

export function HeroRibbon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1000 1060" fill="none" className={className}>
      <defs>
        <linearGradient id="ribbon-upper" x1="60" y1="0" x2="940" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: "var(--color-deep-blue)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--color-blue)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-lavender)" }} />
        </linearGradient>
        <linearGradient id="ribbon-lower" x1="60" y1="0" x2="940" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: "var(--color-lavender)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-mist)" }} />
        </linearGradient>
      </defs>
      <g strokeWidth={13} strokeLinecap="round" strokeLinejoin="round">
        <Strands apexY={560} gradient="ribbon-upper" delay={0} />
        <Strands apexY={930} gradient="ribbon-lower" delay={0.35} />
      </g>
    </svg>
  );
}
