"use client";

import { CalendarDays, Camera, Check, CircleHelp, MessageSquare, Plus, Scale, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChoiceChip, ChoiceGroup } from "@/components/ui/choice-chip";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { protectedGroundsIn } from "@/features/criteria/agg-check";
import { bookingDate, formatDayLabel } from "@/features/listing-manage/slots";
import { useMounted } from "@/lib/use-mounted";
import { listing, type Applicant, type MessageCategory } from "./data";
import { appliedLabel } from "./match";

// Detail-panel sections for booked slots, viewing feedback and voluntary extra messages,
// plus the "Videokonferenz vereinbaren" dialog (UI only; the call itself comes later).

const DURATION = 20;
const pad = (n: number) => String(n).padStart(2, "0");

function addMinutes(time: string, minutes: number) {
  const total = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)) + minutes;
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

/** "Di, 27.10., 17:20" for the table, full label for the detail panel. */
export function SlotLabel({ slot, long = false }: { slot: NonNullable<Applicant["slot"]>; long?: boolean }) {
  const mounted = useMounted();
  if (!mounted) return null;
  const now = new Date();
  const date = bookingDate({ ...slot, name: "" }, now);
  if (long) return <>{`${formatDayLabel(date, now)}, ${slot.time}–${addMinutes(slot.time, DURATION)} Uhr`}</>;
  const weekday = new Intl.DateTimeFormat("de-DE", { weekday: "short" }).format(date).replace(".", "");
  return <>{`${weekday}, ${pad(date.getDate())}.${pad(date.getMonth() + 1)}., ${slot.time}`}</>;
}

export const interestLabels = {
  ja: { short: "Möchte mieten", long: "Möchte die Wohnung mieten", icon: ThumbsUp },
  unsicher: { short: "Unentschlossen", long: "Noch unentschlossen", icon: CircleHelp },
  nein: { short: "Kein Interesse", long: "Kein Interesse mehr", icon: ThumbsDown },
} as const;

export function BookedSlot({ applicant }: { applicant: Applicant }) {
  if (!applicant.slot) return null;
  return (
    <section className="flex items-start gap-3 rounded-card border border-line p-4">
      <CalendarDays aria-hidden className="mt-0.5 size-5 shrink-0 text-deep-blue" />
      <div>
        <p className="text-small text-slate">Gebuchter Besichtigungsslot</p>
        <p className="font-medium">
          <SlotLabel slot={applicant.slot} long />
        </p>
        <p className="text-small text-slate">Allein per Smartlock, Zugang nur in diesem Zeitfenster</p>
      </div>
    </section>
  );
}

export function FeedbackSection({ applicant }: { applicant: Applicant }) {
  const feedback = applicant.feedback;
  if (!feedback) return null;
  const interest = interestLabels[feedback.interest];
  const Icon = interest.icon;
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-h3">Rückmeldung nach der Besichtigung</h3>
        <span className="text-small text-slate">{feedback.daysAgo === 1 ? "Gestern" : `vor ${feedback.daysAgo} Tagen`}</span>
      </div>
      <div className="flex flex-col gap-3 rounded-card border border-line p-4">
        <p className="flex items-center gap-2 font-medium">
          <Icon aria-hidden className="size-5 text-deep-blue" />
          {interest.long}
        </p>
        <blockquote className="rounded-card bg-surface px-4 py-3">„{feedback.text}“</blockquote>
        <div className="flex flex-col gap-2 border-t border-line pt-3">
          <p className="flex items-center gap-2 text-slate">
            <Camera aria-hidden className="size-4 shrink-0" />
            {feedback.photos} von 3 Zustandsfotos am Ende hochgeladen
          </p>
          {feedback.photoCheck.ok ? (
            <p className="flex items-center gap-2 font-medium">
              <Check aria-hidden className="size-4 shrink-0 text-night" strokeWidth={2.5} />
              Abgleich mit Ihren Zustandsfotos: keine Auffälligkeiten
            </p>
          ) : (
            <div className="flex flex-col items-start gap-2">
              <Badge tone="warning">Abweichung erkannt</Badge>
              <p>{feedback.photoCheck.finding}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function messageCountLabel(count: number) {
  if (count === 0) return "0 Nachrichten";
  return `${count} gesendete ${count === 1 ? "Nachricht" : "Nachrichten"}`;
}

export function ExtraMessages({ applicant }: { applicant: Applicant }) {
  const mounted = useMounted();
  const messages = applicant.extraMessages ?? [];
  const flagged = messages.filter((message) => protectedGroundsIn(message.text).length > 0).length;
  const header = (
    <div className="flex items-baseline justify-between gap-3">
      <h3 className="text-h3">Zusätzliche Nachrichten</h3>
      <span className="flex items-center gap-1.5 text-small font-medium text-night">
        <MessageSquare aria-hidden className="size-4 text-deep-blue" />
        {messageCountLabel(messages.length)}
      </span>
    </div>
  );
  if (!messages.length) {
    return (
      <section className="flex flex-col gap-2">
        {header}
        <p className="text-slate">Keine weiteren Nachrichten nach der Bewerbung.</p>
      </section>
    );
  }
  const byCategory = new Map<MessageCategory, typeof messages>();
  for (const message of messages) byCategory.set(message.category, [...(byCategory.get(message.category) ?? []), message]);

  return (
    <section className="flex flex-col gap-3">
      {header}
      {applicant.extraSummary && (
        <div className="flex gap-3 rounded-card bg-mist p-4">
          <Sparkles aria-hidden className="mt-0.5 size-5 shrink-0 text-deep-blue" />
          <div>
            <p className="text-small font-medium text-slate">KI-Zusammenfassung</p>
            <p className="mt-0.5">{applicant.extraSummary}</p>
          </div>
        </div>
      )}
      <ul className="flex flex-wrap gap-2">
        {[...byCategory].map(([category, items]) => (
          <li key={category} className="rounded-full border border-line px-3 py-1 text-small font-medium">
            {category} <span className="text-slate">{items.length}</span>
          </li>
        ))}
      </ul>
      {flagged > 0 && (
        <p className="flex items-start gap-2 text-small text-slate">
          <Scale aria-hidden className="mt-px size-4 shrink-0 text-deep-blue" />
          {flagged === 1 ? "1 Nachricht enthält" : `${flagged} Nachrichten enthalten`} Angaben, die nach AGG nicht in Passung
          und Sortierung einfließen.
        </p>
      )}
      <details className="group rounded-card border border-line">
        <summary className="cursor-pointer list-none px-4 py-3 font-medium text-blue hover:text-deep-blue">
          <span className="group-open:hidden">Alle Nachrichten anzeigen</span>
          <span className="hidden group-open:inline">Nachrichten ausblenden</span>
        </summary>
        <ul className="divide-y divide-line border-t border-line">
          {[...byCategory].flatMap(([category, items]) =>
            items.map((message) => (
              <li key={`${category}-${message.minutesAgo}`} className="flex flex-col gap-1 px-4 py-3">
                <span className="flex flex-wrap justify-between gap-2 text-small text-slate">
                  <span className="font-medium text-night">{category}</span>
                  {mounted && appliedLabel(message.minutesAgo)}
                </span>
                <p>{message.text}</p>
                <MessageEffect text={message.text} criterion={message.effect?.criterion} />
              </li>
            )),
          )}
        </ul>
      </details>
    </section>
  );
}

function MessageEffect({ text, criterion }: { text: string; criterion?: string }) {
  const grounds = protectedGroundsIn(text);
  if (grounds.length)
    return (
      <p className="flex items-center gap-1.5 text-small text-slate">
        <Scale aria-hidden className="size-3.5 shrink-0" />
        Nicht berücksichtigt: enthält Angaben zu {grounds.join(", ")} (AGG)
      </p>
    );
  if (criterion)
    return (
      <p className="flex items-center gap-1.5 text-small font-medium text-deep-blue">
        <Sparkles aria-hidden className="size-3.5 shrink-0" />
        Fließt in die Passung ein: {criterion}
      </p>
    );
  return null;
}

function proposals(now: Date) {
  const result: { key: string; label: string }[] = [];
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  while (result.length < 6) {
    day.setDate(day.getDate() + 1);
    if (day.getDay() === 0) continue;
    for (const time of ["12:30", "18:30"]) {
      result.push({ key: `${day.toDateString()} ${time}`, label: `${formatDayLabel(day, now)}, ${time} Uhr` });
    }
  }
  return result;
}

export function VideoCallDialog({
  applicant,
  name,
  onClose,
  onSend,
}: {
  applicant: Applicant | null;
  name: string;
  onClose: () => void;
  onSend: (id: string) => void;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const [duration, setDuration] = useState(15);
  const [custom, setCustom] = useState<{ key: string; label: string }[]>([]);
  const [ownDate, setOwnDate] = useState("");
  const [ownTime, setOwnTime] = useState("");
  const options = applicant ? [...proposals(new Date()), ...custom] : [];

  function addOwn() {
    if (!ownDate || !ownTime || picked.length >= 3) return;
    const [year, month, day] = ownDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const key = `own ${ownDate} ${ownTime}`;
    if (!custom.some((c) => c.key === key)) {
      setCustom((current) => [...current, { key, label: `${formatDayLabel(date, new Date())}, ${ownTime} Uhr` }]);
    }
    setPicked((current) => (current.includes(key) ? current : [...current, key]));
    setOwnTime("");
  }

  const toggle = (key: string) =>
    setPicked((current) => (current.includes(key) ? current.filter((k) => k !== key) : current.length < 3 ? [...current, key] : current));

  return (
    <Dialog
      open={applicant != null}
      onClose={() => {
        setPicked([]);
        setCustom([]);
        onClose();
      }}
      title="Videokonferenz vereinbaren"
      description={`Mit ${name}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            disabled={picked.length === 0}
            onClick={() => {
              if (applicant) onSend(applicant.id);
              setPicked([]);
              setCustom([]);
            }}
          >
            {picked.length ? `${picked.length} ${picked.length === 1 ? "Termin" : "Termine"} vorschlagen` : "Termine vorschlagen"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <p className="text-slate">
          Schlagen Sie bis zu drei Termine vor. {name} wählt einen davon und erhält den Link per E-Mail. Gut für
          Rückfragen vorab oder statt einer Besichtigung, wenn die Person nicht in Berlin ist.
        </p>
        <ChoiceGroup label="Terminvorschläge">
          {options.map((option) => (
            <ChoiceChip key={option.key} selected={picked.includes(option.key)} onClick={() => toggle(option.key)}>
              {option.label}
            </ChoiceChip>
          ))}
        </ChoiceGroup>
        <div className="flex flex-col gap-2">
          <p className="font-medium text-slate">Eigenen Termin wählen</p>
          <div className="flex flex-wrap items-end gap-2">
            <Input label="Datum" type="date" value={ownDate} onChange={(event) => setOwnDate(event.target.value)} className="w-44" />
            <Input label="Uhrzeit" type="time" step={900} value={ownTime} onChange={(event) => setOwnTime(event.target.value)} className="w-32" />
            <Button
              variant="secondary"
              onClick={addOwn}
              disabled={!ownDate || !ownTime || picked.length >= 3}
              icon={<Plus aria-hidden className="size-4" />}
            >
              Hinzufügen
            </Button>
          </div>
          {picked.length >= 3 && <p className="text-small text-slate">Drei Termine ausgewählt. Entfernen Sie einen, um einen anderen zu wählen.</p>}
        </div>
        <ChoiceGroup label="Dauer">
          {[15, 30].map((minutes) => (
            <ChoiceChip key={minutes} selected={duration === minutes} onClick={() => setDuration(minutes)}>
              {minutes} Minuten
            </ChoiceChip>
          ))}
        </ChoiceGroup>
        <Notice>Die Videokonferenz läuft direkt im Browser über vizmo, ohne Installation. Für {listing.title}.</Notice>
      </div>
    </Dialog>
  );
}
