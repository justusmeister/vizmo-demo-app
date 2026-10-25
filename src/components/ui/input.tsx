import { CircleAlert } from "lucide-react";
import { useId, type ComponentProps } from "react";
import { cx } from "@/lib/cx";

// Design doc 6.3. Linie borders are only 1.3:1 on white, so a field always has a
// visible label and a darker (Grau) border on hover.

const control =
  "w-full rounded-input border bg-white px-3 text-body text-night transition-colors hover:border-gray disabled:cursor-not-allowed disabled:bg-surface disabled:text-gray disabled:hover:border-line";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
};

type InputProps = Omit<ComponentProps<"input">, "className"> & FieldProps;

export function Input({ label, hint, error, className, id, ...props }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className="font-medium text-slate">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={cx(hintId, errorId) || undefined}
        className={cx(control, "h-10", error ? "border-error hover:border-error" : "border-line")}
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="text-small text-slate">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-small font-medium text-error">
          <CircleAlert aria-hidden className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
