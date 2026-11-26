import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { BothSides, HowItWorks, howItWorksLead, Trust } from "@/features/site/home";
import { ProductShots } from "@/features/site/product-shots";
import { PageIntro, Section } from "@/features/site/section";

export const metadata: Metadata = {
  alternates: { canonical: "/so-funktioniert/" },
  title: "So funktioniert’s",
  description:
    "Vom Inserat bis zur Wohnungstür: Bewerbungen nach Ihren Kriterien, geprüfte Identitäten und Besichtigungen per Smartlock, ohne Termine selbst abzustimmen.",
};

// Same sections as on the homepage, gathered on one page the nav can link to.
export default function HowItWorksPage() {
  return (
    <>
      <PageIntro title="So funktioniert vizmo" lead={howItWorksLead} />
      <HowItWorks withHeading={false} />
      <ProductShots />
      <BothSides />
      <Trust />
      <Section tone="mist">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-section font-bold">Bereit, Besichtigungen abzugeben?</h2>
            <p className="mt-3 text-lead text-slate">Werden Sie Pilotvermieter oder schreiben Sie uns, wenn Sie Fragen haben.</p>
          </div>
          <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
            <ButtonLink href="/pilot" className="h-12 px-6">
              Für den Pilot vormerken
            </ButtonLink>
            <ButtonLink href="/kontakt" variant="secondary" className="h-12 px-6">
              Kontakt aufnehmen
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
