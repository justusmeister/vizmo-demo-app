import type { ReactNode } from "react";
import { LogoToggle } from "./logo-toggle";
import { MobileNav } from "./mobile-nav";
import { SidebarNav } from "./nav-list";

// Design doc 5 and 6.8: Nachtblau sidebar (md and up) or top bar with drawer (mobile),
// content on the Fläche background. Identical on every screen.

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh md:flex">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-button focus:bg-white focus:px-4 focus:py-2 focus:font-medium focus:text-night focus:shadow-overlay"
      >
        Zum Inhalt springen
      </a>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-night px-4 md:hidden">
        <LogoToggle width={92} />
        <MobileNav />
      </header>

      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-8 bg-night px-3 py-5 md:flex">
        <div className="px-2">
          <LogoToggle width={112} />
        </div>
        <SidebarNav />
      </aside>

      <main id="main" className="min-w-0 flex-1">
        <div className="mx-auto max-w-content px-4 py-6 md:px-6 md:py-8">{children}</div>
      </main>
    </div>
  );
}
