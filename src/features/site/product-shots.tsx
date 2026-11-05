import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cx } from "@/lib/cx";
import { Section, SectionHeading } from "./section";

// Real screenshots of the demo, cropped to the part that matters (public/product, captured
// from the static build at 3x, WebP q92 with sharp YUV so text stays crisp). Landlord screens
// also have a phone crop of the responsive layout, so the text stays readable at every
// width. Borders only, no shadows.

type Image = { src: string; width: number; height: number };

function Shot({ desktop, mobile, alt, caption, className }: { desktop: Image; mobile?: Image; alt: string; caption: string; className?: string }) {
  return (
    <figure className={cx("flex flex-col gap-3", className)}>
      <div className={cx("overflow-hidden rounded-card border border-line bg-surface", mobile && "mx-auto w-full max-w-md sm:max-w-none")}>
        <picture>
          {mobile && <source media="(max-width: 639px)" srcSet={mobile.src} width={mobile.width} height={mobile.height} />}
          <img src={desktop.src} alt={alt} width={desktop.width} height={desktop.height} loading="lazy" decoding="async" className="block h-auto w-full" />
        </picture>
      </div>
      <figcaption className="text-body text-slate">{caption}</figcaption>
    </figure>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <Check aria-hidden className="mt-1 size-4 shrink-0 text-deep-blue" strokeWidth={2.5} />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Intro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-body font-medium text-deep-blue">{eyebrow}</p>
      <h3 className="font-display text-h1 font-bold md:text-section">{title}</h3>
      <p className="text-slate">{text}</p>
    </div>
  );
}

/** Desktop screen: text above, the screenshot across the full content width. */
function WideFeature({ intro, points, shot }: { intro: ReactNode; points: string[]; shot: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-14">
        {intro}
        <Points items={points} />
      </div>
      {shot}
    </div>
  );
}

export function ProductShots() {
  return (
    <Section id="produkt" tone="white">
      <SectionHeading
        title="Ein Blick in vizmo"
        lead="Ausschnitte aus vizmo, für Vermieter am Schreibtisch und für Interessenten unterwegs am Handy. Alle Namen und Daten sind Beispiele."
      />
      <div className="mt-12 flex flex-col gap-20 md:mt-16 md:gap-28">
        <WideFeature
          intro={
            <Intro
              eyebrow="Für Vermieter"
              title="Alle Bewerbungen auf einen Blick"
              text="Bewerbungen kommen sortiert nach Ihren Kriterien an. Wer besser passt, steht weiter oben, aussortiert wird niemand."
            />
          }
          points={["Passung, Haushalt und Einkommen in einer Zeile", "Gebuchte Termine direkt in der Liste", "Herkunft, Religion, Geschlecht und Alter spielen keine Rolle"]}
          shot={
            <Shot
              desktop={{ src: "/product/bewerbungen.webp", width: 3096, height: 1839 }}
              mobile={{ src: "/product/bewerbungen-mobil.webp", width: 1170, height: 2280 }}
              alt="Bewerbungsliste: Kriterien wie ab 3.900 € netto, bis 3 Personen und Nichtraucher. Darunter Bewerbungen mit Passung 6 von 6, Haushalt, Einkommen, Einzug und Status wie Neu, Slot gebucht und Eingeladen."
              caption="Bewerbungsliste mit Ihren Kriterien und dem Stand jeder Bewerbung"
            />
          }
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-6">
            <Intro
              eyebrow="Für Interessenten"
              title="Bewerben und Termin buchen, am Handy"
              text="Interessenten bewerben sich in wenigen Minuten. Wer eingeladen wird, sucht sich selbst einen freien Termin aus, ohne Hin und Her per Nachricht."
            />
            <Points items={["Bewerbung in fünf kurzen Schritten", "Freie und vergebene Termine klar erkennbar", "Identität und Kaution im selben Ablauf"]} />
          </div>
          <div className="grid items-start gap-8 sm:grid-cols-2 sm:gap-6">
            <Shot
              className="mx-auto w-full max-w-sm"
              desktop={{ src: "/product/bewerbung.webp", width: 1170, height: 1692 }}
              alt="Bewerbungsformular, Schritt 1 von 5: Ihre Kontaktdaten mit Anrede, Vorname und Nachname"
              caption="Bewerbung in fünf Schritten"
            />
            <Shot
              className="mx-auto w-full max-w-sm sm:mt-16"
              desktop={{ src: "/product/terminbuchung.webp", width: 1146, height: 1365 }}
              alt="Terminwahl: Tage mit freien Slots, Dienstag 03.11. gewählt, 17:20 Uhr ist schraffiert und vergeben"
              caption="Terminwahl, vergebene Zeiten sind schraffiert"
            />
          </div>
        </div>

        <WideFeature
          intro={
            <Intro
              eyebrow="Ihr Überblick"
              title="Alle Inserate an einem Ort"
              text="Sehen Sie auf einen Blick, wie viele Bewerbungen neu sind, welche Termine gebucht sind und ob das Smartlock bereit ist."
            />
          }
          points={["Neue Bewerbungen und gebuchte Slots je Wohnung", "Status von Smartlock und Lieferung", "Entwürfe jederzeit fortsetzen"]}
          shot={
            <Shot
              desktop={{ src: "/product/inserate.webp", width: 3576, height: 1440 }}
              mobile={{ src: "/product/inserate-mobil.webp", width: 1170, height: 2100 }}
              alt="Offene Inserate: Gneisenaustraße 41 mit 14 Bewerbungen und Smartlock online, Körnerstraße 7 mit Paket bei DHL unterwegs, Fichtestraße 12 als Entwurf"
              caption="Übersicht Ihrer Inserate mit Bewerbungen, Terminen und Smartlock"
            />
          }
        />
      </div>
    </Section>
  );
}
