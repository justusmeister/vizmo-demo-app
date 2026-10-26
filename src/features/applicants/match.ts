import { protectedGroundsIn } from "@/features/criteria/agg-check";
import { employmentLabels, listing, type Applicant } from "./data";

// Sorting score against the landlord's criteria. Criteria only rank applications,
// nobody is excluded. Only AGG-permitted attributes are evaluated.

export type CheckResult = "met" | "clarify" | "unmet";
export type Check = { label: string; value: string; result: CheckResult; note?: string; fromMessage?: boolean };

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const ratio = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1, minimumFractionDigits: 1 });

export const formatEuro = (value: number) => euro.format(value);
export const rentRatio = (applicant: Applicant) => ratio.format(applicant.netIncome / listing.warmRent);

export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

export function checks(applicant: Applicant): Check[] {
  const c = listing.criteria;
  const list: Check[] = [];
  if (c.income.enabled) {
    const met = applicant.netIncome >= c.income.min;
    list.push({
      label: "Einkommen",
      value: `${formatEuro(applicant.netIncome)} netto, ${rentRatio(applicant)}× Warmmiete`,
      result: met ? "met" : "unmet",
      note: met ? undefined : `Unter Ihrer Vorgabe von ${formatEuro(c.income.min)}`,
    });
  }
  if (c.employment.enabled && c.employment.values.length) {
    const met = c.employment.values.includes(applicant.employment);
    list.push({
      label: "Beschäftigung",
      value: employmentLabels[applicant.employment],
      result: met ? "met" : "unmet",
      note: met ? undefined : "Nicht unter Ihren bevorzugten Beschäftigungsarten",
    });
  }
  if (c.persons.enabled) {
    const met = applicant.persons <= c.persons.max;
    list.push({ label: "Haushalt", value: applicant.household, result: met ? "met" : "unmet", note: met ? undefined : `Mehr als ${c.persons.max} Personen` });
  }
  if (c.pets.enabled) {
    const result: CheckResult = !applicant.pet ? "met" : c.pets.value === "ja" ? "met" : c.pets.value === "absprache" ? "clarify" : "unmet";
    list.push({
      label: "Haustiere",
      value: applicant.pet ?? "Keine",
      result,
      note: result === "clarify" ? "Nach Absprache. Vorab per Nachricht oder Videokonferenz klären, die Besichtigung läuft ohne Sie" : result === "unmet" ? "Haustiere sind nicht erlaubt" : undefined,
    });
  }
  if (c.smoking.enabled) {
    const met = c.smoking.value === "ja" || !applicant.smoker;
    list.push({
      label: "Rauchen",
      value: applicant.smoker ? "Raucht" : "Nichtraucher",
      result: met ? "met" : "unmet",
      note: met ? undefined : "Rauchen ist in der Wohnung nicht erlaubt",
    });
  }
  if (c.moveIn.enabled && c.moveIn.latest) {
    const met = applicant.moveIn <= c.moveIn.latest;
    list.push({
      label: "Einzug",
      value: `ab ${formatDate(applicant.moveIn)}`,
      result: met ? "met" : "unmet",
      note: met ? undefined : `Später als Ihr Wunschtermin ${formatDate(c.moveIn.latest)}`,
    });
  }
  for (const custom of c.custom) {
    list.push({ label: custom.text, value: "Offen", result: "clarify", note: "Noch keine Angabe. Wird bei neuen Bewerbungen im Formular abgefragt" });
  }

  // Extra messages can satisfy a criterion (e.g. a guarantee covers the income), but only
  // if the message contains nothing protected by the AGG. Such content is ignored entirely.
  for (const message of applicant.extraMessages ?? []) {
    if (!message.effect || protectedGroundsIn(message.text).length) continue;
    const check = list.find((c) => c.label === message.effect!.criterion);
    if (!check) continue;
    check.result = "met";
    check.note = message.effect.note;
    check.fromMessage = true;
  }
  return list;
}

/** Number of criteria improved or confirmed by the applicant's extra messages. */
export function messageBoosts(applicant: Applicant) {
  return checks(applicant).filter((check) => check.fromMessage).length;
}

export function score(applicant: Applicant) {
  return checks(applicant).reduce((sum, check) => sum + (check.result === "met" ? 1 : check.result === "clarify" ? 0.5 : 0), 0);
}

export function formatScore(value: number) {
  return String(value).replace(".", ",");
}

export function appliedLabel(minutesAgo: number, now = new Date()) {
  const date = new Date(now.getTime() - minutesAgo * 60_000);
  const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (date.getTime() >= startOfToday) return minutesAgo < 60 ? `vor ${minutesAgo} Min.` : `Heute, ${time}`;
  if (date.getTime() >= startOfToday - 86_400_000) return `Gestern, ${time}`;
  const weekday = new Intl.DateTimeFormat("de-DE", { weekday: "short" }).format(date).replace(".", "");
  return `${weekday}, ${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.`;
}
