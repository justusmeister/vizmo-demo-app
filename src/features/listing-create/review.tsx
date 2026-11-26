"use client";

import { Check, CircleAlert, DoorOpen, KeyRound } from "lucide-react";
import type { ReactNode } from "react";
import { landlord } from "@/config/account";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { criteriaLabels } from "@/features/criteria/types";
import {
  accessLabels,
  addressLine,
  formatDate,
  formatDays,
  formatEuro,
  formatNumber,
  PRICE,
  slotsPerWeek,
  warmRent,
  type Draft,
} from "./draft";
import { Fieldset, OptionCard, type SectionProps } from "./sections";
import { missing, wizardSteps, type StepId } from "./wizard-steps";

type ReviewProps = SectionProps & { goTo: (step: StepId) => void };

function Summary({ title, step, goTo, children }: { title: string; step: StepId; goTo: (step: StepId) => void; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2 rounded-card border border-line p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-h3">{title}</h3>
        <Button size="sm" variant="tertiary" onClick={() => goTo(step)}>
          Bearbeiten
        </Button>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 tabular-nums">{children}</dl>
    </section>
  );
}

function Item({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <>
      <dt className="text-slate">{label}</dt>
      <dd className="text-right font-medium sm:text-left">{value ?? <span className="font-normal text-slate">Fehlt</span>}</dd>
    </>
  );
}

function Thumbs({ photos, label }: { photos: Draft["photos"]; label: string }) {
  if (!photos.length) return <p className="text-slate">Keine {label}</p>;
  return (
    <ul className="flex flex-wrap gap-2">
      {photos.map((photo) => (
        <li key={photo.id} className="size-16 overflow-hidden rounded-input bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
          <img src={photo.url} alt={photo.room} className="size-full object-cover" />
        </li>
      ))}
    </ul>
  );
}

export function Review({ draft, update, showErrors, goTo }: ReviewProps) {
  const empty = draft.occupancy === "leer";
  const warm = warmRent(draft);
  const profile = `${landlord.street}, ${landlord.zip} ${landlord.city}`;
  const open = wizardSteps.filter((step) => step.id !== "pruefen").map((step) => ({ step, items: missing(step.id, draft) }));

  return (
    <div className="flex flex-col gap-6">
      <section aria-label="Vollständigkeit" className="flex flex-col gap-2">
        <h3 className="text-h3">Vollständigkeit</h3>
        <ul className="divide-y divide-line rounded-card border border-line">
          {open.map(({ step, items }) => (
            <li key={step.id} className="flex items-start gap-3 px-4 py-3">
              {items.length ? (
                <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-error" />
              ) : (
                <span aria-hidden className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-night text-white">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium">{step.title}</p>
                <p className="text-small text-slate">{items.length ? `Fehlt: ${items.join(", ")}` : "Vollständig"}</p>
              </div>
              {items.length > 0 && (
                <Button size="sm" variant="secondary" onClick={() => goTo(step.id)}>
                  Ergänzen
                </Button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <Summary title="Wohnung" step="wohnung" goTo={goTo}>
          <Item label="Adresse" value={addressLine(draft)} />
          <Item
            label="Größe"
            value={draft.rooms && draft.size ? `${formatNumber(draft.rooms)} Zimmer, ${formatNumber(draft.size)} m², ${draft.floor ?? ""}` : undefined}
          />
          <Item label="Ausstattung" value={draft.features.length ? draft.features.join(", ") : "Keine Angabe"} />
        </Summary>
        <Summary title="Miete und Vertrag" step="miete" goTo={goTo}>
          <Item label="Warmmiete" value={warm != null ? `${formatEuro(warm)} (${formatEuro(draft.coldRent!)} kalt)` : undefined} />
          <Item label="Kaution" value={draft.deposit != null ? formatEuro(draft.deposit) : undefined} />
          <Item label="Frei ab" value={draft.availableFrom && formatDate(draft.availableFrom)} />
          <Item
            label="Mietdauer"
            value={draft.leaseType === "befristet" ? (draft.leaseEnd ? `Befristet bis ${formatDate(draft.leaseEnd)}` : undefined) : draft.leaseType && "Unbefristet"}
          />
        </Summary>
        <Summary title="Besichtigungen" step="besichtigung" goTo={goTo}>
          <Item label="Ablauf" value={draft.occupancy && (empty ? "Allein per Smartlock" : "Mit Begleitung")} />
          {empty && <Item label="Hauszugang" value={draft.buildingAccess && accessLabels[draft.buildingAccess]} />}
          <Item
            label="Zeiten"
            value={slotsPerWeek(draft) ? `${formatDays(draft.viewingDays)}, ${draft.viewingFrom}–${draft.viewingTo} Uhr` : undefined}
          />
          <Item label="Slots" value={slotsPerWeek(draft) ? `${slotsPerWeek(draft)} pro Woche, je ${draft.viewingDuration} Min.` : undefined} />
          {empty && <Item label="Kaution" value={draft.viewingDeposit != null ? `${formatEuro(draft.viewingDeposit)}, nur vorgemerkt` : undefined} />}
        </Summary>
        <Summary title="Bewerberkriterien" step="kriterien" goTo={goTo}>
          <dt className="sr-only">Kriterien</dt>
          <dd className="col-span-2">
            {draft.criteria ? (
              <ul className="flex flex-wrap gap-1.5">
                {criteriaLabels(draft.criteria).map((label) => (
                  <li key={label} className="rounded-full bg-mist px-2.5 py-0.5 text-small font-medium">
                    {label}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-slate">Fehlt</span>
            )}
          </dd>
        </Summary>
      </div>

      <section className="flex flex-col gap-3 rounded-card border border-line p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-h3">Fotos</h3>
          <Button size="sm" variant="tertiary" onClick={() => goTo("fotos")}>
            Bearbeiten
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-small text-slate">Inseratsfotos, für Interessenten sichtbar ({draft.listingPhotos.length})</p>
            <Thumbs photos={draft.listingPhotos} label="Inseratsfotos" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-small text-slate">Zustandsfotos, nur für vizmo ({draft.photos.length})</p>
            <Thumbs photos={draft.photos} label="Zustandsfotos" />
          </div>
        </div>
      </section>

      {empty && (
        <Fieldset title="Wohin sollen wir das Smartlock-Paket schicken?" description="Nuki Smart Lock und LTE-Stick, Montage in etwa 10 Minuten ohne Bohren.">
          <div className="grid gap-3 md:grid-cols-2">
            <OptionCard
              selected={draft.shipTo === "profil"}
              onSelect={() => update({ shipTo: "profil" })}
              icon={<KeyRound aria-hidden className="size-5" />}
              title="An meine Adresse"
              badge="Empfohlen"
              description={profile}
            />
            <OptionCard
              selected={draft.shipTo === "wohnung"}
              onSelect={() => update({ shipTo: "wohnung" })}
              icon={<DoorOpen aria-hidden className="size-5" />}
              title="An die Wohnung"
              description={`${addressLine(draft) ?? "Adresse der Wohnung"}. Nur wenn dort jemand annehmen kann.`}
            />
          </div>
          {showErrors && !draft.shipTo && <p className="text-small font-medium text-error">Bitte Lieferadresse wählen</p>}
        </Fieldset>
      )}

      <section className="flex flex-col gap-4 rounded-card bg-surface p-4 md:p-5">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h3 className="text-h3">Kosten</h3>
            <p className="text-slate">Einmalig für dieses Inserat, inkl. 19 % MwSt.</p>
          </div>
          <p className="font-display text-h2 font-bold tabular-nums">{formatEuro(PRICE)}</p>
        </div>
        <p className="text-small text-slate">Abrechnung über {landlord.paymentMethod}. Die Rechnung kommt per E-Mail an {landlord.email}.</p>
        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox checked={draft.confirmed} onChange={(event) => update({ confirmed: event.target.checked })} className="mt-0.5" />
          <span>
            Ich bestätige, dass meine Angaben stimmen und ich zur Vermietung der Wohnung berechtigt bin. Es gelten die AGB
            und Datenschutzhinweise von vizmo.
          </span>
        </label>
        {showErrors && !draft.confirmed && <p className="text-small font-medium text-error">Bitte bestätigen</p>}
      </section>
    </div>
  );
}
