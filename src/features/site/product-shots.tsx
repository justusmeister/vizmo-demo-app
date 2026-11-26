import { Check } from "lucide-react";
import { cx } from "@/lib/cx";
import { BookingDemo, SortDemo } from "./process-demos";
import { Section } from "./section";

// "So sieht vizmo im Alltag aus": two animated product moments (process-demos.tsx) and one
// real screenshot of the demo (public/product, captured from the static build at 3x, WebP q92),
// with a phone crop so its text stays readable at every width. Borders only, no shadows.

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

export function ProductShots() {
  return (
    <Section id="produkt" tone="white" className="overflow-hidden">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
        <h2 className="max-w-[16ch] font-display text-section font-bold">So sieht vizmo im Alltag aus</h2>
        <p className="max-w-xl text-lead text-slate">
          Für Vermieter am Schreibtisch, für Interessenten unterwegs am Handy. Alle Namen und Daten sind Beispiele.
        </p>
      </div>

      <div className="mt-16 flex flex-col gap-24 md:mt-20 md:gap-32">
        {/* Sorting: text narrow on the left, the list wide on the right. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <div className="flex flex-col gap-6 lg:pt-6">
            <Intro
              eyebrow="Für Vermieter"
              title="Bewerbungen kommen sortiert an"
              text="Wer besser zu Ihren Kriterien passt, rückt nach oben. Aussortiert wird niemand, und Sie laden mit einem Klick ein."
            />
            <Points items={["Passung, Haushalt und Einkommen in einer Zeile", "Herkunft, Religion, Geschlecht und Alter spielen keine Rolle"]} />
          </div>
          <SortDemo />
        </div>

        {/* Booking: mirrored, the phone sits on a Nebel block that is cut off at the left edge. */}
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-center lg:gap-20">
          <div className="relative py-10 lg:order-1 lg:py-14">
            <div aria-hidden className="absolute inset-y-0 -left-[50vw] right-[18%] bg-mist max-lg:-right-[50vw]" />
            <div className="relative">
              <BookingDemo />
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:order-2">
            <Intro
              eyebrow="Für Interessenten"
              title="Termin buchen ohne Hin und Her"
              text="Eingeladene sehen nur freie Zeiten und buchen selbst. Vergebene Termine sind schraffiert, Rückfragen per Nachricht entfallen."
            />
            <Points items={["Bewerbung in fünf kurzen Schritten", "Identität und Kaution im selben Ablauf"]} />
          </div>
        </div>

        {/* Overview: a real screenshot, running off the right edge of the page. */}
        <div className="flex flex-col gap-8">
          <div className="max-w-xl">
            <Intro
              eyebrow="Ihr Überblick"
              title="Alle Inserate an einem Ort"
              text="Neue Bewerbungen, gebuchte Termine und der Stand jedes Smartlocks, je Wohnung auf einen Blick."
            />
          </div>
          <Shot
            className="lg:mr-[calc(50%-50vw)]"
            desktop={{ src: "/product/inserate.webp", width: 3576, height: 1440 }}
            mobile={{ src: "/product/inserate-mobil.webp", width: 1170, height: 2100 }}
            alt="Offene Inserate: Gneisenaustraße 41 mit 14 Bewerbungen und Smartlock online, Körnerstraße 7 mit Paket bei DHL unterwegs, Fichtestraße 12 als Entwurf"
            caption="Echter Ausschnitt aus der Übersicht Ihrer Inserate"
          />
        </div>
      </div>
    </Section>
  );
}
