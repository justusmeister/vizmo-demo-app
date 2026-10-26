"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { defaultCriteria } from "@/features/criteria/types";
import { cx } from "@/lib/cx";
import { emptyDraft, formatEuro, PRICE, warmRent, type Draft } from "./draft";
import { createListing, type ListingResult } from "./listing-result";
import { ListingSuccess } from "./listing-success";
import { Review } from "./review";
import { StepBesichtigung, StepFotos, StepKriterien, StepMiete, StepWohnung } from "./sections";
import { missing, wizardSteps, type StepId } from "./wizard-steps";

// Landlord screen 1: create a listing in six clear steps. The step list shows at all
// times what is done and what is still missing, so nothing gets forgotten.

const sections = {
  wohnung: StepWohnung,
  miete: StepMiete,
  besichtigung: StepBesichtigung,
  kriterien: StepKriterien,
  fotos: StepFotos,
} as const;

export function ListingWizard() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [current, setCurrent] = useState<StepId>("wohnung");
  const [visited, setVisited] = useState<Set<StepId>>(new Set(["wohnung"]));
  const [errorsFor, setErrorsFor] = useState<Set<StepId>>(new Set());
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<ListingResult | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Move focus to the step heading when the step changes (not on first load).
  const shownStep = useRef(current);
  useEffect(() => {
    if (shownStep.current === current) return;
    shownStep.current = current;
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }, [current]);

  const index = wizardSteps.findIndex((step) => step.id === current);
  const step = wizardSteps[index];
  const missingAll = wizardSteps.map((s) => missing(s.id, draft));
  const doneCount = wizardSteps.filter((s, i) => visited.has(s.id) && missingAll[i].length === 0).length;
  const allComplete = missingAll.every((items) => items.length === 0);

  const update = (patch: Partial<Draft>) => setDraft((previous) => ({ ...previous, ...patch }));

  function goTo(id: StepId) {
    if (id === "kriterien" && !draft.criteria) update({ criteria: defaultCriteria(warmRent(draft), draft.availableFrom) });
    setVisited((previous) => new Set(previous).add(id));
    setCurrent(id);
  }

  function next() {
    if (missing(current, draft).length) {
      setErrorsFor((previous) => new Set(previous).add(current));
      return;
    }
    const following = wizardSteps[index + 1];
    if (following) goTo(following.id);
  }

  function create() {
    if (!allComplete) {
      setErrorsFor(new Set(wizardSteps.map((s) => s.id)));
      return;
    }
    setCreating(true);
    timer.current = window.setTimeout(() => {
      setResult(createListing(draft));
      setCreating(false);
      window.scrollTo({ top: 0 });
    }, 1500);
  }

  if (result) return <ListingSuccess draft={draft} result={result} />;

  const status = (id: StepId, i: number) => {
    const items = missingAll[i];
    if (!visited.has(id)) return { label: "Noch offen", done: false };
    if (items.length === 0) return { label: "Vollständig", done: true };
    return { label: `${items.length} ${items.length === 1 ? "Angabe fehlt" : "Angaben fehlen"}`, done: false };
  };

  const Section = current === "pruefen" ? null : sections[current];

  return (
    <>
      <PageHeader
        title="Neues Inserat"
        description="In sechs Schritten zum fertigen Inserat. Die Schrittübersicht zeigt jederzeit, was noch fehlt."
      />

      <div className="grid items-start gap-6 xl:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="min-w-0 xl:sticky xl:top-8">
          {/* Mobile: compact progress */}
          <div className="flex flex-col gap-2 xl:hidden">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-medium">
                Schritt {index + 1} von {wizardSteps.length}: {step.title}
              </p>
              <span className="text-small text-slate tabular-nums">{doneCount}/{wizardSteps.length} vollständig</span>
            </div>
            <Progress value={doneCount} max={wizardSteps.length} label="Vollständige Schritte" />
            <nav aria-label="Schritte" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
              <ol className="flex gap-2 pb-1">
                {wizardSteps.map((s, i) => {
                  const st = status(s.id, i);
                  const active = s.id === current;
                  return (
                    <li key={s.id} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => goTo(s.id)}
                        aria-current={active ? "step" : undefined}
                        className={cx(
                          "flex h-9 items-center gap-2 rounded-full border px-3 text-small font-medium whitespace-nowrap",
                          active ? "border-blue bg-mist text-night" : "border-line bg-white text-night",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cx(
                            "flex size-5 items-center justify-center rounded-full",
                            st.done ? "bg-night text-white" : active ? "bg-blue text-white" : "bg-line text-night",
                          )}
                        >
                          {st.done ? <Check className="size-3" strokeWidth={3} /> : i + 1}
                        </span>
                        {s.title}
                        <span className="sr-only">, {st.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>

          {/* Desktop: full step list */}
          <Card padding="none" className="hidden xl:block">
            <nav aria-label="Schritte">
              <ol className="flex flex-col p-2">
                {wizardSteps.map((s, i) => {
                  const st = status(s.id, i);
                  const active = s.id === current;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => goTo(s.id)}
                        aria-current={active ? "step" : undefined}
                        className={cx(
                          "flex w-full items-start gap-3 rounded-button px-3 py-2.5 text-left transition-colors",
                          active ? "bg-mist" : "hover:bg-surface",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cx(
                            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-small font-medium",
                            st.done && "bg-night text-white",
                            !st.done && active && "bg-blue text-white",
                            !st.done && !active && "border-2 border-line text-slate",
                          )}
                        >
                          {st.done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium text-night">{s.title}</span>
                          <span className={cx("block text-small", !st.done && visited.has(s.id) && errorsFor.has(s.id) ? "text-error" : "text-slate")}>
                            {st.label}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
            <div className="flex flex-col gap-2 border-t border-line p-4">
              <div className="flex justify-between text-small">
                <span className="text-slate">Fortschritt</span>
                <span className="font-medium tabular-nums">
                  {doneCount} von {wizardSteps.length}
                </span>
              </div>
              <Progress value={doneCount} max={wizardSteps.length} label="Vollständige Schritte" />
              <p className="mt-1 text-small text-slate">Preis: {formatEuro(PRICE)} einmalig, erst beim Erstellen fällig.</p>
            </div>
          </Card>
        </aside>

        <Card padding="none" className="min-w-0">
          <header className="border-b border-line px-5 py-4 md:px-6">
            <p className="text-small text-slate">
              Schritt {index + 1} von {wizardSteps.length}
            </p>
            <h2 ref={headingRef} tabIndex={-1} className="scroll-mt-20 text-h2 outline-none">
              {step.title}
            </h2>
            <p className="text-slate">{step.description}</p>
          </header>

          <div className="px-5 py-6 md:px-6">
            {Section ? (
              <Section draft={draft} update={update} showErrors={errorsFor.has(current)} />
            ) : (
              <Review draft={draft} update={update} showErrors={errorsFor.has("pruefen")} goTo={goTo} />
            )}
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 rounded-b-card border-t border-line bg-surface px-5 py-4 md:px-6">
            <Button variant="secondary" onClick={() => goTo(wizardSteps[index - 1].id)} disabled={index === 0}>
              Zurück
            </Button>
            <div className="flex items-center gap-3">
              {errorsFor.has(current) && missing(current, draft).length > 0 && (
                <p className="hidden text-small font-medium text-error sm:block" aria-live="polite">
                  {missing(current, draft).length === 1 ? "1 Angabe fehlt" : `${missing(current, draft).length} Angaben fehlen`}
                </p>
              )}
              {current === "pruefen" ? (
                <Button onClick={create} loading={creating}>
                  {creating ? "Inserat wird erstellt …" : `Zahlungspflichtig erstellen (${formatEuro(PRICE)})`}
                </Button>
              ) : (
                <Button onClick={next}>Weiter: {wizardSteps[index + 1].title}</Button>
              )}
            </div>
          </footer>
        </Card>
      </div>
    </>
  );
}
