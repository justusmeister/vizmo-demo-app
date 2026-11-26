"use client";

import { Check, LockKeyhole } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cx } from "@/lib/cx";
import { useLoop } from "./use-loop";

// Animated product moments for the homepage, built from the demo's real UI language instead
// of static screenshots. Each loops slowly while on screen and holds its finished state under
// reduced motion. Decorative: a visually hidden sentence tells the same story.

/* Sorting: applications arrive in any order, vizmo sorts them by the landlord's criteria. */

const applicants = [
  { name: "Tom B.", initials: "TB", score: 3, household: "3 Personen" },
  { name: "Marie S.", initials: "MS", score: 6, household: "2 Personen" },
  { name: "Jonas W.", initials: "JW", score: 4, household: "1 Person" },
  { name: "Lena H.", initials: "LH", score: 6, household: "1 Person" },
  { name: "Anna K.", initials: "AK", score: 5, household: "2 Personen" },
];
const sorted = [...applicants].sort((a, b) => b.score - a.score).map((a) => a.name);
const SORT_STEPS = [2600, 2400, 3600];
const ROW = 60; // px per row

function Meter({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} className={cx("h-1.5 w-1.5 rounded-full sm:w-2.5", i < value ? "bg-night" : "bg-line")} />
      ))}
    </span>
  );
}

export function SortDemo() {
  const { ref, step } = useLoop<HTMLDivElement>(SORT_STEPS);
  const isSorted = step >= 1;
  return (
    <div ref={ref} className="border-y border-night/80 bg-white">
      <p className="sr-only">
        Bewerbungen kommen in beliebiger Reihenfolge an. vizmo sortiert sie nach Ihren Kriterien, die passendsten stehen oben,
        und Sie laden mit einem Klick ein.
      </p>
      <div aria-hidden>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line py-3 text-body">
          <span className="font-medium">Ihre Kriterien</span>
          {["ab 2.600 € netto", "bis 2 Personen", "Einzug ab 1. Februar"].map((c) => (
            <span key={c} className="text-slate">
              {c}
            </span>
          ))}
          <span className={cx("ml-auto font-medium transition-colors duration-500", isSorted ? "text-deep-blue" : "text-gray")}>
            {isSorted ? "Sortiert nach Passung" : "Neu eingegangen"}
          </span>
        </div>
        <ul className="relative" style={{ height: applicants.length * ROW }}>
          {applicants.map((a, arrival) => {
            const position = isSorted ? sorted.indexOf(a.name) : arrival;
            const invited = step === 2 && position < 3;
            return (
              <li
                key={a.name}
                className="absolute inset-x-0 flex items-center gap-3 border-b border-line transition-[top] duration-700 ease-out motion-reduce:transition-none"
                style={{ top: position * ROW, height: ROW }}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mist text-small font-medium">{a.initials}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{a.name}</span>
                  <span className="block text-small text-slate">{a.household}</span>
                </span>
                <span className="flex items-center gap-2 text-small text-slate">
                  <Meter value={a.score} />
                  <span className="hidden w-12 tabular-nums sm:inline">{a.score} von 6</span>
                </span>
                <span className="w-20 text-right sm:w-24">
                  {invited ? <Badge tone="success">Eingeladen</Badge> : <span className="text-small text-slate">{isSorted ? "" : "Neu"}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* Booking: an invited applicant picks a free slot on the phone and books it. */

const slots = [
  { time: "17:00", taken: true },
  { time: "17:20", taken: true },
  { time: "17:40", taken: false },
  { time: "18:00", taken: false },
  { time: "18:20", taken: true },
  { time: "18:40", taken: false },
];
const BOOK_STEPS = [1800, 1400, 900, 3400];

export function BookingDemo() {
  const { ref, step } = useLoop<HTMLDivElement>(BOOK_STEPS);
  const picked = step >= 1;
  const pressing = step === 2;
  const booked = step === 3;
  return (
    <div ref={ref} className="mx-auto w-full max-w-[19rem] rounded-modal border-[6px] border-night bg-white">
      <p className="sr-only">Eingeladene wählen am Handy einen freien Termin und buchen ihn mit einem Tipp. Vergebene Zeiten sind schraffiert.</p>
      <div aria-hidden className="relative h-[25rem] overflow-hidden px-4 pt-5 pb-4">
        <div className={cx("flex h-full flex-col transition-opacity duration-300", booked && "opacity-0")}>
          <p className="text-small text-slate">Gneisenaustraße 41</p>
          <p className="mt-0.5 font-display text-h2 font-medium">Termin wählen</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-small">
            {[
              ["Mo", "2.11."],
              ["Di", "3.11."],
              ["Mi", "4.11."],
            ].map(([d, date], i) => (
              <span key={d} className={cx("rounded-button border py-1.5", i === 1 ? "border-night bg-night text-white" : "border-line text-slate")}>
                <span className="block font-medium">{d}</span>
                {date}
              </span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {slots.map((slot) => {
              const active = picked && slot.time === "17:40";
              return (
                <span
                  key={slot.time}
                  className={cx(
                    "rounded-button border py-2.5 text-center text-body font-medium tabular-nums transition-colors duration-300",
                    slot.taken && "border-line bg-[repeating-linear-gradient(135deg,var(--color-line)_0_2px,transparent_2px_7px)] text-gray line-through",
                    !slot.taken && !active && "border-line text-night",
                    active && "border-blue bg-mist text-night",
                  )}
                >
                  {slot.time}
                </span>
              );
            })}
          </div>
          <span
            className={cx(
              "mt-auto flex h-11 items-center justify-center rounded-button text-body font-medium text-white transition-[background-color,transform] duration-200",
              picked ? "bg-blue" : "bg-gray",
              pressing && "scale-[0.97] bg-deep-blue",
            )}
          >
            Slot buchen
          </span>
        </div>

        <div className={cx("absolute inset-0 flex flex-col px-4 pt-5 pb-4 transition-opacity duration-500", booked ? "opacity-100" : "pointer-events-none opacity-0")}>
          <span className="flex size-10 items-center justify-center rounded-full bg-success text-white">
            <Check className="size-5" strokeWidth={2.5} />
          </span>
          <p className="mt-4 font-display text-h2 font-medium">Termin gebucht</p>
          <p className="mt-1 tabular-nums text-slate">Di, 3. November, 17:40–18:00</p>
          <div className="mt-6 border-t border-line pt-4 text-body">
            <p className="font-medium">Vor der Besichtigung</p>
            <p className="mt-1 text-slate">Identität bestätigen und Kaution vormerken lassen. Danach öffnet die Tür nur in Ihrem Zeitfenster.</p>
          </div>
          <p className="mt-auto flex items-center gap-2 text-body text-slate">
            <LockKeyhole className="size-4 text-deep-blue" />
            Tür öffnet 17:40
          </p>
        </div>
      </div>
    </div>
  );
}
