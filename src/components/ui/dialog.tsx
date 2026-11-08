"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";

// Modal built on the native <dialog>: focus trap, Escape and inert background for free.
// The close button never shows the blue focus ring; keyboard focus tints it like hover.
// "center" for confirmations, "side" for a detail panel (full screen on mobile).
// size "lg" (center only) is for reading-heavy dialogs on the marketing site, sized to its
// 16 px copy: wider, roomier, larger title, full screen on phones. The whole dialog scrolls
// (not a small inner area) and the footer stays pinned at the bottom.

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
    if (open && !dialog.open) {
      dialog.showModal();
      // Focus the dialog itself, not the close button, so nothing is highlighted on open.
      dialog.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      tabIndex={-1}
      onClose={onClose}
      onClick={(event) => event.target === ref.current && onClose()}
      className={cx(
        "flex-col bg-white text-night outline-hidden backdrop:bg-night/60 not-open:hidden open:flex",
        variant === "center" &&
          size === "md" &&
          "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg rounded-modal shadow-overlay",
        variant === "center" &&
          size === "lg" &&
          "m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain sm:m-auto sm:h-fit sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100%-2rem)] sm:max-w-2xl sm:rounded-modal sm:shadow-overlay",
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
          className="-mr-2 inline-flex size-10 shrink-0 items-center justify-center rounded-button text-night outline-hidden hover:bg-mist focus-visible:bg-mist"
        >
          <X aria-hidden className="size-5" />
        </button>
      </header>
      <div className={cx(size === "lg" ? "flex-1 px-5 py-6 md:px-8" : "min-h-0 flex-1 overflow-y-auto px-5 py-5")}>{children}</div>
      {footer && (
        <footer
          className={cx(
            "flex flex-wrap justify-end gap-2 border-t border-line bg-surface",
            size === "lg" ? "sticky bottom-0 flex-col-reverse px-5 py-5 sm:flex-row md:px-8 [&>*]:h-12 [&>*]:px-6" : "px-5 py-4",
          )}
        >
          {footer}
        </footer>
      )}
    </dialog>
  );
}
