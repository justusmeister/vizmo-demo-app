import { cx } from "@/lib/cx";

// The vizmo mark at hero scale on Nachtblau: the same two chevrons as the logo (same geometry,
// round caps, upper Vizmo Blau, lower Lavendel), drawn once on load, upper first. It carries
// the hero's colour contrast until there are photos or video. Decorative.

const chevrons = [
  { points: "255,274 512,531 769,274", className: "stroke-blue", delay: "0.1s" },
  { points: "255,492 512,749 769,492", className: "stroke-lavender", delay: "0.45s" },
];

export function HeroChevrons({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="190 210 644 604" className={cx("pointer-events-none", className)}>
      <g fill="none" strokeWidth={100} strokeLinecap="round" strokeLinejoin="round">
        {chevrons.map((c) => (
          <polyline
            key={c.points}
            points={c.points}
            pathLength={1}
            strokeDasharray="1 1"
            className={cx(c.className, "animate-draw motion-reduce:animate-none")}
            style={{ animationDelay: c.delay }}
          />
        ))}
      </g>
    </svg>
  );
}
