// Navigation of the public website (govizmo.de). The demo app lives under /p and /u.

export const siteNav = [
  { href: "/so-funktioniert", label: "So funktioniert’s" },
  { href: "/preise", label: "Preise" },
  { href: "/vision", label: "Vision" },
  { href: "/faq", label: "FAQ" },
];

export const footerNav = [
  {
    title: "Produkt",
    links: [
      { href: "/so-funktioniert", label: "So funktioniert’s" },
      { href: "/so-funktioniert#sicherheit", label: "Datenschutz und Sicherheit" },
      { href: "/preise", label: "Preise" },
      { href: "/faq", label: "Häufige Fragen" },
      { href: "/pilot", label: "Pilotprojekt" },
    ],
  },
  {
    title: "Unternehmen",
    links: [
      { href: "/vision", label: "Vision" },
          { href: "/kontakt", label: "Kontakt" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { href: "/impressum", label: "Impressum" },
      { href: "/datenschutz", label: "Datenschutz" },
    ],
  },
];

export const company = {
  name: "vizmo",
  // Pre-founding phase: no company registered yet. The legal pages name Justus Meister as
  // the responsible person. The address is an interim one (Ursulaschule Osnabrück).
  responsible: "Justus Meister",
  street: "Kleine Domsfreiheit 11–18",
  city: "49074 Osnabrück",
  email: "kontakt@govizmo.de",
  web: "www.govizmo.de",
  claim: "Besichtigungen, die sich selbst organisieren.",
};
