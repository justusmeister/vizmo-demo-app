"use client";

import { BellRing, CalendarPlus, DoorOpen, LockKeyhole, Mail, MapPin, ShieldCheck } from "lucide-react";
import { landlord } from "@/config/account";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Invitation } from "@/data/invitations";
import type { Listing } from "@/data/listings";
import { downloadIcs } from "./ics";
import type { PickedSlot } from "./slot-picker";

type BookingSuccessProps = { invitation: Invitation; listing: Listing; slot: PickedSlot; paymentLabel: string; reference: string };

export function BookingSuccess({ invitation, listing, slot, paymentLabel, reference }: BookingSuccessProps) {
  const { applicant } = invitation;
  const address = `${listing.street}, ${listing.unit}, ${listing.zip} ${listing.city}`;
  const greeting = applicant.salutation === "Keine Angabe" ? `${applicant.firstName} ${applicant.lastName}` : `${applicant.salutation} ${applicant.lastName}`;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 py-6 md:py-10">
      <div className="flex flex-col items-start gap-3">
        <Badge tone="success">Besichtigung gebucht</Badge>
        <h1 className="text-h1">Alles erledigt, {greeting}</h1>
        <p className="text-slate">
          Ihr Termin ist verbindlich gebucht. Die Bestätigung haben wir an <span className="font-medium text-night">{applicant.email}</span> geschickt.
        </p>
      </div>

      <Card padding="lg" className="flex flex-col gap-4">
        <div>
          <p className="text-small text-slate">Ihr Termin</p>
          <p className="font-display text-h2 font-bold">{slot.label}</p>
        </div>
        <div className="flex items-start gap-3 rounded-card bg-surface p-3">
          <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-deep-blue" />
          <div>
            <p className="font-medium">{address}</p>
            <p className="text-small text-slate">Die genaue Adresse sehen Sie ab jetzt, weil Ihr Termin feststeht.</p>
          </div>
        </div>
        <Button
          variant="secondary"
          icon={<CalendarPlus aria-hidden className="size-4" />}
          onClick={() =>
            downloadIcs({
              iso: slot.iso,
              start: slot.time,
              end: slot.end,
              title: `Wohnungsbesichtigung ${listing.street}`,
              location: address,
              description: `Besichtigung über vizmo. Den Öffnungslink erhalten Sie 15 Minuten vorher per E-Mail und SMS. Buchung ${reference}.`,
            })
          }
          className="w-full sm:w-auto"
        >
          Zum Kalender hinzufügen
        </Button>
      </Card>

      <Card padding="lg" className="flex flex-col gap-4">
        <h2 className="text-h3">So kommen Sie hinein</h2>
        <ol className="flex flex-col gap-4">
          <li className="flex gap-3">
            <BellRing aria-hidden className="mt-0.5 size-5 shrink-0 text-deep-blue" />
            <div>
              <p className="font-medium">Haustür</p>
              <p className="text-slate">Klingeln Sie bei „{landlord.lastName}“. In Ihrem Zeitfenster öffnet sich die Haustür automatisch.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <LockKeyhole aria-hidden className="mt-0.5 size-5 shrink-0 text-deep-blue" />
            <div>
              <p className="font-medium">Wohnungstür im 2. OG</p>
              <p className="text-slate">15 Minuten vor Beginn erhalten Sie Ihren persönlichen Öffnungslink per E-Mail und SMS. Ein Tipp darauf öffnet das Smartlock.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <DoorOpen aria-hidden className="mt-0.5 size-5 shrink-0 text-deep-blue" />
            <div>
              <p className="font-medium">Zum Schluss</p>
              <p className="text-slate">Drei Fotos in der App aufnehmen, Tür zuziehen. Das Schloss verriegelt von selbst.</p>
            </div>
          </li>
        </ol>
      </Card>

      <Card className="flex items-start gap-3">
        <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-deep-blue" />
        <div>
          <p className="font-medium">Identität bestätigt, {invitation.deposit} € vorgemerkt</p>
          <p className="text-slate">Über {paymentLabel}. Ohne Auffälligkeiten geben wir den Betrag direkt nach der Besichtigung frei.</p>
        </div>
      </Card>

      <section aria-label="Bestätigungs-E-Mail" className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-small font-medium text-slate">
          <Mail aria-hidden className="size-4" />
          Gerade verschickt
        </p>
        <div className="overflow-hidden rounded-card border border-line bg-white">
          <div className="border-b border-line bg-surface px-4 py-3 text-small">
            <p className="text-slate">
              Von: <span className="text-night">vizmo &lt;termine@govizmo.de&gt;</span>
            </p>
            <p className="text-slate">
              An: <span className="text-night">{applicant.email}</span>
            </p>
            <p className="mt-1 font-medium text-night">Ihre Besichtigung ist bestätigt: {slot.label}</p>
          </div>
          <div className="flex flex-col gap-3 px-4 py-4">
            <p>Guten Tag {greeting},</p>
            <p>
              Ihre Besichtigung der Wohnung {listing.street}, {listing.unit} ist gebucht. Ihre Identität ist bestätigt, und Sie haben
              die Regeln für die Besichtigung akzeptiert.
            </p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-card bg-surface p-3 text-small">
              <dt className="text-slate">Termin</dt>
              <dd className="font-medium">{slot.label}</dd>
              <dt className="text-slate">Adresse</dt>
              <dd className="font-medium">{address}</dd>
              <dt className="text-slate">Kaution</dt>
              <dd className="font-medium">{invitation.deposit} € vorgemerkt, nicht abgebucht</dd>
              <dt className="text-slate">Buchung</dt>
              <dd className="font-medium tabular-nums">{reference}</dd>
            </dl>
            <p>Den Öffnungslink schicken wir Ihnen 15 Minuten vor Beginn. Absagen oder verschieben können Sie bis 3 Stunden vorher über diese E-Mail.</p>
            <p className="text-slate">Ihr vizmo-Team</p>
          </div>
        </div>
      </section>
    </div>
  );
}
