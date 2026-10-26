import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInvitation, invitations } from "@/data/invitations";
import { BookingPage } from "@/features/booking/booking-page";

export const dynamicParams = false;
export function generateStaticParams() {
  return invitations.map((invitation) => ({ token: invitation.token }));
}

export const metadata: Metadata = { title: "Besichtigung buchen – vizmo", robots: { index: false } };

// Applicant screen 2: personal invitation link to book a viewing slot.
export default async function InvitationPage({ params }: PageProps<"/u/einladung/[token]">) {
  const { token } = await params;
  if (!getInvitation(token)) notFound();
  return <BookingPage token={token} />;
}
