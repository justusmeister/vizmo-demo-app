"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/shell/brand-logo";
import { ButtonLink } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { siteNav } from "./site-nav";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 md:px-6">
        <Link href="/" aria-label="vizmo Startseite" className="rounded-button">
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
          <ButtonLink href="/p/inserate">Demo ansehen</ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Menü öffnen"
          className="inline-flex size-11 items-center justify-center rounded-button text-night hover:bg-mist lg:hidden"
        >
          <Menu aria-hidden className="size-6" />
        </button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} variant="side" title="Menü">
        <nav aria-label="Hauptnavigation mobil" className="flex flex-col gap-6">
          <ul className="flex flex-col">
            {[...siteNav, { href: "/kontakt", label: "Kontakt" }].map((item) => (
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
          <ButtonLink href="/p/inserate" onClick={() => setOpen(false)} className="h-12 w-full">
            Demo ansehen
          </ButtonLink>
        </nav>
      </Dialog>
    </header>
  );
}
