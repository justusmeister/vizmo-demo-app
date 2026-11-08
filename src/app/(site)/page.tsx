import type { Metadata } from "next";
import { siteUrl } from "@/config/site-pages";
import { Home } from "@/features/site/home";
import { company } from "@/features/site/site-nav";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Structured data for search engines: who is behind the site and how to reach them.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: company.name,
      url: siteUrl,
      logo: `${siteUrl}/android-chrome-512.png`,
      email: company.email,
      slogan: company.claim,
    },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: company.name, inLanguage: "de-DE", publisher: { "@id": `${siteUrl}/#organization` } },
  ],
};

// govizmo.de homepage.
export default function HomePage() {
  return (
    <>
      {/* Static, trusted object; JSON.stringify output can't break out of the script tag here. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Home />
    </>
  );
}
