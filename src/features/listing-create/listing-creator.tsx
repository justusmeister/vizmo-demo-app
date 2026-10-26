"use client";

import { Check, Undo2 } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BrandMark } from "@/components/shell/brand-mark";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { emptyDraft, formatDate, formatEuro, formatNumber, type Draft } from "./draft";
import { DraftSummary } from "./draft-summary";
import type { Extracted } from "./extract";
import { createListing, type ListingResult } from "./listing-result";
import { ListingSuccess } from "./listing-success";
import { steps, type Submit } from "./steps";

type Turn = { stepId: string; answer: string; before: Draft };

const TYPING_MS = 650;

function AssistantMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <BrandMark size={32} className="mt-0.5" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-small font-medium text-slate">vizmo Assistent</span>
        <div className="flex flex-col gap-3">{children}</div>
      </div>
    </div>
  );
}

function Bubble({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-prose self-start rounded-card rounded-tl-input border border-line bg-white px-4 py-3 text-night">
      {children}
    </div>
  );
}

function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end pl-10 sm:pl-16">
      <p className="max-w-prose rounded-card rounded-tr-input bg-night px-4 py-3 whitespace-pre-line text-white">
        {children}
      </p>
    </div>
  );
}

function TypingIndicator() {
  return (
    <AssistantMessage>
      <div className="self-start rounded-card rounded-tl-input border border-line bg-white px-4 py-3.5" aria-label="Assistent schreibt">
        <span className="flex gap-1">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="size-1.5 animate-pulse rounded-full bg-slate"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </span>
      </div>
    </AssistantMessage>
  );
}

const extractedLabels: { key: keyof Extracted; format: (draft: Draft) => string }[] = [
  { key: "street", format: (d) => `Adresse: ${d.street}${d.zip ? `, ${d.zip} ${d.city}` : ""}` },
  { key: "rooms", format: (d) => `${formatNumber(d.rooms!)} Zimmer` },
  { key: "size", format: (d) => `${formatNumber(d.size!)} m² Wohnfläche` },
  { key: "floor", format: (d) => `Etage: ${d.floor}` },
  { key: "coldRent", format: (d) => `Kaltmiete ${formatEuro(d.coldRent!)}` },
  { key: "utilities", format: (d) => `Nebenkosten ${formatEuro(d.utilities!)}` },
  { key: "deposit", format: (d) => `Mietkaution ${formatEuro(d.deposit!)}` },
  { key: "availableFrom", format: (d) => `Frei ab ${formatDate(d.availableFrom!)}` },
];

function ExtractionResult({ before, after }: { before: Draft; after: Draft }) {
  const found = extractedLabels.filter(({ key }) => before[key] === undefined && after[key] !== undefined);
  if (!found.length) {
    return <Bubble>Ich konnte keine Eckdaten herauslesen. Kein Problem, ich frage sie kurz einzeln ab.</Bubble>;
  }
  return (
    <Bubble>
      <p>Danke. Das habe ich übernommen:</p>
      <ul className="mt-2 flex flex-col gap-1">
        {found.map(({ key, format }) => (
          <li key={key} className="flex items-start gap-2">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-deep-blue" strokeWidth={2.5} />
            {format(after)}
          </li>
        ))}
      </ul>
    </Bubble>
  );
}

export function ListingCreator() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<ListingResult | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const createTimer = useRef<number | undefined>(undefined);

  const applicable = steps.filter((step) => step.applies(draft));
  const current = applicable.find((step) => !step.complete(draft)) ?? null;
  const done = applicable.filter((step) => step.complete(draft)).length;
  const currentKey = current?.id ?? "done";
  const typing = revealed !== currentKey;

  // Show a short typing indicator before each new assistant question.
  useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(currentKey), TYPING_MS);
    return () => window.clearTimeout(timer);
  }, [currentKey]);

  useEffect(() => {
    if (typing || turns.length === 0) return;
    const node = questionRef.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    node.focus({ preventScroll: true });
  }, [typing, turns.length]);

  useEffect(() => () => window.clearTimeout(createTimer.current), []);

  const submit: Submit = (patch, answer) => {
    if (!current) return;
    setTurns((previous) => [...previous, { stepId: current.id, answer, before: draft }]);
    setDraft((previous) => ({ ...previous, ...patch }));
  };

  function undo() {
    const last = turns.at(-1);
    if (!last) return;
    setDraft(last.before);
    setTurns(turns.slice(0, -1));
  }

  function create() {
    setCreating(true);
    createTimer.current = window.setTimeout(() => {
      setResult(createListing(draft));
      setCreating(false);
      window.scrollTo({ top: 0 });
    }, 1400);
  }

  if (result) return <ListingSuccess draft={draft} result={result} />;

  return (
    <>
      <PageHeader
        title="Neues Inserat"
        description="Beantworten Sie ein paar Fragen. vizmo bereitet daraus Ihr Inserat, die Besichtigungsslots und den Smartlock-Versand vor."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Card padding="lg" className="min-w-0">
          <div role="log" aria-label="Unterhaltung mit dem vizmo Assistenten" className="flex flex-col gap-6">
            <AssistantMessage>
              <Bubble>
                Hallo Herr Berger, ich helfe Ihnen beim Anlegen Ihres Inserats. Das dauert etwa fünf Minuten.
              </Bubble>
            </AssistantMessage>

            {turns.map((turn, index) => {
              const step = steps.find((s) => s.id === turn.stepId)!;
              const after = turns[index + 1]?.before ?? draft;
              return (
                <div key={`${turn.stepId}-${index}`} className="flex flex-col gap-6">
                  <AssistantMessage>
                    <Bubble>{step.question(turn.before).title}</Bubble>
                  </AssistantMessage>
                  <UserMessage>{turn.answer}</UserMessage>
                  {turn.stepId === "intro" && (
                    <AssistantMessage>
                      <ExtractionResult before={turn.before} after={after} />
                    </AssistantMessage>
                  )}
                </div>
              );
            })}

            {typing ? (
              <TypingIndicator />
            ) : current ? (
              <div ref={questionRef} tabIndex={-1} className="scroll-mt-20 outline-none">
                <AssistantMessage>
                  <Bubble>
                    <p className="font-medium">{current.question(draft).title}</p>
                    {current.question(draft).detail && (
                      <p className="mt-1 text-slate">{current.question(draft).detail}</p>
                    )}
                  </Bubble>
                  <div className="rounded-card border border-line bg-surface p-4">
                    <current.Input key={current.id} draft={draft} onSubmit={submit} />
                  </div>
                </AssistantMessage>
              </div>
            ) : (
              <div ref={questionRef} tabIndex={-1} className="scroll-mt-20 outline-none">
                <AssistantMessage>
                  <Bubble>
                    <p className="font-medium">Alles da. Ihr Inserat ist startklar.</p>
                    <p className="mt-1 text-slate">
                      Prüfen Sie den Entwurf. Nach dem Erstellen erhalten Sie Ihren Bewerbungslink
                      {draft.occupancy === "leer" ? " und wir verschicken Ihr Smartlock-Paket" : ""}.
                    </p>
                  </Bubble>
                  <div>
                    <Button onClick={create} loading={creating}>
                      {creating ? "Inserat wird erstellt …" : "Inserat erstellen"}
                    </Button>
                  </div>
                </AssistantMessage>
              </div>
            )}
          </div>

          {turns.length > 0 && !creating && (
            <div className="mt-6 flex justify-end border-t border-line pt-4">
              <Button variant="tertiary" size="sm" onClick={undo} icon={<Undo2 aria-hidden className="size-4" />}>
                Letzte Antwort ändern
              </Button>
            </div>
          )}
        </Card>

        <aside aria-label="Inserat-Entwurf" className="lg:sticky lg:top-8">
          <DraftSummary draft={draft} done={done} total={applicable.length} creating={creating} onCreate={create} />
        </aside>
      </div>
    </>
  );
}
