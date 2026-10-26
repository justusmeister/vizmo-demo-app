"use client";

import { Clock } from "lucide-react";
import { useState } from "react";
import type { Listing } from "@/data/listings";
import { upcomingDays, type Day } from "@/features/listing-manage/slots";
import { cx } from "@/lib/cx";

// Landlord-defined viewing slots for the next two weeks. Taken slots stay visible but
// can't be chosen, so the applicant sees real availability.

export type PickedSlot = { iso: string; time: string; end: string; label: string };

const weekdayShort = new Intl.DateTimeFormat("de-DE", { weekday: "short" });
const weekdayLong = new Intl.DateTimeFormat("de-DE", { weekday: "long" });

function parseIso(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const pad = (n: number) => String(n).padStart(2, "0");

function addMinutes(time: string, minutes: number) {
  const total = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)) + minutes;
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

export function slotLabel(iso: string, time: string, duration: number) {
  const date = parseIso(iso);
  return `${weekdayLong.format(date)}, ${pad(date.getDate())}.${pad(date.getMonth() + 1)}., ${time}–${addMinutes(time, duration)} Uhr`;
}

/** Future days with slots; today's slots starting within the next hour are dropped. */
export function availableDays(listing: Listing, now: Date): Day[] {
  const cutoff = now.getHours() * 60 + now.getMinutes() + 60;
  const todayIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return upcomingDays(listing.viewing, listing.bookings, now, 14)
    .map((day) => ({
      ...day,
      slots: day.iso === todayIso ? day.slots.filter((s) => Number(s.time.slice(0, 2)) * 60 + Number(s.time.slice(3, 5)) > cutoff) : day.slots,
    }))
    .filter((day) => day.slots.length > 0);
}

type SlotPickerProps = {
  days: Day[];
  duration: number;
  value: PickedSlot | null;
  onChange: (slot: PickedSlot) => void;
};

export function SlotPicker({ days, duration, value, onChange }: SlotPickerProps) {
  const firstWithFree = days.find((day) => day.slots.some((s) => !s.booking)) ?? days[0];
  const [dayIso, setDayIso] = useState(value?.iso ?? firstWithFree?.iso);
  const day = days.find((d) => d.iso === dayIso) ?? firstWithFree;

  if (!day) return <p className="rounded-card bg-surface p-4 text-slate">Aktuell sind keine Slots frei. Der Vermieter wurde informiert.</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <ul className="flex gap-2 pb-1" aria-label="Tag wählen">
          {days.map((d) => {
            const date = parseIso(d.iso);
            const free = d.slots.filter((s) => !s.booking).length;
            const selected = d.iso === day.iso;
            return (
              <li key={d.iso} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setDayIso(d.iso)}
                  className={cx(
                    "flex w-18 flex-col items-center gap-0.5 rounded-card border px-2 py-2.5 transition-colors",
                    selected ? "border-blue bg-mist" : "border-line bg-white hover:border-gray",
                  )}
                >
                  <span className="text-small font-medium text-slate">{weekdayShort.format(date).replace(".", "")}</span>
                  <span className="font-display text-h3 font-bold tabular-nums">{pad(date.getDate())}.{pad(date.getMonth() + 1)}.</span>
                  <span className={cx("text-small", free ? "text-night" : "text-slate")}>{free ? `${free} frei` : "voll"}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="mb-2 font-medium">{day.label}</p>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {day.slots.map((slot) => {
            const taken = Boolean(slot.booking);
            const selected = value?.iso === day.iso && value.time === slot.time;
            return (
              <li key={slot.key}>
                <button
                  type="button"
                  disabled={taken}
                  aria-pressed={selected}
                  aria-label={`${slot.time} Uhr${taken ? ", vergeben" : ""}`}
                  onClick={() =>
                    onChange({ iso: day.iso, time: slot.time, end: addMinutes(slot.time, duration), label: slotLabel(day.iso, slot.time, duration) })
                  }
                  className={cx(
                    "flex h-12 w-full flex-col items-center justify-center rounded-button border font-medium tabular-nums transition-colors",
                    taken && "cursor-not-allowed border-line bg-surface text-slate",
                    !taken && !selected && "border-line bg-white text-night hover:border-blue hover:bg-mist",
                    selected && "border-blue bg-blue text-white",
                  )}
                >
                  <span className={cx(taken && "line-through")}>{slot.time}</span>
                  {taken && <span className="text-small font-normal">vergeben</span>}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 flex items-center gap-2 text-small text-slate">
          <Clock aria-hidden className="size-4 shrink-0" />
          Jede Besichtigung dauert {duration} Minuten. Sie sind in dieser Zeit allein in der Wohnung.
        </p>
      </div>
    </div>
  );
}
