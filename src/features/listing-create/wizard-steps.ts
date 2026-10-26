import { slotsPerWeek, type Draft } from "./draft";

// The six wizard steps and what each still needs. "missing" drives the step status,
// the field errors and the completeness checklist on the review step.

export type StepId = "wohnung" | "miete" | "besichtigung" | "kriterien" | "fotos" | "pruefen";

export const wizardSteps: { id: StepId; title: string; description: string }[] = [
  { id: "wohnung", title: "Wohnung", description: "Adresse, Größe und Ausstattung" },
  { id: "miete", title: "Miete und Vertrag", description: "Kosten, Kaution und Einzug" },
  { id: "besichtigung", title: "Besichtigungen", description: "Zugang, Zeiten und Kaution" },
  { id: "kriterien", title: "Bewerberkriterien", description: "Wonach Bewerbungen sortiert werden" },
  { id: "fotos", title: "Fotos", description: "Für das Inserat und den Zustand" },
  { id: "pruefen", title: "Prüfen und erstellen", description: "Versand, Kosten und Bestätigung" },
];

export function missing(step: StepId, d: Draft): string[] {
  const list: string[] = [];
  switch (step) {
    case "wohnung":
      if (!d.street) list.push("Straße und Hausnummer");
      if (!d.zip || !/^\d{5}$/.test(d.zip)) list.push("Postleitzahl");
      if (!d.city) list.push("Ort");
      if (!d.rooms) list.push("Zimmer");
      if (!d.size) list.push("Wohnfläche");
      if (!d.floor) list.push("Etage");
      break;
    case "miete":
      if (!d.coldRent) list.push("Kaltmiete");
      if (d.utilities == null) list.push("Nebenkosten");
      if (d.deposit == null) list.push("Mietkaution");
      else if (d.coldRent && d.deposit > d.coldRent * 3) list.push("Mietkaution höchstens drei Kaltmieten");
      if (!d.availableFrom) list.push("Frei ab");
      if (!d.leaseType) list.push("Mietdauer");
      else if (d.leaseType === "befristet" && (!d.leaseEnd || (d.availableFrom && d.leaseEnd <= d.availableFrom)))
        list.push("Ende der Befristung");
      break;
    case "besichtigung":
      if (!d.occupancy) list.push("Ist die Wohnung leer?");
      if (d.occupancy === "leer" && !d.buildingAccess) list.push("Zugang zum Haus");
      if (slotsPerWeek(d) === 0) list.push("Besichtigungszeiten");
      if (d.occupancy === "leer" && d.viewingDeposit == null) list.push("Besichtigungskaution");
      break;
    case "kriterien":
      if (!d.criteria) list.push("Kriterien festlegen");
      break;
    case "fotos":
      if (d.photos.length < 3) list.push(`Zustandsfotos (noch ${3 - d.photos.length})`);
      break;
    case "pruefen":
      if (d.occupancy === "leer" && !d.shipTo) list.push("Lieferadresse für das Smartlock");
      if (!d.confirmed) list.push("Bestätigung der Angaben");
      break;
  }
  return list;
}
