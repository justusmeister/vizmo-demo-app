import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

// Design doc 6.4. Functional colors are for status only, with their stated meanings:
// success = verified / accepted / slot booked, warning = deposit hold / action pending,
// error = rejected / failed check. Status badges always carry an icon, so color is never
// the only signal. Hinweis takes Nachtblau text only.

type Tone = "neutral" | "success" | "warning" | "error";

const tones: Record<Tone, string> = {
  neutral: "bg-mist text-night",
  success: "bg-success text-white",
  warning: "bg-warning text-night",
  error: "bg-error text-white",
};

const statusIcons: Record<Exclude<Tone, "neutral">, ReactNode> = {
  success: <CircleCheck aria-hidden className="size-3.5 shrink-0" />,
  warning: <TriangleAlert aria-hidden className="size-3.5 shrink-0" />,
  error: <CircleX aria-hidden className="size-3.5 shrink-0" />,
};

type BadgeProps = {
  tone?: Tone;
  children: ReactNode;
  className?: string;
};

export function Badge({ tone = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-small font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {tone !== "neutral" && statusIcons[tone]}
      {children}
    </span>
  );
}
