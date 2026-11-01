"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/shell/brand-logo";
import { ButtonLink } from "@/components/ui/button";
import { cx } from "@/lib/cx";
import { siteNav } from "./site-nav";

const mobileNav = [...siteNav, { href: "/kontakt", label: "Kontakt" }];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);

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
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 md:px-6">
          <Link href="/" aria-label="vizmo Startseite" className="rounded-button" onClick={() => setOpen(false)}>
            <BrandLogo tone="light" width={104} />
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {siteNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="rounded-button px-3 py-2 font-medium text-night hover:bg-mist">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <ButtonLink href="/kontakt" variant="tertiary">
              Kontakt
            </ButtonLink>
            <ButtonLink href="/#pilot">Pilot vormerken</ButtonLink>
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
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-4 font-display text-h2 font-bold text-night"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href="/#pilot" onClick={() => setOpen(false)} className="h-12 w-full">
            Für den Pilot vormerken
          </ButtonLink>
        </nav>
      </div>
    </>
  );
}

// Three lines that turn into a cross. Pressing only greys the lines: no background flash,
// no tap highlight. The middle line fades, the outer two rotate.
function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const line = "absolute left-0 h-0.5 w-6 rounded-full bg-current transition-[transform,opacity] duration-200 ease-out";
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
        <span className={cx(line, "top-0", open && "translate-y-1.75 rotate-45")} />
        <span className={cx(line, "top-1.75", open && "opacity-0")} />
        <span className={cx(line, "top-3.5", open && "-translate-y-1.75 -rotate-45")} />
      </span>
    </button>
  );
}
