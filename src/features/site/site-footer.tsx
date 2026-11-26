import { Mail } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/shell/brand-logo";
import { ChevronGraphic } from "./chevron-graphic";
import { CookieSettingsLink } from "./cookie-consent";
import { company, footerNav } from "./site-nav";

// LinkedIn's "in" mark (lucide has no brand icons). Takes the text color like the other icons.
function LinkedInIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-night text-white">
      <ChevronGraphic className="absolute -right-24 -bottom-40 w-112 md:w-144" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 md:px-6 lg:grid-cols-[1.2fr_2fr]">
        <div className="flex flex-col gap-4">
          <BrandLogo tone="dark" width={132} />
          <p className="max-w-xs font-display text-h2 font-medium">{company.claim}</p>
          <a href={`mailto:${company.email}`} className="inline-flex items-center gap-2 self-start rounded-button text-lavender hover:text-white">
            <Mail aria-hidden className="size-4" />
            {company.email}
          </a>
          <a
            href={company.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-button text-lavender hover:text-white"
          >
            <LinkedInIcon />
            LinkedIn
            <span className="sr-only">(öffnet in neuem Tab)</span>
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
          <p>© 2026 {company.name}. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
