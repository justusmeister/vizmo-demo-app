import { Mail, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StepList } from "@/components/ui/step-list";
import type { Listing } from "@/data/listings";
import type { Application } from "./draft";
import { ListingFacts } from "./listing-summary";

export function ApplicationSuccess({ data, listing, reference }: { data: Application; listing: Listing; reference: string }) {
  const sms = data.contact.includes("sms");
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 py-6 md:py-10">
      <div className="flex flex-col items-start gap-3">
        <Badge tone="success">Bewerbung eingegangen</Badge>
        <h1 className="text-h1">Danke, {data.firstName}!</h1>
        <p className="text-slate">
          Ihre Bewerbung ist beim Vermieter. Wir haben Ihnen eine Bestätigung an <span className="font-medium text-night">{data.email}</span>{" "}
          geschickt. Ihre Bewerbungsnummer: <span className="font-medium text-night tabular-nums">{reference}</span>
        </p>
      </div>

      <Card>
        <ListingFacts listing={listing} />
      </Card>

      <Card padding="lg" className="flex flex-col gap-4">
        <h2 className="text-h3">So geht es weiter</h2>
        <StepList
          items={[
            { label: "Bewerbung abgeschickt", description: "Gerade eben", state: "done" },
            { label: "Der Vermieter sieht sich die Bewerbungen an", description: "Meist innerhalb weniger Tage", state: "current" },
            { label: "Einladung per E-Mail", description: `Mit Video-Rundgang und freien Besichtigungsslots${sms ? ", zusätzlich per SMS" : ""}`, state: "upcoming" },
            { label: "Slot buchen und Identität bestätigen", description: "Ausweis und Selfie über Didit, etwa 2 Minuten", state: "upcoming" },
            { label: "Wohnung allein besichtigen", description: "25 € Kaution werden nur vorgemerkt, nicht abgebucht", state: "upcoming" },
          ]}
        />
      </Card>

      <Card tone="mist" className="flex flex-col gap-2">
        <p className="flex items-center gap-2 font-medium">
          <MessageSquare aria-hidden className="size-4 text-deep-blue" />
          Etwas vergessen?
        </p>
        <p>
          Über den Link in Ihrer Bestätigungs-E-Mail können Sie jederzeit Nachweise nachreichen oder dem Vermieter eine
          Nachricht schicken.
        </p>
      </Card>

      <p className="flex items-center gap-2 text-small text-slate">
        <Mail aria-hidden className="size-4 shrink-0" />
        Keine E-Mail bekommen? Schauen Sie bitte auch im Spam-Ordner nach.
      </p>
    </div>
  );
}
