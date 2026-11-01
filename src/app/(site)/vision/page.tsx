import { Clock, Scale, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { PageIntro, Section, SectionHeading } from "@/features/site/section";

export const metadata: Metadata = {
  title: "Vision",
  description: "Warum wir vizmo bauen: Vermietung ohne Terminchaos, fair für Vermieter und Wohnungssuchende.",
};

const headlines = [
  "Mehr als 600 Mitbewerber auf eine Wohnung",
  "Wohnungssuche dauert bei jedem Zweiten länger als ein Jahr",
  "„Nicht mehr normal“: Interessenten stehen mehr als hundert Meter an",
];

const principles = [
  { title: "Zeit zurückgeben", text: "Vermieter sollen entscheiden, nicht koordinieren. Alles, was sich automatisieren lässt, übernimmt vizmo.", icon: Clock },
  { title: "Fair auswählen", text: "Kriterien sortieren, sie schließen niemanden aus. Was das Gleichbehandlungsgesetz schützt, fragen wir gar nicht erst ab.", icon: Scale },
  { title: "Vertrauen verdienen", text: "Wer seine Wohnung öffnet, braucht Sicherheit. Geprüfte Identitäten, Datensparsamkeit und Hosting in Deutschland sind für uns Grundlage.", icon: ShieldCheck },
];

const roadmap = [
  { phase: "Jetzt", title: "Pilot mit ersten Vermietern", text: "Die ersten Vermieter nutzen vizmo, wir lernen aus jeder Besichtigung." },
  { phase: "Als Nächstes", title: "Die sieben größten Städte", text: "Berlin, Hamburg, München, Köln, Frankfurt, Stuttgart und Düsseldorf, mit rund 2 Millionen Wohnungen privater Vermieter." },
  { phase: "Danach", title: "Ganz Deutschland", text: "14,6 Millionen Wohnungen gehören privaten Vermietern, das sind 63,5 % aller Mietwohnungen." },
  { phase: "Langfristig", title: "Europa", text: "Rund 33,6 Millionen Haushalte in Europa mieten bei privaten Vermietern." },
];

export default function VisionPage() {
  return (
    <>
      <PageIntro
        title="Vermieten ohne Terminchaos. Fair für beide Seiten."
        lead="Wir glauben, dass eine Wohnungsbesichtigung so einfach sein sollte wie eine Zugfahrt zu buchen: Termin wählen, hingehen, fertig. Für Vermieter, die ihre Zeit zurückwollen, und für Menschen, die eine Wohnung suchen."
      />

      <Section>
        <SectionHeading
          title="Warum es vizmo braucht"
          lead="Der Wohnungsmarkt ist angespannt wie nie. Auf der einen Seite stehen Menschen in langen Schlangen vor einer Besichtigung, auf der anderen Vermieter, die nach jeder Anzeige im Postfach versinken."
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {headlines.map((line) => (
            <li key={line} className="rounded-card border border-line bg-surface p-6 font-display text-h2 font-bold">
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-body text-slate">Schlagzeilen aus der Presse, u. a. t-online (2023)</p>
      </Section>

      <Section tone="surface">
        <SectionHeading
          title="In den USA etabliert. In Deutschland fehlt es. Bis jetzt."
          lead="Besichtigungen ohne Vermieter vor Ort sind in den USA seit Jahren erprobt, mit Smartlocks und Online-Buchung. Wir bauen das für private Vermieter in Deutschland: den ganzen Weg von der Anfrage bis zur Tür in einem Produkt, passend zu deutschem Datenschutz und Gleichbehandlungsrecht."
        />
      </Section>

      <Section>
        <SectionHeading title="Woran wir uns halten" />
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {principles.map(({ title, text, icon: Icon }) => (
            <li key={title} className="flex flex-col gap-3">
              <span className="flex size-12 items-center justify-center rounded-card bg-mist text-deep-blue">
                <Icon aria-hidden className="size-6" />
              </span>
              <h3 className="text-h2">{title}</h3>
              <p className="text-slate">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="night">
        <SectionHeading dark title="Wohin wir wollen" lead="Wir starten dort, wo der Druck am größten ist, und wachsen Schritt für Schritt." />
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {roadmap.map((item, index) => (
            <li key={item.title} className="flex flex-col gap-3 border-t-2 border-white/15 pt-5">
              <span className="text-body font-medium text-lavender">
                {index + 1}. {item.phase}
              </span>
              <h3 className="text-h2">{item.title}</h3>
              <p className="text-lavender">{item.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-body text-lavender">Quellen: Zensus 2022, IW Köln 2025, Hochrechnung auf Basis Eurostat 2024</p>
      </Section>

      <Section tone="mist">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <SectionHeading title="Bauen Sie mit uns" lead="Wir suchen Vermieter für unseren Pilot und Partner, die den Wohnungsmarkt fairer machen wollen." />
          <ButtonLink href="/kontakt" className="h-12 px-6">
            Kontakt aufnehmen
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
