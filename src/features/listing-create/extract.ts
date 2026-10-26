import type { Draft } from "./draft";

// Stand-in for the AI extraction: pulls structured fields out of a free-text listing
// description with German-language patterns. Anything not found is asked for later.

export type Extracted = Partial<Pick<Draft, "street" | "zip" | "city" | "rooms" | "size" | "floor" | "coldRent" | "utilities" | "deposit" | "availableFrom">>;

const amount = String.raw`(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{1,2}))?`;

function toNumber(whole: string, fraction?: string) {
  return Number(`${whole.replace(/\./g, "")}.${fraction ?? "0"}`);
}

function matchAmount(text: string, labels: string) {
  // "890 € kalt" first, so "kalt zzgl. NK 180 €" doesn't read the utilities as rent.
  const after = new RegExp(String.raw`${amount}\s*(?:€|EUR|Euro)\s*(?:${labels})`, "i").exec(text);
  if (after) return toNumber(after[1], after[2]);
  const before = new RegExp(String.raw`(?:${labels})\D{0,15}?${amount}`, "i").exec(text);
  return before ? toNumber(before[1], before[2]) : undefined;
}

function isoToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function extractListing(text: string): Extracted {
  const result: Extracted = {};

  const street = /([A-ZÄÖÜ][\wäöüß.-]*(?:[Ss]traße|[Ss]trasse|[Ss]tr\.|[Ww]eg|[Aa]llee|[Pp]latz|[Rr]ing|[Gg]asse|[Dd]amm|[Uu]fer|[Cc]haussee|[Ss]teig))\s+(\d+\s?[a-zA-Z]?)\b/.exec(text);
  if (street) result.street = `${street[1]} ${street[2].replace(/\s/g, "")}`;

  const city = /\b(\d{5})\s+([A-ZÄÖÜ][a-zäöüß]+(?:[ -][A-ZÄÖÜ][a-zäöüß]+)*)/.exec(text);
  if (city) {
    result.zip = city[1];
    result.city = city[2];
  }

  const rooms = /(\d+(?:[.,]5)?)\s*-?\s*(?:Zimmer|Zi\.)/i.exec(text);
  if (rooms) result.rooms = Number(rooms[1].replace(",", "."));

  const size = /(\d+(?:[.,]\d+)?)\s*(?:m²|m2|qm|Quadratmeter)/i.exec(text);
  if (size) result.size = Number(size[1].replace(",", "."));

  const floor = /(\d)\.\s*(?:OG|Obergeschoss|Etage|Stock)/i.exec(text);
  if (floor) result.floor = `${floor[1]}. OG`;
  else if (/\b(?:EG|Erdgeschoss)\b/i.test(text)) result.floor = "EG";
  else if (/\b(?:DG|Dachgeschoss)\b/i.test(text)) result.floor = "DG";

  result.coldRent = matchAmount(text, "Kaltmiete|kalt");
  result.utilities = matchAmount(text, "Nebenkosten|Betriebskosten|NK");
  result.deposit = matchAmount(text, "Mietkaution|Kaution");

  const date = /(?:ab|frei ab|verfügbar ab|bezugsfrei ab)\s*(?:dem\s*)?(\d{1,2})\.(\d{1,2})\.(\d{4})/i.exec(text);
  if (date) result.availableFrom = `${date[3]}-${date[2].padStart(2, "0")}-${date[1].padStart(2, "0")}`;
  else if (/\b(?:ab sofort|sofort frei|sofort verfügbar)\b/i.test(text)) result.availableFrom = isoToday();

  for (const key of Object.keys(result) as (keyof Extracted)[]) {
    if (result[key] === undefined) delete result[key];
  }
  return result;
}

export const exampleDescription =
  "Helle 3-Zimmer-Altbauwohnung im 2. OG, Gneisenaustraße 41, 10961 Berlin-Kreuzberg. 78 m², Kaltmiete 1.050 €, Nebenkosten 220 €, Kaution 3.150 €. Frei ab 01.12.2026. Balkon zum ruhigen Hof, Einbauküche, Tageslichtbad mit Wanne, Dielenböden.";
