import type { ReactNode } from "react";
import { CookieConsent } from "./cookie-consent";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

// Frame of the public website: skip link, header, footer, cookie banner. Shared by the
// (site) layout and the global 404 page. Long German words wrap and hyphenate instead of
// widening the page; overflow-x-clip is the safety net (unlike hidden, it keeps sticky).
export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-white text-copy break-words">
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-button focus:bg-white focus:px-4 focus:py-2 focus:font-medium focus:text-night focus:shadow-overlay"
      >
        Zum Inhalt springen
      </a>
      <SiteHeader />
      <main id="inhalt" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <CookieConsent />
    </div>
  );
}
