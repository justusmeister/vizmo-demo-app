import type { Metadata } from "next";
import { Overview } from "@/features/overview/overview";

export const metadata: Metadata = { title: "Meine Inserate" };

// Landlord home: open listings and their next steps.
export default function Home() {
  return <Overview />;
}
