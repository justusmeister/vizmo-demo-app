import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

// Layout helpers for marketing pages: one container width, consistent vertical rhythm.

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-6xl px-4 md:px-6", className)}>{children}</div>;
}

export function Section({
  id,
  tone = "white",
  className,
  children,
}: {
  id?: string;
  tone?: "white" | "surface" | "mist" | "night";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cx(
        "scroll-mt-20 py-16 md:py-24",
        tone === "white" && "bg-white",
        tone === "surface" && "bg-surface",
        tone === "mist" && "bg-mist",
        tone === "night" && "bg-night text-white",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({ title, lead, className, dark = false }: { title: string; lead?: ReactNode; className?: string; dark?: boolean }) {
  return (
    <div className={cx("max-w-2xl", className)}>
      <h2 className="font-display text-section font-bold">{title}</h2>
      {lead && <p className={cx("mt-4 text-lead", dark ? "text-lavender" : "text-slate")}>{lead}</p>}
    </div>
  );
}

/** Page intro for subpages. */
export function PageIntro({ title, lead }: { title: string; lead?: ReactNode }) {
  return (
    <div className="border-b border-line bg-surface">
      <Container className="py-14 md:py-20">
        <h1 className="max-w-3xl font-display text-hero font-bold">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lead text-slate">{lead}</p>}
      </Container>
    </div>
  );
}
