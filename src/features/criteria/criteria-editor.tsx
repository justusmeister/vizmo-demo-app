"use client";

import { CircleX, Plus, Scale, ShieldCheck, Trash } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChoiceChip } from "@/components/ui/choice-chip";
import { Input, Select } from "@/components/ui/input";
import { cx } from "@/lib/cx";
import { checkCriterion, customSuggestions, protectedGrounds, type CheckOutcome } from "./agg-check";
import { employmentLabels, petLabels, type Criteria, type Employment } from "./types";

// Predefined, adjustable criteria plus custom ones that pass the (simulated) AI check
// against the AGG. Criteria only sort applications, they never exclude anyone.

type CriteriaEditorProps = {
  value: Criteria;
  onChange: (value: Criteria) => void;
  warmRent?: number;
};

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function Row({
  title,
  description,
  enabled,
  onToggle,
  disabled,
  badge,
  children,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle?: (enabled: boolean) => void;
  disabled?: boolean;
  badge?: string;
  children?: ReactNode;
}) {
  return (
    <li className={cx("flex flex-col gap-3 px-4 py-3.5", enabled && "bg-white")}>
      <label className={cx("flex items-start gap-3", disabled ? "cursor-not-allowed" : "cursor-pointer")}>
        <Checkbox
          checked={enabled}
          disabled={disabled}
          onChange={(event) => onToggle?.(event.target.checked)}
          className="mt-0.5"
        />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2 font-medium text-night">
            {title}
            {badge && <span className="rounded-full bg-mist px-2 py-0.5 text-small text-night">{badge}</span>}
          </span>
          <span className="block text-small text-slate">{description}</span>
        </span>
      </label>
      {enabled && children && <div className="pl-8">{children}</div>}
    </li>
  );
}

export function CriteriaEditor({ value, onChange, warmRent }: CriteriaEditorProps) {
  const [draft, setDraft] = useState("");
  const [checking, setChecking] = useState(false);
  const [outcome, setOutcome] = useState<{ text: string; result: CheckOutcome } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const set = <K extends keyof Criteria>(key: K, patch: Partial<Criteria[K]>) =>
    onChange({ ...value, [key]: { ...(value[key] as object), ...patch } });

  function toggleEmployment(item: Employment) {
    const values = value.employment.values.includes(item)
      ? value.employment.values.filter((e) => e !== item)
      : [...value.employment.values, item];
    set("employment", { values });
  }

  function runCheck(text: string) {
    const trimmed = text.trim();
    if (trimmed.length < 4) return;
    setChecking(true);
    setOutcome(null);
    timer.current = window.setTimeout(() => {
      const result = checkCriterion(trimmed);
      setChecking(false);
      setOutcome({ text: trimmed, result });
      if (result.allowed) {
        onChange({ ...value, custom: [...value.custom, { id: `${Date.now()}`, text: trimmed }] });
        setDraft("");
      }
    }, 900);
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h3 className="text-h3">Vorgegebene Kriterien</h3>
        <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
          <Row
            title="Mindesteinkommen"
            description="Haushaltsnettoeinkommen pro Monat"
            enabled={value.income.enabled}
            onToggle={(enabled) => set("income", { enabled })}
          >
            <Input
              label="Netto ab"
              type="number"
              min={0}
              step={100}
              suffix="€"
              value={value.income.min}
              onChange={(event) => set("income", { min: Number(event.target.value) })}
              hint={warmRent ? `Üblich: dreifache Warmmiete, also ${euro.format(Math.ceil((warmRent * 3) / 100) * 100)}` : undefined}
              className="max-w-60"
            />
          </Row>
          <Row
            title="Beschäftigung"
            description="Bevorzugte Beschäftigungsarten"
            enabled={value.employment.enabled}
            onToggle={(enabled) => set("employment", { enabled })}
          >
            <div className="flex flex-wrap gap-2">
              {(Object.keys(employmentLabels) as Employment[]).map((item) => (
                <ChoiceChip key={item} selected={value.employment.values.includes(item)} onClick={() => toggleEmployment(item)}>
                  {employmentLabels[item]}
                </ChoiceChip>
              ))}
            </div>
          </Row>
          <Row
            title="Haushaltsgröße"
            description="Wie viele Personen einziehen"
            enabled={value.persons.enabled}
            onToggle={(enabled) => set("persons", { enabled })}
          >
            <Select
              label="Höchstens"
              value={value.persons.max}
              onChange={(event) => set("persons", { max: Number(event.target.value) })}
              className="max-w-60"
            >
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? "Person" : "Personen"}
                </option>
              ))}
            </Select>
          </Row>
          <Row title="Haustiere" description="Ob Tiere einziehen dürfen" enabled={value.pets.enabled} onToggle={(enabled) => set("pets", { enabled })}>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(petLabels) as (keyof typeof petLabels)[]).map((item) => (
                <ChoiceChip key={item} selected={value.pets.value === item} onClick={() => set("pets", { value: item })}>
                  {petLabels[item]}
                </ChoiceChip>
              ))}
            </div>
          </Row>
          <Row title="Rauchen" description="In der Wohnung" enabled={value.smoking.enabled} onToggle={(enabled) => set("smoking", { enabled })}>
            <div className="flex flex-wrap gap-2">
              <ChoiceChip selected={value.smoking.value === "nein"} onClick={() => set("smoking", { value: "nein" })}>
                Nicht erlaubt
              </ChoiceChip>
              <ChoiceChip selected={value.smoking.value === "ja"} onClick={() => set("smoking", { value: "ja" })}>
                Erlaubt
              </ChoiceChip>
            </div>
          </Row>
          <Row
            title="Einzugstermin"
            description="Spätester gewünschter Einzug"
            enabled={value.moveIn.enabled}
            onToggle={(enabled) => set("moveIn", { enabled })}
          >
            <Input
              label="Einzug spätestens"
              type="date"
              value={value.moveIn.latest}
              onChange={(event) => set("moveIn", { latest: event.target.value })}
              className="max-w-60"
            />
          </Row>
          <Row
            title="Mietdauer"
            description="Wie lange Interessenten mindestens bleiben möchten"
            enabled={value.duration.enabled}
            onToggle={(enabled) => set("duration", { enabled })}
          >
            <Select
              label="Mindestens"
              value={value.duration.years}
              onChange={(event) => set("duration", { years: Number(event.target.value) })}
              className="max-w-60"
            >
              {[1, 2, 3, 5].map((years) => (
                <option key={years} value={years}>
                  {years} {years === 1 ? "Jahr" : "Jahre"}
                </option>
              ))}
            </Select>
          </Row>
          <Row
            title="SCHUFA und Mietschuldenfreiheit"
            description="Nachweise direkt in der Bewerbung"
            enabled={false}
            disabled
            badge="Bald verfügbar"
          />
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h3 className="text-h3">Eigene Kriterien</h3>
          <p className="mt-0.5 text-slate">
            Beschreiben Sie, was Ihnen noch wichtig ist. Die KI prüft jedes Kriterium, bevor es übernommen wird.
          </p>
        </div>

        {value.custom.length > 0 && (
          <ul className="flex flex-col gap-2">
            {value.custom.map((item) => (
              <li key={item.id} className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-2.5">
                <ShieldCheck aria-hidden className="size-4 shrink-0 text-deep-blue" />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{item.text}</span>
                  <span className="block text-small text-slate">Geprüft: zulässig. Wird im Bewerbungsformular abgefragt.</span>
                </span>
                <button
                  type="button"
                  onClick={() => onChange({ ...value, custom: value.custom.filter((c) => c.id !== item.id) })}
                  aria-label={`${item.text} entfernen`}
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-button text-slate hover:bg-mist hover:text-night"
                >
                  <Trash aria-hidden className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            runCheck(draft);
          }}
          className="flex flex-col gap-2 sm:flex-row sm:items-end"
        >
          <Input
            label="Neues Kriterium"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setOutcome(null);
            }}
            placeholder="z. B. Bereitschaft zur Kehrwoche"
            className="flex-1"
          />
          <Button type="submit" variant="secondary" loading={checking} disabled={draft.trim().length < 4} icon={<Plus aria-hidden className="size-4" />}>
            {checking ? "KI prüft …" : "Prüfen und hinzufügen"}
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-small text-slate">Vorschläge:</span>
          {customSuggestions
            .filter((suggestion) => !value.custom.some((c) => c.text === suggestion))
            .map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setDraft(suggestion)}
                className="rounded-full border border-line bg-white px-3 py-1 text-small font-medium text-night hover:border-gray"
              >
                {suggestion}
              </button>
            ))}
        </div>

        <div aria-live="polite">
          {outcome && !outcome.result.allowed && (
            <div className="flex gap-3 rounded-card border border-error bg-white p-4">
              <CircleX aria-hidden className="mt-0.5 size-5 shrink-0 text-error" />
              <div>
                <p className="font-medium text-error">Nicht zulässig: {outcome.result.ground}</p>
                <p className="mt-0.5 text-night">
                  „{outcome.text}“ {outcome.result.reason} Das Kriterium wird nicht übernommen.
                </p>
              </div>
            </div>
          )}
          {outcome?.result.allowed && (
            <p className="flex items-center gap-2 text-small font-medium text-night">
              <ShieldCheck aria-hidden className="size-4 text-deep-blue" />„{outcome.text}“ ist zulässig und wurde hinzugefügt.
            </p>
          )}
        </div>
      </section>

      <p className="flex items-start gap-2 rounded-card bg-mist p-4 text-night">
        <Scale aria-hidden className="mt-0.5 size-5 shrink-0 text-deep-blue" />
        <span>
          Nicht wählbar nach dem Allgemeinen Gleichbehandlungsgesetz: {protectedGrounds.join(", ")}. Kriterien sortieren
          Bewerbungen nur, niemand wird automatisch abgelehnt.
        </span>
      </p>
    </div>
  );
}
