"use client";

import { BellRing, FileText, LockKeyhole, Mail, Package, RadioTower, Users } from "lucide-react";
import type { ReactNode } from "react";
import { landlord } from "@/config/account";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { CopyField } from "@/components/ui/copy-field";
import { StepList } from "@/components/ui/step-list";
import { addressLine, formatEuro, formatNumber, warmRent, type Draft } from "./draft";
import { formatDay, formatTime, type ListingResult } from "./listing-result";

type ListingSuccessProps = { draft: Draft; result: ListingResult };

function PackageItem({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <li className="flex gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-button bg-mist text-deep-blue">{icon}</span>
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        <p className="text-small text-slate">{description}</p>
      </div>
    </li>
  );
}

export function ListingSuccess({ draft, result }: ListingSuccessProps) {
  const empty = draft.occupancy === "leer";
  const delivery = `${formatDay(result.deliveryFrom)} – ${formatDay(result.deliveryTo)}`;
  const shipAddress =
    draft.shipTo === "wohnung" ? addressLine(draft) : `${landlord.street}, ${landlord.zip} ${landlord.city}`;
  const portalText = `Besichtigung und Bewerbung laufen über vizmo. Sie buchen dort einen festen Termin und besichtigen die Wohnung${empty ? " eigenständig" : ""}. Hier bewerben: ${result.link}`;
  const warm = warmRent(draft);

  return (
    <>
      <header className="mb-6 flex flex-col gap-3 md:mb-8">
        <Badge tone="success" className="self-start">
          Inserat aktiv
        </Badge>
        <h1 className="text-h1">Ihr Inserat ist bereit</h1>
        <p className="max-w-prose text-slate">
          {draft.street}, {draft.zip} {draft.city}. Bewerbungen nehmen wir ab sofort über Ihren persönlichen Link
          entgegen. Eine Zusammenfassung haben wir an {landlord.email} geschickt.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card padding="lg" className="flex flex-col gap-5">
            <CardHeader
              title="Ihr Bewerbungslink"
              description="Fügen Sie den Link in Ihre Anzeige bei ImmoScout24, Kleinanzeigen oder WG-Gesucht ein. Interessenten bewerben sich darüber direkt bei vizmo."
            />
            <CopyField label="Link zum Inserat" value={result.link} />
            <CopyField label="Textbaustein für Ihre Anzeige" value={portalText} multiline />
          </Card>

          <Card padding="lg">
            <CardHeader title="So geht es weiter" />
            <StepList
              className="mt-4"
              items={[
                { label: "Inserat erstellt", description: `Heute, ${formatTime(result.createdAt)} Uhr`, state: "done" },
                { label: "Link in Ihre Anzeige einfügen", description: "Bewerbungen landen ab dann sortiert in Ihrem Postfach bei vizmo.", state: "current" },
                empty
                  ? { label: "Smartlock montieren", description: `Lieferung voraussichtlich ${delivery}, danach führt Sie die App durch die Montage.`, state: "upcoming" }
                  : { label: "Besichtigungszeiten bestätigen", description: "Sie sehen jede Buchung vorab und können sie absagen.", state: "upcoming" },
                { label: "Bewerbungen sichten und Besichtigungen freigeben", description: "Sie entscheiden, wer einen Slot buchen darf.", state: "upcoming" },
              ]}
            />
          </Card>

          <Card padding="lg">
            <CardHeader
              title="Inserat im Überblick"
              actions={
                <ButtonLink href="/" variant="secondary" size="sm">
                  Zur Übersicht
                </ButtonLink>
              }
            />
            <dl className="mt-4 grid gap-x-6 gap-y-3 tabular-nums sm:grid-cols-3">
              <div>
                <dt className="text-small text-slate">Wohnung</dt>
                <dd className="font-medium">
                  {formatNumber(draft.rooms ?? 0)} Zimmer, {formatNumber(draft.size ?? 0)} m², {draft.floor}
                </dd>
              </div>
              <div>
                <dt className="text-small text-slate">Warmmiete</dt>
                <dd className="font-medium">{warm != null ? formatEuro(warm) : "–"}</dd>
              </div>
              <div>
                <dt className="text-small text-slate">Besichtigung</dt>
                <dd className="font-medium">{empty ? "Allein per Smartlock" : "Mit Begleitung"}</dd>
              </div>
            </dl>
            <div className="mt-5 border-t border-line pt-4">
              <p className="mb-3 text-small text-slate">
                {draft.photos.length} Zustandsfotos für den Abgleich nach jeder Besichtigung hinterlegt
              </p>
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {draft.photos.map((photo) => (
                  <li key={photo.id} className="flex flex-col gap-1">
                    <span className="aspect-square overflow-hidden rounded-input bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
                      <img src={photo.url} alt={photo.room} className="size-full object-cover" />
                    </span>
                    <span className="truncate text-small text-slate">{photo.room}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-8">
          {empty ? (
            <Card padding="lg" className="flex flex-col gap-5">
              <div className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-button bg-night text-lavender">
                  <Package aria-hidden className="size-5" />
                </span>
                <div>
                  <h2 className="text-h3">Ihr Smartlock-Paket ist unterwegs</h2>
                  <p className="mt-0.5 text-slate">
                    Voraussichtlich bei Ihnen: <span className="font-medium whitespace-nowrap text-night">{delivery}</span>
                  </p>
                </div>
              </div>

              <ul className="flex flex-col gap-3">
                <PackageItem
                  icon={<LockKeyhole aria-hidden className="size-5" />}
                  title="Nuki Smart Lock"
                  description="Wird innen auf den Schlüssel gesetzt, ohne Bohren."
                />
                <PackageItem
                  icon={<RadioTower aria-hidden className="size-5" />}
                  title="Huawei LTE-Stick"
                  description="Hält das Schloss online, auch ohne WLAN in der Wohnung."
                />
                {draft.buildingAccess === "klingel" && (
                  <PackageItem
                    icon={<BellRing aria-hidden className="size-5" />}
                    title="Nuki Opener"
                    description="Öffnet die Haustür über die Gegensprechanlage."
                  />
                )}
                <PackageItem
                  icon={<FileText aria-hidden className="size-5" />}
                  title="Montageanleitung"
                  description="Schritt für Schritt, in etwa 10 Minuten erledigt."
                />
              </ul>

              <StepList
                items={[
                  { label: "Bestellt", description: `Heute, ${formatTime(result.createdAt)} Uhr`, state: "done" },
                  { label: "Wird verpackt", description: "Versand am nächsten Werktag", state: "current" },
                  { label: "Übergabe an DHL", state: "upcoming" },
                  { label: "Zugestellt", description: delivery, state: "upcoming" },
                ]}
              />

              <dl className="flex flex-col gap-2 border-t border-line pt-4">
                <div>
                  <dt className="text-small text-slate">Lieferadresse</dt>
                  <dd className="font-medium">
                    {landlord.firstName} {landlord.lastName}, {shipAddress}
                  </dd>
                </div>
                <div>
                  <dt className="text-small text-slate">DHL-Sendungsnummer</dt>
                  <dd className="font-medium tabular-nums">{result.trackingNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}</dd>
                </div>
              </dl>
            </Card>
          ) : (
            <Card padding="lg" className="flex flex-col gap-3">
              <div className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-button bg-night text-lavender">
                  <Users aria-hidden className="size-5" />
                </span>
                <div>
                  <h2 className="text-h3">Begleitete Besichtigungen</h2>
                  <p className="mt-0.5 text-slate">
                    Weil die Wohnung noch bewohnt ist, verschicken wir kein Smartlock. Jede Buchung erscheint in Ihrem
                    Kalender, und Sie oder die Mieter öffnen vor Ort.
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card tone="mist" className="flex gap-3">
            <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-deep-blue" />
            <p>
              Sobald die erste Bewerbung eingeht, benachrichtigen wir Sie per E-Mail. Bewerbungen sind nach Ihren
              Kriterien sortiert.
            </p>
          </Card>
        </aside>
      </div>
    </>
  );
}
