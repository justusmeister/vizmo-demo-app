"use client";

import { Check, FileText, Minus, Plus, Scale, Trash, Upload } from "lucide-react";
import { useId, type ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChoiceChip, ChoiceGroup } from "@/components/ui/choice-chip";
import { Input, Select, Textarea } from "@/components/ui/input";
import type { Listing } from "@/data/listings";
import { protectedGroundsIn } from "@/features/criteria/agg-check";
import { employmentLabels, type Employment } from "@/features/criteria/types";
import { cx } from "@/lib/cx";
import { contactLabels, durationLabels, formatEuro, warm, type Application, type Contact } from "./draft";

export type SectionProps = {
  data: Application;
  update: (patch: Partial<Application>) => void;
  errors: Record<string, string>;
  listing: Listing;
};

function Group({ title, hint, children }: { title: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-line pt-6 first:border-t-0 first:pt-0">
      <div>
        <h3 className="text-h3">{title}</h3>
        {hint && <p className="mt-0.5 text-slate">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function Required() {
  return <span className="font-normal text-slate"> (Pflichtfeld)</span>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-small font-medium text-error">{message}</p>;
}

/** Large tappable single choice in a row (Ja/Nein style). */
function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
  error,
}: {
  label: ReactNode;
  value?: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  error?: string;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1.5 font-medium text-slate">{label}</legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <ChoiceChip
            key={option.value}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
            className="min-h-12 justify-center"
          >
            {option.label}
          </ChoiceChip>
        ))}
      </div>
      <FieldError message={error} />
    </fieldset>
  );
}

function Stepper({
  label,
  hint,
  value,
  min,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  const button = "inline-flex size-11 items-center justify-center rounded-button border border-line bg-white text-night hover:bg-mist disabled:text-gray disabled:hover:bg-white";
  return (
    <div className="flex items-center justify-between gap-4 rounded-card border border-line bg-white px-4 py-3">
      <div>
        <p id={id} className="font-medium">
          {label}
        </p>
        {hint && <p className="text-small text-slate">{hint}</p>}
      </div>
      <div className="flex items-center gap-3" role="group" aria-labelledby={id}>
        <button type="button" className={button} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`${label}: eine weniger`}>
          <Minus aria-hidden className="size-4" />
        </button>
        <output aria-live="polite" className="w-6 text-center text-h3 font-display font-bold tabular-nums">
          {value}
        </output>
        <button type="button" className={button} onClick={() => onChange(value + 1)} disabled={value >= 9} aria-label={`${label}: eine mehr`}>
          <Plus aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function StepKontakt({ data, update, errors }: SectionProps) {
  const toggle = (contact: Contact) => {
    const next = data.contact.includes(contact) ? data.contact.filter((c) => c !== contact) : [...data.contact, contact];
    update({ contact: next.length ? next : ["email"] });
  };
  return (
    <div className="flex flex-col gap-6">
      <Group title="Name">
        <Select
          label="Anrede"
          value={data.salutation}
          onChange={(event) => update({ salutation: event.target.value as Application["salutation"] })}
          hint="Nur für die Ansprache in E-Mails."
        >
          <option>Keine Angabe</option>
          <option>Frau</option>
          <option>Herr</option>
        </Select>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Vorname (Pflichtfeld)" value={data.firstName} onChange={(event) => update({ firstName: event.target.value })} autoComplete="given-name" enterKeyHint="next" error={errors.firstName} />
          <Input label="Nachname (Pflichtfeld)" value={data.lastName} onChange={(event) => update({ lastName: event.target.value })} autoComplete="family-name" enterKeyHint="next" error={errors.lastName} />
        </div>
      </Group>

      <Group title="So erreicht man Sie" hint="Über Ihre E-Mail-Adresse bekommen Sie Einladung und Termine. Ohne sie können wir Sie nicht erreichen.">
        <Input
          label="E-Mail-Adresse (Pflichtfeld)"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          enterKeyHint="next"
          value={data.email}
          onChange={(event) => update({ email: event.target.value })}
          placeholder="name@beispiel.de"
          error={errors.email}
        />
        <Input
          label={data.contact.some((c) => c !== "email") ? "Telefonnummer (Pflichtfeld)" : "Telefonnummer (optional)"}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          enterKeyHint="done"
          value={data.phone}
          onChange={(event) => update({ phone: event.target.value })}
          placeholder="0170 1234567"
          error={errors.phone}
        />
        <ChoiceGroup label="Wie dürfen wir Sie kontaktieren?">
          {(Object.keys(contactLabels) as Contact[]).map((contact) => (
            <ChoiceChip key={contact} selected={data.contact.includes(contact)} onClick={() => toggle(contact)}>
              {contactLabels[contact]}
            </ChoiceChip>
          ))}
        </ChoiceGroup>
      </Group>
    </div>
  );
}

export function StepHaushalt({ data, update, errors, listing }: SectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <Group title="Wer zieht ein?">
        <Stepper label="Erwachsene" value={data.adults} min={1} onChange={(adults) => update({ adults })} />
        <Stepper label="Kinder" hint="Unter 18 Jahren" value={data.children} min={0} onChange={(children) => update({ children })} />
      </Group>

      <Group title="Einzug">
        <Input
          label="Frühester Einzug (Pflichtfeld)"
          type="date"
          min={listing.availableFrom}
          value={data.moveIn}
          onChange={(event) => update({ moveIn: event.target.value })}
          hint={`Die Wohnung ist ab ${listing.availableFrom.split("-").reverse().join(".")} frei.`}
          error={errors.moveIn}
        />
        <Select
          label="Wie lange möchten Sie bleiben?"
          value={data.duration ?? ""}
          onChange={(event) => update({ duration: (event.target.value || undefined) as Application["duration"] })}
        >
          <option value="">Bitte wählen</option>
          {(Object.keys(durationLabels) as (keyof typeof durationLabels)[]).map((key) => (
            <option key={key} value={key}>
              {durationLabels[key]}
            </option>
          ))}
        </Select>
      </Group>

      <Group title="Haustiere und Rauchen">
        <Choice
          label={<>Ziehen Haustiere mit ein?<Required /></>}
          value={data.pets}
          onChange={(pets) => update({ pets })}
          options={[
            { value: "nein", label: "Nein" },
            { value: "ja", label: "Ja" },
          ]}
          error={errors.pets}
        />
        {data.pets === "ja" && (
          <Input
            label="Welches Tier? (Pflichtfeld)"
            value={data.petDescription}
            onChange={(event) => update({ petDescription: event.target.value })}
            placeholder="z. B. Katze, 6 Jahre, wohnungsgewohnt"
            error={errors.petDescription}
          />
        )}
        <Choice
          label={<>Rauchen Sie in der Wohnung?<Required /></>}
          value={data.smoker}
          onChange={(smoker) => update({ smoker })}
          options={[
            { value: "nein", label: "Nein" },
            { value: "ja", label: "Ja" },
          ]}
          error={errors.smoker}
        />
      </Group>
    </div>
  );
}

function DocumentUpload({ data, update }: Pick<SectionProps, "data" | "update">) {
  const id = useId();
  return (
    <div className="flex flex-col gap-3">
      {data.documents.length > 0 && (
        <ul className="flex flex-col gap-2">
          {data.documents.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 rounded-card border border-line bg-white px-3 py-2.5">
              <FileText aria-hidden className="size-5 shrink-0 text-deep-blue" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{doc.name}</span>
                <span className="text-small text-slate">{Math.max(1, Math.round(doc.size / 1024))} KB</span>
              </span>
              <button
                type="button"
                aria-label={`${doc.name} entfernen`}
                onClick={() => update({ documents: data.documents.filter((d) => d.id !== doc.id) })}
                className="inline-flex size-10 items-center justify-center rounded-button text-slate hover:bg-mist hover:text-night"
              >
                <Trash aria-hidden className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <label
        htmlFor={id}
        className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-card border-2 border-dashed border-line bg-white px-4 py-3 font-medium text-night hover:border-gray has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue"
      >
        <Upload aria-hidden className="size-5 text-deep-blue" />
        Nachweise hinzufügen
        <input
          id={id}
          type="file"
          multiple
          accept="application/pdf,image/*"
          className="sr-only"
          onChange={(event) => {
            const files = [...(event.target.files ?? [])].map((file, i) => ({
              id: `${Date.now()}-${i}`,
              name: file.name,
              size: file.size,
              kind: file.type,
            }));
            update({ documents: [...data.documents, ...files] });
            event.target.value = "";
          }}
        />
      </label>
      <p className="text-small text-slate">PDF oder Foto, z. B. Gehaltsnachweise, Bürgschaft, Mietschuldenfreiheitsbescheinigung.</p>
    </div>
  );
}

export function StepBeruf({ data, update, errors, listing }: SectionProps) {
  const rent = warm(listing);
  return (
    <div className="flex flex-col gap-6">
      <Group title="Beschäftigung">
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 font-medium text-slate">
            Ihre Beschäftigung<Required />
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {(Object.keys(employmentLabels) as Employment[]).map((value) => (
              <ChoiceChip key={value} selected={data.employment === value} onClick={() => update({ employment: value })} className="min-h-12">
                {employmentLabels[value]}
              </ChoiceChip>
            ))}
          </div>
          <FieldError message={errors.employment} />
        </fieldset>
        <Input
          label="Tätigkeit (optional)"
          value={data.occupation}
          onChange={(event) => update({ occupation: event.target.value })}
          placeholder="z. B. Pflegefachkraft, seit 2021"
        />
      </Group>

      <Group title="Einkommen" hint={`Netto im Monat, für den ganzen Haushalt. Die Warmmiete beträgt ${formatEuro(rent)}.`}>
        <Input
          label="Haushaltsnettoeinkommen (Pflichtfeld)"
          type="number"
          inputMode="numeric"
          min={0}
          step={100}
          suffix="€"
          value={data.netIncome ?? ""}
          onChange={(event) => update({ netIncome: event.target.value === "" ? undefined : Number(event.target.value) })}
          error={errors.netIncome}
        />
        <label className="flex cursor-pointer items-start gap-3 rounded-card border border-line bg-white px-4 py-3">
          <Checkbox checked={data.guarantee} onChange={(event) => update({ guarantee: event.target.checked })} className="mt-0.5" />
          <span>
            <span className="block font-medium">Eine Bürgschaft ist möglich</span>
            <span className="block text-small text-slate">Zum Beispiel durch Eltern. Das kann ein geringeres Einkommen ausgleichen.</span>
          </span>
        </label>
      </Group>

      <Group title="Nachweise (optional)" hint="Wer Nachweise mitschickt, wird oft schneller eingeladen. Sie können sie auch später nachreichen.">
        <DocumentUpload data={data} update={update} />
      </Group>
    </div>
  );
}

const ABOUT_MAX = 1000;

export function StepVorstellung({ data, update }: SectionProps) {
  const grounds = protectedGroundsIn(`${data.about} ${data.extra}`);
  return (
    <div className="flex flex-col gap-6">
      <Group title="Stellen Sie sich vor" hint="Ein paar Sätze reichen: wer Sie sind, warum diese Wohnung, was Ihnen wichtig ist.">
        <Textarea
          label="Ihre Vorstellung (optional, empfohlen)"
          rows={6}
          maxLength={ABOUT_MAX}
          value={data.about}
          onChange={(event) => update({ about: event.target.value })}
          placeholder="z. B. Wir sind ein ruhiger Zwei-Personen-Haushalt, arbeiten beide im Büro und suchen eine Wohnung zum Bleiben …"
          hint={`${data.about.length} von ${ABOUT_MAX} Zeichen`}
        />
        <ul className="flex flex-col gap-1.5 text-small text-slate">
          {["Warum passt die Wohnung zu Ihnen?", "Wie wohnen Sie bisher?", "Was sollte der Vermieter noch wissen?"].map((tip) => (
            <li key={tip} className="flex items-center gap-2">
              <Check aria-hidden className="size-3.5 shrink-0 text-deep-blue" strokeWidth={2.5} />
              {tip}
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Weitere Informationen (optional)" hint="Zum Beispiel Fragen an den Vermieter, Wünsche zum Termin oder Besonderheiten.">
        <Textarea
          label="Ergänzungen"
          rows={3}
          value={data.extra}
          onChange={(event) => update({ extra: event.target.value })}
          placeholder="z. B. Termine passen mir am besten nach 18 Uhr."
        />
      </Group>

      <p className={cx("flex items-start gap-2 rounded-card p-4 text-small", grounds.length ? "border border-line bg-white text-night" : "bg-mist text-night")} aria-live="polite">
        <Scale aria-hidden className="mt-px size-4 shrink-0 text-deep-blue" />
        {grounds.length ? (
          <span>
            Ihr Text enthält Angaben zu {grounds.join(", ")}. Solche Angaben fließen nach dem Gleichbehandlungsgesetz nicht in
            die Auswahl ein. Sie müssen sie nicht machen.
          </span>
        ) : (
          <span>
            Angaben zu Herkunft, Religion, Alter, Gesundheit oder Familienplanung brauchen Sie nicht zu machen. Sie fließen
            nach dem Gleichbehandlungsgesetz nicht in die Auswahl ein.
          </span>
        )}
      </p>
    </div>
  );
}
