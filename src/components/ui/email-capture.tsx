import { CircleAlert } from "lucide-react";
import { useId, type ComponentProps } from "react";
import { cx } from "@/lib/cx";
import { Button } from "./button";

// One fused field for a single e-mail address and its action, for Nachtblau surfaces (design
// doc 6.3, "E-mail capture"). The field is a quiet translucent strip with the primary button
// inside it, so it reads as one control, not a box. The label is visually hidden because the
// placeholder and the surrounding copy name the field; the hint below stays visible.

type EmailCaptureProps = Omit<ComponentProps<"input">, "className" | "type"> & {
  label: string;
  action: string;
  hint?: string;
  error?: string;
  className?: string;
};

export function EmailCapture({ label, action, hint, error, className, id, ...props }: EmailCaptureProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const noteId = `${fieldId}-note`;
  return (
    <div className={cx("flex w-full max-w-md flex-col gap-2.5", className)}>
      <label htmlFor={fieldId} className="sr-only">
        {label}
      </label>
      <div
        className={cx(
          "flex items-center gap-1.5 rounded-button bg-white/10 p-1.5 ring-1 transition-[box-shadow,background-color] focus-within:bg-white/15 focus-within:ring-2 focus-within:ring-white",
          error ? "ring-white" : "ring-white/25 hover:ring-white/40",
          "[&_button:focus-visible]:outline-white",
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
          className="h-10 min-w-0 flex-1 bg-transparent px-2.5 text-copy text-white outline-none placeholder:text-lavender focus-visible:outline-none"
          {...props}
        />
        <Button type="submit" className="h-10 px-4">
          {action}
        </Button>
      </div>
      {error ? (
        <p id={noteId} className="flex items-center gap-1.5 text-body font-medium text-white" aria-live="polite">
          <CircleAlert aria-hidden className="size-4 shrink-0" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={noteId} className="text-body text-lavender" aria-live="polite">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
