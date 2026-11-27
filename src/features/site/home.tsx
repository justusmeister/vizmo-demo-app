import {
  ArrowRight,
  BadgeEuro,
  Check,
  KeyRound,
  MessagesSquare,
  Scale,
  ScanFace,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { cx } from "@/lib/cx";
import { ChevronEdge } from "./chevron-edge";
import { HeroRibbon } from "./hero-ribbon";
import { HeroSignup } from "./hero-signup";
import { HeroVisual } from "./hero-visual";
import { ComparisonTable, PricingCard } from "./pricing";
import { ProductShots } from "./product-shots";
import { Container, Section, SectionHeading } from "./section";

// Homepage of govizmo.de. Figures come from the pitch deck (Finale V2, Oktober 2026).

/**
 * Announcement pill above the hero headline, as Attio or Personio do it: a quiet link with a
 * small Nebel tag in Tiefblau and a Vizmo Blau arrow, so it stays in the blue family of the
 * button below. No glow, no sparkle. Points to the pilot page.
 */
function PilotPill() {
  return (
    <Link
      href="/pilot"
      className="group inline-flex max-w-full items-center gap-2.5 rounded-full border border-line bg-white/70 py-1 pr-3 pl-1 text-body text-night transition-colors hover:border-gray hover:bg-white"
    >
      <span className="rounded-full bg-mist px-2.5 py-0.5 text-small font-medium text-deep-blue">Pilot</span>
      <span className="truncate">Wir starten mit wenigen Vermietern</span>
      <ArrowRight aria-hidden className="size-4 shrink-0 text-blue transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
    </Link>
  );
}

function Hero() {
  return (
    <section className="relative -mt-16 overflow-hidden bg-linear-to-b from-mist/80 to-white to-60% pt-16">
      <Container className="relative grid grid-cols-1 items-center gap-14 pt-14 pb-20 md:pt-20 lg:grid-cols-[1.35fr_1fr] lg:gap-8 lg:pt-24 lg:pb-28">
        <div className="relative z-10 flex min-w-0 flex-col items-start">
          <PilotPill />
          <h1 className="mt-6 max-w-[16ch] font-display text-stage font-bold text-balance text-night">
            Die Plattform für Besichtigungen, die sich selbst organisieren
          </h1>
          <p className="mt-6 max-w-[34ch] text-intro text-slate">Interessenten buchen selbst, das Smartlock öffnet die Tür.</p>
          <div className="mt-10 w-full">
            <HeroSignup />
          </div>
        </div>

        <div className="relative pt-6 pb-12 lg:py-0">
          {/* The ribbon bleeds off the right edge and above the column, like a backdrop. */}
          <HeroRibbon className="pointer-events-none absolute max-lg:[mask-image:linear-gradient(to_bottom,transparent,black_45%)] lg:[mask-image:linear-gradient(to_bottom,transparent_calc(50%-270px),black_calc(50%-150px))] top-[38%] left-1/2 w-[150%] sm:top-1/2 max-w-none -translate-x-[38%] -translate-y-1/2 sm:w-[95%] sm:-translate-x-1/2 lg:w-[235%] lg:-translate-x-[22%]" />
          <div className="relative z-10">
            <HeroVisual />
          </div>
        </div>
      </Container>
      {/* The ribbon fades out towards the chevron edge below instead of being cut off by it. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-white/0 to-white lg:h-40" />
    </section>
  );
}

/** Pilot waitlist page (/pilot): the same fused e-mail field as in the hero, no box around it. */
export function Pilot() {
  return (
    <Section id="pilot-anmeldung" tone="mist" className="-mt-16 pt-32 md:pt-40">
      <div className="flex max-w-2xl flex-col items-start">
        <p className="text-body font-medium text-slate">Pilotprojekt</p>
        <h1 id="pilot-title" className="mt-5 font-display text-hero font-bold text-balance">
          Vermieten Sie bald neu? Werden Sie Pilotvermieter
        </h1>
        <p className="mt-5 text-lead text-slate">
          Wir starten vizmo mit einer kleinen Gruppe privater Vermieter. Tragen Sie sich ein, dann melden wir uns persönlich,
          sobald es losgeht.
        </p>
        <div className="mt-10 w-full">
          <HeroSignup id="pilot" />
        </div>
        <p className="mt-8 flex items-center gap-2 text-body text-slate">
          <MessagesSquare aria-hidden className="size-4 shrink-0 text-slate" />
          Sie sprechen direkt mit uns, dem Gründerteam.
        </p>
        <p className="mt-2 text-body text-slate">
          Wir nutzen Ihre E-Mail-Adresse nur für das Pilotprojekt.{" "}
          <Link href="/datenschutz" className="font-medium text-deep-blue hover:underline">
            Datenschutz
          </Link>
        </p>
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
    <Section tone="surface" className="relative pt-32 sm:pt-40 lg:pt-56">
      <ChevronEdge from="white" />
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
    title: "Datensparsam nach DSGVO",
    text: "Wir erheben nur, was für die Vermietung nötig ist, und löschen Daten, sobald sie nicht mehr gebraucht werden. Ausweisdaten bleiben beim Prüfdienst.",
    icon: <ShieldCheck aria-hidden className="size-6" />,
  },
  {
    title: "Entwickelt in Osnabrück",
    text: "Unser Team entwickelt vizmo selbst. Dienstleister, die Daten für uns verarbeiten, verpflichten wir vertraglich auf die DSGVO.",
    icon: <MapPin aria-hidden className="size-6" />,
  },
  {
    title: "Faire Auswahl nach AGG",
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
