import { isEmail, isPhone, type Application } from "./draft";

// Application steps and what each still needs. Required: name, e-mail (the only reliable
// way to reach the applicant) and every question behind one of the landlord's criteria.

export type StepId = "kontakt" | "haushalt" | "beruf" | "vorstellung" | "absenden";

export const applicationSteps: { id: StepId; title: string; short: string; description: string }[] = [
  { id: "kontakt", title: "Ihre Kontaktdaten", short: "Kontakt", description: "Damit der Vermieter Sie erreichen kann." },
  { id: "haushalt", title: "Haushalt und Einzug", short: "Haushalt", description: "Wer einzieht und ab wann." },
  { id: "beruf", title: "Beruf und Einkommen", short: "Einkommen", description: "Freiwillig nachweisbar, nur für diese Bewerbung." },
  { id: "vorstellung", title: "Über Sie", short: "Über Sie", description: "Stellen Sie sich in Ihren eigenen Worten vor." },
  { id: "absenden", title: "Prüfen und absenden", short: "Absenden", description: "Noch einmal alles im Blick." },
];

/** Missing items per step, keyed by field so the form can show the error next to it. */
export function missing(step: StepId, a: Application): Record<string, string> {
  const m: Record<string, string> = {};
  switch (step) {
    case "kontakt":
      if (!a.firstName.trim()) m.firstName = "Bitte Vornamen angeben";
      if (!a.lastName.trim()) m.lastName = "Bitte Nachnamen angeben";
      if (!a.email.trim()) m.email = "Bitte E-Mail-Adresse angeben";
      else if (!isEmail(a.email)) m.email = "Bitte eine gültige E-Mail-Adresse angeben, z. B. name@beispiel.de";
      if ((a.contact.includes("anruf") || a.contact.includes("sms")) && !isPhone(a.phone))
        m.phone = "Für Anruf oder SMS brauchen wir Ihre Telefonnummer";
      else if (a.phone.trim() && !isPhone(a.phone)) m.phone = "Bitte eine gültige Telefonnummer angeben";
      break;
    case "haushalt":
      if (a.adults < 1) m.adults = "Mindestens eine erwachsene Person";
      if (!a.moveIn) m.moveIn = "Bitte Datum wählen";
      if (!a.pets) m.pets = "Bitte auswählen";
      else if (a.pets === "ja" && !a.petDescription.trim()) m.petDescription = "Welches Tier, zum Beispiel „Katze“";
      if (!a.smoker) m.smoker = "Bitte auswählen";
      break;
    case "beruf":
      if (!a.employment) m.employment = "Bitte auswählen";
      if (a.netIncome == null || Number.isNaN(a.netIncome)) m.netIncome = "Bitte angeben";
      break;
    case "vorstellung":
      break;
    case "absenden":
      if (!a.privacy) m.privacy = "Bitte zustimmen";
      if (!a.truthful) m.truthful = "Bitte bestätigen";
      break;
  }
  return m;
}
