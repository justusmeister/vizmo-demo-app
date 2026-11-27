"use client";

import { Cookie } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";

// Cookie banner with equally prominent accept and reject (TDDDG § 25, DSGVO). Besides the
// technically necessary storage of the choice itself, "Statistik" switches on Vercel Web
// Analytics (see SiteAnalytics); without that consent no analytics script loads.

const KEY = "vizmo-consent";
const EVENT = "vizmo-consent-change";
const OPEN_EVENT = "vizmo-consent-open";

type Consent = { statistics: boolean; date: string };

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return "unavailable";
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function save(consent: Omit<Consent, "date">) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...consent, date: new Date().toISOString() }));
  } catch {
    // Storage blocked: the banner will show again next time.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** True once the visitor has agreed to statistics; false before any choice or after a reject. */
export function useStatisticsConsent() {
  const stored = useSyncExternalStore(subscribe, read, () => null);
  if (!stored || stored === "unavailable") return false;
  try {
    return (JSON.parse(stored) as Consent).statistics === true;
  } catch {
    return false;
  }
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie-Einstellungen
    </button>
  );
}

export function CookieConsent() {
  // "pending" during static rendering so the banner never flashes for returning visitors.
  const stored = useSyncExternalStore(subscribe, read, () => "pending");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statistics, setStatistics] = useState(false);

  const showBanner = stored === null;

  function openSettings() {
    try {
      const current = JSON.parse(window.localStorage.getItem(KEY) ?? "null") as Consent | null;
      setStatistics(current?.statistics ?? false);
    } catch {
      setStatistics(false);
    }
    setSettingsOpen(true);
  }

  return (
    <>
      <OpenListener onOpen={openSettings} />
      {showBanner && (
        // Floating, centred card: one deliberate step, not a strip glued to the page edge.
        <div
          role="region"
          aria-label="Cookie-Hinweis"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-modal border border-line bg-white p-5 shadow-overlay sm:bottom-6 sm:p-6"
        >
          <div className="flex gap-3">
            <Cookie aria-hidden className="mt-0.5 size-5 shrink-0 text-deep-blue" />
            <div className="min-w-0">
              <p className="font-medium">Ihre Privatsphäre</p>
              <p className="mt-1 text-slate">
                Wir nutzen nur technisch notwendige Speicher, damit die Seite funktioniert. Optionale Statistik setzen wir nur
                mit Ihrer Einwilligung ein. Mehr in der{" "}
                <Link href="/datenschutz" className="font-medium text-blue underline hover:text-deep-blue">
                  Datenschutzerklärung
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="tertiary" onClick={openSettings} className="sm:order-first">
              Einstellungen
            </Button>
            <div className="grid grid-cols-2 gap-2 max-sm:order-first">
              <Button variant="secondary" onClick={() => save({ statistics: false })}>
                Ablehnen
              </Button>
              <Button variant="secondary" onClick={() => save({ statistics: true })}>
                Akzeptieren
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Always-there way back to the settings once a choice is made (TDDDG: withdrawing must
          be as easy as consenting). */}
      {stored !== null && stored !== "pending" && !settingsOpen && (
        <button
          type="button"
          onClick={openSettings}
          aria-label="Cookie-Einstellungen"
          title="Cookie-Einstellungen"
          className="fixed bottom-4 left-4 z-40 flex size-11 items-center justify-center rounded-full border border-line bg-white text-deep-blue shadow-overlay transition-colors hover:border-gray hover:text-blue"
        >
          <Cookie aria-hidden className="size-5" />
        </button>
      )}

      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        size="lg"
        title="Cookie-Einstellungen"
        description="Sie können Ihre Auswahl jederzeit über das Cookie-Symbol unten links ändern."
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                save({ statistics: false });
                setSettingsOpen(false);
              }}
            >
              Alle ablehnen
            </Button>
            <Button
              onClick={() => {
                save({ statistics });
                setSettingsOpen(false);
              }}
            >
              Auswahl speichern
            </Button>
          </>
        }
      >
        <ul className="flex flex-col gap-4">
          <li className="flex flex-col gap-2 rounded-card border border-line p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div>
              <p className="text-h2 font-medium">Notwendig</p>
              <p className="mt-1 text-slate">Speichert Ihre Cookie-Auswahl im Browser. Ohne Einwilligung zulässig.</p>
            </div>
            <span className="w-fit shrink-0 rounded-full bg-mist px-3 py-1 text-body font-medium text-night">Immer aktiv</span>
          </li>
          <li>
            <label className="flex cursor-pointer items-start gap-4 rounded-card border border-line p-5 hover:border-gray">
              <Checkbox checked={statistics} onChange={(event) => setStatistics(event.target.checked)} className="mt-1" />
              <span>
                <span className="block text-h2 font-medium">Statistik</span>
                <span className="mt-1 block text-slate">
                  Zählt Seitenaufrufe mit Vercel Web Analytics, ohne Cookies und ohne Sie wiederzuerkennen. So sehen wir, wie viele Menschen die Seite wann besuchen.
                </span>
              </span>
            </label>
          </li>
        </ul>
      </Dialog>
    </>
  );
}

// Listens for openCookieSettings() calls from anywhere on the page (e.g. the footer).
function OpenListener({ onOpen }: { onOpen: () => void }) {
  const latest = useRef(onOpen);
  useEffect(() => {
    latest.current = onOpen;
  });
  useEffect(() => {
    const handler = () => latest.current();
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);
  return null;
}
