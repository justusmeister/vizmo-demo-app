import { Building, LockKeyhole, MapPin } from "lucide-react";
import { landlord } from "@/config/account";
import type { Listing } from "@/data/listings";
import { criteriaLabels } from "@/features/criteria/types";
import { formatDate, formatEuro, warm } from "./draft";

// Listing facts for applicants. The exact address is only shared after a slot is booked.

export function ListingFacts({ listing }: { listing: Listing }) {
  return (
    <div className="flex gap-3">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-card bg-mist text-deep-blue">
        <Building aria-hidden className="size-6" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-h3 font-bold">
          {listing.rooms}-Zimmer-Wohnung, {listing.size} m²
        </p>
        <p className="flex items-center gap-1 text-slate">
          <MapPin aria-hidden className="size-3.5 shrink-0" />
          {listing.city.replace("Berlin-", "Berlin ")}, {listing.floor}
        </p>
        <p className="mt-0.5 font-medium tabular-nums">
          {formatEuro(warm(listing))} warm <span className="font-normal text-slate">({formatEuro(listing.coldRent)} kalt), frei ab {formatDate(listing.availableFrom)}</span>
        </p>
      </div>
    </div>
  );
}

export function ListingDetails({ listing }: { listing: Listing }) {
  return (
    <div className="flex flex-col gap-4">
      {listing.features && (
        <ul className="flex flex-wrap gap-1.5">
          {listing.features.map((feature) => (
            <li key={feature} className="rounded-full bg-mist px-2.5 py-0.5 text-small font-medium">
              {feature}
            </li>
          ))}
        </ul>
      )}
      {listing.description && <p className="text-night">{listing.description}</p>}
      <div className="flex flex-col gap-2 rounded-card bg-surface p-3">
        <p className="text-small font-medium text-slate">Das ist dem Vermieter wichtig</p>
        <ul className="flex flex-wrap gap-1.5">
          {criteriaLabels(listing.criteria).map((label) => (
            <li key={label} className="rounded-full border border-line bg-white px-2.5 py-0.5 text-small font-medium">
              {label}
            </li>
          ))}
        </ul>
        <p className="text-small text-slate">Alle Bewerbungen werden angesehen. Die Punkte helfen nur bei der Reihenfolge.</p>
      </div>
      <p className="flex items-start gap-2 text-small text-slate">
        <LockKeyhole aria-hidden className="mt-px size-4 shrink-0 text-deep-blue" />
        Nach einer Einladung besichtigen Sie die Wohnung allein in einem festen Zeitfenster. Die genaue Adresse erhalten Sie
        mit der Buchung. Privat vermietet von {landlord.firstName} {landlord.lastName[0]}.
      </p>
    </div>
  );
}
