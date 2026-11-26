"use client";

import { Analytics } from "@vercel/analytics/react";
import { useStatisticsConsent } from "./cookie-consent";

// Vercel Web Analytics for the public website: page views by time, page, referrer, country
// and device, without cookies. It loads only after consent to "Statistik" in the cookie
// banner and unloads again when that consent is withdrawn. The demo (/p, /u) is not tracked.
export function SiteAnalytics() {
  const allowed = useStatisticsConsent();
  return allowed ? <Analytics /> : null;
}
