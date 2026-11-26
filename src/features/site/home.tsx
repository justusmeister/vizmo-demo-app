import {
  ArrowRight,
  BadgeEuro,
  Check,
  KeyRound,
  MessagesSquare,
  Scale,
  ScanFace,
  Server,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { cx } from "@/lib/cx";
import { ChevronEdge } from "./chevron-edge";
import { HeroVisual } from "./hero-visual";
import { PilotSignup } from "./pilot-signup";
import { ComparisonTable, PricingCard } from "./pricing";
import { ProductShots } from "./product-shots";
import { Container, Section, SectionHeading } from "./section";

// Homepage of govizmo.de. Figures come from the pitch deck (Finale V2, Oktober 2026).

function Hero() {
  return (
    <section className="relative -mt-16 overflow-hidden pt-16">
      {/* A Nebel slab behind the product visual, set off-centre and running off the right edge,
          so the hero is not one symmetric band. It runs up behind the transparent header and
          stops short of the bottom, so the chevron edge into the pilot section starts on white. */}
      <div aria-hidden className="absolute top-0 right-0 bottom-20 hidden w-[42%] bg-mist lg:block" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-full bg-linear-to-b from-mist/70 to-white to-50% lg:hidden" />
      <Container className="relative grid grid-cols-1 items-center gap-16 pt-12 pb-24 md:pt-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pt-28 lg:pb-32">
        <div className="relative z-10 flex min-w-0 flex-col items-start">
          <h1 className="max-w-[18ch] font-display text-stage font-bold text-balance text-night">
            Wohnungen zeigen, ohne selbst dabei zu sein
          </h1>
          <p className="mt-6 max-w-[34ch] text-intro text-slate">Interessenten buchen selbst einen Termin, das Smartlock öffnet die Tür.</p>
          <div className="mt-10 grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
            <ButtonLink href="#pilot" className="h-12 px-6">
              Für den Pilot vormerken
            </ButtonLink>
            <ButtonLink href="#ablauf" variant="secondary" className="h-12 px-6">
              So funktioniert’s
            </ButtonLink>
          </div>
        </div>
        <div className="px-2 py-6 sm:px-8 lg:py-0 lg:pl-10">
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}

/** Pilot waitlist. On /pilot it is the page itself, so its heading becomes the h1. */
export function Pilot({ asPage = false }: { asPage?: boolean }) {
  const Heading = asPage ? "h1" : "h2";
  return (
    <Section id="pilot" tone="mist" className={cx("relative", asPage ? "-mt-16 pt-32 md:pt-40" : "pt-28 sm:pt-36 lg:pt-52")}>
      {!asPage && <ChevronEdge from="white" />}
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-5">
          <p className="text-body font-medium text-slate">Pilotprojekt</p>
          <Heading id="pilot-title" className={cx("font-display font-bold text-balance", asPage ? "text-hero" : "text-section")}>
            Vermieten Sie bald neu? Werden Sie Pilotvermieter
          </Heading>
          <p className="text-lead text-slate">
            Wir starten vizmo mit einer kleinen Gruppe privater Vermieter. Tragen Sie sich ein, dann melden wir uns persönlich,
            sobald es losgeht.
          </p>
          <p className="flex items-center gap-2 text-body text-slate">
            <MessagesSquare aria-hidden className="size-4 shrink-0 text-slate" />
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
        title="Eine Wohnung neu zu vermieten ist bis heute Handarbeit"
        lead="Auf eine Wohnung kommen dutzende, in Großstädten hunderte Anfragen. Wer privat vermietet, sortiert Postfächer, stimmt Termine ab und steht am Wochenende in der leeren Wohnung."
      />
      {/* Figures step down like the chevron, instead of sitting in three equal boxes. */}
      <dl className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {stats.map((stat, index) => (
          <div key={stat.label} className={cx("flex flex-col gap-1 border-t border-night pt-5", index === 1 && "md:mt-12", index === 2 && "md:mt-24")}>
            <dt className="order-2 font-medium">{stat.label}</dt>
            <dd className="order-1 font-display text-stage font-bold tabular-nums text-night">{stat.value}</dd>
            <dd className="order-3 max-w-[28ch] text-slate">{stat.note}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-10 text-body text-slate">Quellen: IW Köln Vermieterreport (2026), ImmoScout24 WohnBarometer (Q2/2026)</p>
    </Section>
  );
}

const steps: { title: string; text: string; detail: string }[] = [
  {
    title: "Inserat anlegen",
    text: "In wenigen Minuten, auf Wunsch direkt aus Ihrem bestehenden Anzeigentext. Sie bekommen einen Bewerbungslink für ImmoScout24, Kleinanzeigen und Co.",
    detail: "Link im Inserat",
  },
  {
    title: "Smartlock kommt per Post",
    text: "Nuki Smart Lock und LTE-Stick, montiert in etwa zehn Minuten, ohne Bohren. Ein WLAN in der Wohnung brauchen Sie nicht.",
    detail: "Montage ohne Bohren",
  },
  {
    title: "Bewerbungen kommen sortiert an",
    text: "Interessenten bewerben sich über Ihren Link. vizmo sortiert nach Ihren Kriterien, niemand wird automatisch aussortiert. Sie laden mit einem Klick ein.",
    detail: "Sortiert, nicht aussortiert",
  },
  {
    title: "Termin und Identität",
    text: "Eingeladene buchen selbst einen freien Slot, bestätigen ihre Identität mit Didit und hinterlegen eine kleine Kaution, die nur vorgemerkt wird.",
    detail: "Slots rund um die Uhr buchbar",
  },
  {
    title: "Besichtigung ohne Sie",
    text: "Die Tür öffnet sich nur im gebuchten Zeitfenster. Am Ende fotografieren Interessenten die Räume, vizmo gleicht mit dem Zustand vorher ab.",
    detail: "Fotoabgleich nach jeder Besichtigung",
  },
];

export const howItWorksLead =
  "Fünf Schritte von der Anzeige bis zur Wohnungstür. Sie entscheiden, wer besichtigen darf, den Rest erledigt vizmo.";

/** The five steps. On /so-funktioniert the page intro carries the heading instead. */
export function HowItWorks({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <Section id="ablauf" tone="surface">
      {withHeading && <SectionHeading title="So funktioniert vizmo" lead={howItWorksLead} />}
      <ol className={cx("grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-5", withHeading && "mt-14")}>
        {steps.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-3 border-t-2 border-night pt-4">
            <span className="font-display text-section font-bold tabular-nums text-night">{index + 1}</span>
            <h3 className="text-h2 font-medium">{step.title}</h3>
            <p className="text-slate">{step.text}</p>
            <p className="mt-auto pt-2 text-body font-medium text-deep-blue">{step.detail}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function BothSides() {
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
      <SectionHeading title="Weniger Aufwand für Sie, ein eigener Termin für Interessenten" lead="vizmo nimmt Vermietern die Abstimmung ab und gibt Interessenten einen fairen, planbaren Ablauf." />
      <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-0">
        {sides.map((side, index) => (
          <div key={side.title} className={cx(index === 1 && "md:mt-20 md:border-l md:border-line md:pl-12", index === 0 && "md:pr-12")}>
            <h3 className="font-display text-h1 font-bold md:text-section">{side.title}</h3>
            <p className="mt-3 max-w-[42ch] text-slate">{side.lead}</p>
            <ul className="mt-7 flex flex-col divide-y divide-line border-y border-line">
              {side.points.map((point) => (
                <li key={point} className="flex items-start gap-3 py-3">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-night" strokeWidth={2.5} />
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

function Comparison() {
  return (
    <Section tone="surface">
      <SectionHeading title="Schneller als selbst, günstiger als ein Makler" lead="Ein Vergleich für eine typische Wohnung mit 865 € Kaltmiete." />
      <ComparisonTable />
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

/** Security and fairness. `edgeFrom` is the tone of the section above, for the chevron edge. */
export function Trust({ edgeFrom = "white" }: { edgeFrom?: "white" | "surface" }) {
  return (
    <Section id="sicherheit" tone="night" className="relative overflow-hidden pt-32 sm:pt-40 lg:pt-56">
      <ChevronEdge from={edgeFrom} />
      <SectionHeading
        dark
        title="Sicher für Ihre Wohnung, fair für Interessenten"
        lead="Fremde Menschen in die eigene Wohnung zu lassen, braucht Vertrauen. Deshalb sind Datenschutz, Fairness und Sicherheit bei vizmo eingebaut, nicht nachgerüstet."
      />
      <ul className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {trust.map((item) => (
          <li key={item.title} className="flex flex-col gap-3">
            <span className="text-lavender">{item.icon}</span>
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
        <div className="flex flex-col gap-4">
          <PricingCard />
          <Link href="/preise" className="inline-flex items-center gap-1 self-start rounded-button font-medium text-blue hover:text-deep-blue hover:underline">
            Alle Details zu den Preisen
            <ArrowRight aria-hidden className="size-4" />
          </Link>
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
          <h2 className="font-display text-section font-bold">Planen Sie Ihre nächste Vermietung mit vizmo</h2>
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
      <Trust edgeFrom="surface" />
      <Pricing />
      <FinalCta />
    </>
  );
}
