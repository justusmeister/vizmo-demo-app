import type { Metadata } from "next";
import { ListingCreator } from "@/features/listing-create/listing-creator";

export const metadata: Metadata = { title: "Neues Inserat – vizmo" };

// Demo screen 1 (landlord): create a listing via the guided assistant.
export default function NewListingPage() {
  return <ListingCreator />;
}
