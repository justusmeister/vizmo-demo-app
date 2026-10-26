import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

// Neutral explanatory box on Nebel. Not a status indicator, so it never uses functional colors.

type NoticeProps = {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Notice({ title, icon, children, className }: NoticeProps) {
  return (
    <div className={cx("flex gap-3 rounded-card bg-mist p-4 text-night", className)}>
      <span className="mt-0.5 shrink-0 text-deep-blue">{icon ?? <Info aria-hidden className="size-5" />}</span>
      <div className="min-w-0">
        {title && <p className="font-medium">{title}</p>}
        <div className={cx(title && "mt-0.5", "text-night")}>{children}</div>
      </div>
    </div>
  );
}
