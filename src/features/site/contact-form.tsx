"use client";

import { ArrowLeft, Check, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChoiceChip } from "@/components/ui/choice-chip";
import { Input, Textarea } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Progress } from "@/components/ui/progress";
import { cx } from "@/lib/cx";
import { Honeypot } from "./honeypot";
import { clean, isEmail, limits } from "./mailto";
import { deliver, trapped, type Delivery } from "./send-form";
import { company } from "./site-nav";

// Contact as a guided flow: topic, a few questions that fit the topic, the message, contact
// details, then a review. Sending goes straight to kontakt@govizmo.de (send-form.ts).

type Topic = "vermieter" | "suche" | "presse" | "partner" | "anderes";

const topics: { id: Topic; label: string; hint: string }[] = [
  { id: "vermieter", label: "Ich vermiete privat", hint: "Fragen zu vizmo oder Interesse am Pilot" },
  { id: "suche", label: "Ich suche eine Wohnung", hint: "Fragen als Interessentin oder Interessent" },
  { id: "presse", label: "Presse", hint: "Anfragen für Artikel, Interviews oder Beiträge" },
  { id: "partner", label: "Investment oder Partnerschaft", hint: "Investoren, Kooperationen, Hardware" },
  { id: "anderes", label: "Etwas anderes", hint: "Alles, was sonst nirgends passt" },
];

type Question = { key: string; label: string; options?: string[]; input?: { placeholder?: string; autoComplete?: string }; optional?: boolean };

const questions: Record<Topic, Question[]> = {
  vermieter: [
    { key: "Wohnungen", label: "Wie viele Wohnungen vermieten Sie?", options: ["Eine", "Zwei bis fünf", "Mehr als fünf"] },
    { key: "Nächste Vermietung", label: "Wann steht die nächste Vermietung an?", options: ["In den nächsten drei Monaten", "Später", "Noch offen"] },
    { key: "Pilot", label: "Möchten Sie beim Pilot mitmachen?", options: ["Ja, gern", "Erst mehr erfahren"] },
    { key: "Stadt", label: "In welcher Stadt liegt die Wohnung?", input: { autoComplete: "address-level2" }, optional: true },
  ],
  suche: [{ key: "Anliegen", label: "Worum geht es genau?", options: ["Meine Bewerbung oder Besichtigung", "Eine allgemeine Frage"] }],
  presse: [
    { key: "Medium", label: "Für welches Medium schreiben Sie?", input: { autoComplete: "organization" } },
    { key: "Termin", label: "Bis wann brauchen Sie eine Antwort?", input: { placeholder: "zum Beispiel Freitag, 12 Uhr" }, optional: true },
  ],
  partner: [
    { key: "Art", label: "Worum geht es?", options: ["Investment", "Kooperation", "Smartlock und Hardware", "Etwas anderes"] },
    { key: "Organisation", label: "Für welche Organisation schreiben Sie?", input: { autoComplete: "organization" }, optional: true },
  ],
  anderes: [],
};

const messagePrompt: Record<Topic, string> = {
  vermieter: "Was möchten Sie wissen, oder was sollen wir über Ihre Wohnung wissen?",
  suche: "Wie können wir helfen?",
  presse: "Worum geht es in Ihrem Beitrag?",
  partner: "Erzählen Sie uns kurz, was Sie vorhaben.",
  anderes: "Was können wir für Sie tun?",
};

const stepTitles = ["Worum geht es?", "Ein paar Fragen", "Ihre Nachricht", "Wie erreichen wir Sie?", "Alles richtig?"];

export function ContactForm() {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [opened, setOpened] = useState<Exclude<Delivery, "error"> | false>(false);
  const [sending, setSending] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  const asked = topic ? questions[topic] : [];
  // Topics without questions skip step 2.
  const steps = topic && !asked.length ? [0, 2, 3, 4] : [0, 1, 2, 3, 4];
  const position = steps.indexOf(step);

  useEffect(() => {
    // Move focus to the new step's heading after a step change (not on first render).
    if (moved.current) headingRef.current?.focus();
    moved.current = true;
  }, [step, opened]);

  function go(next: number) {
    setErrors({});
    setStep(next);
  }

  function chooseTopic(id: Topic) {
    setTopic(id);
    setAnswers({});
    go(questions[id].length ? 1 : 2);
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (step === 1) {
      for (const q of asked) if (!q.optional && !clean(answers[q.key] ?? "", limits.name)) next[q.key] = q.options ? "Bitte eine Antwort wählen" : "Bitte ausfüllen";
    }
    if (step === 2 && clean(message, limits.message, true).length < 10) next.message = "Bitte schreiben Sie uns ein paar Worte";
    if (step === 3) {
      if (!clean(name, limits.name)) next.name = "Bitte Ihren Namen angeben";
      if (!isEmail(clean(email, limits.email))) next.email = "Bitte eine gültige E-Mail-Adresse angeben";
    }
    return next;
  }

  function forward(event: React.FormEvent) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    if (step < 4) return go(steps[position + 1]);
    void send(event.currentTarget as HTMLFormElement);
  }

  /** After a successful send, start over so the same message can't go out twice. */
  function reset() {
    setTopic(null);
    setAnswers({});
    setMessage("");
    setOpened(false);
    go(0);
  }

  async function send(form: HTMLFormElement) {
    if (!topic) return;
    const label = topics.find((t) => t.id === topic)!.label;
    const details = asked
      .map((q) => [q.key, clean(answers[q.key] ?? "", limits.name)] as const)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`);
    const values = { name: clean(name, limits.name), email: clean(email, limits.email), message: clean(message, limits.message, true) };
    const body = [values.message, details.length ? `\n${details.join("\n")}` : "", `\n${values.name}\n${values.email}`].join("\n");
    setSending(true);
    const result = await deliver({ subject: `${label}: Anfrage von ${values.name}`, email: values.email, name: values.name, body, trap: trapped(form) });
    setSending(false);
    if (result === "error") {
      setErrors({ send: `Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es noch einmal oder schreiben Sie direkt an ${company.email}.` });
      return;
    }
    setOpened(result);
  }

  if (opened) {
    return (
      <div className="flex flex-col items-start gap-4 border-t-2 border-night pt-6">
        <span className="flex size-10 items-center justify-center rounded-full bg-success text-white">
          <Check aria-hidden className="size-5" strokeWidth={2.5} />
        </span>
        <h2 ref={headingRef} tabIndex={-1} className="font-display text-h1 font-bold outline-none">
          {opened === "sent" ? "Danke, Ihre Nachricht ist angekommen" : "Ihre Nachricht liegt im E-Mail-Programm bereit"}
        </h2>
        {opened === "sent" ? (
          <p className="max-w-prose text-slate">
            Wir antworten Ihnen persönlich an <span className="font-medium text-night">{email}</span>.
          </p>
        ) : (
          <p className="max-w-prose text-slate">
            Prüfen Sie sie dort und drücken Sie auf Senden. Falls sich nichts geöffnet hat, schreiben Sie direkt an{" "}
            <a href={`mailto:${company.email}`} className="font-medium text-blue hover:text-deep-blue hover:underline">
              {company.email}
            </a>
            .
          </p>
        )}
        <Button variant="secondary" className="mt-2" onClick={() => (opened === "sent" ? reset() : setOpened(false))}>
          Zurück zur Übersicht
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={forward} noValidate className="flex flex-col border-t-2 border-night pt-5">
      <Honeypot />
      <div className="flex items-center justify-between gap-4 text-body text-slate">
        <span aria-live="polite">
          Schritt {position + 1} von {steps.length}
        </span>
        {position > 0 && (
          <Button type="button" variant="tertiary" size="sm" icon={<ArrowLeft aria-hidden className="size-4" />} onClick={() => go(steps[position - 1])}>
            Zurück
          </Button>
        )}
      </div>
      <Progress value={position + 1} max={steps.length} label="Fortschritt" className="mt-3" />

      <h2 ref={headingRef} tabIndex={-1} className="mt-8 font-display text-h1 font-bold outline-none md:text-display">
        {stepTitles[step]}
      </h2>

      <div className="mt-6 flex flex-col gap-6">
        {step === 0 && (
          <ul className="flex flex-col gap-2">
            {topics.map((t) => (
              <li key={t.id}>
                <ChoiceChip selected={topic === t.id} onClick={() => chooseTopic(t.id)} className="w-full">
                  <span className="flex flex-col py-1">
                    <span>{t.label}</span>
                    <span className="text-body font-normal text-slate">{t.hint}</span>
                  </span>
                </ChoiceChip>
              </li>
            ))}
          </ul>
        )}

        {step === 1 && topic && (
          <>
            {topic === "suche" && (
              <Notice title="Schon beworben?">
                Fragen zu Ihrer Bewerbung oder Besichtigung klären Sie am schnellsten über den Link in Ihrer E-Mail von vizmo.
              </Notice>
            )}
            {asked.map((q) =>
              q.options ? (
                <fieldset key={q.key} className="flex flex-col gap-2">
                  <legend className="mb-1.5 font-medium text-slate">{q.label}</legend>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((option) => (
                      <ChoiceChip key={option} selected={answers[q.key] === option} onClick={() => setAnswers((a) => ({ ...a, [q.key]: option }))}>
                        {option}
                      </ChoiceChip>
                    ))}
                  </div>
                  {errors[q.key] && <p className="text-body text-error">{errors[q.key]}</p>}
                </fieldset>
              ) : (
                <Input
                  key={q.key}
                  label={q.optional ? `${q.label} (optional)` : q.label}
                  placeholder={q.input?.placeholder}
                  autoComplete={q.input?.autoComplete}
                  maxLength={limits.name}
                  value={answers[q.key] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.key]: e.target.value }))}
                  error={errors[q.key]}
                />
              ),
            )}
          </>
        )}

        {step === 2 && topic && (
          <Textarea label={messagePrompt[topic]} rows={7} maxLength={limits.message} value={message} onChange={(e) => setMessage(e.target.value)} error={errors.message} />
        )}

        {step === 3 && (
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
        )}

        {step === 4 && topic && (
          <dl className="flex flex-col divide-y divide-line border-y border-line">
            <Row label="Thema" value={topics.find((t) => t.id === topic)!.label} onEdit={() => go(0)} />
            {asked
              .filter((q) => answers[q.key])
              .map((q) => (
                <Row key={q.key} label={q.key} value={answers[q.key]} onEdit={() => go(1)} />
              ))}
            <Row label="Nachricht" value={message} onEdit={() => go(2)} multiline />
            <Row label="Absender" value={`${name}, ${email}`} onEdit={() => go(3)} />
          </dl>
        )}
        {errors.send && <p className="text-body text-error">{errors.send}</p>}
      </div>

      {step > 0 && (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Button type="submit" loading={sending} className="h-12 w-full px-6 sm:w-auto" icon={step === 4 ? <Send aria-hidden className="size-4" /> : undefined}>
            {step === 4 ? "Nachricht senden" : "Weiter"}
          </Button>
        </div>
      )}
    </form>
  );
}

function Row({ label, value, onEdit, multiline = false }: { label: string; value: string; onEdit: () => void; multiline?: boolean }) {
  return (
    <div className="flex items-start gap-4 py-3">
      <div className="min-w-0 flex-1">
        <dt className="text-body text-slate">{label}</dt>
        <dd className={cx("mt-0.5 break-words", multiline && "line-clamp-4 whitespace-pre-line")}>{value}</dd>
      </div>
      <Button type="button" variant="tertiary" size="sm" onClick={onEdit}>
        Ändern<span className="sr-only">: {label}</span>
      </Button>
    </div>
  );
}
