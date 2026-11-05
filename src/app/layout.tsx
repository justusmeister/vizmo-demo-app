import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

// Brand fonts per Markenhandbuch: Poppins Bold for headings, Inter for UI and body text.
const poppins = Poppins({
  variable: "--font-poppins",
  weight: "700",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.govizmo.de"),
  title: { default: "vizmo: Besichtigungen, die sich selbst organisieren", template: "%s | vizmo" },
  description:
    "vizmo organisiert Wohnungsbesichtigungen für private Vermieter: Bewerbungen sortiert nach Ihren Kriterien, Identitätsprüfung und Besichtigung per Smartlock, ohne jeden Termin selbst abzustimmen.",
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "vizmo",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "vizmo: Besichtigungen, die sich selbst organisieren." }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${poppins.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
