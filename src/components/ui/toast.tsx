"use client";

import { CircleCheck } from "lucide-react";
import { useEffect } from "react";

// Transient confirmation after an action. Nachtblau surface, announced politely.

export function Toast({ message, onDone, duration = 4000 }: { message: string | null; onDone: () => void; duration?: number }) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDone, duration);
    return () => window.clearTimeout(timer);
  }, [message, onDone, duration]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center md:left-60">
      {message && (
        <p className="pointer-events-auto flex items-center gap-2 rounded-button bg-night px-4 py-3 font-medium text-white shadow-overlay">
          <CircleCheck aria-hidden className="size-5 shrink-0 text-lavender" />
          {message}
        </p>
      )}
    </div>
  );
}
