// Applicant criteria a landlord can set. Only AGG-permitted attributes exist here;
// custom criteria are checked by agg-check.ts before they're accepted.

export type Employment = "angestellt" | "befristet" | "selbststaendig" | "beamtet" | "ausbildung" | "rente";

export type CustomCriterion = { id: string; text: string };

export type Criteria = {
  income: { enabled: boolean; min: number };
  employment: { enabled: boolean; values: Employment[] };
  persons: { enabled: boolean; max: number };
  pets: { enabled: boolean; value: "ja" | "absprache" | "nein" };
  smoking: { enabled: boolean; value: "ja" | "nein" };
  moveIn: { enabled: boolean; latest: string };
  duration: { enabled: boolean; years: number };
  custom: CustomCriterion[];
};

export const employmentLabels: Record<Employment, string> = {
  angestellt: "Unbefristet angestellt",
  befristet: "Befristet angestellt",
  selbststaendig: "Selbstständig",
  beamtet: "Verbeamtet",
  ausbildung: "Studium oder Ausbildung",
  rente: "Rente oder Pension",
};

export const petLabels = { ja: "Erlaubt", absprache: "Nach Absprache", nein: "Nicht erlaubt" } as const;

export function defaultCriteria(warmRent?: number, availableFrom?: string): Criteria {
  const latest = availableFrom ? addMonths(availableFrom, 2) : "";
  return {
    income: { enabled: true, min: warmRent ? Math.ceil((warmRent * 3) / 100) * 100 : 3000 },
    employment: { enabled: false, values: ["angestellt", "beamtet"] },
    persons: { enabled: false, max: 3 },
    pets: { enabled: true, value: "absprache" },
    smoking: { enabled: true, value: "nein" },
    moveIn: { enabled: Boolean(latest), latest },
    duration: { enabled: false, years: 2 },
    custom: [],
  };
}

function addMonths(iso: string, months: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1 + months, day);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

/** Short human-readable labels for every active criterion, in display order. */
export function criteriaLabels(criteria: Criteria): string[] {
  const labels: string[] = [];
  if (criteria.income.enabled) labels.push(`ab ${euro.format(criteria.income.min)} netto`);
  if (criteria.employment.enabled && criteria.employment.values.length)
    labels.push(criteria.employment.values.map((e) => employmentLabels[e]).join(" oder "));
  if (criteria.persons.enabled) labels.push(`bis ${criteria.persons.max} ${criteria.persons.max === 1 ? "Person" : "Personen"}`);
  if (criteria.pets.enabled)
    labels.push({ ja: "Haustiere erlaubt", absprache: "Haustiere nach Absprache", nein: "Keine Haustiere" }[criteria.pets.value]);
  if (criteria.smoking.enabled) labels.push(criteria.smoking.value === "nein" ? "Nichtraucher" : "Rauchen erlaubt");
  if (criteria.moveIn.enabled && criteria.moveIn.latest) labels.push(`Einzug bis ${formatDate(criteria.moveIn.latest)}`);
  if (criteria.duration.enabled) labels.push(`Mietdauer mind. ${criteria.duration.years} ${criteria.duration.years === 1 ? "Jahr" : "Jahre"}`);
  for (const custom of criteria.custom) labels.push(custom.text);
  return labels;
}
