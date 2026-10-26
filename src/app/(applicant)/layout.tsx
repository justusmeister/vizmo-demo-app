import type { Viewport } from "next";
import { BrandLogo } from "@/components/shell/brand-logo";

export const viewport: Viewport = { themeColor: "white" };

// Applicant area (app.govizmo.de/u/…): a separate, mobile-first unit without the landlord shell.
export default function ApplicantLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-6">
          <BrandLogo tone="light" width={92} />
          <span className="text-small text-slate">Sichere Bewerbung</span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line bg-white">
        <div className="mx-auto max-w-5xl px-4 py-5 text-small text-slate md:px-6">
          vizmo organisiert Bewerbung und Besichtigung im Auftrag des Vermieters. Ihre Angaben gehen nur an diesen
          Vermieter und werden nach Abschluss der Vermietung gelöscht.
        </div>
      </footer>
    </div>
  );
}
