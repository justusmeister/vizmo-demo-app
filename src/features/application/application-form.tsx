"use client";

import { ChevronDown, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getListingByCode } from "@/data/listings";
import { cx } from "@/lib/cx";
import { ApplicationSuccess } from "./application-success";
import { emptyApplication, type Application } from "./draft";
import { ListingDetails, ListingFacts } from "./listing-summary";
import { Review } from "./review";
import { StepBeruf, StepHaushalt, StepKontakt, StepVorstellung } from "./sections";
import { applicationSteps, missing, type StepId } from "./steps";

// Applicant screen 1: mobile-first application form behind the public listing link.

const sections = { kontakt: StepKontakt, haushalt: StepHaushalt, beruf: StepBeruf, vorstellung: StepVorstellung } as const;

export function ApplicationForm({ code }: { code: string }) {
  const listing = getListingByCode(code)!;
  const [data, setData] = useState<Application>(emptyApplication);
  const [current, setCurrent] = useState<StepId>("kontakt");
  const [showErrors, setShowErrors] = useState<Set<StepId>>(new Set());
  const [sending, setSending] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shownStep = useRef(current);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (shownStep.current === current) return;
    shownStep.current = current;
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [current]);

  const index = applicationSteps.findIndex((s) => s.id === current);
  const step = applicationSteps[index];
  const errors = showErrors.has(current) ? missing(current, data) : {};
  const update = (patch: Partial<Application>) => setData((previous) => ({ ...previous, ...patch }));
  const goTo = (id: StepId) => setCurrent(id);

  function next() {
    if (Object.keys(missing(current, data)).length) {
      setShowErrors((previous) => new Set(previous).add(current));
      return;
    }
    if (current !== "absenden") {
      goTo(applicationSteps[index + 1].id);
      return;
    }
    const incomplete = applicationSteps.find((s) => Object.keys(missing(s.id, data)).length);
    if (incomplete) {
      setShowErrors((previous) => new Set(previous).add(incomplete.id));
      goTo(incomplete.id);
      return;
    }
    setSending(true);
    timer.current = window.setTimeout(() => {
      setReference(`B-${2065 + Math.floor(Math.random() * 30)}`);
      setSending(false);
      window.scrollTo({ top: 0 });
    }, 1200);
  }

  if (reference) return <ApplicationSuccess data={data} listing={listing} reference={reference} />;

  const Section = current === "absenden" ? null : sections[current];
  const errorCount = Object.keys(errors).length;

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 pt-5 pb-28 md:px-6 md:pt-8 md:pb-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
      {/* Listing: compact on mobile with expandable details, sidebar on desktop */}
      <aside className="lg:order-2">
        <Card className="lg:sticky lg:top-20">
          <ListingFacts listing={listing} />
          <details className="group mt-3 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-1 font-medium text-blue">
              Details zur Wohnung
              <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-3">
              <ListingDetails listing={listing} />
            </div>
          </details>
          <div className="mt-4 hidden lg:block">
            <ListingDetails listing={listing} />
          </div>
        </Card>
      </aside>

      <div className="flex min-w-0 flex-col gap-4 lg:order-1">
        {index === 0 && (
          <div>
            <h1 className="text-h1">Jetzt bewerben</h1>
            <p className="mt-1 text-slate">Dauert etwa 3 Minuten. Pflichtfelder sind gekennzeichnet, alles andere ist freiwillig.</p>
          </div>
        )}

        <nav aria-label="Fortschritt" className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between text-small">
            <span className="font-medium">
              Schritt {index + 1} von {applicationSteps.length}
            </span>
            <span className="text-slate">{step.short}</span>
          </div>
          <ol className="grid grid-cols-5 gap-1.5">
            {applicationSteps.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => i < index && goTo(s.id)}
                  disabled={i >= index}
                  aria-label={`${s.short}${i < index ? ", erledigt" : i === index ? ", aktuell" : ""}`}
                  aria-current={i === index ? "step" : undefined}
                  className={cx("block h-1.5 w-full rounded-full", i < index ? "bg-night" : i === index ? "bg-blue" : "bg-line")}
                />
              </li>
            ))}
          </ol>
        </nav>

        <Card padding="none">
          <header className="border-b border-line px-4 py-4 md:px-6">
            <h2 ref={headingRef} tabIndex={-1} className="text-h2 outline-none">
              {step.title}
            </h2>
            <p className="text-slate">{step.description}</p>
          </header>
          <div className="px-4 py-5 md:px-6">
            {Section ? (
              <Section data={data} update={update} errors={errors} listing={listing} />
            ) : (
              <Review data={data} update={update} errors={errors} listing={listing} goTo={goTo} />
            )}
          </div>
        </Card>

        {/* Action bar: fixed to the thumb zone on mobile, inline from md */}
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:static md:border-0 md:bg-transparent md:p-0">
          {errorCount > 0 && (
            <p className="mb-2 text-center text-small font-medium text-error md:text-right" aria-live="polite">
              {errorCount === 1 ? "1 Angabe fehlt noch" : `${errorCount} Angaben fehlen noch`}
            </p>
          )}
          <div className="mx-auto flex max-w-5xl gap-2 md:justify-end">
            {index > 0 && (
              <Button variant="secondary" onClick={() => goTo(applicationSteps[index - 1].id)} aria-label="Zurück" className="h-12 px-3 md:h-10 md:px-4">
                <ChevronLeft aria-hidden className="size-5 md:hidden" />
                <span className="hidden md:inline">Zurück</span>
              </Button>
            )}
            <Button onClick={next} loading={sending} className="h-12 flex-1 md:h-10 md:flex-none">
              {current === "absenden" ? (sending ? "Wird gesendet …" : "Bewerbung absenden") : `Weiter: ${applicationSteps[index + 1].short}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
