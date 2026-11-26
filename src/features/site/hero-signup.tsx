"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <form id="pilot" onSubmit={submit} noValidate className="w-full max-w-lg scroll-mt-24 bg-white p-4 text-night sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Input
          label="Ihre E-Mail-Adresse für den Pilot"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          maxLength={limits.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          className="min-w-0 flex-1"
        />
        <Button type="submit" className="h-12 px-6 sm:h-10">
          Für den Pilot vormerken
        </Button>
      </div>
      <p className="mt-3 text-body text-slate" aria-live="polite">
        {opened ? "Bitte senden Sie die vorbereitete E-Mail ab, dann sind Sie vorgemerkt." : "Öffnet Ihr E-Mail-Programm, Sie senden selbst."}
      </p>
    </form>
  );
}
