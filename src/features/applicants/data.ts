// Mock data for landlord screen 2: applications for the Gneisenaustraße listing.
// The listing itself comes from the shared fixture in src/data/listings.ts.

import { getListing, warmRent, type Weekday } from "@/data/listings";
import type { Employment } from "@/features/criteria/types";

export { employmentLabels, type Employment } from "@/features/criteria/types";

export type Status = "neu" | "eingeladen" | "gebucht" | "besichtigt" | "abgesagt";

export type MessageCategory = "Unterlagen" | "Rückfrage" | "Terminwunsch" | "Vorstellung" | "Nachfrage zum Stand";

/** Voluntary extra message after applying. Category and summary are AI-generated (mocked). */
export type ExtraMessage = {
  minutesAgo: number;
  category: MessageCategory;
  text: string;
  /** AI-detected effect on a criterion, applied only if the text is free of AGG-protected content. */
  effect?: { criterion: string; note: string };
};

/** Feedback the applicant gives in the app at the end of a self-guided viewing. */
export type ViewingFeedback = {
  daysAgo: number;
  interest: "ja" | "unsicher" | "nein";
  text: string;
  photos: number;
  photoCheck: { ok: true } | { ok: false; finding: string };
};

const base = getListing("gneisenaustrasse-41")!;

export const listing = {
  slug: base.slug,
  title: `${base.street}, ${base.unit}`,
  rooms: base.rooms,
  size: base.size,
  warmRent: warmRent(base),
  availableFrom: base.availableFrom,
  link: base.link!,
  slotsPerWeek: 18,
  criteria: base.criteria,
};

export type Applicant = {
  id: string;
  ref: string;
  firstName: string;
  lastName: string;
  minutesAgo: number;
  persons: number;
  household: string;
  netIncome: number;
  employment: Employment;
  occupation: string;
  moveIn: string;
  pet?: string;
  smoker: boolean;
  /** Salutation for correspondence and, if the applicant shared it voluntarily, the age.
   * Shown in the detail view only. Never used for sorting (AGG). */
  salutation: "Frau" | "Herr" | "Keine Angabe";
  age?: number;
  status: Status;
  statusNote?: string;
  /** Booked viewing slot, resolved to a date relative to today. */
  slot?: { weekday: Weekday; weekOffset: number; time: string };
  feedback?: ViewingFeedback;
  extraMessages?: ExtraMessage[];
  extraSummary?: string;
  message: string;
};

const hours = 60;
const days = 24 * hours;

export const applicants: Applicant[] = [
  {
    id: "a1", ref: "B-2041", firstName: "Lena", lastName: "Hoffmann", minutesAgo: 2 * days + 3 * hours,
    persons: 2, household: "2 Erwachsene", netIncome: 5400, employment: "angestellt",
    occupation: "UX-Research, unbefristet seit 2021", moveIn: "2026-12-01", smoker: false,
    salutation: "Frau", age: 32, status: "gebucht", statusNote: "Identität mit Didit geprüft, 25 € Kaution vorgemerkt", slot: { weekday: "di", weekOffset: 0, time: "17:20" },
    message: "Wir suchen eine ruhige Wohnung nah an der Arbeit und würden gern langfristig bleiben. Die Wohnung passt perfekt zu uns.",
  },
  {
    id: "a2", ref: "B-2044", firstName: "Mehmet", lastName: "Yılmaz", minutesAgo: 2 * days,
    persons: 3, household: "2 Erwachsene, 1 Kind", netIncome: 4700, employment: "beamtet",
    occupation: "Lehrkraft an einer Grundschule", moveIn: "2026-12-15", smoker: false,
    salutation: "Herr", age: 41, status: "gebucht", statusNote: "Identität mit Didit geprüft, 25 € Kaution vorgemerkt", slot: { weekday: "do", weekOffset: 0, time: "18:00" },
    message: "Wir wohnen seit acht Jahren in Kreuzberg und brauchen ein Zimmer mehr. Mietschuldenfreiheit liegt vor.",
  },
  {
    id: "a3", ref: "B-2047", firstName: "Anna", lastName: "Kowalski", minutesAgo: 1 * days + 20 * hours,
    persons: 1, household: "1 Person", netIncome: 4100, employment: "angestellt",
    occupation: "Projektleitung im Bauwesen", moveIn: "2026-12-01", pet: "Katze", smoker: false,
    salutation: "Frau", status: "besichtigt", statusNote: "Besichtigung allein per Smartlock, 19 Minuten. Kaution freigegeben",
    feedback: {
      daysAgo: 2, interest: "ja", photos: 3, photoCheck: { ok: true },
      text: "Die Wohnung ist noch schöner als auf den Fotos, vor allem das Licht im Wohnzimmer. Ich würde sie sehr gern nehmen und könnte zum 01.12. einziehen.",
    },
    extraMessages: [
      { minutesAgo: 1 * days + 18 * hours, category: "Unterlagen", text: "Anbei meine Gehaltsnachweise der letzten drei Monate und die Mietschuldenfreiheitsbescheinigung meiner aktuellen Vermieterin.", effect: { criterion: "Einkommen", note: "Gehaltsnachweise per Nachricht nachgereicht" } },
      { minutesAgo: 1 * days + 2 * hours, category: "Rückfrage", text: "Gibt es im Hof einen Platz, an dem ich mein Fahrrad abstellen kann?" },
    ],
    extraSummary: "Hat Gehaltsnachweise und eine Mietschuldenfreiheitsbescheinigung nachgereicht. Fragt nach einem Fahrradstellplatz im Hof.",
    message: "Ich ziehe beruflich nach Berlin. Meine Katze ist ruhig und wohnungsgewohnt.",
  },
  {
    id: "a4", ref: "B-2049", firstName: "David", lastName: "Nguyen", minutesAgo: 1 * days + 6 * hours,
    persons: 2, household: "2 Erwachsene", netIncome: 6200, employment: "angestellt",
    occupation: "Software-Entwicklung, unbefristet seit 2019", moveIn: "2026-12-01", smoker: false,
    salutation: "Herr", age: 36, status: "neu",
    extraMessages: [
      { minutesAgo: 1 * days + 3 * hours, category: "Vorstellung", text: "Kurz zu uns: Wir arbeiten beide überwiegend im Büro, sind ruhig und haben bisher jede Wohnung in gutem Zustand übergeben. Referenz der Vorvermieterin gern auf Anfrage." },
    ],
    extraSummary: "Stellt den Haushalt kurz vor und bietet eine Referenz der Vorvermieterin an.",
    message: "Wir sind beide berufstätig, Nichtraucher und haben keine Haustiere. Besichtigung jederzeit möglich.",
  },
  {
    id: "a5", ref: "B-2050", firstName: "Marie", lastName: "Schulz", minutesAgo: 1 * days + 2 * hours,
    persons: 2, household: "2 Erwachsene", netIncome: 3600, employment: "angestellt",
    occupation: "Pflegefachkraft, Charité", moveIn: "2026-12-01", smoker: false,
    salutation: "Frau", age: 29, status: "neu",
    extraMessages: [
      { minutesAgo: 1 * days + 1 * hours, category: "Unterlagen", text: "Die Bürgschaftserklärung meiner Eltern habe ich als PDF hochgeladen.", effect: { criterion: "Einkommen", note: "Elternbürgschaft per Nachricht nachgereicht, gleicht das geringere Einkommen aus" } },
      { minutesAgo: 20 * hours, category: "Terminwunsch", text: "Wegen unseres Schichtdienstes wären Termine nach 18 Uhr ideal." },
      { minutesAgo: 5 * hours, category: "Rückfrage", text: "Ist die Einbauküche im Mietpreis enthalten oder wird sie extra berechnet?" },
    ],
    extraSummary: "Hat eine Elternbürgschaft nachgereicht, wünscht Termine nach 18 Uhr und fragt, ob die Einbauküche im Mietpreis enthalten ist.",
    message: "Wir arbeiten beide im Schichtdienst und suchen etwas Ruhiges. Eine Bürgschaft der Eltern ist möglich.",
  },
  {
    id: "a6", ref: "B-2052", firstName: "Samuel", lastName: "Owusu", minutesAgo: 22 * hours,
    persons: 2, household: "2 Erwachsene", netIncome: 5100, employment: "selbststaendig",
    occupation: "Architekturbüro, selbstständig seit 2018", moveIn: "2027-01-01", smoker: false,
    salutation: "Herr", status: "besichtigt", statusNote: "Besichtigung allein per Smartlock, 20 Minuten. Kaution noch vorgemerkt",
    feedback: {
      daysAgo: 1, interest: "unsicher", photos: 3,
      photoCheck: { ok: false, finding: "Küche: Kratzer auf der Arbeitsplatte, auf dem Zustandsfoto nicht zu sehen. Bitte prüfen, bevor die Kaution freigegeben wird." },
      text: "Schöne Wohnung, aber das Bad ist kleiner als gedacht. Wir entscheiden uns bis Freitag.",
    },
    message: "Ich lege gern die BWA und die Steuerbescheide der letzten zwei Jahre vor.",
  },
  {
    id: "a7", ref: "B-2055", firstName: "Clara", lastName: "Richter", minutesAgo: 19 * hours,
    persons: 1, household: "1 Person", netIncome: 4300, employment: "beamtet",
    occupation: "Verwaltung, Bezirksamt", moveIn: "2026-12-01", smoker: false,
    salutation: "Frau", age: 45, status: "eingeladen", statusNote: "Einladung verschickt, noch nicht geöffnet",
    message: "Ich suche eine Wohnung zum Ankommen und Bleiben. Gern auch mit kleinen Renovierungsarbeiten.",
  },
  {
    id: "a8", ref: "B-2056", firstName: "Felix", lastName: "Neumann", minutesAgo: 15 * hours,
    persons: 4, household: "2 Erwachsene, 2 Kinder", netIncome: 6800, employment: "angestellt",
    occupation: "Vertrieb, unbefristet", moveIn: "2026-12-01", smoker: false,
    salutation: "Herr", age: 39, status: "gebucht", statusNote: "Identität mit Didit geprüft, 25 € Kaution vorgemerkt", slot: { weekday: "sa", weekOffset: 0, time: "17:40" },
    message: "Wir wünschen uns mehr Platz für die Kinder und kennen den Kiez sehr gut.",
  },
  {
    id: "a9", ref: "B-2058", firstName: "Aylin", lastName: "Demir", minutesAgo: 9 * hours,
    persons: 1, household: "1 Person", netIncome: 2900, employment: "ausbildung",
    occupation: "Masterstudium, Werkstudentin", moveIn: "2026-12-01", smoker: false,
    salutation: "Frau", age: 24, status: "neu",
    message: "Meine Eltern würden eine Bürgschaft übernehmen. Ich bin zuverlässig und sehr ordentlich.",
  },
  {
    id: "a10", ref: "B-2060", firstName: "Tobias", lastName: "Krüger", minutesAgo: 6 * hours,
    persons: 2, household: "2 Erwachsene", netIncome: 4400, employment: "befristet",
    occupation: "Wissenschaftliche Mitarbeit, befristet bis 2028", moveIn: "2026-12-01", pet: "Kleiner Hund", smoker: false,
    salutation: "Herr", age: 34, status: "neu",
    extraMessages: [
      { minutesAgo: 5 * hours + 40, category: "Vorstellung", text: "Hier noch zwei Fotos von Bruno, damit Sie sehen, wie entspannt er ist.", effect: { criterion: "Haustiere", note: "Hund per Nachricht mit Fotos vorgestellt. Die Entscheidung liegt bei Ihnen" } },
      { minutesAgo: 4 * hours, category: "Rückfrage", text: "Gibt es in der Nähe eine Grünfläche für Spaziergänge?" },
      { minutesAgo: 2 * hours, category: "Nachfrage zum Stand", text: "Gibt es schon Neuigkeiten zu unserer Bewerbung?" },
      { minutesAgo: 35, category: "Nachfrage zum Stand", text: "Wir wollten nur noch einmal nachfragen, ob die Wohnung noch frei ist." },
    ],
    extraSummary: "Hat Fotos des Hundes geschickt und nach Grünflächen gefragt. Hat zweimal nach dem Stand der Bewerbung gefragt.",
    message: "Unser Hund ist acht Jahre alt und sehr ruhig. Gern stellen wir ihn vorab per Video vor.",
  },
  {
    id: "a11", ref: "B-2061", firstName: "Julia", lastName: "Lehmann", minutesAgo: 4 * hours,
    persons: 2, household: "2 Erwachsene", netIncome: 4900, employment: "angestellt",
    occupation: "Marketing, unbefristet", moveIn: "2027-03-01", smoker: true,
    salutation: "Keine Angabe", status: "neu",
    message: "Wir rauchen nur auf dem Balkon. Einzug wäre bei uns erst zum März möglich.",
  },
  {
    id: "a12", ref: "B-2063", firstName: "Niklas", lastName: "Brandt", minutesAgo: 95,
    persons: 1, household: "1 Person", netIncome: 4000, employment: "angestellt",
    occupation: "Steuerfachangestellter, unbefristet", moveIn: "2026-12-01", smoker: false,
    salutation: "Herr", age: 27, status: "neu",
    extraMessages: [
      { minutesAgo: 70, category: "Vorstellung", text: "Kurz zu mir: Ich bin 27 Jahre alt, in der Kirchengemeinde hier im Kiez aktiv und sehr ordentlich. Eine Referenz meines Arbeitgebers schicke ich gern mit." },
    ],
    extraSummary: "Stellt sich kurz vor und bietet eine Referenz des Arbeitgebers an. Angaben zu Alter und Religion fließen nach AGG nicht in die Bewertung ein.",
    message: "Ich arbeite zwei Straßen weiter und würde mich sehr über eine Besichtigung freuen.",
  },
  {
    id: "a13", ref: "B-2064", firstName: "Sophie", lastName: "Wagner", minutesAgo: 40,
    persons: 3, household: "3 Erwachsene", netIncome: 4500, employment: "ausbildung",
    occupation: "Studium, Wohngemeinschaft", moveIn: "2026-12-01", smoker: false,
    salutation: "Frau", age: 23, status: "neu",
    message: "Wir sind drei Studierende und suchen eine gemeinsame Wohnung. Alle haben Bürgschaften.",
  },
  {
    id: "a14", ref: "B-2042", firstName: "Jonas", lastName: "Becker", minutesAgo: 2 * days + 1 * hours,
    persons: 2, household: "2 Erwachsene", netIncome: 3200, employment: "befristet",
    occupation: "Gastronomie, befristet", moveIn: "2026-12-01", smoker: true,
    salutation: "Herr", status: "abgesagt", statusNote: "Absage am 24.10. verschickt",
    message: "Wir sind flexibel beim Einzug und würden die Wohnung gern ansehen.",
  },
];
