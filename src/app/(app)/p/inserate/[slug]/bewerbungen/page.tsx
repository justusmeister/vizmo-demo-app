import type { Metadata } from "next";
import { ApplicantList } from "@/features/applicants/applicant-list";

export const metadata: Metadata = { title: "Bewerbungen – Gneisenaustraße 41 – vizmo" };

// Static export: the demo has an applicant list for one listing only.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ slug: "gneisenaustrasse-41" }];
}

// Demo screen 2 (landlord): applications sorted by the landlord's criteria.
export default function ApplicationsPage() {
  return <ApplicantList />;
}
