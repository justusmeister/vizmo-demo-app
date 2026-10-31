"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChoiceChip, ChoiceGroup } from "@/components/ui/choice-chip";
import { Input, Textarea } from "@/components/ui/input";
import { company } from "./site-nav";

// The site has no backend, so the form composes an e-mail in the visitor's mail app
// instead of pretending to send. Nothing is transmitted to us until they send it.

const topics = ["Ich vermiete privat", "Ich suche eine Wohnung", "Presse", "Investment oder Partnerschaft", "Etwas anderes"];

export function ContactForm() {
  const [topic, setTopic] = useState(topics[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [opened, setOpened] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Bitte Ihren Namen angeben";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = "Bitte eine gültige E-Mail-Adresse angeben";
    if (message.trim().length < 10) next.message = "Bitte schreiben Sie uns ein paar Worte";
    setErrors(next);
    if (Object.keys(next).length) return;
    const subject = `${topic}: Anfrage von ${name.trim()}`;
    const body = `${message.trim()}\n\n${name.trim()}\n${email.trim()}`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <ChoiceGroup label="Worum geht es?">
        {topics.map((t) => (
          <ChoiceChip key={t} selected={topic === t} onClick={() => setTopic(t)}>
            {t}
          </ChoiceChip>
        ))}
      </ChoiceGroup>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <Input label="E-Mail-Adresse" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
      </div>
      <Textarea label="Ihre Nachricht" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} error={errors.message} />
      <div className="flex flex-col items-start gap-3">
        <Button type="submit" icon={<Mail aria-hidden className="size-4" />} className="h-12 px-6">
          Nachricht im E-Mail-Programm öffnen
        </Button>
        <p className="text-small text-slate" aria-live="polite">
          {opened
            ? `Ihr E-Mail-Programm sollte sich jetzt geöffnet haben. Falls nicht, schreiben Sie uns direkt an ${company.email}.`
            : "Ihre Nachricht wird in Ihrem E-Mail-Programm vorbereitet. Sie senden sie selbst ab."}
        </p>
      </div>
    </form>
  );
}
