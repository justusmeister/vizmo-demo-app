"use client";

import { Cookie } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";

// Cookie banner with equally prominent accept and reject (TDDDG § 25, DSGVO). The site
// currently only uses technically necessary storage; "Statistik" exists so consent can be
// collected before any analytics is added.

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
        <div role="region" aria-label="Cookie-Hinweis" className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:gap-8 md:px-6 md:py-5">
            <div className="flex min-w-0 flex-1 gap-3">
              <Cookie aria-hidden className="mt-0.5 size-5 shrink-0 text-deep-blue" />
              <div>
                <p className="font-medium">Ihre Privatsphäre</p>
                <p className="mt-1 text-slate">
                  Wir nutzen nur technisch notwendige Speicher, damit die Seite funktioniert. Optionale Statistik setzen wir
                  nur mit Ihrer Einwilligung ein. Mehr in der{" "}
                  <Link href="/datenschutz" className="font-medium text-blue underline hover:text-deep-blue">
                    Datenschutzerklärung
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="grid grid-cols-2 gap-2 sm:order-2">
                <Button variant="secondary" onClick={() => save({ statistics: false })}>
                  Ablehnen
                </Button>
                <Button variant="secondary" onClick={() => save({ statistics: true })}>
                  Akzeptieren
                </Button>
              </div>
              <Button variant="tertiary" onClick={openSettings}>
                Einstellungen
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        size="lg"
        title="Cookie-Einstellungen"
        description="Wählen Sie, welche Speicher wir nutzen dürfen. Sie können Ihre Auswahl jederzeit im Fuß der Seite ändern."
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
                  Anonyme Nutzungsstatistik, um die Seite zu verbessern. Derzeit ist kein Statistik-Dienst im Einsatz.
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
