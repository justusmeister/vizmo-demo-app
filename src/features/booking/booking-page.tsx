"use client";

import { Check, CreditCard, ScanFace, Smartphone, Wallet } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { landlord } from "@/config/account";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getInvitation, type Invitation } from "@/data/invitations";
import { getListing } from "@/data/listings";
import { ListingFacts } from "@/features/application/listing-summary";
import { cx } from "@/lib/cx";
import { useMounted } from "@/lib/use-mounted";
import { BookingSuccess } from "./booking-success";
import { Documents, docs, type DocId } from "./documents";
import { IdentityCheck, type IdentityResult } from "./identity-check";
import { availableDays, SlotPicker, type PickedSlot } from "./slot-picker";

// Applicant screen 2: personal invitation link. Pick a slot, verify identity (Didit),
// accept the rules, pre-authorize the viewing deposit, then book.

type StepKey = "slot" | "identity" | "documents" | "payment";

const payments = [
  { id: "applepay", label: "Apple Pay", icon: Smartphone },
  { id: "googlepay", label: "Google Pay", icon: Wallet },
  { id: "karte", label: "Kredit- oder Debitkarte", icon: CreditCard },
] as const;

type PaymentId = (typeof payments)[number]["id"];

const pad = (n: number) => String(n).padStart(2, "0");

function formatValidUntil(invitation: Invitation, now: Date) {
  const date = new Date(now.getTime() + (invitation.validHours * 60 - invitation.invitedMinutesAgo) * 60_000);
  const weekday = new Intl.DateTimeFormat("de-DE", { weekday: "short" }).format(date).replace(".", "");
  return `${weekday}, ${pad(date.getDate())}.${pad(date.getMonth() + 1)}., ${pad(date.getHours())}:${pad(date.getMinutes())} Uhr`;
}

function StepCard({
  id,
  number,
  title,
  done,
  summary,
  highlight,
  children,
}: {
  id: StepKey;
  number: number;
  title: string;
  done: boolean;
  summary?: ReactNode;
  highlight: boolean;
  children: ReactNode;
}) {
  return (
    <section id={`schritt-${id}`} className="scroll-mt-20">
      <Card padding="none" className={cx("transition-shadow", highlight && "ring-2 ring-error")}>
        <header className="flex items-center gap-3 border-b border-line px-4 py-3.5 md:px-5">
          <span
            aria-hidden
            className={cx(
              "flex size-7 shrink-0 items-center justify-center rounded-full text-small font-medium",
              done ? "bg-night text-white" : "border-2 border-line text-night",
            )}
          >
            {done ? <Check className="size-4" strokeWidth={3} /> : number}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-h3">{title}</h2>
            {summary && <p className="truncate text-small text-slate">{summary}</p>}
          </div>
          {done && <span className="text-small font-medium text-night">Erledigt</span>}
        </header>
        <div className="px-4 py-4 md:px-5">{children}</div>
      </Card>
    </section>
  );
}

export function BookingPage({ token }: { token: string }) {
  const invitation = getInvitation(token)!;
  const listing = getListing(invitation.listingSlug)!;
  const mounted = useMounted();
  const [slot, setSlot] = useState<PickedSlot | null>(null);
  const [reservedUntil, setReservedUntil] = useState<string | null>(null);
  const [identity, setIdentity] = useState<IdentityResult | null>(null);
  const [identityOpen, setIdentityOpen] = useState(false);
  const [accepted, setAccepted] = useState<Set<DocId>>(new Set());
  const [payment, setPayment] = useState<PaymentId | null>(null);
  const [highlight, setHighlight] = useState<StepKey | null>(null);
  const [booking, setBooking] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const { applicant } = invitation;
  const name = `${applicant.firstName} ${applicant.lastName}`;
  const greeting = applicant.salutation === "Keine Angabe" ? name : `${applicant.salutation} ${applicant.lastName}`;
  const done: Record<StepKey, boolean> = {
    slot: slot != null,
    identity: identity != null,
    documents: accepted.size === docs.length,
    payment: payment != null,
  };
  const open = (Object.keys(done) as StepKey[]).filter((key) => !done[key]);

  function pickSlot(next: PickedSlot) {
    setSlot(next);
    const until = new Date(Date.now() + 15 * 60_000);
    setReservedUntil(`${pad(until.getHours())}:${pad(until.getMinutes())}`);
    if (highlight === "slot") setHighlight(null);
  }

  function toggleDoc(id: DocId) {
    setAccepted((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function book() {
    if (open.length) {
      setHighlight(open[0]);
      document.getElementById(`schritt-${open[0]}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setBooking(true);
    timer.current = window.setTimeout(() => {
      setReference(`V-${listing.slug.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 89999)}`);
      setBooking(false);
      window.scrollTo({ top: 0 });
    }, 1500);
  }

  if (reference && slot && payment) {
    return (
      <BookingSuccess
        invitation={invitation}
        listing={listing}
        slot={slot}
        paymentLabel={payments.find((p) => p.id === payment)!.label}
        reference={reference}
      />
    );
  }

  const validUntil = mounted ? formatValidUntil(invitation, new Date()) : null;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 pt-5 pb-32 md:pt-8 md:pb-10">
      <div className="flex flex-col items-start gap-2">
        <Badge>Persönliche Einladung</Badge>
        <h1 className="text-h1">Ihre Besichtigung buchen</h1>
        <p className="text-slate">
          Guten Tag {greeting}, {landlord.firstName} {landlord.lastName} hat Sie nach Ihrer Bewerbung zur Besichtigung eingeladen.
          {validUntil && <> Die Einladung gilt bis {validUntil}.</>}
        </p>
      </div>

      <Card>
        <ListingFacts listing={listing} />
      </Card>

      <StepCard id="slot" number={1} title="Termin wählen" done={done.slot} summary={slot?.label} highlight={highlight === "slot"}>
        {mounted ? (
          <SlotPicker days={availableDays(listing, new Date())} duration={listing.viewing.duration} value={slot} onChange={pickSlot} />
        ) : (
          <div className="h-40" />
        )}
        {slot && reservedUntil && (
          <p className="mt-3 rounded-card bg-mist px-3 py-2 text-small font-medium" aria-live="polite">
            {slot.label} ist bis {reservedUntil} Uhr für Sie reserviert.
          </p>
        )}
      </StepCard>

      <StepCard
        id="identity"
        number={2}
        title="Identität bestätigen"
        done={done.identity}
        summary={identity ? `Bestätigt per ${identity.document === "ausweis" ? "Personalausweis" : "Reisepass"}` : "Mit Didit, etwa 2 Minuten"}
        highlight={highlight === "identity"}
      >
        {identity ? (
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success text-white">
              <ScanFace aria-hidden className="size-5" />
            </span>
            <div>
              <p className="font-medium">{name}, Identität bestätigt</p>
              <p className="text-small text-slate">Geprüft durch Didit</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p>
              Weil Sie die Wohnung allein besichtigen, prüfen wir einmalig Ihre Identität. Sie brauchen Ihren Personalausweis oder
              Reisepass und etwa zwei Minuten.
            </p>
            <ul className="flex flex-col gap-1 text-small text-slate">
              <li>Ausweis mit der Handykamera fotografieren</li>
              <li>Kurzes Selfie-Video zum Abgleich</li>
              <li>Für Sie kostenlos, Ausweisdaten bleiben bei Didit</li>
            </ul>
            <Button onClick={() => setIdentityOpen(true)} icon={<ScanFace aria-hidden className="size-4" />} className="w-full sm:w-auto">
              Mit Didit bestätigen
            </Button>
          </div>
        )}
      </StepCard>

      <StepCard
        id="documents"
        number={3}
        title="Regeln und Bestätigungen"
        done={done.documents}
        summary={`${accepted.size} von ${docs.length} bestätigt`}
        highlight={highlight === "documents"}
      >
        <p className="mb-3 text-slate">Bitte lesen und bestätigen Sie jedes Dokument einzeln.</p>
        <Documents
          accepted={accepted}
          onToggle={(id) => {
            toggleDoc(id);
            if (highlight === "documents") setHighlight(null);
          }}
          context={{
            address: `${listing.street}, ${listing.zip} ${listing.city}`,
            deposit: invitation.deposit,
            duration: listing.viewing.duration,
            landlord: `${landlord.firstName} ${landlord.lastName}`,
          }}
        />
      </StepCard>

      <StepCard
        id="payment"
        number={4}
        title={`${invitation.deposit} € Kaution vormerken`}
        done={done.payment}
        summary={payment ? payments.find((p) => p.id === payment)!.label : "Wird nicht abgebucht"}
        highlight={highlight === "payment"}
      >
        <p className="mb-3">
          Der Betrag wird nur auf Ihrer Karte reserviert und nach der Besichtigung wieder freigegeben, spätestens nach 7 Tagen.
        </p>
        <div className="flex flex-col gap-2">
          {payments.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={payment === id}
              onClick={() => {
                setPayment(id);
                if (highlight === "payment") setHighlight(null);
              }}
              className={cx(
                "flex min-h-12 items-center gap-3 rounded-card border px-4 py-3 text-left font-medium transition-colors",
                payment === id ? "border-blue bg-mist" : "border-line bg-white hover:border-gray",
              )}
            >
              <Icon aria-hidden className="size-5 shrink-0 text-deep-blue" />
              {label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-small text-slate">Sichere Abwicklung über Stripe. vizmo speichert keine Kartendaten.</p>
      </StepCard>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:static md:border-0 md:bg-transparent md:p-0">
        <div className="mx-auto flex max-w-xl flex-col gap-2">
          <p className={cx("text-center text-small font-medium", open.length ? "text-slate" : "text-night")} aria-live="polite">
            {open.length ? `Noch ${open.length} ${open.length === 1 ? "Schritt" : "Schritte"} offen` : "Alles bereit"}
          </p>
          <Button onClick={book} loading={booking} className="h-12 w-full">
            {booking ? "Termin wird gebucht …" : "Besichtigung verbindlich buchen"}
          </Button>
        </div>
      </div>

      <IdentityCheck
        open={identityOpen}
        name={name}
        onClose={() => setIdentityOpen(false)}
        onVerified={(result) => {
          setIdentity(result);
          if (highlight === "identity") setHighlight(null);
        }}
      />
    </div>
  );
}
