import { slugify, type Draft } from "./draft";

// Mock "server" response for a created listing: public application link, DHL shipment.

export type ListingResult = {
  code: string;
  link: string;
  createdAt: Date;
  trackingNumber: string;
  deliveryFrom: Date;
  deliveryTo: Date;
};

function randomChars(length: number, alphabet: string) {
  const values = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join("");
}

function addBusinessDays(date: Date, days: number) {
  const next = new Date(date);
  let added = 0;
  while (added < days) {
    next.setDate(next.getDate() + 1);
    if (next.getDay() !== 0 && next.getDay() !== 6) added += 1;
  }
  return next;
}

export function createListing(draft: Draft): ListingResult {
  const createdAt = new Date();
  const code = randomChars(6, "abcdefghjkmnpqrstuvwxyz23456789");
  return {
    code,
    link: `https://app.govizmo.de/u/bewerben/${slugify(draft.street ?? "wohnung")}-${code}`,
    createdAt,
    trackingNumber: `00340434${randomChars(12, "0123456789")}`,
    deliveryFrom: addBusinessDays(createdAt, 2),
    deliveryTo: addBusinessDays(createdAt, 3),
  };
}

const weekday = new Intl.DateTimeFormat("de-DE", { weekday: "short" });

export function formatDay(date: Date) {
  return `${weekday.format(date).replace(".", "")}, ${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.`;
}

export function formatTime(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
