import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { applicationCode, getListingByCode, listings } from "@/data/listings";
import { ApplicationForm } from "@/features/application/application-form";

export const dynamicParams = false;
export function generateStaticParams() {
  return listings.filter((listing) => listing.status === "aktiv" && listing.link).map((listing) => ({ code: applicationCode(listing)! }));
}

export async function generateMetadata({ params }: PageProps<"/u/bewerben/[code]">): Promise<Metadata> {
  const { code } = await params;
  const listing = getListingByCode(code);
  return {
    title: listing ? `Bewerben: ${listing.rooms}-Zimmer-Wohnung in ${listing.city} – vizmo` : "Bewerben – vizmo",
    robots: { index: false },
  };
}

// Applicant screen 1: public application page behind app.govizmo.de/u/bewerben/<code>.
export default async function ApplyPage({ params }: PageProps<"/u/bewerben/[code]">) {
  const { code } = await params;
  if (!getListingByCode(code)) notFound();
  return <ApplicationForm code={code} />;
}
