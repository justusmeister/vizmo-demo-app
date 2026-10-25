import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

// Design doc 6.5. White (or Nebel) surface on the Fläche page background,
// 1px Linie border instead of a shadow.

type CardProps = ComponentProps<"section"> & {
  tone?: "white" | "mist";
  padding?: "none" | "md" | "lg";
};

const paddings = { none: "", md: "p-4 md:p-5", lg: "p-5 md:p-6" };

export function Card({ tone = "white", padding = "md", className, ...props }: CardProps) {
  return (
    <section
      className={cx(
        "rounded-card",
        tone === "white" ? "border border-line bg-white" : "bg-mist",
        paddings[padding],
        className,
      )}
      {...props}
    />
  );
}

type CardHeaderProps = {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function CardHeader({ title, description, actions, className }: CardHeaderProps) {
  return (
    <header className={cx("flex flex-wrap items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <h3 className="text-h3">{title}</h3>
        {description && <p className="mt-0.5 text-slate">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
