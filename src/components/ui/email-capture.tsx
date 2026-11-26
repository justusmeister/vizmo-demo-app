import { CircleAlert } from "lucide-react";
import { useId, type ComponentProps } from "react";
import { cx } from "@/lib/cx";
import { Button } from "./button";

// One fused field for a single e-mail address and its action (design doc 6.3, "E-mail
// capture"): the input and the primary button share one rounded control, so it reads as one
// element, not a box. The button sits 6 px inside the field with the smaller input radius, so
// the corners stay concentric. `light` for white or Nebel surfaces, `dark` for Nachtblau.
// The label is visually hidden because the placeholder and surrounding copy name the field.

type EmailCaptureProps = Omit<ComponentProps<"input">, "className" | "type"> & {
  label: string;
  action: string;
  hint?: string;
  error?: string;
  tone?: "light" | "dark";
  className?: string;
};

export function EmailCapture({ label, action, hint, error, tone = "light", className, id, ...props }: EmailCaptureProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const noteId = `${fieldId}-note`;
  const dark = tone === "dark";
  return (
    <div className={cx("flex w-full max-w-md flex-col gap-2.5", className)}>
      <label htmlFor={fieldId} className="sr-only">
        {label}
      </label>
      <div
        className={cx(
          "flex items-center gap-1.5 rounded-card p-1.5 transition-[box-shadow,background-color]",
          dark
            ? cx("bg-white/10 ring-1 focus-within:bg-white/15 focus-within:ring-2 focus-within:ring-white [&_button:focus-visible]:outline-white", error ? "ring-white" : "ring-white/25 hover:ring-white/40")
            : cx("bg-white ring-1 focus-within:ring-2 focus-within:ring-blue", error ? "ring-error" : "ring-gray/50 hover:ring-gray"),
        )}
      >
        <input
          id={fieldId}
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={hint || error ? noteId : undefined}
          className={cx(
            "h-11 min-w-0 flex-1 bg-transparent px-3 text-copy outline-none focus-visible:outline-none",
            dark ? "text-white placeholder:text-lavender" : "text-night placeholder:text-gray",
          )}
          {...props}
        />
        <Button type="submit" inset className="h-11 px-4">
          {action}
        </Button>
      </div>
      {error ? (
        <p id={noteId} className={cx("flex items-center gap-1.5 text-body font-medium", dark ? "text-white" : "text-error")} aria-live="polite">
          <CircleAlert aria-hidden className="size-4 shrink-0" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={noteId} className={cx("text-body", dark ? "text-lavender" : "text-slate")} aria-live="polite">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
