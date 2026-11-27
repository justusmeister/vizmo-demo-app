"use client";

import { useState } from "react";
import { EmailCapture } from "@/components/ui/email-capture";
import { Honeypot } from "./honeypot";
import { clean, isEmail, limits } from "./mailto";
import { deliver, trapped } from "./send-form";

// Pilot sign-up right in the hero (owner's request, as Attio or Personio put their demo
// sign-up up front): e-mail only, sent straight to kontakt@govizmo.de (send-form.ts). No note
// under the field until something happens.

export function HeroSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = clean(email, limits.email);
    setSuccess(undefined);
    if (!isEmail(value)) {
      setError("Bitte eine gültige E-Mail-Adresse angeben");
      return;
    }
    setError(undefined);
    setSending(true);
    const result = await deliver({
      subject: "Pilotprojekt: bitte vormerken",
      email: value,
      body: `Bitte für das Pilotprojekt vormerken.\n\nE-Mail: ${value}`,
      trap: trapped(event.currentTarget),
    });
    setSending(false);
    if (result === "sent") {
      setEmail("");
      setSuccess("Danke, Sie sind vorgemerkt. Wir melden uns persönlich bei Ihnen.");
    } else if (result === "mail") {
      setSuccess("Bitte senden Sie die vorbereitete E-Mail ab, dann sind Sie vorgemerkt.");
    } else {
      setError("Das hat nicht geklappt. Bitte versuchen Sie es noch einmal.");
    }
  }

  return (
    <form id="pilot" onSubmit={submit} noValidate className="scroll-mt-24">
      <Honeypot />
      <EmailCapture
        label="Ihre E-Mail-Adresse für den Pilot"
        placeholder="Ihre E-Mail-Adresse"
        action="Pilot vormerken"
        maxLength={limits.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        success={success}
        loading={sending}
      />
    </form>
  );
}
