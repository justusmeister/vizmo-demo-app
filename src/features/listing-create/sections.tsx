"use client";

import { BellRing, Check, DoorOpen, KeyRound, LockKeyhole, Sparkles, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChoiceChip, ChoiceGroup } from "@/components/ui/choice-chip";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { CriteriaEditor } from "@/features/criteria/criteria-editor";
import { cx } from "@/lib/cx";
import {
  accessLabels,
  featureOptions,
  floorOptions,
  formatEuro,
  slotsPerWeek,
  todayIso,
  warmRent,
  weekdays,
  type Draft,
  type Weekday,
} from "./draft";
import { exampleDescription, extractListing } from "./extract";
import { PhotoUploader } from "./photo-uploader";

export type SectionProps = { draft: Draft; update: (patch: Partial<Draft>) => void; showErrors: boolean };

const AI_HINT = "Aus Ihrem Text übernommen, bitte prüfen";

function num(value: string) {
  if (value.trim() === "") return undefined;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function Fieldset({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4 border-t border-line pt-6 first:border-t-0 first:pt-0">
      <legend className="contents">
        <span className="block">
          <span className="block text-h3 font-display font-bold">{title}</span>
          {description && <span className="mt-0.5 block text-slate">{description}</span>}
        </span>
      </legend>
      {children}
    </fieldset>
  );
}

export function OptionCard({
  selected,
  onSelect,
  icon,
  title,
  description,
  badge,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cx(
        "flex gap-3 rounded-card border p-4 text-left transition-colors",
        selected ? "border-blue bg-mist" : "border-line bg-white hover:border-gray",
      )}
    >
      <span className="mt-0.5 shrink-0 text-deep-blue">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 font-medium text-night">
          {title}
          {badge && <span className="rounded-full bg-white px-2 py-0.5 text-small text-night">{badge}</span>}
        </span>
        <span className="mt-0.5 block text-slate">{description}</span>
      </span>
      <span
        aria-hidden
        className={cx(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-blue bg-blue text-white" : "border-gray bg-white",
        )}
      >
        {selected && <Check className="size-3.5" strokeWidth={3} />}
      </span>
    </button>
  );
}

function AiImport({ draft, update }: Pick<SectionProps, "draft" | "update">) {
  const [open, setOpen] = useState(!draft.description);
  const [text, setText] = useState(draft.description ?? "");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  function apply() {
    if (text.trim().length < 20) return;
    setBusy(true);
    window.setTimeout(() => {
      const extracted = extractListing(text);
      const keys = Object.keys(extracted);
      update({ ...extracted, description: text.trim(), aiFields: keys });
      setResult(keys.length);
      setBusy(false);
      setOpen(false);
    }, 1100);
  }

  if (!open) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-mist px-4 py-3">
        <p className="flex items-center gap-2 font-medium text-night">
          <Sparkles aria-hidden className="size-4 text-deep-blue" />
          {result != null
            ? `${result} Angaben aus Ihrem Text übernommen. Markierte Felder bitte kurz prüfen.`
            : "Sie haben schon einen Anzeigentext? Die KI füllt das Formular für Sie vor."}
        </p>
        <Button size="sm" variant="tertiary" onClick={() => setOpen(true)}>
          {result != null ? "Text ändern" : "Text einfügen"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4">
      <div className="flex items-start gap-3">
        <Sparkles aria-hidden className="mt-0.5 size-5 shrink-0 text-deep-blue" />
        <div>
          <p className="font-medium">Schneller mit KI: Anzeigentext einfügen</p>
          <p className="text-slate">
            Fügen Sie Ihren Text von ImmoScout24, Kleinanzeigen oder eine eigene Beschreibung ein. Die KI überträgt
            Adresse, Größe, Miete und Einzugsdatum in die passenden Felder.
          </p>
        </div>
      </div>
      <Textarea
        label="Anzeigentext"
        rows={4}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="z. B. Helle 3-Zimmer-Wohnung im 2. OG, 78 m², Kaltmiete 1.050 € …"
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button size="sm" variant="tertiary" onClick={() => setText(exampleDescription)}>
            Beispieltext einfügen
          </Button>
          <Button size="sm" variant="tertiary" onClick={() => setOpen(false)}>
            Selbst ausfüllen
          </Button>
        </div>
        <Button size="sm" onClick={apply} loading={busy} disabled={text.trim().length < 20} icon={<Sparkles aria-hidden className="size-4" />}>
          {busy ? "Text wird ausgewertet …" : "Formular ausfüllen"}
        </Button>
      </div>
    </div>
  );
}

export function StepWohnung({ draft, update, showErrors }: SectionProps) {
  const ai = (key: string) => (draft.aiFields.includes(key) ? AI_HINT : undefined);
  const err = (condition: boolean, message: string) => (showErrors && condition ? message : undefined);

  return (
    <div className="flex flex-col gap-6">
      <AiImport draft={draft} update={update} />

      <Fieldset title="Adresse" description="Die genaue Adresse sehen Interessenten erst nach der Buchung eines Slots.">
        <div className="grid gap-4 sm:grid-cols-[1fr_8rem_1fr]">
          <Input
            label="Straße und Hausnummer"
            value={draft.street ?? ""}
            onChange={(event) => update({ street: event.target.value })}
            autoComplete="street-address"
            hint={ai("street")}
            error={err(!draft.street, "Bitte angeben")}
          />
          <Input
            label="PLZ"
            inputMode="numeric"
            maxLength={5}
            value={draft.zip ?? ""}
            onChange={(event) => update({ zip: event.target.value })}
            hint={ai("zip") && "Übernommen"}
            error={err(!draft.zip || !/^\d{5}$/.test(draft.zip), "5 Ziffern")}
          />
          <Input
            label="Ort"
            value={draft.city ?? ""}
            onChange={(event) => update({ city: event.target.value })}
            hint={ai("city")}
            error={err(!draft.city, "Bitte angeben")}
          />
        </div>
      </Fieldset>

      <Fieldset title="Größe und Lage">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Zimmer"
            type="number"
            min={1}
            step={0.5}
            value={draft.rooms ?? ""}
            onChange={(event) => update({ rooms: num(event.target.value) })}
            hint={ai("rooms")}
            error={err(!draft.rooms, "Bitte angeben")}
          />
          <Input
            label="Wohnfläche"
            type="number"
            min={10}
            suffix="m²"
            value={draft.size ?? ""}
            onChange={(event) => update({ size: num(event.target.value) })}
            hint={ai("size")}
            error={err(!draft.size, "Bitte angeben")}
          />
          <Select
            label="Etage"
            value={draft.floor ?? ""}
            onChange={(event) => update({ floor: event.target.value || undefined })}
            hint={ai("floor")}
            error={err(!draft.floor, "Bitte wählen")}
          >
            <option value="">Bitte wählen</option>
            {floorOptions.map((floor) => (
              <option key={floor}>{floor}</option>
            ))}
          </Select>
        </div>
      </Fieldset>

      <Fieldset title="Ausstattung" description="Optional. Erscheint auf Ihrer Bewerbungsseite.">
        <div className="flex flex-wrap gap-2">
          {featureOptions.map((feature) => {
            const selected = draft.features.includes(feature);
            return (
              <ChoiceChip
                key={feature}
                selected={selected}
                onClick={() =>
                  update({ features: selected ? draft.features.filter((f) => f !== feature) : [...draft.features, feature] })
                }
              >
                {feature}
              </ChoiceChip>
            );
          })}
        </div>
        <Textarea
          label="Beschreibung für Interessenten"
          rows={3}
          value={draft.description ?? ""}
          onChange={(event) => update({ description: event.target.value })}
          placeholder="Was macht die Wohnung aus? Lage, Licht, Besonderheiten …"
        />
      </Fieldset>
    </div>
  );
}

export function StepMiete({ draft, update, showErrors }: SectionProps) {
  const ai = (key: string) => (draft.aiFields.includes(key) ? AI_HINT : undefined);
  const err = (condition: boolean, message: string) => (showErrors && condition ? message : undefined);
  const warm = warmRent(draft);
  const maxDeposit = draft.coldRent ? draft.coldRent * 3 : undefined;
  const depositTooHigh = draft.deposit != null && maxDeposit != null && draft.deposit > maxDeposit;

  return (
    <div className="flex flex-col gap-6">
      <Fieldset title="Kosten">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Kaltmiete"
            type="number"
            min={0}
            suffix="€"
            value={draft.coldRent ?? ""}
            onChange={(event) => update({ coldRent: num(event.target.value) })}
            hint={ai("coldRent")}
            error={err(!draft.coldRent, "Bitte angeben")}
          />
          <Input
            label="Nebenkosten"
            type="number"
            min={0}
            suffix="€"
            value={draft.utilities ?? ""}
            onChange={(event) => update({ utilities: num(event.target.value) })}
            hint={ai("utilities") ?? "Vorauszahlung inklusive Heizung"}
            error={err(draft.utilities == null, "Bitte angeben, 0 € möglich")}
          />
          <div className="flex flex-col gap-1.5">
            <span className="font-medium text-slate">Warmmiete</span>
            <span className="flex h-10 items-center rounded-input bg-surface px-3 font-medium tabular-nums">
              {warm != null ? formatEuro(warm) : "Wird berechnet"}
            </span>
          </div>
        </div>
        <Input
          label="Mietkaution"
          type="number"
          min={0}
          suffix="€"
          value={draft.deposit ?? ""}
          onChange={(event) => update({ deposit: num(event.target.value) })}
          hint={maxDeposit ? `Höchstens drei Kaltmieten (§ 551 BGB): ${formatEuro(maxDeposit)}` : ai("deposit")}
          error={
            depositTooHigh
              ? `Höchstens ${formatEuro(maxDeposit!)} zulässig (§ 551 BGB)`
              : err(draft.deposit == null, "Bitte angeben")
          }
          className="sm:max-w-[calc((100%-2rem)/3)]"
        />
      </Fieldset>

      <Fieldset title="Einzug und Mietdauer">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Frei ab"
            type="date"
            min={todayIso()}
            value={draft.availableFrom ?? ""}
            onChange={(event) => update({ availableFrom: event.target.value || undefined })}
            hint={ai("availableFrom")}
            error={err(!draft.availableFrom, "Bitte Datum wählen")}
          />
        </div>
        <ChoiceGroup label="Mietdauer">
          <ChoiceChip selected={draft.leaseType === "unbefristet"} onClick={() => update({ leaseType: "unbefristet" })}>
            Unbefristet
          </ChoiceChip>
          <ChoiceChip selected={draft.leaseType === "befristet"} onClick={() => update({ leaseType: "befristet" })}>
            Befristet
          </ChoiceChip>
        </ChoiceGroup>
        {showErrors && !draft.leaseType && <p className="text-small font-medium text-error">Bitte Mietdauer wählen</p>}
        {draft.leaseType === "befristet" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Befristet bis"
              type="date"
              value={draft.leaseEnd ?? ""}
              onChange={(event) => update({ leaseEnd: event.target.value || undefined })}
              hint="Eine Befristung braucht einen gesetzlichen Grund (§ 575 BGB)."
              error={err(!draft.leaseEnd || (!!draft.availableFrom && draft.leaseEnd <= draft.availableFrom), "Datum nach dem Einzug wählen")}
            />
          </div>
        )}
      </Fieldset>
    </div>
  );
}

const times = Array.from({ length: 29 }, (_, index) => {
  const minutes = 7 * 60 + index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

export function StepBesichtigung({ draft, update, showErrors }: SectionProps) {
  const empty = draft.occupancy === "leer";
  const slots = slotsPerWeek(draft);
  const toggleDay = (day: Weekday) =>
    update({ viewingDays: draft.viewingDays.includes(day) ? draft.viewingDays.filter((d) => d !== day) : [...draft.viewingDays, day] });
  const needed = (condition: boolean, message: string) =>
    showErrors && condition ? <p className="text-small font-medium text-error">{message}</p> : null;

  return (
    <div className="flex flex-col gap-6">
      <Fieldset title="Ist die Wohnung zu den Besichtigungen leer?" description="Davon hängt ab, ob Interessenten allein per Smartlock besichtigen.">
        <div className="grid gap-3 md:grid-cols-2">
          <OptionCard
            selected={draft.occupancy === "leer"}
            onSelect={() => update({ occupancy: "leer" })}
            icon={<LockKeyhole aria-hidden className="size-5" />}
            title="Ja, die Wohnung ist leer"
            description="Interessenten besichtigen allein. Das Smartlock öffnet nur im gebuchten Zeitfenster."
          />
          <OptionCard
            selected={draft.occupancy === "bewohnt"}
            onSelect={() => update({ occupancy: "bewohnt", buildingAccess: undefined, viewingDeposit: undefined, shipTo: undefined })}
            icon={<Users aria-hidden className="size-5" />}
            title="Nein, sie ist noch bewohnt"
            description="Besichtigungen finden begleitet statt, durch Sie oder die aktuellen Mieter. Kein Smartlock nötig."
          />
        </div>
        {needed(!draft.occupancy, "Bitte auswählen")}
      </Fieldset>

      {empty && (
        <Fieldset title="Wie kommen Interessenten ins Haus?" description="Das Smartlock sitzt an der Wohnungstür.">
          <div className="grid gap-3 md:grid-cols-3">
            <OptionCard
              selected={draft.buildingAccess === "klingel"}
              onSelect={() => update({ buildingAccess: "klingel" })}
              icon={<BellRing aria-hidden className="size-5" />}
              title={accessLabels.klingel}
              description="Wir legen einen Nuki Opener für die Gegensprechanlage bei."
            />
            <OptionCard
              selected={draft.buildingAccess === "offen"}
              onSelect={() => update({ buildingAccess: "offen" })}
              icon={<DoorOpen aria-hidden className="size-5" />}
              title={accessLabels.offen}
              description="Slots liegen dann nur in der Zeit, in der die Tür offen ist."
            />
            <OptionCard
              selected={draft.buildingAccess === "direkt"}
              onSelect={() => update({ buildingAccess: "direkt" })}
              icon={<KeyRound aria-hidden className="size-5" />}
              title={accessLabels.direkt}
              description="Zum Beispiel Erdgeschoss mit eigenem Eingang."
            />
          </div>
          {needed(!draft.buildingAccess, "Bitte auswählen")}
        </Fieldset>
      )}

      <Fieldset
        title="Besichtigungszeiten"
        description={
          draft.occupancy === "bewohnt"
            ? "Zeiten, zu denen Sie oder die Mieter vor Ort sein können. Interessenten buchen daraus feste Slots."
            : "Interessenten buchen daraus feste Slots. Sie müssen nicht vor Ort sein."
        }
      >
        <ChoiceGroup label="Wochentage">
          {weekdays.map((day) => (
            <ChoiceChip key={day.id} selected={draft.viewingDays.includes(day.id)} onClick={() => toggleDay(day.id)} aria-label={day.long} className="min-w-12 justify-center">
              {day.short}
            </ChoiceChip>
          ))}
        </ChoiceGroup>
        <div className="grid gap-4 sm:grid-cols-3">
          <Select label="Von" value={draft.viewingFrom} onChange={(event) => update({ viewingFrom: event.target.value })}>
            {times.map((time) => (
              <option key={time}>{time}</option>
            ))}
          </Select>
          <Select label="Bis" value={draft.viewingTo} onChange={(event) => update({ viewingTo: event.target.value })}>
            {times.map((time) => (
              <option key={time}>{time}</option>
            ))}
          </Select>
          <Select label="Dauer pro Besichtigung" value={draft.viewingDuration} onChange={(event) => update({ viewingDuration: Number(event.target.value) })}>
            {[15, 20, 30, 45].map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} Minuten
              </option>
            ))}
          </Select>
        </div>
        <p className={cx("font-medium", slots ? "text-night" : "text-error")} aria-live="polite">
          {slots ? `Ergibt ${slots} Besichtigungsslots pro Woche.` : "Bitte mindestens einen Tag und ein gültiges Zeitfenster wählen."}
        </p>
      </Fieldset>

      {empty && (
        <Fieldset title="Besichtigungskaution" description="Interessenten hinterlegen sie vor der Besichtigung. Sie sichert Sie bei Schäden ab.">
          <div className="grid gap-3 md:grid-cols-2">
            <OptionCard
              selected={draft.viewingDeposit === 25}
              onSelect={() => update({ viewingDeposit: 25 })}
              icon={<LockKeyhole aria-hidden className="size-5" />}
              title="25 €"
              badge="Empfohlen"
              description="Niedrige Hürde für Interessenten, deckt kleine Schäden ab."
            />
            <OptionCard
              selected={draft.viewingDeposit === 50}
              onSelect={() => update({ viewingDeposit: 50 })}
              icon={<LockKeyhole aria-hidden className="size-5" />}
              title="50 €"
              description="Für möblierte oder besonders gefragte Wohnungen."
            />
          </div>
          {needed(draft.viewingDeposit == null, "Bitte auswählen")}
          <Notice>
            Der Betrag wird über Stripe nur auf der Karte vorgemerkt, nicht abgebucht. Ohne Schaden geben wir ihn direkt
            nach der Besichtigung frei, spätestens nach 7 Tagen.
          </Notice>
        </Fieldset>
      )}
    </div>
  );
}

export function StepKriterien({ draft, update }: SectionProps) {
  if (!draft.criteria) return null;
  return <CriteriaEditor value={draft.criteria} onChange={(criteria) => update({ criteria })} warmRent={warmRent(draft)} />;
}

export function StepFotos({ draft, update, showErrors }: SectionProps) {
  const remaining = Math.max(0, 3 - draft.photos.length);
  return (
    <div className="flex flex-col gap-6">
      <Fieldset title="Fotos für das Inserat" description="Optional, aber empfohlen. Interessenten sehen sie auf Ihrer Bewerbungsseite. Das erste Foto ist das Titelbild.">
        <PhotoUploader
          mode="listing"
          photos={draft.listingPhotos}
          onChange={(listingPhotos) => update({ listingPhotos })}
          hint="Querformat wirkt am besten. Bis zu 20 Fotos."
        />
      </Fieldset>

      <Fieldset
        title="Zustandsfotos, mindestens 3"
        description="Für den Abgleich nach jeder Besichtigung: Interessenten fotografieren am Ende dieselben Räume. Diese Fotos sieht nur vizmo."
      >
        <PhotoUploader
          mode="reference"
          photos={draft.photos}
          onChange={(photos) => update({ photos })}
          hint="Bei Tageslicht, aus der Türperspektive, ein Foto pro Raum. Ordnen Sie jedem Foto den Raum zu."
        />
        <p className={cx("font-medium", remaining ? (showErrors ? "text-error" : "text-slate") : "text-night")} aria-live="polite">
          {remaining ? `Noch ${remaining} ${remaining === 1 ? "Zustandsfoto" : "Zustandsfotos"} erforderlich` : `${draft.photos.length} Zustandsfotos hinterlegt`}
        </p>
      </Fieldset>
    </div>
  );
}
