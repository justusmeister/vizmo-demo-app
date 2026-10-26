"use client";

import { ChevronRight, FileText } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { cx } from "@/lib/cx";

// Rules and confirmations the applicant accepts before booking. Each document can be read
// in full and must be confirmed individually. Demo texts, not legally reviewed.

export type DocId = "besichtigung" | "hausordnung" | "haftung" | "datenschutz";

type Doc = { id: DocId; title: string; summary: string; version: string; body: (ctx: DocContext) => ReactNode };
type DocContext = { address: string; deposit: number; duration: number; landlord: string };

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-h3">{title}</h3>
      <div className="flex flex-col gap-2 text-night">{children}</div>
    </section>
  );
}

export const docs: Doc[] = [
  {
    id: "besichtigung",
    title: "Regeln für die Besichtigung",
    summary: "Allein, pünktlich, nichts verändern, am Ende drei Fotos",
    version: "Fassung 2.1 vom 01.10.2026",
    body: ({ duration }) => (
      <>
        <Section title="1. Zeitfenster">
          <p>Die Wohnung öffnet sich nur in Ihrem gebuchten Zeitfenster von {duration} Minuten. Bitte erscheinen Sie pünktlich. Eine Verlängerung ist nicht möglich, weil direkt danach die nächste Person besichtigt.</p>
          <p>Kurz vor Ende erhalten Sie einen Hinweis in der App. Verlassen Sie die Wohnung bitte vor Ablauf der Zeit.</p>
        </Section>
        <Section title="2. Begleitung">
          <p>Sie besichtigen allein oder mit den Personen, die mit Ihnen einziehen. Weitere Personen, Makler oder Handwerker dürfen nicht mitgebracht werden.</p>
        </Section>
        <Section title="3. Verhalten in der Wohnung">
          <ul className="list-disc pl-5">
            <li>Nichts verändern, verschieben oder mitnehmen. Schränke und Geräte dürfen angesehen, aber nicht benutzt werden.</li>
            <li>In der Wohnung wird nicht geraucht, gegessen oder getrunken.</li>
            <li>Haustiere bleiben draußen.</li>
            <li>Fenster und Balkontür beim Gehen schließen.</li>
          </ul>
        </Section>
        <Section title="4. Fotos zum Abschluss">
          <p>Am Ende fotografieren Sie in der App drei Räume aus der vorgegebenen Perspektive. Die Fotos werden mit dem Zustand vor Ihrer Besichtigung verglichen und nach 30 Tagen gelöscht.</p>
        </Section>
        <Section title="5. Zugang">
          <p>Der Öffnungslink ist persönlich und darf nicht weitergegeben werden. Schließen Sie die Wohnungstür beim Gehen, das Smartlock verriegelt automatisch.</p>
        </Section>
      </>
    ),
  },
  {
    id: "hausordnung",
    title: "Hausordnung (Auszug)",
    summary: "Ruhe im Haus, Haustür schließen, Hof und Treppenhaus",
    version: "Gneisenaustraße 41, Stand 2025",
    body: ({ address }) => (
      <>
        <p className="text-slate">Auszug aus der Hausordnung für {address}, soweit sie für Besuchende gilt.</p>
        <Section title="Ruhe">
          <p>Bitte verhalten Sie sich im Treppenhaus und in der Wohnung ruhig. Die Mittagsruhe gilt von 13 bis 15 Uhr, die Nachtruhe ab 22 Uhr.</p>
        </Section>
        <Section title="Haustür und Treppenhaus">
          <p>Die Haustür muss stets geschlossen sein. Bitte lassen Sie keine fremden Personen ins Haus. Im Treppenhaus dürfen keine Fahrräder, Kinderwagen oder sonstigen Gegenstände abgestellt werden.</p>
        </Section>
        <Section title="Hof">
          <p>Der Hof ist kein Durchgang zu anderen Grundstücken. Fahrräder werden nur in den dafür vorgesehenen Ständern abgestellt.</p>
        </Section>
      </>
    ),
  },
  {
    id: "haftung",
    title: "Haftung und Kaution",
    summary: "Haftung für Schäden, Kaution wird nur vorgemerkt",
    version: "Fassung 1.4 vom 01.10.2026",
    body: ({ deposit, landlord }) => (
      <>
        <Section title="1. Haftung">
          <p>Für Schäden, die Sie während Ihres Zeitfensters in der Wohnung oder im Haus verursachen, haften Sie gegenüber dem Vermieter {landlord} nach den gesetzlichen Vorschriften. Das gilt auch für Schäden durch mitgebrachte Personen.</p>
        </Section>
        <Section title="2. Besichtigungskaution">
          <p>Vor der Besichtigung werden {deposit} € auf Ihrer Karte vorgemerkt (Pre-Authorization über Stripe). Der Betrag wird nicht abgebucht.</p>
          <p>Ergibt der Fotoabgleich keine Auffälligkeiten, geben wir die Vormerkung direkt nach der Besichtigung frei, spätestens nach 7 Tagen. Bei einem festgestellten Schaden kann der Vermieter den Betrag ganz oder teilweise einziehen. Sie werden vorher informiert und können widersprechen.</p>
        </Section>
        <Section title="3. Nachweis">
          <p>Grundlage für die Beurteilung sind die Zustandsfotos vor und nach Ihrer Besichtigung sowie das Protokoll des Smartlocks mit Öffnungs- und Schließzeit.</p>
        </Section>
      </>
    ),
  },
  {
    id: "datenschutz",
    title: "Datenschutz bei der Besichtigung",
    summary: "Identitätsprüfung, Smartlock-Protokoll, Fotos",
    version: "Fassung 3.0 vom 15.09.2026",
    body: () => (
      <>
        <Section title="Was wir verarbeiten">
          <ul className="list-disc pl-5">
            <li>Ergebnis der Identitätsprüfung durch Didit (nicht die Ausweisdaten selbst)</li>
            <li>Öffnungs- und Schließzeiten des Smartlocks während Ihres Zeitfensters</li>
            <li>Ihre Fotos zum Abschluss der Besichtigung</li>
            <li>Status der Kautionsvormerkung über Stripe (keine Kartendaten)</li>
          </ul>
        </Section>
        <Section title="Wie lange">
          <p>Fotos und Smartlock-Protokoll löschen wir 30 Tage nach der Besichtigung, sofern kein Schaden geklärt werden muss. Alle übrigen Daten werden nach Abschluss der Vermietung gelöscht.</p>
        </Section>
        <Section title="Ihre Rechte">
          <p>Sie können jederzeit Auskunft, Berichtigung oder Löschung verlangen. In der Wohnung gibt es keine Kameras.</p>
        </Section>
      </>
    ),
  },
];

type DocumentsProps = {
  accepted: Set<DocId>;
  onToggle: (id: DocId) => void;
  context: DocContext;
};

export function Documents({ accepted, onToggle, context }: DocumentsProps) {
  const [openId, setOpenId] = useState<DocId | null>(null);
  const open = docs.find((d) => d.id === openId) ?? null;

  return (
    <>
      <ul className="flex flex-col gap-2">
        {docs.map((doc) => {
          const checked = accepted.has(doc.id);
          return (
            <li key={doc.id} className={cx("rounded-card border bg-white", checked ? "border-blue" : "border-line")}>
              <button type="button" onClick={() => setOpenId(doc.id)} className="flex w-full items-center gap-3 px-4 pt-3 text-left">
                <FileText aria-hidden className="size-5 shrink-0 text-deep-blue" />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{doc.title}</span>
                  <span className="block text-small text-slate">{doc.summary}</span>
                </span>
                <span className="flex shrink-0 items-center text-small font-medium text-blue">
                  Ansehen
                  <ChevronRight aria-hidden className="size-4" />
                </span>
              </button>
              <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
                <Checkbox checked={checked} onChange={() => onToggle(doc.id)} />
                <span className="text-small font-medium">Gelesen und akzeptiert</span>
              </label>
            </li>
          );
        })}
      </ul>

      <Dialog
        open={open != null}
        onClose={() => setOpenId(null)}
        variant="side"
        title={open?.title ?? ""}
        description={open?.version}
        footer={
          open && (
            <Button
              onClick={() => {
                if (!accepted.has(open.id)) onToggle(open.id);
                setOpenId(null);
              }}
              className="w-full sm:w-auto"
            >
              {accepted.has(open.id) ? "Schließen" : "Gelesen und akzeptieren"}
            </Button>
          )
        }
      >
        {open && (
          <div className="flex flex-col gap-5">
            {open.body(context)}
            <p className="border-t border-line pt-4 text-small text-slate">Demo-Fassung, rechtlich nicht geprüft.</p>
          </div>
        )}
      </Dialog>
    </>
  );
}
