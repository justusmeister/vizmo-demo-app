import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

// Design doc 6.6: completed steps Nachtblau with a check, the active step Vizmo Blau,
// upcoming steps Grau (marker only; labels stay readable in Schiefer).

export type StepState = "done" | "current" | "upcoming";
export type StepItem = { label: string; description?: ReactNode; state: StepState };

export function StepList({ items, className }: { items: StepItem[]; className?: string }) {
  return (
    <ol className={cx("flex flex-col", className)}>
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <li key={item.label} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span
                aria-hidden
                className={cx(
                  "absolute top-6 bottom-0 left-[11px] w-0.5",
                  item.state === "done" ? "bg-night" : "bg-line",
                )}
              />
            )}
            <span
              aria-hidden
              className={cx(
                "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full",
                item.state === "done" && "bg-night text-white",
                item.state === "current" && "bg-blue ring-4 ring-mist",
                item.state === "upcoming" && "border-2 border-gray bg-white",
              )}
            >
              {item.state === "done" && <Check className="size-3.5" strokeWidth={3} />}
              {item.state === "current" && <span className="size-2 rounded-full bg-white" />}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className={cx("font-medium", item.state === "upcoming" ? "text-slate" : "text-night")}>
                {item.label}
                <span className="sr-only">
                  {item.state === "done" ? " (erledigt)" : item.state === "current" ? " (aktuell)" : ""}
                </span>
              </p>
              {item.description && <p className="mt-0.5 text-small text-slate">{item.description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
