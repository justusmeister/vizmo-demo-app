import { Check, CircleHelp, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cx } from "@/lib/cx";
import type { Status } from "./data";
import type { Check as CheckItem } from "./match";

// Match meter: one segment per criterion. Met = Nachtblau, to clarify = Lavendel, unmet = Linie.
// Data, not status, so no functional colors.
export function MatchMeter({ items, className }: { items: CheckItem[]; className?: string }) {
  return (
    <span aria-hidden className={cx("flex gap-0.5", className)}>
      {items.map((item) => (
        <span
          key={item.label}
          className={cx(
            "h-1.5 w-3 rounded-full",
            item.result === "met" && "bg-night",
            item.result === "clarify" && "bg-lavender",
            item.result === "unmet" && "bg-line",
          )}
        />
      ))}
    </span>
  );
}

const statusBadge: Record<Status, { tone: "neutral" | "success" | "warning" | "error"; label: string }> = {
  neu: { tone: "neutral", label: "Neu" },
  eingeladen: { tone: "warning", label: "Eingeladen" },
  gebucht: { tone: "success", label: "Slot gebucht" },
  besichtigt: { tone: "neutral", label: "Besichtigt" },
  abgesagt: { tone: "error", label: "Abgesagt" },
};

export function StatusBadge({ status }: { status: Status }) {
  const { tone, label } = statusBadge[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function CheckIcon({ result }: { result: CheckItem["result"] }) {
  if (result === "met") return <Check aria-label="erfüllt" className="size-4 shrink-0 text-night" strokeWidth={2.5} />;
  if (result === "clarify") return <CircleHelp aria-label="klären" className="size-4 shrink-0 text-deep-blue" />;
  return <Minus aria-label="nicht erfüllt" className="size-4 shrink-0 text-slate" strokeWidth={2.5} />;
}
