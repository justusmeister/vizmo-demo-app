"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { clean, isEmail, limits, openMail } from "./mailto";
import { company } from "./site-nav";

const topics = ["Ich vermiete privat", "Ich suche eine Wohnung", "Pilotprojekt", "Presse", "Investment oder Partnerschaft", "Etwas anderes"];

export function ContactForm() {
  const [topic, setTopic] = useState(topics[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [opened, setOpened] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const values = { name: clean(name, limits.name), email: clean(email, limits.email), message: clean(message, limits.message, true) };
    const next: Record<string, string> = {};
    if (!values.name) next.name = "Bitte Ihren Namen angeben";
    if (!isEmail(values.email)) next.email = "Bitte eine gültige E-Mail-Adresse angeben";
    if (values.message.length < 10) next.message = "Bitte schreiben Sie uns ein paar Worte";
    setErrors(next);
    if (Object.keys(next).length) return;
    const subject = `${topics.includes(topic) ? topic : topics[0]}: Anfrage von ${values.name}`;
    const body = `${values.message}\n\n${values.name}\n${values.email}`;
    if (!openMail(subject, body)) {
      setErrors({ message: "Die Nachricht ist zu lang für das E-Mail-Programm. Bitte kürzen Sie sie etwas." });
      return;
    }
    setOpened(true);
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <Select label="Worum geht es?" value={topic} onChange={(e) => setTopic(e.target.value)}>
        {topics.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </Select>
      <div className="grid gap-5 sm:grid-cols-2">
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
      <Textarea label="Ihre Nachricht" rows={6} maxLength={limits.message} value={message} onChange={(e) => setMessage(e.target.value)} error={errors.message} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <Button type="submit" className="h-12 w-full px-6 sm:w-auto">
          Nachricht senden
        </Button>
        <p className="text-body text-slate" aria-live="polite">
          {opened
            ? `Ihr E-Mail-Programm sollte sich geöffnet haben. Falls nicht, schreiben Sie direkt an ${company.email}.`
            : "Öffnet Ihr E-Mail-Programm mit der fertigen Nachricht."}
        </p>
      </div>
    </form>
  );
}
