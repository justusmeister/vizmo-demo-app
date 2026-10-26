import type { Booking, Weekday } from "@/data/listings";

// Concrete viewing slots for the coming days, from the weekly pattern plus existing bookings.

export type Pattern = { days: Weekday[]; from: string; to: string; duration: number };
export type Slot = { key: string; time: string; booking?: string };
export type Day = { iso: string; label: string; slots: Slot[] };

const order: Weekday[] = ["so", "mo", "di", "mi", "do", "fr", "sa"];
const weekdayLong = new Intl.DateTimeFormat("de-DE", { weekday: "long" });

const toMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
const toTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export function patternTimes(pattern: Pattern) {
  const times: string[] = [];
  if (!pattern.from || !pattern.to) return times;
  for (let t = toMinutes(pattern.from); t + pattern.duration <= toMinutes(pattern.to); t += pattern.duration) times.push(toTime(t));
  return times;
}

export function bookingDate(booking: Booking, now: Date) {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = order.indexOf(booking.weekday);
  date.setDate(date.getDate() + ((target - date.getDay() + 7) % 7) + booking.weekOffset * 7);
  return date;
}

export function formatDayLabel(date: Date, now: Date) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diff = Math.round((date.getTime() - today) / 86_400_000);
  const dm = `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.`;
  if (diff === 0) return `Heute, ${dm}`;
  if (diff === 1) return `Morgen, ${dm}`;
  return `${weekdayLong.format(date)}, ${dm}`;
}

export function upcomingDays(pattern: Pattern, bookings: Booking[], now: Date, count = 14): Day[] {
  const times = patternTimes(pattern);
  const days: Day[] = [];
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (let i = 0; i < count; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const key = iso(date);
    const booked = bookings.filter((b) => iso(bookingDate(b, now)) === key);
    const inPattern = pattern.days.includes(order[date.getDay()]);
    if (!inPattern && !booked.length) continue;
    const slotTimes = new Set([...(inPattern ? times : []), ...booked.map((b) => b.time)]);
    const slots = [...slotTimes]
      .sort()
      .map((time) => ({ key: `${key} ${time}`, time, booking: booked.find((b) => b.time === time)?.name }));
    days.push({ iso: key, label: formatDayLabel(date, now), slots });
  }
  return days;
}
