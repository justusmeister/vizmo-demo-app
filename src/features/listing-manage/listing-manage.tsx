"use client";

import { CalendarDays, ChevronRight, ExternalLink, LockKeyhole, Package, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useState, useSyncExternalStore } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ChoiceChip, ChoiceGroup } from "@/components/ui/choice-chip";
import { CopyField } from "@/components/ui/copy-field";
import { Dialog } from "@/components/ui/dialog";
import { Segmented } from "@/components/ui/segmented";
import { Toast } from "@/components/ui/toast";
import { applicationPath, getListing, warmRent } from "@/data/listings";
import { CriteriaEditor } from "@/features/criteria/criteria-editor";
import { criteriaLabels, type Criteria } from "@/features/criteria/types";
import { useMounted } from "@/lib/use-mounted";
import { SlotEditor } from "./slot-editor";
import { bookingDate, formatDayLabel, type Pattern } from "./slots";

// Landlord: manage an active listing. Tabs are driven by the URL hash so the
// overview can link straight to "#slots" or "#kriterien".

type Tab = "ueberblick" | "slots" | "kriterien";
const tabs: Tab[] = ["ueberblick", "slots", "kriterien"];

function subscribeHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

function useHashTab(): [Tab, (tab: Tab) => void] {
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash.slice(1), () => "");
  const tab = (tabs as string[]).includes(hash) ? (hash as Tab) : "ueberblick";
  const setTab = useCallback((next: Tab) => {
    history.replaceState(null, "", next === "ueberblick" ? window.location.pathname : `#${next}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, []);
  return [tab, setTab];
}

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const endReasons = ["Die Wohnung ist vermietet", "Ich vermiete die Wohnung doch nicht", "Ich lege das Inserat neu an", "Anderer Grund"];

export function ListingManage({ slug }: { slug: string }) {
  const listing = getListing(slug)!;
  const [tab, setTab] = useHashTab();
  const mounted = useMounted();
  const [savedPattern, setSavedPattern] = useState<Pattern>({ ...listing.viewing });
  const [pattern, setPattern] = useState<Pattern>({ ...listing.viewing });
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [slotsDirty, setSlotsDirty] = useState(false);
  const [criteria, setCriteria] = useState<Criteria>(listing.criteria);
  const [savedCriteria, setSavedCriteria] = useState<Criteria>(listing.criteria);
  const [ending, setEnding] = useState(false);
  const [endReason, setEndReason] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  const title = `${listing.street}, ${listing.unit}`;
  const criteriaDirty = JSON.stringify(criteria) !== JSON.stringify(savedCriteria);
  const affected = listing.applications.invited + listing.applications.booked;
  const now = new Date();
  const upcoming = mounted
    ? listing.bookings
        .map((booking) => ({ booking, date: bookingDate(booking, now) }))
        .sort((a, b) => a.date.getTime() - b.date.getTime())
    : [];

  function saveSlots() {
    setSavedPattern(pattern);
    setSlotsDirty(false);
    setToast("Besichtigungszeiten gespeichert. Gebuchte Termine bleiben bestehen.");
  }

  function saveCriteria() {
    setSavedCriteria(criteria);
    setToast(`Kriterien gespeichert. ${listing.applications.total} Bewerbungen wurden neu sortiert.`);
  }

  function endListing() {
    setEnded(true);
    setEnding(false);
    setToast("Inserat beendet. Alle Beteiligten wurden informiert.");
  }

  return (
    <>
      <nav aria-label="Brotkrumen" className="mb-2 text-small text-slate">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-night hover:underline">
              Meine Inserate
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5" />
          </li>
          <li aria-current="page" className="text-night">
            {title}
          </li>
        </ol>
      </nav>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-h1">{title}</h1>
            {ended ? <Badge tone="error">Beendet</Badge> : <Badge>Online</Badge>}
          </div>
          <p className="mt-1 text-slate">
            {listing.zip} {listing.city}, {listing.rooms} Zimmer, {listing.size} m², {euro.format(warmRent(listing))} warm
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!ended && (
            <Button variant="secondary" onClick={() => setEnding(true)}>
              Inserat beenden
            </Button>
          )}
          {listing.hasApplicantList && (
            <ButtonLink href={`/p/inserate/${listing.slug}/bewerbungen`} icon={<Users aria-hidden className="size-4" />}>
              Bewerbungen ({listing.applications.total})
            </ButtonLink>
          )}
        </div>
      </header>

      {ended && (
        <Card tone="mist" className="mb-6">
          <p className="font-medium">Dieses Inserat ist beendet{endReason ? `: ${endReason}` : ""}.</p>
          <p className="mt-0.5 text-slate">
            Der Bewerbungslink ist deaktiviert und die Smartlock-Zugänge sind gelöscht. Einstellungen können nicht mehr
            geändert werden.
          </p>
        </Card>
      )}

      <Segmented
        label="Bereich"
        value={tab}
        onChange={setTab}
        className="mb-6"
        options={[
          { value: "ueberblick", label: "Überblick" },
          { value: "slots", label: "Besichtigungsslots" },
          { value: "kriterien", label: "Anforderungen" },
        ]}
      />

      {tab === "ueberblick" && (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex min-w-0 flex-col gap-6">
            <Card padding="lg" className="flex flex-col gap-4">
              <CardHeader title="Nächste Besichtigungen" actions={<Button size="sm" variant="secondary" onClick={() => setTab("slots")}>Slots bearbeiten</Button>} />
              {!mounted ? null : upcoming.length ? (
                <ul className="divide-y divide-line rounded-card border border-line">
                  {upcoming.map(({ booking, date }) => (
                    <li key={`${booking.weekday}-${booking.time}`} className="flex items-center gap-3 px-4 py-3">
                      <CalendarDays aria-hidden className="size-5 shrink-0 text-deep-blue" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{booking.name}</p>
                        <p className="text-small text-slate">
                          {formatDayLabel(date, now)}, {booking.time} Uhr, {listing.viewing.duration} Minuten
                        </p>
                      </div>
                      <Badge tone="success">Slot gebucht</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-card bg-surface p-4 text-slate">
                  Noch keine Besichtigung gebucht. Sobald Sie Interessenten einladen, erscheinen ihre Termine hier.
                </p>
              )}
            </Card>

            <Card padding="lg" className="flex flex-col gap-4">
              <CardHeader
                title="Anforderungen an Bewerbungen"
                description="Danach werden Bewerbungen sortiert, niemand wird ausgeschlossen."
                actions={<Button size="sm" variant="secondary" onClick={() => setTab("kriterien")}>Anpassen</Button>}
              />
              <ul className="flex flex-wrap gap-2">
                {criteriaLabels(savedCriteria).map((label) => (
                  <li key={label} className="rounded-full bg-mist px-3 py-1 text-small font-medium">
                    {label}
                  </li>
                ))}
              </ul>
            </Card>

            {listing.link && !ended && (
              <Card padding="lg" className="flex flex-col gap-3">
                <CopyField label="Bewerbungslink für Ihre Anzeige" value={listing.link} />
                <ButtonLink href={applicationPath(listing)} target="_blank" variant="tertiary" size="sm" className="self-start" icon={<ExternalLink aria-hidden className="size-4" />}>
                  Bewerbungsseite ansehen
                </ButtonLink>
              </Card>
            )}
          </div>

          <aside className="flex flex-col gap-6">
            <Card padding="lg" className="flex flex-col gap-3">
              <div className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-button bg-night text-lavender">
                  {listing.smartlock.state === "unterwegs" ? <Package aria-hidden className="size-5" /> : <LockKeyhole aria-hidden className="size-5" />}
                </span>
                <div>
                  <h2 className="text-h3">Smartlock</h2>
                  <p className="text-slate">{ended ? "Zugänge gelöscht" : listing.smartlock.note}</p>
                </div>
              </div>
            </Card>

            <Card padding="lg" className="flex flex-col gap-3">
              <h2 className="text-h3">Bewerbungen</h2>
              <dl className="grid grid-cols-2 gap-3 tabular-nums">
                {[
                  ["Gesamt", listing.applications.total],
                  ["Neu", listing.applications.new],
                  ["Eingeladen", listing.applications.invited],
                  ["Gebucht", listing.applications.booked],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-card bg-surface px-3 py-2">
                    <dt className="text-small text-slate">{label}</dt>
                    <dd className="text-h3 font-display font-bold">{value}</dd>
                  </div>
                ))}
              </dl>
              {listing.hasApplicantList && (
                <ButtonLink href={`/p/inserate/${listing.slug}/bewerbungen`} variant="secondary" className="w-full">
                  Bewerbungen ansehen
                </ButtonLink>
              )}
            </Card>
          </aside>
        </div>
      )}

      {tab === "slots" && (
        <Card padding="none">
          <div className="p-5 md:p-6">
            <SlotEditor
              pattern={pattern}
              onPatternChange={(next) => {
                setPattern(next);
                setSlotsDirty(true);
              }}
              blocked={blocked}
              onBlockedChange={(next) => {
                setBlocked(next);
                setSlotsDirty(true);
              }}
              bookings={listing.bookings}
              disabled={ended}
            />
          </div>
          {!ended && (
            <footer className="sticky bottom-0 flex flex-wrap items-center justify-end gap-3 rounded-b-card border-t border-line bg-surface px-5 py-4 md:px-6">
              {slotsDirty && <p className="mr-auto text-small text-slate">Ungespeicherte Änderungen</p>}
              <Button
                variant="secondary"
                disabled={!slotsDirty}
                onClick={() => {
                  setPattern(savedPattern);
                  setBlocked(new Set());
                  setSlotsDirty(false);
                }}
              >
                Verwerfen
              </Button>
              <Button disabled={!slotsDirty} onClick={saveSlots}>
                Änderungen speichern
              </Button>
            </footer>
          )}
        </Card>
      )}

      {tab === "kriterien" && (
        <Card padding="none">
          <div className={ended ? "pointer-events-none p-5 opacity-60 md:p-6" : "p-5 md:p-6"} aria-disabled={ended || undefined}>
            <CriteriaEditor value={criteria} onChange={setCriteria} warmRent={warmRent(listing)} />
          </div>
          {!ended && (
            <footer className="sticky bottom-0 flex flex-wrap items-center justify-end gap-3 rounded-b-card border-t border-line bg-surface px-5 py-4 md:px-6">
              {criteriaDirty && <p className="mr-auto text-small text-slate">Bewerbungen werden nach dem Speichern neu sortiert.</p>}
              <Button variant="secondary" disabled={!criteriaDirty} onClick={() => setCriteria(savedCriteria)}>
                Verwerfen
              </Button>
              <Button disabled={!criteriaDirty} onClick={saveCriteria}>
                Kriterien speichern
              </Button>
            </footer>
          )}
        </Card>
      )}

      <Dialog
        open={ending}
        onClose={() => setEnding(false)}
        title="Inserat beenden?"
        description={title}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEnding(false)}>
              Abbrechen
            </Button>
            <Button onClick={endListing} disabled={!endReason}>
              Inserat endgültig beenden
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <ChoiceGroup label="Warum beenden Sie das Inserat?">
            {endReasons.map((reason) => (
              <ChoiceChip key={reason} selected={endReason === reason} onClick={() => setEndReason(reason)}>
                {reason}
              </ChoiceChip>
            ))}
          </ChoiceGroup>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Das passiert danach:</p>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-night">
              <li>Der Bewerbungslink wird sofort deaktiviert.</li>
              {affected > 0 && (
                <li>
                  {affected} {affected === 1 ? "Person mit Einladung oder Termin wird" : "Personen mit Einladung oder Termin werden"} per
                  E-Mail informiert. Gebuchte Termine werden storniert, vorgemerkte Kautionen freigegeben.
                </li>
              )}
              {listing.applications.new > 0 && <li>{listing.applications.new} offene Bewerbungen erhalten eine neutrale Absage.</li>}
              {listing.smartlock.state !== "keins" && <li>Alle Smartlock-Zugänge werden gelöscht. Für das Gerät erhalten Sie ein Rücksendeetikett.</li>}
            </ul>
          </div>
          <p className="text-small text-slate">Das lässt sich nicht rückgängig machen. Sie können die Wohnung später neu inserieren.</p>
        </div>
      </Dialog>

      <Toast message={toast} onDone={clearToast} />
    </>
  );
}
