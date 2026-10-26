import type { ReactNode } from "react";
import { landlord } from "@/config/account";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  accessLabels,
  addressLine,
  employmentLabels,
  formatDate,
  formatDays,
  formatEuro,
  formatNumber,
  petLabels,
  slotsPerWeek,
  warmRent,
  type Draft,
} from "./draft";

type DraftSummaryProps = {
  draft: Draft;
  done: number;
  total: number;
  creating: boolean;
  onCreate: () => void;
};

function Row({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-1.5">
      <dt className="shrink-0 text-slate">{label}</dt>
      <dd className="min-w-0 text-right font-medium text-night">
        {value ?? <span className="font-normal text-slate">Noch offen</span>}
      </dd>
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-line py-3">
      <h3 className="mb-1 text-h3">{title}</h3>
      <dl className="tabular-nums">{children}</dl>
    </div>
  );
}

export function DraftSummary({ draft, done, total, creating, onCreate }: DraftSummaryProps) {
  const warm = warmRent(draft);
  const empty = draft.occupancy === "leer";
  const open = total - done;
  const slots = slotsPerWeek(draft);

  return (
    <Card padding="none" className="flex flex-col">
      <div className="p-4 md:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-h3">Inserat-Entwurf</h2>
          <span className="text-small text-slate tabular-nums">
            {done} von {total} Angaben
          </span>
        </div>
        <Progress value={done} max={total} label="Fortschritt des Inserats" className="mt-3" />
      </div>

      <div className="px-4 md:px-5">
        <Group title="Wohnung">
          <Row label="Adresse" value={addressLine(draft)} />
          <Row
            label="Größe"
            value={draft.rooms && draft.size ? `${formatNumber(draft.rooms)} Zimmer, ${formatNumber(draft.size)} m²` : undefined}
          />
          <Row label="Etage" value={draft.floor} />
        </Group>

        <Group title="Miete">
          <Row label="Kaltmiete" value={draft.coldRent != null ? formatEuro(draft.coldRent) : undefined} />
          <Row label="Nebenkosten" value={draft.utilities != null ? formatEuro(draft.utilities) : undefined} />
          <Row label="Warmmiete" value={warm != null ? formatEuro(warm) : undefined} />
          <Row label="Mietkaution" value={draft.deposit != null ? formatEuro(draft.deposit) : undefined} />
          <Row label="Frei ab" value={draft.availableFrom ? formatDate(draft.availableFrom) : undefined} />
          <Row
            label="Mietdauer"
            value={
              draft.leaseType === "befristet" && draft.leaseEnd
                ? `Befristet bis ${formatDate(draft.leaseEnd)}`
                : draft.leaseType === "unbefristet"
                  ? "Unbefristet"
                  : undefined
            }
          />
        </Group>

        <Group title="Besichtigungen">
          <Row
            label="Ablauf"
            value={draft.occupancy ? (empty ? "Allein per Smartlock" : "Mit Begleitung") : undefined}
          />
          {empty && <Row label="Hauszugang" value={draft.buildingAccess && accessLabels[draft.buildingAccess]} />}
          <Row
            label="Zeiten"
            value={slots ? `${formatDays(draft.viewingDays ?? [])}, ${draft.viewingFrom}–${draft.viewingTo}` : undefined}
          />
          <Row label="Slots" value={slots ? `${slots} pro Woche, je ${draft.viewingDuration} Min.` : undefined} />
          {empty && (
            <Row label="Kaution" value={draft.viewingDeposit != null ? `${formatEuro(draft.viewingDeposit)}, vorgemerkt` : undefined} />
          )}
        </Group>

        <Group title="Bewerbungen">
          <Row
            label="Einkommen"
            value={draft.minIncome != null ? (draft.minIncome ? `ab ${formatEuro(draft.minIncome)} netto` : "Keine Vorgabe") : undefined}
          />
          {draft.minIncome != null && (
            <>
              <Row
                label="Beschäftigung"
                value={draft.employment?.length ? draft.employment.map((e) => employmentLabels[e]).join(", ") : "Keine Vorgabe"}
              />
              <Row label="Haushalt" value={draft.maxPersons ? `bis ${draft.maxPersons} Personen` : "Keine Vorgabe"} />
              <Row label="Haustiere" value={draft.pets && petLabels[draft.pets]} />
              <Row label="Rauchen" value={draft.smoking === "ja" ? "Erlaubt" : "Nicht erlaubt"} />
            </>
          )}
        </Group>

        <div className="border-t border-line py-3">
          <h3 className="mb-2 text-h3">Zustandsfotos</h3>
          {draft.photos.length ? (
            <ul className="grid grid-cols-4 gap-2">
              {draft.photos.map((photo) => (
                <li key={photo.id} className="aspect-square overflow-hidden rounded-input bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
                  <img src={photo.url} alt={photo.room} className="size-full object-cover" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate">Noch keine Fotos, mindestens 3 nötig.</p>
          )}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3 rounded-b-card border-t border-line bg-surface p-4 md:p-5">
        <div className="flex justify-between gap-4">
          <span className="text-slate">Startgebühr</span>
          <span className="font-medium tabular-nums">{formatEuro(15)}</span>
        </div>
        <p className="text-small text-slate">
          Wird über {landlord.paymentMethod} abgerechnet. Weitere Kosten fallen erst an, wenn ein Mietvertrag
          zustande kommt.
        </p>
        <Button onClick={onCreate} disabled={open > 0} loading={creating} className="w-full">
          {creating ? "Inserat wird erstellt …" : "Inserat erstellen"}
        </Button>
        {open > 0 && (
          <p className="text-center text-small text-slate" aria-live="polite">
            Noch {open} {open === 1 ? "Angabe" : "Angaben"} offen
          </p>
        )}
      </div>
    </Card>
  );
}
