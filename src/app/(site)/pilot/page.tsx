import type { Metadata } from "next";
import { HowItWorks, Pilot } from "@/features/site/home";

export const metadata: Metadata = {
  alternates: { canonical: "/pilot/" },
  title: "Pilotprojekt",
  description: "Vermieten Sie bald neu? Werden Sie Pilotvermieter von vizmo und sprechen Sie direkt mit dem Gründerteam.",
};

// The pilot waitlist as a page of its own, followed by what the pilot looks like in practice.
export default function PilotPage() {
  return (
    <>
      <Pilot asPage />
      <HowItWorks />
    </>
  );
}
