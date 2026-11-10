import {
  ArrowRight,
  BadgeEuro,
  Camera,
  Check,
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
import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { cx } from "@/lib/cx";
import { HeroRibbon } from "./hero-ribbon";
import { HeroVisual } from "./hero-visual";
import { PilotSignup } from "./pilot-signup";
import { ComparisonTable, PricingCard } from "./pricing";
import { ProductShots } from "./product-shots";
import { Container, Section, SectionHeading } from "./section";
import { company } from "./site-nav";

// Homepage of govizmo.de. Figures come from the pitch deck (Finale V2, Oktober 2026).

function Hero() {
  return (
    <section className="relative -mt-16 overflow-hidden bg-linear-to-b from-mist/80 to-white to-60% pt-16">
      <Container className="relative grid grid-cols-1 items-center gap-14 pt-14 pb-20 md:pt-20 lg:grid-cols-[1.35fr_1fr] lg:gap-8 lg:pt-24 lg:pb-28">
        <div className="relative z-10 flex min-w-0 flex-col items-start">
          <p className="text-body font-medium text-slate">Für private Vermieter</p>
          <h1 className="mt-5 max-w-[13ch] font-display text-stage font-bold text-balance text-night">{company.claim}</h1>
          <p className="mt-6 max-w-[34ch] text-intro text-slate">
            Bewerbungen sortiert nach Ihren Kriterien, geprüfte Identitäten und Besichtigungen per Smartlock. Ohne dass Sie
            einen einzigen Termin selbst abstimmen.
          </p>
          <div className="mt-9 grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
            <ButtonLink href="#pilot" className="h-12 px-6">
              Für den Pilot vormerken
            </ButtonLink>
            <ButtonLink href="#ablauf" variant="secondary" className="h-12 px-6">
              So funktioniert’s
            </ButtonLink>
          </div>
        </div>

        <div className="relative pt-6 pb-12 lg:py-0">
          {/* The ribbon bleeds off the right edge and above the column, like a backdrop. */}
          <HeroRibbon className="pointer-events-none absolute max-lg:[mask-image:linear-gradient(to_bottom,transparent,black_45%)] top-1/2 left-1/2 w-[150%] max-w-none -translate-x-[38%] -translate-y-1/2 sm:w-[95%] sm:-translate-x-1/2 lg:w-[235%] lg:-translate-x-[22%]" />
          <div className="relative">
            <HeroVisual />
          </div>
        </div>
      </Container>

      <div className="relative border-t border-line bg-white">
        <Container>
          <ul className="flex flex-col gap-3 py-5 text-body text-slate sm:flex-row sm:flex-wrap sm:gap-x-10">
            {["DSGVO-konform", "Entwickelt und gehostet in Deutschland", "AGG-konforme Auswahl"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check aria-hidden className="size-4 shrink-0 text-deep-blue" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}

/** Pilot waitlist. On /pilot it is the page itself, so its heading becomes the h1. */
export function Pilot({ asPage = false }: { asPage?: boolean }) {
  const Heading = asPage ? "h1" : "h2";
  return (
    <Section id="pilot" tone="mist" className={cx(asPage && "-mt-16 pt-32 md:pt-40")}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-5">
          <p className="w-fit rounded-full bg-white px-3 py-1 text-body font-medium text-night">Pilotprojekt</p>
          <Heading id="pilot-title" className={cx("font-display font-bold text-balance", asPage ? "text-hero" : "text-section")}>
            Vermieten Sie bald neu? Werden Sie Pilotvermieter.
          </Heading>
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

export const howItWorksLead =
  "Fünf Schritte von der Anzeige bis zur Wohnungstür. Sie entscheiden, wer besichtigen darf, den Rest erledigt vizmo.";

/** The five steps. On /so-funktioniert the page intro carries the heading instead. */
export function HowItWorks({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <Section id="ablauf" tone="surface">
      {withHeading && <SectionHeading title="So funktioniert vizmo" lead={howItWorksLead} />}
      <ol className={cx("grid gap-4 md:grid-cols-2 xl:grid-cols-5", withHeading && "mt-12")}>
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

export function Trust() {
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
