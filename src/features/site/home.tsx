import {
  BadgeEuro,
  Camera,
  Check,
  Clock,
  KeyRound,
  LockKeyhole,
  MailOpen,
  MessagesSquare,
  Scale,
  ScanFace,
  Server,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { ChevronGraphic } from "./chevron-graphic";
import { HeroVisual } from "./hero-visual";
import { PilotSignup } from "./pilot-signup";
import { ProductShots } from "./product-shots";
import { Container, Section, SectionHeading } from "./section";
import { company } from "./site-nav";

// Homepage of govizmo.de. Figures come from the pitch deck (Finale V2, Oktober 2026).

function Hero() {
  return (
    <section className="relative overflow-hidden bg-night text-white [&_a:focus-visible]:outline-white">
      <ChevronGraphic className="absolute -top-24 -right-40 w-184 md:-right-24 lg:w-224" />
      <Container className="relative grid grid-cols-1 items-center gap-16 py-16 md:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-28">
        <div className="flex min-w-0 flex-col items-start gap-6">
          <p className="rounded-full bg-white/10 px-3 py-1 text-body font-medium text-lavender">Für private Vermieter</p>
          <h1 className="font-display text-hero font-bold text-balance hyphens-auto">{company.claim}</h1>
          <p className="max-w-xl text-lead text-lavender">
            vizmo übernimmt alles zwischen Inserat und Wohnungstür: Bewerbungen sortiert nach Ihren Kriterien, geprüfte
            Identitäten und Besichtigungen per Smartlock. Ohne dass Sie einen einzigen Termin selbst abstimmen.
          </p>
          <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
            <ButtonLink href="#pilot" className="h-12 px-6">
              Für den Pilot vormerken
            </ButtonLink>
            <ButtonLink href="#ablauf" variant="secondary" className="h-12 px-6">
              So funktioniert&apos;s
            </ButtonLink>
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-body text-lavender">
            {["DSGVO-konform", "Entwickelt und gehostet in Deutschland", "AGG-konforme Auswahl"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check aria-hidden className="size-4 text-white" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="pb-10 lg:pb-0">
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}

function Pilot() {
  return (
    <Section id="pilot" tone="mist">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-5">
          <p className="w-fit rounded-full bg-white px-3 py-1 text-body font-medium text-night">Pilotprojekt</p>
          <h2 id="pilot-title" className="font-display text-section font-bold text-balance">
            Vermieten Sie bald neu? Werden Sie Pilotvermieter.
          </h2>
          <p className="text-lead text-slate">
            Wir starten vizmo mit einer kleinen Gruppe privater Vermieter. Tragen Sie sich ein, dann melden wir uns persönlich,
            sobald es losgeht.
          </p>
          <p className="flex items-center gap-2 text-body text-slate">
            <MessagesSquare aria-hidden className="size-4 shrink-0 text-deep-blue" />
            Sie sprechen direkt mit uns, dem Gründerteam.
          </p>
        </div>
        <div className="rounded-modal border border-line bg-white p-5 md:p-8">
          <PilotSignup />
        </div>
      </div>
    </Section>
  );
}

const stats = [
  { value: ">75", label: "Kontaktanfragen pro Inserat", note: "schon in Mittelstädten wie Osnabrück" },
  { value: "15–30", label: "Stunden Handarbeit", note: "pro Vermietung, vor allem Vorauswahl und Besichtigungen" },
  { value: "100–200", label: "Nachrichten", note: "Rückfragen, Terminabsprachen und Absagen pro Vermietung" },
];

function Problem() {
  return (
    <Section tone="surface">
      <SectionHeading
        title="Eine Wohnung neu zu vermieten ist bis heute Handarbeit."
        lead="Auf eine Wohnung kommen dutzende, in Großstädten hunderte Anfragen. Wer privat vermietet, sortiert Postfächer, stimmt Termine ab und steht am Wochenende in der leeren Wohnung."
      />
      <dl className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 bg-white p-6 md:p-8">
            <dt className="order-2 font-medium">{stat.label}</dt>
            <dd className="order-1 font-display text-hero font-bold tabular-nums text-blue">{stat.value}</dd>
            <dd className="order-3 text-slate">{stat.note}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-body text-slate">Quellen: IW Köln Vermieterreport (2026), ImmoScout24 WohnBarometer (Q2/2026)</p>
    </Section>
  );
}

const steps: { title: string; text: string; icon: ReactNode; detail: string }[] = [
  {
    title: "Inserat anlegen",
    text: "In wenigen Minuten, auf Wunsch direkt aus Ihrem bestehenden Anzeigentext. Sie bekommen einen Bewerbungslink für ImmoScout24, Kleinanzeigen und Co.",
    icon: <MailOpen aria-hidden className="size-5" />,
    detail: "Link im Inserat",
  },
  {
    title: "Smartlock kommt per Post",
    text: "Nuki Smart Lock und LTE-Stick, montiert in etwa zehn Minuten, ohne Bohren. Ein WLAN in der Wohnung brauchen Sie nicht.",
    icon: <LockKeyhole aria-hidden className="size-5" />,
    detail: "Montage ohne Bohren",
  },
  {
    title: "Bewerbungen kommen sortiert an",
    text: "Interessenten bewerben sich über Ihren Link. vizmo sortiert nach Ihren Kriterien, niemand wird automatisch aussortiert. Sie laden mit einem Klick ein.",
    icon: <Users aria-hidden className="size-5" />,
    detail: "Sortiert, nicht aussortiert",
  },
  {
    title: "Termin und Identität",
    text: "Eingeladene buchen selbst einen freien Slot, bestätigen ihre Identität mit Didit und hinterlegen eine kleine Kaution, die nur vorgemerkt wird.",
    icon: <ScanFace aria-hidden className="size-5" />,
    detail: "Slots rund um die Uhr buchbar",
  },
  {
    title: "Besichtigung ohne Sie",
    text: "Die Tür öffnet sich nur im gebuchten Zeitfenster. Am Ende fotografieren Interessenten die Räume, vizmo gleicht mit dem Zustand vorher ab.",
    icon: <Camera aria-hidden className="size-5" />,
    detail: "Fotoabgleich nach jeder Besichtigung",
  },
];

function HowItWorks() {
  return (
    <Section id="ablauf" tone="surface">
      <SectionHeading
        title="So funktioniert vizmo"
        lead="Fünf Schritte von der Anzeige bis zur Wohnungstür. Sie entscheiden, wer besichtigen darf, den Rest erledigt vizmo."
      />
      <ol className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {steps.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-4 rounded-card border border-line bg-white p-5">
            <span className="flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-full bg-night font-display font-bold text-white">{index + 1}</span>
              <span className="text-deep-blue">{step.icon}</span>
            </span>
            <div>
              <h3 className="text-h2">{step.title}</h3>
              <p className="mt-2 text-slate">{step.text}</p>
            </div>
            <p className="mt-auto border-t border-line pt-3 text-body font-medium">{step.detail}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function BothSides() {
  const sides = [
    {
      title: "Für Vermieter",
      lead: "63,5 % aller Mietwohnungen in Deutschland gehören privaten Vermietern. Für genau sie bauen wir vizmo.",
      points: [
        "Kein Terminchaos: Interessenten buchen selbst",
        "Bewerbungen sortiert nach Ihren Kriterien",
        "Geprüfte Identität vor jeder Besichtigung",
        "Kaution und Fotoabgleich sichern Sie ab",
        "Bezahlt wird vor allem bei Erfolg",
      ],
    },
    {
      title: "Für Interessenten",
      lead: "Keine Schlangen im Treppenhaus und keine Massenbesichtigung, sondern ein eigener Termin.",
      points: [
        "Bewerbung in drei Minuten, auch am Handy",
        "Eigener Termin statt Massenbesichtigung",
        "Wohnung in Ruhe allein ansehen",
        "Faire Auswahl ohne Angaben zu Herkunft, Alter oder Religion",
        "Für Interessenten kostenlos",
      ],
    },
  ];
  return (
    <Section>
      <SectionHeading title="Gut für beide Seiten" lead="Vermieter sparen Zeit, Interessenten bekommen einen fairen, planbaren Ablauf." />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {sides.map((side) => (
          <div key={side.title} className="rounded-card border border-line p-6 md:p-8">
            <h3 className="font-display text-h1 font-bold">{side.title}</h3>
            <p className="mt-2 text-slate">{side.lead}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {side.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-mist text-deep-blue">
                    <Check aria-hidden className="size-3.5" strokeWidth={3} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

const comparison = [
  { label: "Direkte Kosten", makler: "2 Kaltmieten zzgl. MwSt.", selbst: "50–150 €", vizmo: "39 € + 45 % der ersten Kaltmiete" },
  { label: "Leerstand", makler: "1–2 Kaltmieten", selbst: "1–2 Kaltmieten", vizmo: "ca. 1 Kaltmiete" },
  { label: "Ihr Zeitaufwand", makler: "1–2 Stunden", selbst: "15–30 Stunden", vizmo: "Minimal, läuft automatisch" },
  { label: "Tempo", makler: "Langsam bis mittel", selbst: "Langsam", vizmo: "Schnell, Slots rund um die Uhr" },
];

function Comparison() {
  return (
    <Section tone="surface">
      <SectionHeading title="Schneller als selbst, günstiger als ein Makler" lead="Ein Vergleich für eine typische Wohnung mit 865 € Kaltmiete." />
      {/* Phones: one card per criterion, so nothing scrolls sideways. */}
      <ul className="mt-10 flex flex-col gap-3 md:hidden">
        {comparison.map((row) => (
          <li key={row.label} className="rounded-card border border-line bg-white">
            <p className="px-4 pt-4 pb-2 font-medium text-slate">{row.label}</p>
            <dl className="divide-y divide-line">
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-slate">Makler</dt>
                <dd className="text-right">{row.makler}</dd>
              </div>
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-slate">Selbst vermieten</dt>
                <dd className="text-right">{row.selbst}</dd>
              </div>
              <div className="flex justify-between gap-4 rounded-b-card bg-mist px-4 py-3">
                <dt className="font-display font-bold">vizmo</dt>
                <dd className="text-right font-medium">{row.vizmo}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <div className="mt-10 hidden overflow-hidden rounded-card border border-line bg-white md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="p-4 text-body font-medium text-slate">
                <span className="sr-only">Merkmal</span>
              </th>
              <th scope="col" className="p-4 font-medium">Makler</th>
              <th scope="col" className="p-4 font-medium">Selbst vermieten</th>
              <th scope="col" className="bg-mist p-4 font-display font-bold">vizmo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {comparison.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="p-4 font-medium text-slate">{row.label}</th>
                <td className="p-4">{row.makler}</td>
                <td className="p-4">{row.selbst}</td>
                <td className="bg-mist p-4 font-medium">{row.vizmo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-body text-slate">Quellen: eigene Darstellung; ImmoScout24 WohnBarometer 2026, IW Köln Vermieterreport 2026, § 3 WoVermittG</p>
    </Section>
  );
}

const trust: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: "DSGVO-konform",
    text: "Wir erheben nur, was für die Vermietung nötig ist, und löschen Daten, sobald sie nicht mehr gebraucht werden. Ausweisdaten bleiben beim Prüfdienst.",
    icon: <ShieldCheck aria-hidden className="size-6" />,
  },
  {
    title: "Entwickelt und gehostet in Deutschland",
    text: "Unser Team entwickelt vizmo selbst. Die Plattform läuft auf Servern in deutschen Rechenzentren.",
    icon: <Server aria-hidden className="size-6" />,
  },
  {
    title: "AGG-konforme Auswahl",
    text: "Kriterien sortieren, sie schließen niemanden aus. Herkunft, Religion, Geschlecht, Alter oder Behinderung werden weder abgefragt noch bewertet.",
    icon: <Scale aria-hidden className="size-6" />,
  },
  {
    title: "Geprüfte Identität",
    text: "Vor jeder Besichtigung bestätigen Interessenten ihre Identität mit Ausweis und Selfie über unseren Partner Didit.",
    icon: <ScanFace aria-hidden className="size-6" />,
  },
  {
    title: "Kaution und Fotoabgleich",
    text: "Eine kleine Kaution wird über Stripe vorgemerkt, nicht abgebucht. Fotos vor und nach der Besichtigung machen Schäden nachvollziehbar.",
    icon: <BadgeEuro aria-hidden className="size-6" />,
  },
  {
    title: "Zugang nur im Zeitfenster",
    text: "Das Smartlock öffnet ausschließlich während des gebuchten Slots. Jede Öffnung wird protokolliert.",
    icon: <KeyRound aria-hidden className="size-6" />,
  },
];

function Trust() {
  return (
    <Section id="sicherheit" tone="night" className="relative overflow-hidden">
      <SectionHeading
        dark
        title="Was uns ausmacht"
        lead="Fremde Menschen in die eigene Wohnung zu lassen, braucht Vertrauen. Deshalb sind Datenschutz, Fairness und Sicherheit bei vizmo eingebaut, nicht nachgerüstet."
      />
      <ul className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {trust.map((item) => (
          <li key={item.title} className="flex flex-col gap-3">
            <span className="flex size-12 items-center justify-center rounded-card bg-white/10 text-lavender">{item.icon}</span>
            <h3 className="text-h2">{item.title}</h3>
            <p className="text-lavender">{item.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Pricing() {
  return (
    <Section id="preise">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
        <SectionHeading
          title="Sie zahlen vor allem, wenn es klappt"
          lead="Eine kleine Grundgebühr zum Start, der Rest nur bei erfolgreicher Vermietung. Ohne Vermietung bleibt es bei der Grundgebühr."
        />
        <div className="overflow-hidden rounded-modal border border-line">
          <div className="grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="flex flex-col gap-2 p-6">
              <p className="text-body font-medium text-slate">Bei der Anmeldung</p>
              <p className="font-display text-hero font-bold tabular-nums">39 €</p>
              <p className="text-slate">Software freischalten, Smartlock und Zubehör werden geliefert.</p>
            </div>
            <div className="flex flex-col gap-2 bg-mist p-6">
              <p className="text-body font-medium text-slate">Nur wenn vermietet wird</p>
              <p className="font-display text-hero font-bold tabular-nums">45 %</p>
              <p className="text-slate">der ersten Kaltmiete als Erfolgsgebühr.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-line bg-surface p-6">
            <p className="flex items-center gap-2 font-medium">
              <Clock aria-hidden className="size-4 text-deep-blue" />
              Beispiel bei 865 € Kaltmiete
            </p>
            <p className="text-slate tabular-nums">
              39 € + 389 € = <span className="font-medium text-night">428 €</span>. Ein Makler kostet bis zu zwei Kaltmieten, also bis zu
              1.730 € zzgl. MwSt.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function FinalCta() {
  return (
    <Section tone="mist">
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-section font-bold">{company.claim}</h2>
          <p className="mt-3 text-lead text-slate">Werden Sie Pilotvermieter oder schreiben Sie uns, wenn Sie Fragen haben.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#pilot" className="h-12 px-6">
            Für den Pilot vormerken
          </ButtonLink>
          <ButtonLink href="/kontakt" variant="secondary" className="h-12 px-6">
            Kontakt aufnehmen
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <Pilot />
      <Problem />
      <ProductShots />
      <HowItWorks />
      <BothSides />
      <Comparison />
      <Trust />
      <Pricing />
      <FinalCta />
    </>
  );
}
