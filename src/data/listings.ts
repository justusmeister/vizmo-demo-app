import type { Criteria } from "@/features/criteria/types";

// Read-only mock listings shared by the overview, manage and applicant screens.
// Screens copy what they need into local state; nothing writes back here.

export type Weekday = "mo" | "di" | "mi" | "do" | "fr" | "sa" | "so";

export type Booking = { weekday: Weekday; weekOffset: number; time: string; name: string };

export type Listing = {
  slug: string;
  street: string;
  unit: string;
  zip: string;
  city: string;
  rooms: number;
  size: number;
  coldRent: number;
  utilities: number;
  availableFrom: string;
  status: "aktiv" | "entwurf" | "vermietet";
  statusNote: string;
  link?: string;
  occupancy: "leer" | "bewohnt";
  smartlock: { state: "online" | "unterwegs" | "keins"; note: string };
  viewing: { days: Weekday[]; from: string; to: string; duration: number; deposit: number };
  bookings: Booking[];
  applications: { total: number; new: number; invited: number; booked: number };
  criteria: Criteria;
  hasApplicantList?: boolean;
  /** Public listing content shown on the applicant page. */
  description?: string;
  features?: string[];
  floor?: string;
  draftProgress?: number;
};

export const listings: Listing[] = [
  {
    slug: "gneisenaustrasse-41",
    street: "Gneisenaustraße 41",
    unit: "2. OG",
    zip: "10961",
    city: "Berlin-Kreuzberg",
    rooms: 3,
    size: 78,
    coldRent: 1050,
    utilities: 220,
    availableFrom: "2026-12-01",
    status: "aktiv",
    statusNote: "Online seit 23.10.2026",
    link: "https://app.govizmo.de/u/bewerben/gneisenaustrasse-41-k7m2qx",
    floor: "2. OG",
    description:
      "Helle Altbauwohnung mit Dielenböden und hohen Decken in ruhiger Hoflage. Das Wohnzimmer und der Balkon gehen nach Westen, die Küche ist voll ausgestattet. U-Bahn Gneisenaustraße und Südstern in wenigen Minuten zu Fuß.",
    features: ["Balkon", "Einbauküche", "Badewanne", "Dielenboden", "Altbau"],
    occupancy: "leer",
    smartlock: { state: "online", note: "Nuki Smart Lock online, Akku 86 %" },
    viewing: { days: ["di", "do", "sa"], from: "17:00", to: "19:00", duration: 20, deposit: 25 },
    bookings: [
      { weekday: "di", weekOffset: 0, time: "17:20", name: "Lena Hoffmann" },
      { weekday: "do", weekOffset: 0, time: "18:00", name: "Mehmet Yılmaz" },
      { weekday: "sa", weekOffset: 0, time: "17:40", name: "Felix Neumann" },
    ],
    applications: { total: 14, new: 7, invited: 1, booked: 3 },
    hasApplicantList: true,
    criteria: {
      income: { enabled: true, min: 3900 },
      employment: { enabled: true, values: ["angestellt", "beamtet"] },
      persons: { enabled: true, max: 3 },
      pets: { enabled: true, value: "absprache" },
      smoking: { enabled: true, value: "nein" },
      moveIn: { enabled: true, latest: "2027-01-31" },
      duration: { enabled: false, years: 2 },
      custom: [],
    },
  },
  {
    slug: "koernerstrasse-7",
    street: "Körnerstraße 7",
    unit: "EG links",
    zip: "12169",
    city: "Berlin-Steglitz",
    rooms: 2,
    size: 54,
    coldRent: 690,
    utilities: 160,
    availableFrom: "2027-01-01",
    status: "aktiv",
    statusNote: "Online seit gestern",
    link: "https://app.govizmo.de/u/bewerben/koernerstrasse-7-p4hw9t",
    floor: "EG",
    description:
      "Ruhige Erdgeschosswohnung mit eigenem Gartenanteil in einem gepflegten Mehrfamilienhaus. Tageslichtbad, neue Fenster, Keller. Schlossstraße und S-Bahn Rathaus Steglitz in zehn Minuten zu Fuß.",
    features: ["Garten", "Keller", "Einbauküche"],
    occupancy: "leer",
    smartlock: { state: "unterwegs", note: "Paket bei DHL, Zustellung voraussichtlich Mi" },
    viewing: { days: ["mi", "sa"], from: "10:00", to: "12:00", duration: 30, deposit: 25 },
    bookings: [],
    applications: { total: 3, new: 3, invited: 0, booked: 0 },
    criteria: {
      income: { enabled: true, min: 2600 },
      employment: { enabled: false, values: [] },
      persons: { enabled: true, max: 2 },
      pets: { enabled: true, value: "nein" },
      smoking: { enabled: true, value: "nein" },
      moveIn: { enabled: true, latest: "2027-02-28" },
      duration: { enabled: false, years: 2 },
      custom: [{ id: "c1", text: "Übernahme der Gartenpflege" }],
    },
  },
  {
    slug: "fichtestrasse-12",
    street: "Fichtestraße 12",
    unit: "3. OG",
    zip: "10967",
    city: "Berlin-Kreuzberg",
    rooms: 4,
    size: 96,
    coldRent: 1480,
    utilities: 290,
    availableFrom: "2027-02-01",
    status: "entwurf",
    statusNote: "Zuletzt bearbeitet vor 3 Tagen",
    occupancy: "bewohnt",
    smartlock: { state: "keins", note: "Begleitete Besichtigungen" },
    viewing: { days: [], from: "17:00", to: "19:00", duration: 20, deposit: 0 },
    bookings: [],
    applications: { total: 0, new: 0, invited: 0, booked: 0 },
    draftProgress: 3,
    criteria: {
      income: { enabled: true, min: 5400 },
      employment: { enabled: false, values: [] },
      persons: { enabled: false, max: 4 },
      pets: { enabled: true, value: "absprache" },
      smoking: { enabled: true, value: "nein" },
      moveIn: { enabled: false, latest: "" },
      duration: { enabled: false, years: 2 },
      custom: [],
    },
  },
  {
    slug: "wrangelstrasse-88",
    street: "Wrangelstraße 88",
    unit: "1. OG rechts",
    zip: "10997",
    city: "Berlin-Kreuzberg",
    rooms: 2,
    size: 61,
    coldRent: 820,
    utilities: 180,
    availableFrom: "2026-08-01",
    status: "vermietet",
    statusNote: "Vermietet zum 01.08.2026, 31 Bewerbungen, 6 Besichtigungen",
    occupancy: "leer",
    smartlock: { state: "keins", note: "Smartlock zurückgeschickt" },
    viewing: { days: [], from: "", to: "", duration: 20, deposit: 25 },
    bookings: [],
    applications: { total: 31, new: 0, invited: 0, booked: 0 },
    criteria: {
      income: { enabled: true, min: 3000 },
      employment: { enabled: false, values: [] },
      persons: { enabled: false, max: 2 },
      pets: { enabled: false, value: "absprache" },
      smoking: { enabled: false, value: "nein" },
      moveIn: { enabled: false, latest: "" },
      duration: { enabled: false, years: 2 },
      custom: [],
    },
  },
];

export const getListing = (slug: string) => listings.find((listing) => listing.slug === slug);

/** Code at the end of the public application link, e.g. "gneisenaustrasse-41-k7m2qx". */
export const applicationCode = (listing: Listing) => listing.link?.split("/").pop();
export const getListingByCode = (code: string) => listings.find((listing) => applicationCode(listing) === code);
/** Local demo route for a public link on app.govizmo.de. */
export const applicationPath = (listing: Listing) => `/u/bewerben/${applicationCode(listing)}`;
export const warmRent = (listing: Listing) => listing.coldRent + listing.utilities;
