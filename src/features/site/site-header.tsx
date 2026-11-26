"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { BrandLogo } from "@/components/shell/brand-logo";
import { ButtonLink } from "@/components/ui/button";
import { cx } from "@/lib/cx";
import { siteNav } from "./site-nav";

const mobileNav = [...siteNav, { href: "/kontakt", label: "Kontakt" }];

const trimSlash = (path: string) => path.replace(/(.)\/$/, "$1");

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  // Transparent at the very top, so the hero's tint runs up behind the header without an
  // edge; frosted white once the page scrolls.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Every nav entry has its own page. Clicking the entry of the page you're on reloads it
  // (client navigation to the same URL would do nothing). Links to another page keep the
  // mobile menu open until that page has rendered, then the check below closes it; closing
  // on click would flash the old page while the next one loads.
  const isCurrent = (href: string) => trimSlash(href) === trimSlash(pathname);
  function reloadIfCurrent(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (!isCurrent(href)) return;
    event.preventDefault();
    window.location.reload();
  }

  // Close the menu after navigating (adjusting state during render, not in an effect).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // While open: Escape closes, the page behind neither scrolls nor takes focus.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const behind = [document.getElementById("inhalt"), document.querySelector("footer")].filter((el) => el !== null);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    behind.forEach((el) => (el.inert = true));
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      behind.forEach((el) => (el.inert = false));
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className={cx("sticky top-0 z-40 transition-colors duration-200 motion-reduce:transition-none", scrolled || open ? "bg-white/85 backdrop-blur" : "bg-transparent")}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 md:px-6">
          {/* Plain link on purpose: clicking the logo reloads the start page, as visitors expect. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- deliberate full reload */}
          <a href="/" aria-label="vizmo Startseite" className="rounded-button">
            <BrandLogo tone="ink" width={108} />
          </a>

          <nav aria-label="Hauptnavigation" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {siteNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(event) => reloadIfCurrent(event, item.href)}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className="rounded-button px-3 py-2 font-medium text-night hover:bg-mist"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <ButtonLink href="/kontakt" variant="tertiary" onClick={(event) => reloadIfCurrent(event, "/kontakt")}>
              Kontakt
            </ButtonLink>
            <ButtonLink href="/pilot" onClick={(event) => reloadIfCurrent(event, "/pilot")}>
              Pilot vormerken
            </ButtonLink>
          </div>

          <MenuToggle open={open} onToggle={() => setOpen((value) => !value)} />
        </div>
      </header>

      {/* Outside the header: its backdrop-blur would become the containing block of a fixed child. */}
      <div id="mobile-menu" hidden={!open} className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-white lg:hidden">
        <nav aria-label="Hauptnavigation mobil" className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-2 pb-8 md:px-6">
          <ul className="flex flex-col">
            {mobileNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={(event) => reloadIfCurrent(event, item.href)}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="block border-b border-line py-4 font-display text-h2 font-bold text-night"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href="/pilot" onClick={(event) => reloadIfCurrent(event, "/pilot")} className="h-12 w-full">
            Für den Pilot vormerken
          </ButtonLink>
        </nav>
      </div>
    </>
  );
}

// Three lines that turn into a cross. The outer lines move to the middle and rotate in one
// motion; the middle line simply fades out. Pressing only greys the lines: no background
// flash, no tap highlight.
function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const line = "absolute left-0 h-0.5 w-6 rounded-full bg-current motion-reduce:transition-none";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? "Menü schließen" : "Menü öffnen"}
      className="-mr-2.5 inline-flex size-11 items-center justify-center rounded-button text-night transition-colors active:text-gray lg:hidden"
    >
      <span aria-hidden className="relative block h-4 w-6">
        <span className={cx(line, "top-0 transition-transform duration-300 ease-in-out", open && "translate-y-1.75 rotate-45")} />
        <span className={cx(line, "top-1.75 transition-opacity duration-150 ease-out", open && "opacity-0")} />
        <span className={cx(line, "top-3.5 transition-transform duration-300 ease-in-out", open && "-translate-y-1.75 -rotate-45")} />
      </span>
    </button>
  );
}
