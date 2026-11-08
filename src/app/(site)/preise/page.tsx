import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { ComparisonTable, PricingCard } from "@/features/site/pricing";
import { PageIntro, Section, SectionHeading } from "@/features/site/section";

export const metadata: Metadata = {
  alternates: { canonical: "/preise/" },
  title: "Preise",
  description:
    "39 € bei der Anmeldung, 45 % der ersten Kaltmiete nur bei erfolgreicher Vermietung. Smartlock, Identitätsprüfung und Besichtigungsslots inklusive.",
};

// Facts only from the pitch deck and the FAQ; nothing here may promise more than they do.
const included = [
  "Inserat anlegen und Bewerbungen nach Ihren Kriterien sortieren lassen",
  "Nuki Smart Lock und LTE-Stick per Post, Montage ohne Bohren",
  "Identitätsprüfung der Interessenten mit Ausweis und Selfie über Didit",
  "Kaution für jede Besichtigung, über Stripe vorgemerkt, und Fotoabgleich vorher und nachher",
  "Besichtigungsslots rund um die Uhr, ohne dass Sie Termine abstimmen",
];

const questions = [
  {
    q: "Was kostet vizmo?",
    a: "39 € Grundgebühr bei der Anmeldung. Kommt über vizmo ein Mietvertrag zustande, berechnen wir 45 % der ersten Kaltmiete.",
  },
  { q: "Was passiert, wenn die Wohnung nicht vermietet wird?", a: "Dann bleibt es bei den 39 €. Die Erfolgsgebühr fällt nur an, wenn ein Mietvertrag zustande kommt." },
  {
    q: "Zahlen Interessenten etwas?",
    a: "Nein. Für Interessenten ist vizmo kostenlos. Die Kaution für die Besichtigung wird nur vorgemerkt und danach wieder freigegeben.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageIntro
        title="Sie zahlen vor allem, wenn es klappt"
        lead="Eine kleine Grundgebühr zum Start, der Rest nur bei erfolgreicher Vermietung. Ohne Vermietung bleibt es bei der Grundgebühr."
      />

      <Section>
        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
          <PricingCard />
          <div>
            <h2 className="font-display text-h1 font-bold">Im Preis enthalten</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {included.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-deep-blue" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading title="Schneller als selbst, günstiger als ein Makler" lead="Ein Vergleich für eine typische Wohnung mit 865 € Kaltmiete." />
        <ComparisonTable />
      </Section>

      <Section>
        <SectionHeading title="Fragen zu den Preisen" />
        <dl className="mt-8 max-w-3xl divide-y divide-line border-y border-line">
          {questions.map((item) => (
            <div key={item.q} className="py-5">
              <dt className="text-h2 font-medium">{item.q}</dt>
              <dd className="mt-2 text-slate">{item.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6">
          Weitere Antworten finden Sie in den{" "}
          <Link href="/faq" className="rounded-button font-medium text-blue underline hover:text-deep-blue">
            häufigen Fragen
          </Link>
          .
        </p>
      </Section>

      <Section tone="mist">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-section font-bold">Werden Sie Pilotvermieter</h2>
            <p className="mt-3 text-lead text-slate">Tragen Sie sich ein oder schreiben Sie uns, wenn Sie Fragen zu den Preisen haben.</p>
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
