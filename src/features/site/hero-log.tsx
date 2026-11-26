import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";

// Homepage hero: one real rental as a log, from listing to locked door. It builds up once on
// load, row by row, while the track fills (one orchestrated moment, none under reduced
// motion). The landlord's single action is set apart: that is the promise of the page.

type Entry = { time: string; text: string; note?: string; yours?: boolean };

const days: { day: string; entries: Entry[] }[] = [
  {
    day: "Montag",
    entries: [
      { time: "09:12", text: "Inserat ist online", note: "Bewerbungslink steht bei ImmoScout24" },
      { time: "21:47", text: "14 Bewerbungen, sortiert nach Ihren Kriterien" },
    ],
  },
  {
    day: "Dienstag",
    entries: [
      { time: "08:05", text: "Sie laden vier Interessenten ein", note: "Ihr einziger Schritt", yours: true },
      { time: "12:30", text: "Lena H. bucht 17:40 Uhr" },
      { time: "17:32", text: "Identität bestätigt, Kaution vorgemerkt" },
      { time: "17:40", text: "Tür öffnet für 20 Minuten" },
      { time: "18:03", text: "Fotos abgeglichen, Wohnung unverändert" },
    ],
  },
];

const STEP = 0.55; // seconds between rows
const START = 0.35;

// Index of each day's first row in the whole log, for the staggered delays.
const offsets = days.map((_, i) => days.slice(0, i).reduce((n, d) => n + d.entries.length, 0));

function delay(index: number): CSSProperties {
  return { animationDelay: `${START + index * STEP}s` };
}

export function HeroLog({ className }: { className?: string }) {
  return (
    <div className={cx("relative", className)}>
      <p className="text-body text-slate">Eine Vermietung mit vizmo, Gneisenaustraße 41</p>
      <div className="relative mt-6">
        {/* Track: a quiet line that fills in Vizmo Blau as the week unfolds. */}
        <span aria-hidden className="absolute top-2 bottom-2 left-[5.25rem] w-px bg-lavender sm:left-[5.75rem]" />
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-[5.25rem] w-px origin-top animate-fill bg-blue motion-reduce:animate-none sm:left-[5.75rem]"
          style={{ animationDelay: `${START}s` }}
        />
        {days.map((group, groupIndex) => (
          <div key={group.day} className={cx("relative", groupIndex > 0 && "mt-5")}>
            <p className="mb-1 pl-[6.75rem] text-small font-medium text-slate sm:pl-[7.25rem]">{group.day}</p>
            <ol className="flex flex-col">
              {group.entries.map((entry, entryIndex) => {
                const style = delay(offsets[groupIndex] + entryIndex);
                return (
                  <li
                    key={entry.time}
                    className={cx(
                      "relative grid animate-rise grid-cols-[4.25rem_1fr] gap-x-10 py-3 motion-reduce:animate-none sm:grid-cols-[4.75rem_1fr]",
                      // The landlord's step sits on a white strip, square-cut on purpose.
                      entry.yours && "my-1 bg-white",
                    )}
                    style={style}
                  >
                    <time className="pt-0.5 text-right text-body tabular-nums text-slate md:pt-1">{entry.time}</time>
                    <span
                      aria-hidden
                      className={cx(
                        "absolute top-[1.3rem] left-[5.25rem] -translate-x-1/2 rounded-full sm:left-[5.75rem]",
                        entry.yours ? "size-3.5 bg-blue ring-4 ring-white" : "size-2.5 bg-night ring-4 ring-mist max-lg:ring-white",
                      )}
                    />
                    <span>
                      <span className={cx("block md:text-lead", entry.yours ? "font-medium text-night" : "text-night")}>{entry.text}</span>
                      {entry.note && <span className={cx("block text-body", entry.yours ? "font-medium text-deep-blue" : "text-slate")}>{entry.note}</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
