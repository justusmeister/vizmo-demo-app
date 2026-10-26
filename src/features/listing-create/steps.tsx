"use client";

import { BellRing, DoorOpen, KeyRound, LockKeyhole, Users } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { landlord } from "@/config/account";
import { Button } from "@/components/ui/button";
import { ChoiceChip, ChoiceGroup } from "@/components/ui/choice-chip";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { cx } from "@/lib/cx";
import {
  accessLabels,
  addressLine,
  employmentLabels,
  floorOptions,
  formatDate,
  formatDays,
  formatEuro,
  petLabels,
  slotsPerWeek,
  warmRent,
  weekdays,
  type Draft,
  type Employment,
  type Weekday,
} from "./draft";
import { exampleDescription, extractListing } from "./extract";
import { PhotoUploader } from "./photo-uploader";

// One entry per question in the creation chat. A step is asked when it applies to the
// draft and isn't complete yet, so fields recognized in the free-text description are skipped.

export type Submit = (patch: Partial<Draft>, answer: string) => void;
type StepInputProps = { draft: Draft; onSubmit: Submit };

export type Step = {
  id: string;
  applies: (draft: Draft) => boolean;
  complete: (draft: Draft) => boolean;
  question: (draft: Draft) => { title: string; detail?: ReactNode };
  Input: (props: StepInputProps) => ReactNode;
};

const isEmpty = (draft: Draft) => draft.occupancy === "leer";
const always = () => true;

function toNumber(value: FormDataEntryValue | null) {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) && String(value ?? "").trim() !== "" ? parsed : undefined;
}

function AnswerForm({
  onSubmit,
  submitLabel = "Weiter",
  disabled,
  children,
  aside,
}: {
  onSubmit: (data: FormData) => void;
  submitLabel?: string;
  disabled?: boolean;
  children: ReactNode;
  aside?: ReactNode;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(new FormData(event.currentTarget));
  }
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {children}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>{aside}</div>
        <Button type="submit" disabled={disabled}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

// Large single-choice options that answer immediately on click.
function OptionList({
  options,
}: {
  options: { label: string; description: string; icon: ReactNode; badge?: string; onSelect: () => void }[];
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          onClick={option.onSelect}
          className="group flex gap-3 rounded-card border border-line bg-white p-4 text-left transition-colors hover:border-blue hover:bg-mist"
        >
          <span className="mt-0.5 shrink-0 text-deep-blue">{option.icon}</span>
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2 font-medium text-night">
              {option.label}
              {option.badge && (
                <span className="rounded-full bg-mist px-2 py-0.5 text-small text-night group-hover:bg-white">
                  {option.badge}
                </span>
              )}
            </span>
            <span className="mt-0.5 block text-slate">{option.description}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function IntroInput({ draft, onSubmit }: StepInputProps) {
  const [text, setText] = useState(draft.description ?? "");
  const [error, setError] = useState<string>();

  return (
    <AnswerForm
      onSubmit={() => {
        if (text.trim().length < 20) {
          setError("Bitte beschreiben Sie die Wohnung in mindestens einem Satz.");
          return;
        }
        onSubmit({ description: text.trim(), ...extractListing(text) }, text.trim());
      }}
      submitLabel="Beschreibung senden"
      aside={
        <Button variant="tertiary" size="sm" onClick={() => { setText(exampleDescription); setError(undefined); }}>
          Beispieltext einfügen
        </Button>
      }
    >
      <Textarea
        label="Beschreibung oder bestehender Inseratstext"
        rows={5}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="z. B. Helle 3-Zimmer-Wohnung im 2. OG, 78 m², Kaltmiete 1.050 €, frei ab 01.12. …"
        error={error}
      />
    </AnswerForm>
  );
}

function AddressInput({ draft, onSubmit }: StepInputProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <AnswerForm
      onSubmit={(data) => {
        const street = String(data.get("street") ?? "").trim();
        const zip = String(data.get("zip") ?? "").trim();
        const city = String(data.get("city") ?? "").trim();
        const next: Record<string, string> = {};
        if (!/\d/.test(street)) next.street = "Bitte Straße und Hausnummer angeben.";
        if (!/^\d{5}$/.test(zip)) next.zip = "Fünfstellige Postleitzahl";
        if (!city) next.city = "Bitte den Ort angeben.";
        setErrors(next);
        if (Object.keys(next).length) return;
        onSubmit({ street, zip, city }, `${street}, ${zip} ${city}`);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_8rem_1fr]">
        <Input name="street" label="Straße und Hausnummer" defaultValue={draft.street} autoComplete="street-address" error={errors.street} />
        <Input name="zip" label="PLZ" inputMode="numeric" maxLength={5} defaultValue={draft.zip} autoComplete="postal-code" error={errors.zip} />
        <Input name="city" label="Ort" defaultValue={draft.city} autoComplete="address-level2" error={errors.city} />
      </div>
    </AnswerForm>
  );
}

function BasicsInput({ draft, onSubmit }: StepInputProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <AnswerForm
      onSubmit={(data) => {
        const rooms = toNumber(data.get("rooms"));
        const size = toNumber(data.get("size"));
        const floor = String(data.get("floor"));
        const next: Record<string, string> = {};
        if (!rooms || rooms <= 0) next.rooms = "Anzahl der Zimmer";
        if (!size || size < 10) next.size = "Wohnfläche in m²";
        setErrors(next);
        if (Object.keys(next).length || !rooms || !size) return;
        onSubmit({ rooms, size, floor }, `${String(rooms).replace(".", ",")} Zimmer, ${size} m², ${floor}`);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Input name="rooms" label="Zimmer" type="number" min={1} step={0.5} defaultValue={draft.rooms} error={errors.rooms} />
        <Input name="size" label="Wohnfläche" type="number" min={10} suffix="m²" defaultValue={draft.size} error={errors.size} />
        <Select name="floor" label="Etage" defaultValue={draft.floor ?? "1. OG"}>
          {floorOptions.map((floor) => (
            <option key={floor}>{floor}</option>
          ))}
        </Select>
      </div>
    </AnswerForm>
  );
}

function RentInput({ draft, onSubmit }: StepInputProps) {
  const [cold, setCold] = useState(draft.coldRent);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const maxDeposit = cold ? cold * 3 : undefined;

  return (
    <AnswerForm
      onSubmit={(data) => {
        const coldRent = toNumber(data.get("coldRent"));
        const utilities = toNumber(data.get("utilities"));
        const deposit = toNumber(data.get("deposit"));
        const next: Record<string, string> = {};
        if (!coldRent) next.coldRent = "Bitte die Kaltmiete angeben.";
        if (utilities == null) next.utilities = "Bitte die Nebenkosten angeben (0 € möglich).";
        if (deposit == null) next.deposit = "Bitte die Mietkaution angeben.";
        else if (coldRent && deposit > coldRent * 3) next.deposit = `Höchstens drei Kaltmieten (§ 551 BGB): ${formatEuro(coldRent * 3)}`;
        setErrors(next);
        if (Object.keys(next).length || coldRent == null || utilities == null || deposit == null) return;
        onSubmit(
          { coldRent, utilities, deposit },
          `${formatEuro(coldRent)} kalt, ${formatEuro(utilities)} Nebenkosten, ${formatEuro(deposit)} Kaution`,
        );
      }}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          name="coldRent"
          label="Kaltmiete"
          type="number"
          min={0}
          suffix="€"
          defaultValue={draft.coldRent}
          onChange={(event) => setCold(toNumber(event.target.value))}
          error={errors.coldRent}
        />
        <Input name="utilities" label="Nebenkosten" type="number" min={0} suffix="€" defaultValue={draft.utilities} error={errors.utilities} />
        <Input
          name="deposit"
          label="Mietkaution"
          type="number"
          min={0}
          suffix="€"
          defaultValue={draft.deposit}
          hint={maxDeposit ? `Höchstens ${formatEuro(maxDeposit)}` : undefined}
          error={errors.deposit}
        />
      </div>
    </AnswerForm>
  );
}

function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function AvailabilityInput({ draft, onSubmit }: StepInputProps) {
  const [leaseType, setLeaseType] = useState(draft.leaseType ?? "unbefristet");
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <AnswerForm
      onSubmit={(data) => {
        const availableFrom = String(data.get("availableFrom") ?? "");
        const leaseEnd = String(data.get("leaseEnd") ?? "");
        const next: Record<string, string> = {};
        if (!availableFrom) next.availableFrom = "Bitte ein Datum wählen.";
        if (leaseType === "befristet" && (!leaseEnd || leaseEnd <= availableFrom)) next.leaseEnd = "Enddatum nach dem Einzug wählen.";
        setErrors(next);
        if (Object.keys(next).length) return;
        onSubmit(
          { availableFrom, leaseType, leaseEnd: leaseType === "befristet" ? leaseEnd : undefined },
          `Frei ab ${formatDate(availableFrom)}, ${leaseType === "befristet" ? `befristet bis ${formatDate(leaseEnd)}` : "unbefristet"}`,
        );
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="availableFrom" label="Frei ab" type="date" min={todayIso()} defaultValue={draft.availableFrom} error={errors.availableFrom} />
        {leaseType === "befristet" && (
          <Input name="leaseEnd" label="Befristet bis" type="date" defaultValue={draft.leaseEnd} error={errors.leaseEnd} />
        )}
      </div>
      <ChoiceGroup label="Mietdauer">
        <ChoiceChip selected={leaseType === "unbefristet"} onClick={() => setLeaseType("unbefristet")}>
          Unbefristet
        </ChoiceChip>
        <ChoiceChip selected={leaseType === "befristet"} onClick={() => setLeaseType("befristet")}>
          Befristet
        </ChoiceChip>
      </ChoiceGroup>
    </AnswerForm>
  );
}

function OccupancyInput({ onSubmit }: StepInputProps) {
  return (
    <OptionList
      options={[
        {
          label: "Ja, die Wohnung ist leer",
          description: "Interessenten besichtigen allein. Das Smartlock öffnet nur im gebuchten Zeitfenster.",
          icon: <LockKeyhole aria-hidden className="size-5" />,
          onSelect: () => onSubmit({ occupancy: "leer" }, "Die Wohnung ist leer."),
        },
        {
          label: "Nein, sie ist noch bewohnt",
          description: "Besichtigungen finden begleitet statt, durch Sie oder die aktuellen Mieter.",
          icon: <Users aria-hidden className="size-5" />,
          onSelect: () => onSubmit({ occupancy: "bewohnt", buildingAccess: undefined, viewingDeposit: undefined, shipTo: undefined }, "Sie ist noch bewohnt."),
        },
      ]}
    />
  );
}

function AccessInput({ onSubmit }: StepInputProps) {
  return (
    <OptionList
      options={[
        {
          label: accessLabels.klingel,
          description: "Wir legen einen Nuki Opener bei. Er öffnet die Haustür über Ihre Gegensprechanlage.",
          icon: <BellRing aria-hidden className="size-5" />,
          onSelect: () => onSubmit({ buildingAccess: "klingel" }, accessLabels.klingel),
        },
        {
          label: accessLabels.offen,
          description: "Besichtigungen legen wir dann nur in die Zeit, in der die Tür offen ist.",
          icon: <DoorOpen aria-hidden className="size-5" />,
          onSelect: () => onSubmit({ buildingAccess: "offen" }, accessLabels.offen),
        },
        {
          label: accessLabels.direkt,
          description: "Zum Beispiel Erdgeschoss mit eigenem Eingang oder Einfamilienhaus.",
          icon: <KeyRound aria-hidden className="size-5" />,
          onSelect: () => onSubmit({ buildingAccess: "direkt" }, accessLabels.direkt),
        },
      ]}
    />
  );
}

const times = Array.from({ length: 29 }, (_, index) => {
  const minutes = 7 * 60 + index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

function ViewingInput({ draft, onSubmit }: StepInputProps) {
  const [days, setDays] = useState<Weekday[]>(draft.viewingDays ?? ["di", "do", "sa"]);
  const [from, setFrom] = useState(draft.viewingFrom ?? "17:00");
  const [to, setTo] = useState(draft.viewingTo ?? "19:00");
  const [duration, setDuration] = useState(draft.viewingDuration ?? 20);
  const slots = slotsPerWeek({ ...draft, viewingDays: days, viewingFrom: from, viewingTo: to, viewingDuration: duration });

  const toggle = (day: Weekday) =>
    setDays((current) => (current.includes(day) ? current.filter((d) => d !== day) : [...current, day]));

  return (
    <AnswerForm
      disabled={slots === 0}
      onSubmit={() =>
        onSubmit(
          { viewingDays: days, viewingFrom: from, viewingTo: to, viewingDuration: duration },
          `${formatDays(days)}, ${from}–${to} Uhr, je ${duration} Minuten`,
        )
      }
      aside={
        <p className={cx("font-medium", slots ? "text-night" : "text-error")} aria-live="polite">
          {slots ? `${slots} Besichtigungsslots pro Woche` : "Bitte Tage und ein gültiges Zeitfenster wählen."}
        </p>
      }
    >
      <ChoiceGroup label="Wochentage">
        {weekdays.map((day) => (
          <ChoiceChip key={day.id} selected={days.includes(day.id)} onClick={() => toggle(day.id)} aria-label={day.long}>
            {day.short}
          </ChoiceChip>
        ))}
      </ChoiceGroup>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Von" value={from} onChange={(event) => setFrom(event.target.value)}>
          {times.map((time) => (
            <option key={time}>{time}</option>
          ))}
        </Select>
        <Select label="Bis" value={to} onChange={(event) => setTo(event.target.value)}>
          {times.map((time) => (
            <option key={time}>{time}</option>
          ))}
        </Select>
      </div>
      <ChoiceGroup label="Dauer pro Besichtigung">
        {[15, 20, 30].map((minutes) => (
          <ChoiceChip key={minutes} selected={duration === minutes} onClick={() => setDuration(minutes)}>
            {minutes} Minuten
          </ChoiceChip>
        ))}
      </ChoiceGroup>
    </AnswerForm>
  );
}

function DepositInput({ onSubmit }: StepInputProps) {
  return (
    <div className="flex flex-col gap-3">
      <OptionList
        options={[
          {
            label: "25 €",
            badge: "Empfohlen",
            description: "Niedrige Hürde für Interessenten, deckt kleine Schäden ab.",
            icon: <LockKeyhole aria-hidden className="size-5" />,
            onSelect: () => onSubmit({ viewingDeposit: 25 }, "25 € Besichtigungskaution"),
          },
          {
            label: "50 €",
            description: "Für hochwertig möblierte oder besonders gefragte Wohnungen.",
            icon: <LockKeyhole aria-hidden className="size-5" />,
            onSelect: () => onSubmit({ viewingDeposit: 50 }, "50 € Besichtigungskaution"),
          },
        ]}
      />
      <Notice>
        Der Betrag wird über Stripe nur auf der Karte vorgemerkt, nicht abgebucht. Ohne Schaden geben wir ihn direkt nach
        der Besichtigung frei, spätestens nach 7 Tagen.
      </Notice>
    </div>
  );
}

function RequirementsInput({ draft, onSubmit }: StepInputProps) {
  const warm = warmRent(draft);
  const suggestedIncome = warm ? Math.ceil((warm * 3) / 100) * 100 : undefined;
  const [employment, setEmployment] = useState<Employment[]>(draft.employment ?? []);
  const [pets, setPets] = useState(draft.pets ?? "absprache");
  const [smoking, setSmoking] = useState(draft.smoking ?? "nein");

  const toggle = (value: Employment) =>
    setEmployment((current) => (current.includes(value) ? current.filter((e) => e !== value) : [...current, value]));

  return (
    <AnswerForm
      onSubmit={(data) => {
        const minIncome = toNumber(data.get("minIncome")) ?? 0;
        const maxPersons = toNumber(data.get("maxPersons"));
        const parts = [
          minIncome ? `ab ${formatEuro(minIncome)} netto` : "kein Mindesteinkommen",
          maxPersons ? `max. ${maxPersons} Personen` : undefined,
          { ja: "Haustiere erlaubt", absprache: "Haustiere nach Absprache", nein: "keine Haustiere" }[pets],
          smoking === "nein" ? "Nichtraucher" : "Rauchen erlaubt",
        ];
        onSubmit({ minIncome, maxPersons, employment, pets, smoking }, parts.filter(Boolean).join(", "));
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="minIncome"
          label="Haushaltsnettoeinkommen ab"
          type="number"
          min={0}
          step={100}
          suffix="€"
          defaultValue={draft.minIncome ?? suggestedIncome}
          hint={warm ? `Üblich ist die dreifache Warmmiete (${formatEuro(warm)}).` : undefined}
        />
        <Select name="maxPersons" label="Personen im Haushalt" defaultValue={draft.maxPersons ?? ""}>
          <option value="">Keine Vorgabe</option>
          {[1, 2, 3, 4, 5, 6].map((count) => (
            <option key={count} value={count}>
              höchstens {count}
            </option>
          ))}
        </Select>
      </div>
      <ChoiceGroup label="Bevorzugte Beschäftigung (optional)">
        {(Object.keys(employmentLabels) as Employment[]).map((value) => (
          <ChoiceChip key={value} selected={employment.includes(value)} onClick={() => toggle(value)}>
            {employmentLabels[value]}
          </ChoiceChip>
        ))}
      </ChoiceGroup>
      <div className="grid gap-4 sm:grid-cols-2">
        <ChoiceGroup label="Haustiere">
          {(Object.keys(petLabels) as (keyof typeof petLabels)[]).map((value) => (
            <ChoiceChip key={value} selected={pets === value} onClick={() => setPets(value)}>
              {petLabels[value]}
            </ChoiceChip>
          ))}
        </ChoiceGroup>
        <ChoiceGroup label="Rauchen in der Wohnung">
          <ChoiceChip selected={smoking === "nein"} onClick={() => setSmoking("nein")}>
            Nicht erlaubt
          </ChoiceChip>
          <ChoiceChip selected={smoking === "ja"} onClick={() => setSmoking("ja")}>
            Erlaubt
          </ChoiceChip>
        </ChoiceGroup>
      </div>
      <Notice title="Sortieren statt aussortieren">
        Bewerbungen werden nach diesen Kriterien sortiert, niemand wird automatisch abgelehnt. Herkunft, Religion,
        Geschlecht, Alter oder Behinderung fragen wir gemäß AGG grundsätzlich nicht ab.
      </Notice>
    </AnswerForm>
  );
}

function PhotosInput({ draft, onSubmit }: StepInputProps) {
  const [photos, setPhotos] = useState(draft.photos);
  return (
    <AnswerForm
      disabled={photos.length < 3}
      submitLabel="Fotos hinterlegen"
      onSubmit={() =>
        onSubmit(
          { photos },
          `${photos.length} Zustandsfotos: ${[...new Set(photos.map((photo) => photo.room))].join(", ")}`,
        )
      }
      aside={
        <p className={cx("font-medium", photos.length >= 3 ? "text-night" : "text-slate")} aria-live="polite">
          {photos.length} von mindestens 3 Fotos
        </p>
      }
    >
      <PhotoUploader photos={photos} onChange={setPhotos} />
    </AnswerForm>
  );
}

function ShippingInput({ draft, onSubmit }: StepInputProps) {
  const profile = `${landlord.street}, ${landlord.zip} ${landlord.city}`;
  return (
    <OptionList
      options={[
        {
          label: "An meine Adresse",
          badge: "Empfohlen",
          description: profile,
          icon: <KeyRound aria-hidden className="size-5" />,
          onSelect: () => onSubmit({ shipTo: "profil" }, `An meine Adresse: ${profile}`),
        },
        {
          label: "An die Wohnung",
          description: `${addressLine(draft)}. Nur wenn dort jemand das Paket annehmen kann.`,
          icon: <DoorOpen aria-hidden className="size-5" />,
          onSelect: () => onSubmit({ shipTo: "wohnung" }, `An die Wohnung: ${addressLine(draft)}`),
        },
      ]}
    />
  );
}

export const steps: Step[] = [
  {
    id: "intro",
    applies: always,
    complete: (d) => Boolean(d.description),
    question: () => ({
      title: "Beschreiben Sie Ihre Wohnung in ein paar Sätzen oder fügen Sie Ihren bestehenden Inseratstext ein.",
      detail: "Ich übernehme daraus alle Eckdaten und frage nur nach, was noch fehlt.",
    }),
    Input: IntroInput,
  },
  {
    id: "address",
    applies: always,
    complete: (d) => Boolean(d.street && d.zip && d.city),
    question: () => ({ title: "Wo liegt die Wohnung?", detail: "Die genaue Adresse sehen Interessenten erst nach der Buchung eines Slots." }),
    Input: AddressInput,
  },
  {
    id: "basics",
    applies: always,
    complete: (d) => Boolean(d.rooms && d.size && d.floor),
    question: () => ({ title: "Wie groß ist die Wohnung und in welcher Etage liegt sie?" }),
    Input: BasicsInput,
  },
  {
    id: "rent",
    applies: always,
    complete: (d) => d.coldRent != null && d.utilities != null && d.deposit != null,
    question: () => ({ title: "Wie hoch sind Miete, Nebenkosten und Kaution?" }),
    Input: RentInput,
  },
  {
    id: "availability",
    applies: always,
    complete: (d) => Boolean(d.availableFrom && d.leaseType),
    question: (d) => ({
      title: d.availableFrom
        ? `Die Wohnung ist ab ${formatDate(d.availableFrom)} frei. Vermieten Sie unbefristet oder befristet?`
        : "Ab wann ist die Wohnung frei, und vermieten Sie unbefristet oder befristet?",
    }),
    Input: AvailabilityInput,
  },
  {
    id: "occupancy",
    applies: always,
    complete: (d) => Boolean(d.occupancy),
    question: () => ({
      title: "Ist die Wohnung zu den Besichtigungen leer?",
      detail: "Davon hängt ab, ob Interessenten allein per Smartlock besichtigen können.",
    }),
    Input: OccupancyInput,
  },
  {
    id: "access",
    applies: isEmpty,
    complete: (d) => Boolean(d.buildingAccess),
    question: () => ({
      title: "Wie kommen Interessenten ins Haus?",
      detail: "Das Smartlock sitzt an der Wohnungstür. Für die Haustür brauchen wir eventuell noch eine Lösung.",
    }),
    Input: AccessInput,
  },
  {
    id: "viewing",
    applies: always,
    complete: (d) => slotsPerWeek(d) > 0,
    question: (d) => ({
      title: "Wann dürfen Besichtigungen stattfinden?",
      detail:
        d.occupancy === "bewohnt"
          ? "Wählen Sie Zeiten, zu denen Sie oder die Mieter vor Ort sein können. Interessenten buchen daraus feste Slots."
          : "Interessenten buchen daraus feste Slots. Sie müssen dafür nicht vor Ort sein.",
    }),
    Input: ViewingInput,
  },
  {
    id: "deposit",
    applies: isEmpty,
    complete: (d) => d.viewingDeposit != null,
    question: () => ({
      title: "Wie hoch soll die Besichtigungskaution sein?",
      detail: "Interessenten hinterlegen sie vor der Besichtigung. Sie sichert Sie ab, falls etwas beschädigt wird.",
    }),
    Input: DepositInput,
  },
  {
    id: "requirements",
    applies: always,
    complete: (d) => d.minIncome != null,
    question: () => ({
      title: "Worauf legen Sie bei Bewerbungen Wert?",
      detail: "Nur Kriterien, die nach dem Allgemeinen Gleichbehandlungsgesetz zulässig sind.",
    }),
    Input: RequirementsInput,
  },
  {
    id: "photos",
    applies: always,
    complete: (d) => d.photos.length >= 3,
    question: () => ({
      title: "Laden Sie mindestens drei Fotos vom aktuellen Zustand hoch.",
      detail:
        "Am Ende jeder Besichtigung fotografieren Interessenten dieselben Räume. So lässt sich ein Schaden eindeutig zuordnen.",
    }),
    Input: PhotosInput,
  },
  {
    id: "shipping",
    applies: isEmpty,
    complete: (d) => Boolean(d.shipTo),
    question: (d) => ({
      title: "Wohin sollen wir Ihr Smartlock-Paket schicken?",
      detail: `Es enthält ein Nuki Smart Lock und einen LTE-Stick${d.buildingAccess === "klingel" ? ", dazu den Nuki Opener" : ""}. Die Montage dauert etwa 10 Minuten, ohne Bohren.`,
    }),
    Input: ShippingInput,
  },
];
