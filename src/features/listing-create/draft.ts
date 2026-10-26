import type { Criteria } from "@/features/criteria/types";

// Listing draft collected by the creation wizard. All values are local mock state.

export type Weekday = "mo" | "di" | "mi" | "do" | "fr" | "sa" | "so";
export type Room = "Wohnzimmer" | "Küche" | "Bad" | "Schlafzimmer" | "Kinderzimmer" | "Flur" | "Balkon" | "Sonstiges";

export type Photo = { id: string; url: string; name: string; room: Room };

export type Draft = {
  description?: string;
  street?: string;
  zip?: string;
  city?: string;
  rooms?: number;
  size?: number;
  floor?: string;
  features: string[];
  coldRent?: number;
  utilities?: number;
  deposit?: number;
  availableFrom?: string;
  leaseType?: "unbefristet" | "befristet";
  leaseEnd?: string;
  occupancy?: "leer" | "bewohnt";
  buildingAccess?: "klingel" | "offen" | "direkt";
  viewingDays: Weekday[];
  viewingFrom: string;
  viewingTo: string;
  viewingDuration: number;
  viewingDeposit?: number;
  criteria?: Criteria;
  listingPhotos: Photo[];
  photos: Photo[];
  shipTo?: "profil" | "wohnung";
  confirmed: boolean;
  /** Fields filled from the pasted listing text, shown as "please check". */
  aiFields: string[];
};

export const emptyDraft: Draft = {
  features: [],
  viewingDays: ["di", "do", "sa"],
  viewingFrom: "17:00",
  viewingTo: "19:00",
  viewingDuration: 20,
  listingPhotos: [],
  photos: [],
  confirmed: false,
  aiFields: [],
};

export const weekdays: { id: Weekday; short: string; long: string }[] = [
  { id: "mo", short: "Mo", long: "Montag" },
  { id: "di", short: "Di", long: "Dienstag" },
  { id: "mi", short: "Mi", long: "Mittwoch" },
  { id: "do", short: "Do", long: "Donnerstag" },
  { id: "fr", short: "Fr", long: "Freitag" },
  { id: "sa", short: "Sa", long: "Samstag" },
  { id: "so", short: "So", long: "Sonntag" },
];

export const rooms: Room[] = ["Wohnzimmer", "Küche", "Bad", "Schlafzimmer", "Kinderzimmer", "Flur", "Balkon", "Sonstiges"];

export const featureOptions = ["Balkon", "Terrasse", "Garten", "Einbauküche", "Badewanne", "Aufzug", "Keller", "Dielenboden", "Altbau"];

export const accessLabels = {
  klingel: "Haustür mit Klingelanlage",
  offen: "Haustür tagsüber offen",
  direkt: "Direkter Zugang zur Wohnung",
} as const;

export const floorOptions = ["EG", "1. OG", "2. OG", "3. OG", "4. OG", "5. OG", "6. OG", "DG"];

export const PRICE = 42;

// Formatting (de-DE)

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

export const formatEuro = (value: number) => euro.format(value);
export const formatNumber = (value: number) => number.format(value);

export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

export function warmRent(draft: Draft) {
  return draft.coldRent != null && draft.utilities != null ? draft.coldRent + draft.utilities : undefined;
}

export function slotsPerWeek(draft: Pick<Draft, "viewingDays" | "viewingFrom" | "viewingTo" | "viewingDuration">) {
  if (!draft.viewingDays.length || !draft.viewingFrom || !draft.viewingTo || !draft.viewingDuration) return 0;
  const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
  const span = minutes(draft.viewingTo) - minutes(draft.viewingFrom);
  return span > 0 ? draft.viewingDays.length * Math.floor(span / draft.viewingDuration) : 0;
}

export function formatDays(days: Weekday[]) {
  return weekdays
    .filter((day) => days.includes(day.id))
    .map((day) => day.short)
    .join(", ");
}

export function addressLine(draft: Draft) {
  if (!draft.street) return undefined;
  return [draft.street, [draft.zip, draft.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
}

export function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
