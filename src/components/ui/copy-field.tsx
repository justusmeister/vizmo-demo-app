"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";

// Read-only value with a copy button. Falls back to selecting the text when the
// Clipboard API is unavailable (e.g. non-secure context).

type CopyFieldProps = {
  label: string;
  value: string;
  multiline?: boolean;
  className?: string;
};

export function CopyField({ label, value, multiline = false, className }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const fieldRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      fieldRef.current?.select();
      document.execCommand?.("copy");
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  const fieldClass =
    "min-w-0 flex-1 rounded-input border border-line bg-surface px-3 text-body text-night";

  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <span className="font-medium text-slate">{label}</span>
      <div className={cx("flex gap-2", multiline ? "flex-col sm:flex-row sm:items-start" : "items-center")}>
        {multiline ? (
          <textarea
            ref={fieldRef}
            readOnly
            value={value}
            rows={4}
            aria-label={label}
            onFocus={(event) => event.currentTarget.select()}
            className={cx(fieldClass, "resize-none py-2.5")}
          />
        ) : (
          <input
            ref={fieldRef}
            readOnly
            value={value}
            aria-label={label}
            onFocus={(event) => event.currentTarget.select()}
            className={cx(fieldClass, "h-10 truncate font-medium")}
          />
        )}
        <button
          type="button"
          onClick={copy}
          className={cx(
            "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-button px-4 font-medium transition-colors",
            copied ? "bg-night text-white" : "bg-blue text-white hover:bg-deep-blue",
          )}
        >
          {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
          <span aria-live="polite">{copied ? "Kopiert" : "Kopieren"}</span>
        </button>
      </div>
    </div>
  );
}
