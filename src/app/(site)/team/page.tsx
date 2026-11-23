import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { PageIntro, Section, SectionHeading } from "@/features/site/section";

export const metadata: Metadata = {
  alternates: { canonical: "/team/" },
  title: "Team",
  description: "Drei Gründerinnen und Gründer aus Osnabrück und ein Ziel: Vermietung ohne Terminchaos. Das Team hinter vizmo.",
};

// Portraits from the pitch deck; Justus' photo is a square crop with the head centered.
const team = [
  {
    name: "Justus Meister",
    role: "IT und Operations",
    photo: "/team/justus-meister.jpg",
    focus: "Entwickelt die Plattform und sorgt dafür, dass jede Besichtigung reibungslos läuft.",
  },
  {
    name: "Jan Witte",
    role: "Finanzen und Infrastruktur",
    photo: "/team/jan-witte.jpg",
    focus: "Kümmert sich um Finanzplanung, Hardware und die Logistik hinter jedem Smartlock.",
  },
  {
    name: "Johanna Spratte",
    role: "Marktverständnis",
    photo: "/team/johanna-spratte.jpg",
    focus: "Spricht mit Vermietern und Interessenten und übersetzt ihre Erfahrungen ins Produkt.",
  },
];

export default function TeamPage() {
  return (
    <>
      <PageIntro
        title="Das Team hinter vizmo"
        lead="Wir sind drei Gründerinnen und Gründer mit einem gemeinsamen Ziel: Eine Wohnung zu vermieten soll sich nicht mehr wie ein zweiter Job anfühlen."
      />
      <Section>
        <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-3">
          {team.map((person) => (
            <li key={person.name} className="flex flex-col items-center gap-5 text-center">
              <div className="size-40 shrink-0 overflow-hidden rounded-full bg-surface ring-1 ring-line md:size-48">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export without image optimization */}
                <img src={person.photo} alt={`Porträt von ${person.name}`} width={192} height={192} className="size-full object-cover" />
              </div>
              <div className="flex flex-col items-center">
                <h2 className="text-h2 font-medium">{person.name}</h2>
                <p className="mt-1 text-slate">{person.role}</p>
                <p className="mt-3 max-w-72">{person.focus}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="surface">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <SectionHeading
            title="Sprechen Sie mit uns"
            lead="Ob Vermieterin, Investor oder Pilotpartner: Wir freuen uns über jedes Gespräch."
          />
          <ButtonLink href="/kontakt" className="h-12 px-6">
            Kontakt aufnehmen
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
