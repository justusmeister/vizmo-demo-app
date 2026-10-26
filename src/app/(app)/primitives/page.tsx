import { CalendarPlus, Plus } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ChoiceChip, ChoiceGroup } from "@/components/ui/choice-chip";
import { CopyField } from "@/components/ui/copy-field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Progress } from "@/components/ui/progress";
import { StepList } from "@/components/ui/step-list";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Komponenten – vizmo Demo" };

// Internal preview of tokens and primitives for visual QA. Not a demo screen.

const colors = [
  { name: "Vizmo Blau", token: "blue", className: "bg-blue" },
  { name: "Nachtblau", token: "night", className: "bg-night" },
  { name: "Lavendel", token: "lavender", className: "bg-lavender" },
  { name: "Nebel", token: "mist", className: "bg-mist" },
  { name: "Tiefblau", token: "deep-blue", className: "bg-deep-blue" },
  { name: "Schiefer", token: "slate", className: "bg-slate" },
  { name: "Grau", token: "gray", className: "bg-gray" },
  { name: "Linie", token: "line", className: "bg-line" },
  { name: "Fläche", token: "surface", className: "bg-surface" },
  { name: "Weiß", token: "white", className: "bg-white" },
  { name: "Bestätigt", token: "success", className: "bg-success" },
  { name: "Hinweis", token: "warning", className: "bg-warning" },
  { name: "Fehler", token: "error", className: "bg-error" },
];

const viewings = [
  { id: 1, name: "Lena Hoffmann", flat: "Gneisenaustraße 41, 2. OG", date: "28.10.2026", time: "17:30", status: "success" },
  { id: 2, name: "Mehmet Yılmaz", flat: "Gneisenaustraße 41, 2. OG", date: "28.10.2026", time: "18:00", status: "warning" },
  { id: 3, name: "Sophie Wagner", flat: "Körnerstraße 7, EG links", date: "30.10.2026", time: "10:15", status: "neutral" },
  { id: 4, name: "Jonas Becker", flat: "Körnerstraße 7, EG links", date: "30.10.2026", time: "10:45", status: "error" },
] as const;

const statusLabels = {
  success: "Slot gebucht",
  warning: "Betragssperre aktiv",
  neutral: "Eingeladen",
  error: "Prüfung fehlgeschlagen",
} as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-h2">{title}</h2>
      {children}
    </section>
  );
}

export default function PrimitivesPage() {
  return (
    <>
      <PageHeader
        title="Komponenten"
        description="Tokens und Bausteine aus docs/vizmo-design-system.md. Interne Vorschau, kein Demo-Screen."
      />

      <div className="flex flex-col gap-12">
        <Section title="Farben">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {colors.map((color) => (
              <li key={color.token} className="flex flex-col gap-2">
                <span className={`h-14 rounded-button border border-line ${color.className}`} />
                <span>
                  <span className="block font-medium">{color.name}</span>
                  <span className="text-small text-slate">{color.token}</span>
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Typografie">
          <Card className="flex flex-col gap-3">
            <p className="font-display text-display font-bold">Display, Poppins 32</p>
            <p className="font-display text-h1 font-bold">Überschrift 1, Poppins 24</p>
            <p className="font-display text-h2 font-bold">Überschrift 2, Poppins 20</p>
            <p className="font-display text-h3 font-bold">Überschrift 3, Poppins 16</p>
            <p>Fließtext, Inter 14. Interessenten bestätigen ihre Identität, bevor sie einen Slot buchen.</p>
            <p className="font-medium">Hervorgehoben und Beschriftungen, Inter Medium 14</p>
            <p className="text-small text-slate">Klein und Metadaten, Inter 12</p>
          </Card>
        </Section>

        <Section title="Buttons">
          <Card className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <Button icon={<CalendarPlus aria-hidden className="size-4" />}>Slot buchen</Button>
              <Button variant="secondary">Termin verschieben</Button>
              <Button variant="tertiary">Details anzeigen</Button>
              <ButtonLink href="/" variant="secondary">
                Als Link
              </ButtonLink>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" icon={<Plus aria-hidden className="size-4" />}>
                Wohnung anlegen
              </Button>
              <Button size="sm" variant="secondary">
                Filtern
              </Button>
              <Button size="sm" variant="tertiary">
                Zurücksetzen
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button loading>Identität bestätigen</Button>
              <Button disabled>Slot buchen</Button>
              <Button variant="secondary" disabled>
                Termin verschieben
              </Button>
              <Button variant="tertiary" disabled>
                Details anzeigen
              </Button>
            </div>
          </Card>
        </Section>

        <Section title="Eingabefelder">
          <Card className="grid gap-5 md:grid-cols-2">
            <Input label="Vorname" placeholder="z. B. Lena" autoComplete="given-name" />
            <Input
              label="E-Mail-Adresse"
              type="email"
              placeholder="lena.hoffmann@beispiel.de"
              hint="Hierhin schicken wir die Terminbestätigung."
            />
            <Input
              label="Telefonnummer"
              type="tel"
              defaultValue="0176 1234"
              error="Die Nummer ist zu kurz. Bitte mit Vorwahl eingeben."
            />
            <Input label="Wohnungs-ID" defaultValue="GN-41-2OG" disabled />
            <Input label="Kaltmiete" type="number" defaultValue={1050} suffix="€" />
            <Select label="Etage" defaultValue="2. OG">
              <option>EG</option>
              <option>1. OG</option>
              <option>2. OG</option>
            </Select>
            <Textarea label="Beschreibung" placeholder="Helle 3-Zimmer-Wohnung …" className="md:col-span-2" />
            <CopyField label="Link zum Inserat" value="https://app.govizmo.de/u/bewerben/gneisenaustrasse-41-k7m2qx" className="md:col-span-2" />
          </Card>
        </Section>

        <Section title="Auswahl">
          <Card className="flex flex-col gap-5">
            <ChoiceGroup label="Mietdauer">
              <ChoiceChip selected>Unbefristet</ChoiceChip>
              <ChoiceChip selected={false}>Befristet</ChoiceChip>
            </ChoiceGroup>
          </Card>
        </Section>

        <Section title="Hinweis und Fortschritt">
          <Card className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <Notice title="Sortieren statt aussortieren">
                Bewerbungen werden nach Ihren Kriterien sortiert, niemand wird automatisch abgelehnt.
              </Notice>
              <Progress value={6} max={9} label="Beispiel-Fortschritt" />
            </div>
            <StepList
              items={[
                { label: "Bestellt", description: "Heute, 14:32 Uhr", state: "done" },
                { label: "Wird verpackt", state: "current" },
                { label: "Zugestellt", state: "upcoming" },
              ]}
            />
          </Card>
        </Section>

        <Section title="Badges">
          <Card className="flex flex-wrap items-center gap-3">
            <Badge>3 Bewerbungen</Badge>
            <Badge tone="success">Identität geprüft</Badge>
            <Badge tone="warning">Betragssperre aktiv</Badge>
            <Badge tone="error">Absage</Badge>
          </Card>
        </Section>

        <Section title="Karten">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader
                title="Gneisenaustraße 41, 2. OG"
                description="3 Zimmer, 78 m², 1.250 € warm"
                actions={<Badge>4 Slots frei</Badge>}
              />
            </Card>
            <Card tone="mist">
              <CardHeader title="Karte auf Nebel" description="Für hervorgehobene oder gruppierte Inhalte." />
            </Card>
          </div>
        </Section>

        <Section title="Tabelle">
          <Card padding="none">
            <CardHeader
              title="Anstehende Besichtigungen"
              description="Diese Woche"
              actions={
                <Button size="sm" variant="secondary">
                  Alle anzeigen
                </Button>
              }
              className="p-4 md:p-5"
            />
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Interessent</TableHeaderCell>
                  <TableHeaderCell>Wohnung</TableHeaderCell>
                  <TableHeaderCell align="right">Datum</TableHeaderCell>
                  <TableHeaderCell align="right">Uhrzeit</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {viewings.map((viewing) => (
                  <TableRow key={viewing.id}>
                    <TableCell className="font-medium whitespace-nowrap">{viewing.name}</TableCell>
                    <TableCell className="whitespace-nowrap text-slate">{viewing.flat}</TableCell>
                    <TableCell align="right">{viewing.date}</TableCell>
                    <TableCell align="right">{viewing.time}</TableCell>
                    <TableCell>
                      <Badge tone={viewing.status}>{statusLabels[viewing.status]}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Section>

        <Section title="Navigation">
          <p className="max-w-prose text-slate">
            Die Navigation ist Teil der App-Shell: links ab 768 px, darunter als Menü in der oberen Leiste.
            Einträge kommen aus src/config/navigation.ts.
          </p>
        </Section>
      </div>
    </>
  );
}
