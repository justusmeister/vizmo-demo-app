import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getListing, listings } from "@/data/listings";
import { ListingManage } from "@/features/listing-manage/listing-manage";

export const dynamicParams = false;
export function generateStaticParams() {
  return listings.filter((listing) => listing.status === "aktiv").map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: PageProps<"/p/inserate/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${getListing(slug)?.street ?? "Inserat"} – vizmo` };
}

// Landlord: manage one listing (viewing slots, criteria, end listing).
export default async function ListingPage({ params }: PageProps<"/p/inserate/[slug]">) {
  const { slug } = await params;
  const listing = getListing(slug);
  if (!listing) notFound();
  return <ListingManage slug={listing.slug} />;
}
