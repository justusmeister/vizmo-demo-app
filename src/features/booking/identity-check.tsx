"use client";

import { BookOpen, Camera, CreditCard, IdCard, LoaderCircle, ScanFace, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { StepList } from "@/components/ui/step-list";
import { cx } from "@/lib/cx";

// Simulated identity check. In production the applicant is handed over to Didit
// (document + liveness check); vizmo only receives the result, never the ID data.

export type IdentityResult = { document: "ausweis" | "reisepass"; name: string; checkedAt: Date };

type Phase = "document" | "address" | "capture" | "checking" | "done";

const documents = {
  ausweis: { label: "Personalausweis", hint: "Vorder- und Rückseite", icon: IdCard },
  reisepass: { label: "Reisepass", hint: "Bildseite, Adresse fragen wir separat ab", icon: BookOpen },
} as const;

type IdentityCheckProps = {
  open: boolean;
  name: string;
  onClose: () => void;
  onVerified: (result: IdentityResult) => void;
};

export function IdentityCheck({ open, name, onClose, onVerified }: IdentityCheckProps) {
  const [phase, setPhase] = useState<Phase>("document");
  const [docType, setDocType] = useState<keyof typeof documents>("ausweis");
  const [progress, setProgress] = useState(0);
  const [address, setAddress] = useState({ street: "", zip: "", city: "" });
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  function startChecking() {
    setPhase("checking");
    setProgress(0);
    [900, 1900, 2800].forEach((delay, index) => {
      timers.current.push(window.setTimeout(() => setProgress(index + 1), delay));
    });
    timers.current.push(window.setTimeout(() => setPhase("done"), 3300));
  }

  function close() {
    if (phase === "checking") return;
    onClose();
    if (phase !== "done") setPhase("document");
  }

  const addressComplete = address.street.trim() && /^\d{5}$/.test(address.zip) && address.city.trim();

  const footer =
    phase === "document" ? (
      <Button onClick={() => setPhase(docType === "reisepass" ? "address" : "capture")} className="w-full sm:w-auto">
        Weiter
      </Button>
    ) : phase === "address" ? (
      <>
        <Button variant="secondary" onClick={() => setPhase("document")}>
          Zurück
        </Button>
        <Button onClick={() => setPhase("capture")} disabled={!addressComplete}>
          Weiter
        </Button>
      </>
    ) : phase === "capture" ? (
      <Button onClick={startChecking} icon={<Camera aria-hidden className="size-4" />} className="w-full sm:w-auto">
        Kamera starten
      </Button>
    ) : phase === "done" ? (
      <Button
        onClick={() => {
          onVerified({ document: docType, name, checkedAt: new Date() });
          onClose();
        }}
        className="w-full sm:w-auto"
      >
        Zurück zur Buchung
      </Button>
    ) : undefined;

  return (
    <Dialog open={open} onClose={close} variant="side" title="Identität bestätigen" description="Durchgeführt von Didit, unserem Partner für Identitätsprüfung" footer={footer}>
      {phase === "document" && (
        <div className="flex flex-col gap-4">
          <p>Welches Dokument möchten Sie verwenden? Es muss gültig sein und auf {name} lauten.</p>
          <div className="flex flex-col gap-2">
            {(Object.keys(documents) as (keyof typeof documents)[]).map((key) => {
              const doc = documents[key];
              const Icon = doc.icon;
              const selected = docType === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setDocType(key)}
                  className={cx(
                    "flex items-center gap-3 rounded-card border p-4 text-left transition-colors",
                    selected ? "border-blue bg-mist" : "border-line bg-white hover:border-gray",
                  )}
                >
                  <Icon aria-hidden className="size-6 shrink-0 text-deep-blue" />
                  <span>
                    <span className="block font-medium">{doc.label}</span>
                    <span className="block text-small text-slate">{doc.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="flex items-start gap-2 text-small text-slate">
            <ShieldCheck aria-hidden className="mt-px size-4 shrink-0 text-deep-blue" />
            Ihre Ausweisdaten bleiben bei Didit. vizmo und der Vermieter erhalten nur das Ergebnis: Name bestätigt, ja oder nein.
          </p>
        </div>
      )}

      {phase === "address" && (
        <div className="flex flex-col gap-4">
          <p>Im Reisepass steht keine Adresse. Bitte geben Sie Ihre aktuelle Meldeadresse an.</p>
          <Input label="Straße und Hausnummer" autoComplete="street-address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
          <div className="grid grid-cols-[7rem_1fr] gap-3">
            <Input label="PLZ" inputMode="numeric" maxLength={5} autoComplete="postal-code" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
            <Input label="Ort" autoComplete="address-level2" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
          </div>
        </div>
      )}

      {phase === "capture" && (
        <div className="flex flex-col gap-5">
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-card bg-night text-center text-white">
            <div className="flex h-24 w-36 items-center justify-center rounded-card border-2 border-dashed border-lavender">
              <CreditCard aria-hidden className="size-10 text-lavender" />
            </div>
            <p className="px-6 text-small text-lavender">Halten Sie Ihren {documents[docType].label} in den Rahmen</p>
          </div>
          <StepList
            items={[
              { label: `${documents[docType].label} fotografieren`, description: documents[docType].hint, state: "current" },
              { label: "Kurzes Selfie-Video", description: "Kopf langsam nach links und rechts drehen", state: "upcoming" },
              { label: "Automatischer Abgleich", description: "Dauert wenige Sekunden", state: "upcoming" },
            ]}
          />
          <p className="text-small text-slate">Demo: Die Kamera wird nicht wirklich gestartet, der Ablauf wird simuliert.</p>
        </div>
      )}

      {phase === "checking" && (
        <div className="flex flex-col items-center gap-6 py-6 text-center" aria-live="polite">
          <LoaderCircle aria-hidden className="size-10 animate-spin text-blue" />
          <p className="text-h3 font-display font-bold">Ihre Identität wird geprüft</p>
          <StepList
            className="w-full max-w-xs text-left"
            items={[
              { label: "Dokument erkannt", state: progress >= 1 ? "done" : "current" },
              { label: "Echtheit geprüft", state: progress >= 2 ? "done" : progress === 1 ? "current" : "upcoming" },
              { label: "Gesicht abgeglichen", state: progress >= 3 ? "done" : progress === 2 ? "current" : "upcoming" },
            ]}
          />
        </div>
      )}

      {phase === "done" && (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-success text-white">
            <ScanFace aria-hidden className="size-8" />
          </span>
          <p className="text-h2 font-display font-bold">Identität bestätigt</p>
          <p className="text-slate">
            {documents[docType].label} und Selfie passen zusammen. Der Name {name} stimmt mit Ihrer Bewerbung überein.
          </p>
        </div>
      )}
    </Dialog>
  );
}
