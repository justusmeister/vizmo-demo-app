import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "./section";
import { siteNav } from "./site-nav";

// 404 for every unknown URL. Calm, names the next step, offers the main entry points.
export function NotFoundPage() {
  const links = [...siteNav, { href: "/kontakt", label: "Kontakt" }];
  return (
    <Container className="py-20 md:py-28">
      <div className="mx-auto flex max-w-2xl flex-col items-start gap-6">
        <p className="rounded-full bg-mist px-3 py-1 text-body font-medium text-night">Fehler 404</p>
        <h1 className="font-display text-hero font-bold text-balance">Diese Seite gibt es nicht.</h1>
        <p className="text-lead text-slate">
          Vielleicht hat sich die Adresse geändert oder es steckt ein Tippfehler im Link. Von der Startseite aus finden Sie
          alles Wichtige.
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href="/" icon={<ArrowLeft aria-hidden className="size-4" />} className="h-12 px-6">
            Zur Startseite
          </ButtonLink>
          <ButtonLink href="/kontakt" variant="secondary" icon={<Mail aria-hidden className="size-4" />} className="h-12 px-6">
            Kontakt aufnehmen
          </ButtonLink>
        </div>
        <nav aria-label="Beliebte Seiten" className="mt-6 w-full border-t border-line pt-6">
          <p className="text-body text-slate">Oder direkt zu:</p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="rounded-button font-medium text-blue underline-offset-4 hover:text-deep-blue hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Container>
  );
}
