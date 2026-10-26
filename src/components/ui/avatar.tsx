import { cx } from "@/lib/cx";

export function Avatar({ initials, size = "md", className }: { initials: string; size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <span
      aria-hidden
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-mist font-medium text-night",
        size === "sm" && "size-8 text-small",
        size === "md" && "size-9 text-small",
        size === "lg" && "size-12 text-body",
        className,
      )}
    >
      {initials}
    </span>
  );
}
