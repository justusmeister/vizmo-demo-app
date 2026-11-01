import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { PageIntro, Section, SectionHeading } from "@/features/site/section";

export const metadata: Metadata = {
  title: "Team",
  description: "Vier Gründerinnen und Gründer, ein Ziel: Vermietung ohne Terminchaos. Das Team hinter vizmo.",
};

const team = [
  { name: "Jan Witte", role: "Finanzen und Infrastruktur", photo: "/team/jan-witte.jpg", focus: "Kümmert sich um Finanzplanung, Hardware und die Logistik hinter jedem Smartlock." },
  { name: "Johanna Spratte", role: "Marktverständnis", photo: "/team/johanna-spratte.jpg", focus: "Spricht mit Vermietern und Interessenten und übersetzt ihre Erfahrungen ins Produkt." },
  { name: "Justus Meister", role: "IT und Operations", photo: "/team/justus-meister.jpg", focus: "Entwickelt die Plattform und sorgt dafür, dass jede Besichtigung reibungslos läuft." },
  { name: "Theo Gutendorf", role: "Marketing und Vertrieb", photo: "/team/theo-gutendorf.jpg", focus: "Bringt vizmo zu privaten Vermietern, über Messen, Fachmedien und LinkedIn." },
];

export default function TeamPage() {
  return (
    <>
      <PageIntro
        title="Das Team hinter vizmo"
        lead="Wir sind vier Gründerinnen und Gründer mit einem gemeinsamen Ziel: Wohnungen zu vermieten soll sich nicht mehr wie ein zweiter Job anfühlen."
      />
      <Section>
        {/* Round portraits of identical size, as in the pitch deck. */}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 lg:grid-cols-4">
          {team.map((person) => (
            <li key={person.name} className="flex flex-col items-center gap-4 text-center">
              <div className="size-32 shrink-0 overflow-hidden rounded-full bg-surface ring-1 ring-line sm:size-40 md:size-44">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export without image optimization */}
                <img
                  src={person.photo}
                  alt={`Porträt von ${person.name}`}
                  width={176}
                  height={176}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center">
                <h2 className="text-h3 md:text-h2">{person.name}</h2>
                <p className="font-medium text-deep-blue">{person.role}</p>
                <p className="mt-2 max-w-64 text-body text-slate sm:text-copy">{person.focus}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="surface">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <SectionHeading title="Lust, mitzumachen?" lead="Ob Vermieterin, Investor oder Pilotpartner: Wir freuen uns über jedes Gespräch." />
          <ButtonLink href="/kontakt" className="h-12 px-6">
            Kontakt aufnehmen
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
