import { Building, CalendarDays, FilePen, HousePlus, LockKeyhole, Package, Users } from "lucide-react";
import type { ReactNode } from "react";
import { landlord } from "@/config/account";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { listings, warmRent, type Listing } from "@/data/listings";

// Landlord home: open listings with their next to-dos, plus finished ones.

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function Fact({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-slate">
      <span className="shrink-0 text-deep-blue">{icon}</span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

function ListingRow({ listing }: { listing: Listing }) {
  const draft = listing.status === "entwurf";
  const base = `/p/inserate/${listing.slug}`;
  const slots = listing.viewing.days.length * Math.floor(
    (Number(listing.viewing.to.slice(0, 2)) * 60 + Number(listing.viewing.to.slice(3)) - Number(listing.viewing.from.slice(0, 2)) * 60 - Number(listing.viewing.from.slice(3))) /
      listing.viewing.duration,
  );

  return (
    <li className="flex flex-col gap-4 p-5 xl:flex-row xl:items-center xl:gap-6">
      <div className="flex min-w-0 flex-1 gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-card bg-mist text-deep-blue">
          {draft ? <FilePen aria-hidden className="size-6" /> : <Building aria-hidden className="size-6" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-h3">
              {listing.street}, {listing.unit}
            </h3>
            <Badge>{draft ? "Entwurf" : "Online"}</Badge>
          </div>
          <p className="text-slate">
            {listing.zip} {listing.city}, {listing.rooms} Zimmer, {listing.size} m², {euro.format(warmRent(listing))} warm
          </p>
          {draft ? (
            <div className="mt-3 flex max-w-sm flex-col gap-1.5">
              <p className="text-small text-slate">
                {listing.draftProgress} von 6 Schritten erledigt. {listing.statusNote}.
              </p>
              <Progress value={listing.draftProgress ?? 0} max={6} label="Fortschritt des Entwurfs" />
            </div>
          ) : (
            <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-3">
              <Fact icon={<Users aria-hidden className="size-4" />}>
                <span className="font-medium text-night">{listing.applications.total} Bewerbungen</span>
                {listing.applications.new > 0 && `, ${listing.applications.new} neu`}
              </Fact>
              <Fact icon={<CalendarDays aria-hidden className="size-4" />}>
                {listing.applications.booked} gebucht, {slots} Slots pro Woche
              </Fact>
              <Fact icon={listing.smartlock.state === "unterwegs" ? <Package aria-hidden className="size-4" /> : <LockKeyhole aria-hidden className="size-4" />}>
                {listing.smartlock.note}
              </Fact>
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:pl-18 xl:shrink-0 xl:justify-end xl:pl-0">
        {draft ? (
          <ButtonLink href="/p/inserate/neu" size="sm">
            Entwurf fortsetzen
          </ButtonLink>
        ) : (
          <>
            {listing.hasApplicantList && (
              <ButtonLink href={`${base}/bewerbungen`} size="sm">
                Bewerbungen
              </ButtonLink>
            )}
            <ButtonLink href={`${base}#slots`} size="sm" variant="secondary">
              Slots bearbeiten
            </ButtonLink>
            <ButtonLink href={`${base}#kriterien`} size="sm" variant="secondary">
              Anforderungen
            </ButtonLink>
            <ButtonLink href={base} size="sm" variant="tertiary">
              Verwalten
            </ButtonLink>
          </>
        )}
      </div>
    </li>
  );
}

export function Overview() {
  const open = listings.filter((listing) => listing.status !== "vermietet");
  const done = listings.filter((listing) => listing.status === "vermietet");
  const newApplications = open.reduce((sum, listing) => sum + listing.applications.new, 0);
  const booked = open.reduce((sum, listing) => sum + listing.applications.booked, 0);

  return (
    <>
      <PageHeader
        title="Meine Inserate"
        description={`Guten Tag, Herr ${landlord.lastName}. ${newApplications} neue Bewerbungen und ${booked} gebuchte ${booked === 1 ? "Besichtigung" : "Besichtigungen"} warten auf Sie.`}
        actions={
          <ButtonLink href="/p/inserate/neu" icon={<HousePlus aria-hidden className="size-4" />}>
            Neues Inserat
          </ButtonLink>
        }
      />

      <section aria-labelledby="open-heading" className="flex flex-col gap-3">
        <h2 id="open-heading" className="text-h2">
          Offene Inserate <span className="text-slate">{open.length}</span>
        </h2>
        <Card padding="none">
          <ul className="divide-y divide-line">
            {open.map((listing) => (
              <ListingRow key={listing.slug} listing={listing} />
            ))}
          </ul>
        </Card>
      </section>

      {done.length > 0 && (
        <section aria-labelledby="done-heading" className="mt-10 flex flex-col gap-3">
          <h2 id="done-heading" className="text-h2">
            Abgeschlossen
          </h2>
          <Card padding="none">
            <ul className="divide-y divide-line">
              {done.map((listing) => (
                <li key={listing.slug} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {listing.street}, {listing.unit}
                    </p>
                    <p className="text-small text-slate">{listing.statusNote}</p>
                  </div>
                  <Badge tone="success">Vermietet</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </>
  );
}
