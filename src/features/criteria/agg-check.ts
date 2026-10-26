// Stand-in for the AI check on custom applicant criteria. Rejects anything that refers to
// a characteristic protected by § 1 AGG, or that the founders' notes mark as irrelevant
// (family planning, party membership). Pattern-based; a real model would also catch paraphrases.

export type CheckOutcome =
  | { allowed: true }
  | { allowed: false; reason: string; ground: string };

const grounds: { ground: string; reason: string; patterns: RegExp[] }[] = [
  {
    ground: "Ethnische Herkunft",
    reason: "bezieht sich auf die ethnische Herkunft oder Nationalität (§ 1 AGG). Auch Sprachanforderungen wie „Muttersprache“ gelten als mittelbare Benachteiligung.",
    patterns: [/herkunft/, /ausländ/, /migration/, /nationalit/, /staatsangehörig/, /\bdeutsch(e|er|en)?\b/, /muttersprach/, /akzent/, /hautfarbe/, /ethni/, /rasse/, /einheimisch/, /\b(türk|arab|afrikan|osteurop|polnisch|russisch|roma|sinti)/],
  },
  {
    ground: "Religion oder Weltanschauung",
    reason: "bezieht sich auf Religion oder Weltanschauung (§ 1 AGG).",
    patterns: [/religi/, /glaube/, /\bchrist/, /muslim/, /islam/, /jüd/, /\bjude/, /kopftuch/, /kirche/, /moschee/, /atheis/, /weltanschau/, /konfession/],
  },
  {
    ground: "Geschlecht",
    reason: "bezieht sich auf das Geschlecht (§ 1 AGG).",
    patterns: [/geschlecht(?!lich)/, /\bfrau(en)?\b/, /\bmann\b/, /\bmänner/, /männlich/, /weiblich/, /\bdivers\b/, /\btrans/, /\bdamen\b/, /\bherren\b/, /\bmädchen/],
  },
  {
    ground: "Sexuelle Identität",
    reason: "bezieht sich auf die sexuelle Identität (§ 1 AGG).",
    patterns: [/schwul/, /lesb/, /homosex/, /queer/, /sexuell/, /gleichgeschlecht/, /hetero/],
  },
  {
    ground: "Alter",
    reason: "bezieht sich auf das Alter (§ 1 AGG).",
    // JS \b ignores umlauts, so words starting with ä/ü use an explicit boundary.
    patterns: [/\balter\b/, /(^|[^a-zäöüß])älter/, /\bjung(e|er|en)?\b/, /senior/, /rentner/, /(^|\s)(unter|über|ab|bis) \d{2} ?(jahre|jährig|j\.)/, /jahre alt/, /jahrgang/, /\d{2}[- ]?jährig/],
  },
  {
    ground: "Behinderung oder Gesundheit",
    reason: "bezieht sich auf eine Behinderung oder den Gesundheitszustand (§ 1 AGG).",
    patterns: [/behinder/, /rollstuhl/, /\bkrank/, /gesund/, /chronisch/, /psych/, /pflegebedürft/],
  },
  {
    ground: "Familienplanung",
    reason: "fragt nach Familienplanung oder Schwangerschaft. Das ist für die Vermietung unerheblich und darf nicht abgefragt werden.",
    patterns: [/familienplan/, /kinderwunsch/, /schwanger/, /nachwuchs/],
  },
  {
    ground: "Politische Haltung",
    reason: "bezieht sich auf Partei- oder Gewerkschaftszugehörigkeit. Das ist für die Vermietung unerheblich.",
    patterns: [/\bpartei/, /politisch/, /gewerkschaft/, /\b(afd|spd|cdu|csu|fdp|grüne|linke)\b/],
  },
];

export function checkCriterion(text: string): CheckOutcome {
  const normalized = text.toLowerCase();
  for (const { ground, reason, patterns } of grounds) {
    if (patterns.some((pattern) => pattern.test(normalized))) return { allowed: false, ground, reason };
  }
  return { allowed: true };
}

/** All protected grounds a text touches, e.g. in an applicant's message. Used to keep such
 * content out of the ranking. */
export function protectedGroundsIn(text: string): string[] {
  const normalized = text.toLowerCase();
  return grounds.filter(({ patterns }) => patterns.some((pattern) => pattern.test(normalized))).map(({ ground }) => ground);
}

export const protectedGrounds = [
  "Ethnische Herkunft",
  "Religion",
  "Geschlecht",
  "Sexuelle Identität",
  "Alter",
  "Behinderung",
];

export const customSuggestions = ["Übernahme der Gartenpflege", "Bereitschaft zur Kehrwoche", "Keine gewerbliche Nutzung"];
