import type { Listing } from "@/data/listings";
import type { Employment } from "@/features/criteria/types";

// Applicant's application, collected step by step. Only AGG-permitted questions:
// no age, origin, religion, family planning, health or similar.

export type Contact = "email" | "anruf" | "sms";

export type Document = { id: string; name: string; size: number; kind: string };

export type Application = {
  salutation: "Frau" | "Herr" | "Keine Angabe";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contact: Contact[];
  adults: number;
  children: number;
  moveIn: string;
  duration?: "1" | "2" | "3" | "5" | "offen";
  pets?: "nein" | "ja";
  petDescription: string;
  smoker?: "nein" | "ja";
  employment?: Employment;
  occupation: string;
  netIncome?: number;
  guarantee: boolean;
  documents: Document[];
  about: string;
  extra: string;
  privacy: boolean;
  truthful: boolean;
};

export const emptyApplication: Application = {
  salutation: "Keine Angabe",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  contact: ["email"],
  adults: 1,
  children: 0,
  moveIn: "",
  petDescription: "",
  occupation: "",
  guarantee: false,
  documents: [],
  about: "",
  extra: "",
  privacy: false,
  truthful: false,
};

export const contactLabels: Record<Contact, string> = { email: "E-Mail", anruf: "Anruf", sms: "SMS oder Messenger" };

export const durationLabels = { "1": "Mindestens 1 Jahr", "2": "Mindestens 2 Jahre", "3": "Mindestens 3 Jahre", "5": "5 Jahre oder länger", offen: "Noch offen" } as const;

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
export const isPhone = (value: string) => value.replace(/[^\d]/g, "").length >= 7;

export const persons = (a: Application) => a.adults + a.children;

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
export const formatEuro = (value: number) => euro.format(value);

export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

export const warm = (listing: Listing) => listing.coldRent + listing.utilities;
