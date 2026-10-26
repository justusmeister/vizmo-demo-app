"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { employmentLabels } from "@/features/criteria/types";
import { contactLabels, durationLabels, formatDate, formatEuro, type Application } from "./draft";
import type { SectionProps } from "./sections";
import type { StepId } from "./steps";

function Block({ title, step, goTo, children }: { title: string; step: StepId; goTo: (step: StepId) => void; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2 rounded-card border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-h3">{title}</h3>
        <Button size="sm" variant="tertiary" onClick={() => goTo(step)}>
          Ändern
        </Button>
      </div>
      <dl className="flex flex-col gap-1.5">{children}</dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-slate">{label}</dt>
      <dd className="min-w-0 text-right font-medium break-words">{value}</dd>
    </div>
  );
}

const personsLabel = (a: Application) =>
  [`${a.adults} ${a.adults === 1 ? "Erwachsene Person" : "Erwachsene"}`, a.children ? `${a.children} ${a.children === 1 ? "Kind" : "Kinder"}` : null]
    .filter(Boolean)
    .join(", ");

export function Review({ data, update, errors, goTo }: SectionProps & { goTo: (step: StepId) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <Block title="Kontakt" step="kontakt" goTo={goTo}>
        <Row label="Name" value={`${data.salutation !== "Keine Angabe" ? `${data.salutation} ` : ""}${data.firstName} ${data.lastName}`} />
        <Row label="E-Mail" value={data.email} />
        {data.phone && <Row label="Telefon" value={data.phone} />}
        <Row label="Kontakt per" value={data.contact.map((c) => contactLabels[c]).join(", ")} />
      </Block>
      <Block title="Haushalt und Einzug" step="haushalt" goTo={goTo}>
        <Row label="Haushalt" value={personsLabel(data)} />
        <Row label="Einzug ab" value={data.moveIn ? formatDate(data.moveIn) : "–"} />
        {data.duration && <Row label="Mietdauer" value={durationLabels[data.duration]} />}
        <Row label="Haustiere" value={data.pets === "ja" ? data.petDescription : "Keine"} />
        <Row label="Rauchen" value={data.smoker === "ja" ? "Ja" : "Nein"} />
      </Block>
      <Block title="Beruf und Einkommen" step="beruf" goTo={goTo}>
        <Row label="Beschäftigung" value={data.employment ? employmentLabels[data.employment] : "–"} />
        {data.occupation && <Row label="Tätigkeit" value={data.occupation} />}
        <Row label="Nettoeinkommen" value={data.netIncome != null ? formatEuro(data.netIncome) : "–"} />
        {data.guarantee && <Row label="Bürgschaft" value="Möglich" />}
        <Row label="Nachweise" value={data.documents.length ? `${data.documents.length} Datei${data.documents.length === 1 ? "" : "en"}` : "Keine"} />
      </Block>
      <Block title="Über Sie" step="vorstellung" goTo={goTo}>
        <dd className="text-night">{data.about.trim() ? `„${data.about.trim()}“` : <span className="text-slate">Keine Vorstellung. Ein paar Sätze erhöhen Ihre Chancen.</span>}</dd>
        {data.extra.trim() && <dd className="text-slate">{data.extra.trim()}</dd>}
      </Block>

      <div className="flex flex-col gap-3 rounded-card bg-mist p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox checked={data.truthful} onChange={(event) => update({ truthful: event.target.checked })} className="mt-0.5" />
          <span>Meine Angaben sind wahrheitsgemäß.</span>
        </label>
        {errors.truthful && <p className="pl-8 text-small font-medium text-error">{errors.truthful}</p>}
        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox checked={data.privacy} onChange={(event) => update({ privacy: event.target.checked })} className="mt-0.5" />
          <span>
            Ich bin einverstanden, dass vizmo meine Angaben an den Vermieter dieser Wohnung weitergibt und mich zur Bewerbung
            kontaktiert. Die Daten werden nach Abschluss der Vermietung gelöscht.
          </span>
        </label>
        {errors.privacy && <p className="pl-8 text-small font-medium text-error">{errors.privacy}</p>}
      </div>
    </div>
  );
}
