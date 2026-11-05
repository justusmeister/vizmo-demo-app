"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";

// Modal built on the native <dialog>: focus trap, Escape and inert background for free.
// "center" for confirmations, "side" for a detail panel (full screen on mobile).
// size "lg" (center only) is for reading-heavy dialogs on the marketing site, sized to its
// 16 px copy: wider, roomier, larger title, footer buttons full width on phones.

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  variant?: "center" | "side";
  size?: "md" | "lg";
  footer?: ReactNode;
  children: ReactNode;
};

export function Dialog({ open, onClose, title, description, variant = "center", size = "md", footer, children }: DialogProps) {
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
          "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] rounded-modal shadow-overlay",
        variant === "center" && (size === "lg" ? "max-w-2xl" : "max-w-lg"),
        variant === "side" && "m-0 ml-auto h-dvh max-h-none w-full max-w-none sm:max-w-xl",
      )}
    >
      <header className={cx("flex items-start justify-between gap-4 border-b border-line", size === "lg" ? "px-5 py-5 md:px-8 md:py-6" : "px-5 py-4")}>
        <div className="min-w-0">
          <h2 id={titleId} className={size === "lg" ? "text-h1" : "text-h2"}>
            {title}
          </h2>
          {description && <div className={cx("text-slate", size === "lg" ? "mt-1" : "mt-0.5")}>{description}</div>}
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
      <div className={cx("min-h-0 flex-1 overflow-y-auto", size === "lg" ? "px-5 py-6 md:px-8" : "px-5 py-5")}>{children}</div>
      {footer && (
        <footer
          className={cx(
            "flex flex-wrap justify-end gap-2 border-t border-line bg-surface",
            size === "lg" ? "flex-col-reverse px-5 py-5 sm:flex-row md:px-8 [&>*]:h-12 [&>*]:px-6" : "px-5 py-4",
          )}
        >
          {footer}
        </footer>
      )}
    </dialog>
  );
}
