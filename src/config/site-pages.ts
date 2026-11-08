// Public pages of govizmo.de, used for the sitemap. The demo (/p, /u) is not listed.
export const siteUrl = "https://govizmo.de";

export const sitePages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/so-funktioniert/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/preise/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pilot/", priority: 0.8, changeFrequency: "monthly" },
  { path: "/faq/", priority: 0.7, changeFrequency: "monthly" },
  { path: "/vision/", priority: 0.6, changeFrequency: "monthly" },
  { path: "/kontakt/", priority: 0.6, changeFrequency: "yearly" },
  { path: "/impressum/", priority: 0.2, changeFrequency: "yearly" },
  { path: "/datenschutz/", priority: 0.2, changeFrequency: "yearly" },
];
