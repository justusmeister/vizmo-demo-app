"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clean, isEmail, limits, openMail } from "./mailto";

// Pilot waitlist. Like the contact form it prepares an e-mail to kontakt@govizmo.de until a
// backend exists; the visitor sends it themselves.

export function PilotSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [opened, setOpened] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const values = { name: clean(name, limits.name), email: clean(email, limits.email) };
    const next: typeof errors = {};
    if (!values.name) next.name = "Bitte Ihren Namen angeben";
    if (!isEmail(values.email)) next.email = "Bitte eine gültige E-Mail-Adresse angeben";
    setErrors(next);
    if (next.name || next.email) return;
    openMail(
      `Pilotprojekt: ${values.name} möchte vorgemerkt werden`,
      `Hallo vizmo-Team,\n\nbitte merkt mich für das Pilotprojekt vor.\n\nName: ${values.name}\nE-Mail: ${values.email}`,
    );
    setOpened(true);
  }

  return (
    <form onSubmit={submit} noValidate aria-labelledby="pilot-title" className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" autoComplete="name" maxLength={limits.name} value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <Input
          label="E-Mail-Adresse"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          maxLength={limits.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <Button type="submit" className="h-12 w-full px-6 sm:w-auto">
          Für den Pilot vormerken
        </Button>
        <p className="text-body text-slate" aria-live="polite">
          {opened ? "Bitte senden Sie die vorbereitete E-Mail ab, dann sind Sie vorgemerkt." : "Öffnet Ihr E-Mail-Programm mit der fertigen Anmeldung."}
        </p>
      </div>
    </form>
  );
}
