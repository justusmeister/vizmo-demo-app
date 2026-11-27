"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cx } from "@/lib/cx";
import { Honeypot } from "./honeypot";
import { clean, isEmail, limits } from "./mailto";
import { deliver, trapped } from "./send-form";

// Pilot waitlist on /pilot: name and e-mail, sent straight to kontakt@govizmo.de (send-form.ts).

export function PilotSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [note, setNote] = useState<{ text: string; error?: boolean }>();
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = { name: clean(name, limits.name), email: clean(email, limits.email) };
    const next: typeof errors = {};
    if (!values.name) next.name = "Bitte Ihren Namen angeben";
    if (!isEmail(values.email)) next.email = "Bitte eine gültige E-Mail-Adresse angeben";
    setErrors(next);
    if (next.name || next.email) return;
    setNote(undefined);
    setSending(true);
    const result = await deliver({
      subject: `Pilotprojekt: ${values.name} möchte vorgemerkt werden`,
      email: values.email,
      name: values.name,
      body: `Bitte für das Pilotprojekt vormerken.\n\nName: ${values.name}\nE-Mail: ${values.email}`,
      trap: trapped(event.currentTarget),
    });
    setSending(false);
    if (result === "sent") {
      setName("");
      setEmail("");
      setNote({ text: "Danke, Sie sind vorgemerkt. Wir melden uns persönlich bei Ihnen." });
    } else if (result === "mail") {
      setNote({ text: "Bitte senden Sie die vorbereitete E-Mail ab, dann sind Sie vorgemerkt." });
    } else {
      setNote({ text: "Das hat nicht geklappt. Bitte versuchen Sie es noch einmal.", error: true });
    }
  }

  return (
    <form onSubmit={submit} noValidate aria-labelledby="pilot-title" className="flex flex-col gap-4">
      <Honeypot />
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
        <Button type="submit" loading={sending} className="h-12 w-full px-6 sm:w-auto">
          Für den Pilot vormerken
        </Button>
        <p className={cx("text-body", note?.error ? "font-medium text-error" : note ? "font-medium text-night" : "text-slate")} aria-live="polite">
          {note?.text}
        </p>
      </div>
    </form>
  );
}
