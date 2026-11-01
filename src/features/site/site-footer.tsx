import { Mail } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/shell/brand-logo";
import { ChevronGraphic } from "./chevron-graphic";
import { CookieSettingsLink } from "./cookie-consent";
import { company, footerNav } from "./site-nav";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-night text-white">
      <ChevronGraphic className="absolute -right-24 -bottom-40 w-112 md:w-144" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 md:px-6 lg:grid-cols-[1.2fr_2fr]">
        <div className="flex flex-col gap-4">
          <BrandLogo tone="dark" width={132} />
          <p className="max-w-xs font-display text-h2 font-bold">{company.claim}</p>
          <a href={`mailto:${company.email}`} className="inline-flex items-center gap-2 self-start rounded-button text-lavender hover:text-white">
            <Mail aria-hidden className="size-4" />
            {company.email}
          </a>
        </div>
        <nav aria-label="Fußzeile" className="grid gap-8 sm:grid-cols-3">
          {footerNav.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-body font-medium text-lavender">{group.title}</p>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="rounded-button text-white/90 hover:text-white hover:underline focus-visible:outline-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
                {group.title === "Rechtliches" && (
                  <li>
                    <CookieSettingsLink className="rounded-button text-left text-white/90 hover:text-white hover:underline focus-visible:outline-white" />
                  </li>
                )}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-5 text-body text-lavender md:px-6">
          <p>© 2026 {company.name}</p>
          <p>Entwickelt und gehostet in Deutschland</p>
        </div>
      </div>
    </footer>
  );
}
