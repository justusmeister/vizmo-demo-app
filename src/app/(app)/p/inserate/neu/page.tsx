import type { Metadata } from "next";
import { ListingWizard } from "@/features/listing-create/wizard";

export const metadata: Metadata = { title: "Neues Inserat – vizmo" };

// Demo screen 1 (landlord): create a listing in a guided six-step wizard.
export default function NewListingPage() {
  return <ListingWizard />;
}
