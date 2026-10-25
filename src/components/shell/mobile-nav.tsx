"use client";

import { Menu, X } from "lucide-react";
import { useRef } from "react";
import { SidebarNav } from "./nav-list";

// Below md the sidebar becomes a modal drawer. The native <dialog> provides the focus
// trap, Escape to close and inert background.

export function MobileNav() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label="Navigation öffnen"
        className="inline-flex size-10 items-center justify-center rounded-button text-white hover:bg-white/10 focus-visible:outline-white"
      >
        <Menu aria-hidden className="size-5" />
      </button>
      <dialog
        ref={dialogRef}
        aria-label="Navigation"
        onClick={(event) => event.target === dialogRef.current && close()}
        className="m-0 flex h-dvh max-h-none w-72 max-w-[85vw] flex-col bg-night p-4 backdrop:bg-night/60 not-open:hidden"
      >
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={close}
            aria-label="Navigation schließen"
            className="inline-flex size-10 items-center justify-center rounded-button text-white hover:bg-white/10 focus-visible:outline-white"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <SidebarNav onNavigate={close} />
      </dialog>
    </>
  );
}
