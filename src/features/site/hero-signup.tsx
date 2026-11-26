"use client";

import { useState } from "react";
import { EmailCapture } from "@/components/ui/email-capture";
import { clean, isEmail, limits, openMail } from "./mailto";

// Pilot sign-up right in the hero (owner's request, as Attio or Personio put their demo
// sign-up up front): e-mail only. Like the other forms it prepares an e-mail to
// kontakt@govizmo.de, which the visitor sends from their own mail app.

export function HeroSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [opened, setOpened] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = clean(email, limits.email);
    if (!isEmail(value)) {
      setError("Bitte eine gültige E-Mail-Adresse angeben");
      return;
    }
    setError(undefined);
    openMail("Pilotprojekt: bitte vormerken", `Hallo vizmo-Team,\n\nbitte merkt mich für das Pilotprojekt vor.\n\nE-Mail: ${value}`);
    setOpened(true);
  }

  return (
    <form id="pilot" onSubmit={submit} noValidate className="scroll-mt-24">
      <EmailCapture
        label="Ihre E-Mail-Adresse für den Pilot"
        placeholder="Ihre E-Mail-Adresse"
        action="Pilot vormerken"
        maxLength={limits.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        hint={opened ? "Bitte senden Sie die vorbereitete E-Mail ab, dann sind Sie vorgemerkt." : "Öffnet Ihr E-Mail-Programm, Sie senden selbst."}
      />
    </form>
  );
}
