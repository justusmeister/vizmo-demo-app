"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";

// Modal built on the native <dialog>: focus trap, Escape and inert background for free.
// "center" for confirmations, "side" for a detail panel (full screen on mobile).

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  variant?: "center" | "side";
  footer?: ReactNode;
  children: ReactNode;
};

export function Dialog({ open, onClose, title, description, variant = "center", footer, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => event.target === ref.current && onClose()}
      className={cx(
        "flex-col bg-white text-night backdrop:bg-night/60 not-open:hidden open:flex",
        variant === "center" &&
          "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg rounded-modal shadow-overlay",
        variant === "side" && "m-0 ml-auto h-dvh max-h-none w-full max-w-none sm:max-w-xl",
      )}
    >
      <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div className="min-w-0">
          <h2 id={titleId} className="text-h2">
            {title}
          </h2>
          {description && <div className="mt-0.5 text-slate">{description}</div>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="-mr-2 inline-flex size-10 shrink-0 items-center justify-center rounded-button text-night hover:bg-mist"
        >
          <X aria-hidden className="size-5" />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
      {footer && (
        <footer className="flex flex-wrap justify-end gap-2 border-t border-line bg-surface px-5 py-4">{footer}</footer>
      )}
    </dialog>
  );
}
