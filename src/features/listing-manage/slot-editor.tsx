"use client";

import { Ban, UserRound } from "lucide-react";
import { ChoiceChip, ChoiceGroup } from "@/components/ui/choice-chip";
import { Select } from "@/components/ui/input";
import type { Booking, Weekday } from "@/data/listings";
import { cx } from "@/lib/cx";
import { useMounted } from "@/lib/use-mounted";
import { patternTimes, upcomingDays, type Pattern } from "./slots";

const weekdays: { id: Weekday; short: string; long: string }[] = [
  { id: "mo", short: "Mo", long: "Montag" },
  { id: "di", short: "Di", long: "Dienstag" },
  { id: "mi", short: "Mi", long: "Mittwoch" },
  { id: "do", short: "Do", long: "Donnerstag" },
  { id: "fr", short: "Fr", long: "Freitag" },
  { id: "sa", short: "Sa", long: "Samstag" },
  { id: "so", short: "So", long: "Sonntag" },
];

const times = Array.from({ length: 29 }, (_, index) => {
  const minutes = 7 * 60 + index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

type SlotEditorProps = {
  pattern: Pattern;
  onPatternChange: (pattern: Pattern) => void;
  blocked: Set<string>;
  onBlockedChange: (blocked: Set<string>) => void;
  bookings: Booking[];
  disabled?: boolean;
};

export function SlotEditor({ pattern, onPatternChange, blocked, onBlockedChange, bookings, disabled }: SlotEditorProps) {
  const mounted = useMounted();
  const days = mounted ? upcomingDays(pattern, bookings, new Date()) : [];
  const allSlots = days.flatMap((day) => day.slots);
  const free = allSlots.filter((slot) => !slot.booking && !blocked.has(slot.key)).length;
  const perWeek = pattern.days.length * patternTimes(pattern).length;

  const toggleDay = (day: Weekday) =>
    onPatternChange({ ...pattern, days: pattern.days.includes(day) ? pattern.days.filter((d) => d !== day) : [...pattern.days, day] });

  function toggleSlot(key: string) {
    const next = new Set(blocked);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onBlockedChange(next);
  }

  function toggleWholeDay(keys: string[]) {
    const next = new Set(blocked);
    const allBlocked = keys.every((key) => next.has(key));
    for (const key of keys) {
      if (allBlocked) next.delete(key);
      else next.add(key);
    }
    onBlockedChange(next);
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <div>
          <h3 className="text-h3">Wöchentliche Zeiten</h3>
          <p className="text-slate">Gilt für alle künftigen Wochen. Gebuchte Termine bleiben in jedem Fall bestehen.</p>
        </div>
        <ChoiceGroup label="Wochentage">
          {weekdays.map((day) => (
            <ChoiceChip
              key={day.id}
              selected={pattern.days.includes(day.id)}
              onClick={() => toggleDay(day.id)}
              aria-label={day.long}
              disabled={disabled}
              className="min-w-12 justify-center"
            >
              {day.short}
            </ChoiceChip>
          ))}
        </ChoiceGroup>
        <div className="grid gap-4 sm:grid-cols-3">
          <Select label="Von" value={pattern.from} disabled={disabled} onChange={(event) => onPatternChange({ ...pattern, from: event.target.value })}>
            {times.map((time) => (
              <option key={time}>{time}</option>
            ))}
          </Select>
          <Select label="Bis" value={pattern.to} disabled={disabled} onChange={(event) => onPatternChange({ ...pattern, to: event.target.value })}>
            {times.map((time) => (
              <option key={time}>{time}</option>
            ))}
          </Select>
          <Select
            label="Dauer pro Besichtigung"
            value={pattern.duration}
            disabled={disabled}
            onChange={(event) => onPatternChange({ ...pattern, duration: Number(event.target.value) })}
          >
            {[15, 20, 30, 45].map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} Minuten
              </option>
            ))}
          </Select>
        </div>
        <p className="font-medium">{perWeek ? `${perWeek} Slots pro Woche` : "Keine Slots: bitte Tage und Zeitfenster wählen."}</p>
      </section>

      <section className="flex flex-col gap-3 border-t border-line pt-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="text-h3">Nächste 14 Tage</h3>
            <p className="text-slate">Tippen Sie auf einen freien Slot, um ihn für diesen Tag zu sperren.</p>
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-small text-slate">
            <li className="flex items-center gap-1.5">
              <span className="size-3 rounded-full border border-line bg-white" /> Frei ({free})
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-night" /> Gebucht
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-line" /> Gesperrt
            </li>
          </ul>
        </div>

        {!mounted ? null : days.length === 0 ? (
          <p className="rounded-card bg-surface p-6 text-center text-slate">In den nächsten 14 Tagen gibt es keine Besichtigungszeiten.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-line rounded-card border border-line">
            {days.map((day) => {
              const freeKeys = day.slots.filter((slot) => !slot.booking).map((slot) => slot.key);
              const dayBlocked = freeKeys.length > 0 && freeKeys.every((key) => blocked.has(key));
              return (
                <li key={day.iso} className="flex flex-col gap-3 p-4 md:flex-row md:items-start">
                  <div className="flex items-center justify-between gap-2 md:w-48 md:shrink-0 md:flex-col md:items-start">
                    <p className="font-medium">{day.label}</p>
                    {freeKeys.length > 0 && !disabled && (
                      <button type="button" onClick={() => toggleWholeDay(freeKeys)} className="text-small font-medium text-blue hover:text-deep-blue hover:underline">
                        {dayBlocked ? "Tag wieder freigeben" : "Ganzen Tag sperren"}
                      </button>
                    )}
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {day.slots.map((slot) => {
                      const isBlocked = blocked.has(slot.key);
                      if (slot.booking) {
                        return (
                          <li key={slot.key}>
                            <span className="inline-flex h-9 items-center gap-1.5 rounded-button bg-night px-3 font-medium text-white tabular-nums">
                              {slot.time}
                              <UserRound aria-hidden className="size-3.5 text-lavender" />
                              <span className="text-small font-normal text-lavender">{slot.booking}</span>
                            </span>
                          </li>
                        );
                      }
                      return (
                        <li key={slot.key}>
                          <button
                            type="button"
                            aria-pressed={isBlocked}
                            aria-label={`${day.label}, ${slot.time} Uhr: ${isBlocked ? "gesperrt, freigeben" : "frei, sperren"}`}
                            disabled={disabled}
                            onClick={() => toggleSlot(slot.key)}
                            className={cx(
                              "inline-flex h-9 items-center gap-1.5 rounded-button border px-3 font-medium tabular-nums transition-colors disabled:cursor-not-allowed",
                              isBlocked
                                ? "border-line bg-line text-slate line-through hover:bg-mist"
                                : "border-line bg-white text-night hover:border-gray hover:bg-surface",
                            )}
                          >
                            {isBlocked && <Ban aria-hidden className="size-3.5" />}
                            {slot.time}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {disabled ? null : (
        <p className="text-small text-slate">
          Sie möchten einen gebuchten Termin absagen? Das geht in der Bewerberliste, damit die Person automatisch
          informiert wird und ihre Kaution freigegeben wird.
        </p>
      )}
    </div>
  );
}
