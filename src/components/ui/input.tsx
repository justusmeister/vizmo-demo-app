import { CircleAlert } from "lucide-react";
import { useId, type ComponentProps, type ReactNode } from "react";
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

type FieldIds = { id: string; describedBy?: string; invalid?: true };

function Field({
  label,
  hint,
  error,
  className,
  id,
  children,
}: FieldProps & { id?: string; children: (ids: FieldIds) => ReactNode }) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={fieldId} className="font-medium text-slate">
        {label}
      </label>
      {children({ id: fieldId, describedBy: cx(hintId, errorId) || undefined, invalid: error ? true : undefined })}
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

const border = (error?: string) => (error ? "border-error hover:border-error" : "border-line");

type InputProps = Omit<ComponentProps<"input">, "className"> & FieldProps & { suffix?: string };

export function Input({ label, hint, error, className, id, suffix, ...props }: InputProps) {
  return (
    <Field label={label} hint={hint} error={error} className={className} id={id}>
      {({ id: inputId, describedBy, invalid }) => (
        <div className="relative">
          <input
            id={inputId}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={cx(control, "h-10", suffix && "pr-10", border(error))}
            {...props}
          />
          {suffix && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate"
            >
              {suffix}
            </span>
          )}
        </div>
      )}
    </Field>
  );
}

type TextareaProps = Omit<ComponentProps<"textarea">, "className"> & FieldProps;

export function Textarea({ label, hint, error, className, id, rows = 4, ...props }: TextareaProps) {
  return (
    <Field label={label} hint={hint} error={error} className={className} id={id}>
      {({ id: inputId, describedBy, invalid }) => (
        <textarea
          id={inputId}
          rows={rows}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cx(control, "resize-y py-2.5", border(error))}
          {...props}
        />
      )}
    </Field>
  );
}

type SelectProps = Omit<ComponentProps<"select">, "className"> & FieldProps;

export function Select({ label, hint, error, className, id, children, ...props }: SelectProps) {
  return (
    <Field label={label} hint={hint} error={error} className={className} id={id}>
      {({ id: inputId, describedBy, invalid }) => (
        <select
          id={inputId}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cx(control, "h-10 pr-8", border(error))}
          {...props}
        >
          {children}
        </select>
      )}
    </Field>
  );
}
