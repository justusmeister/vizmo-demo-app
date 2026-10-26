"use client";

import { ChevronRight, Copy, EyeOff, Mail, MessageSquare, Scale, Sparkles, Video } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { landlord } from "@/config/account";
import { Avatar } from "@/components/ui/avatar";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import { StepList } from "@/components/ui/step-list";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { Toast } from "@/components/ui/toast";
import { criteriaLabels } from "@/features/criteria/types";
import { cx } from "@/lib/cx";
import { useMounted } from "@/lib/use-mounted";
import { applicants as initialApplicants, employmentLabels, listing, type Applicant, type Status } from "./data";
import { appliedLabel, checks, formatDate, formatEuro, formatScore, messageBoosts, rentRatio, score } from "./match";
import { BookedSlot, ExtraMessages, FeedbackSection, interestLabels, SlotLabel, VideoCallDialog } from "./detail-sections";
import { CheckIcon, MatchMeter, StatusBadge } from "./parts";

type Tab = "alle" | Status;
type Sort = "passung" | "neueste" | "einkommen";
type Confirm = { kind: "invite" | "decline"; ids: string[] } | null;

const selectable = (status: Status) => status === "neu" || status === "eingeladen" || status === "besichtigt";

export function ApplicantList() {
  const [people, setPeople] = useState<Applicant[]>(initialApplicants);
  const [tab, setTab] = useState<Tab>("alle");
  const [sort, setSort] = useState<Sort>("passung");
  const [hideNames, setHideNames] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailId, setDetailId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoRequested, setVideoRequested] = useState<Set<string>>(new Set());
  const mounted = useMounted();
  const clearToast = useCallback(() => setToast(null), []);

  const rows = useMemo(() => {
    const visible = people.filter((p) => tab === "alle" || p.status === tab);
    const sorted = [...visible];
    if (sort === "passung") sorted.sort((a, b) => score(b) - score(a) || messageBoosts(b) - messageBoosts(a) || b.netIncome - a.netIncome);
    if (sort === "neueste") sorted.sort((a, b) => a.minutesAgo - b.minutesAgo);
    if (sort === "einkommen") sorted.sort((a, b) => b.netIncome - a.netIncome);
    return sorted;
  }, [people, tab, sort]);

  const counts = useMemo(() => {
    const count = (status: Status) => people.filter((p) => p.status === status).length;
    return { alle: people.length, neu: count("neu"), eingeladen: count("eingeladen"), gebucht: count("gebucht"), besichtigt: count("besichtigt"), abgesagt: count("abgesagt") };
  }, [people]);

  const selectableRows = rows.filter((p) => selectable(p.status));
  const allSelected = selectableRows.length > 0 && selectableRows.every((p) => selected.has(p.id));
  const someSelected = selectableRows.some((p) => selected.has(p.id));
  const selectedPeople = people.filter((p) => selected.has(p.id));
  const invitable = selectedPeople.filter((p) => p.status === "neu");
  const detail = people.find((p) => p.id === detailId) ?? null;
  const name = (p: Applicant) => (hideNames ? `Bewerbung ${p.ref}` : `${p.firstName} ${p.lastName}`);
  const initials = (p: Applicant) => (hideNames ? "?" : `${p.firstName[0]}${p.lastName[0]}`);

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(selectableRows.map((p) => p.id)));
  }

  function apply(kind: "invite" | "decline", ids: string[]) {
    const status: Status = kind === "invite" ? "eingeladen" : "abgesagt";
    const note = kind === "invite" ? "Einladung gerade verschickt" : "Absage gerade verschickt";
    setPeople((current) => current.map((p) => (ids.includes(p.id) ? { ...p, status, statusNote: note } : p)));
    setSelected(new Set());
    setConfirm(null);
    setDetailId(null);
    const n = ids.length;
    setToast(
      kind === "invite"
        ? `${n} ${n === 1 ? "Einladung" : "Einladungen"} zur Besichtigung verschickt`
        : `${n} ${n === 1 ? "Absage" : "Absagen"} verschickt`,
    );
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(listing.link);
    } catch {
      // Clipboard unavailable; the link is also shown on the listing page.
    }
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 2000);
  }

  const confirmPeople = confirm ? people.filter((p) => confirm.ids.includes(p.id)) : [];

  return (
    <>
      <nav aria-label="Brotkrumen" className="mb-2 text-small text-slate">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-night hover:underline">
              Meine Inserate
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5" />
          </li>
          <li>
            <Link href={`/p/inserate/${listing.slug}`} className="hover:text-night hover:underline">
              {listing.title}
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5" />
          </li>
          <li aria-current="page" className="text-night">
            Bewerbungen
          </li>
        </ol>
      </nav>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
        <div className="min-w-0">
          <h1 className="text-h1">Bewerbungen</h1>
          <p className="mt-1 text-slate">
            {listing.title}, {listing.rooms} Zimmer, {listing.size} m², {formatEuro(listing.warmRent)} warm, frei ab{" "}
            {formatDate(listing.availableFrom)}
          </p>
        </div>
        <Button variant="secondary" onClick={copyLink} icon={<Copy aria-hidden className="size-4" />}>
          <span aria-live="polite">{linkCopied ? "Link kopiert" : "Bewerbungslink kopieren"}</span>
        </Button>
      </header>

      <Card tone="mist" className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-h3">Sortiert nach Ihren Kriterien</h2>
            <p className="mt-0.5 text-slate">
              Alle Bewerbungen bleiben sichtbar. Wer mehr Kriterien erfüllt, steht weiter oben.
            </p>
          </div>
          <ButtonLink href={`/p/inserate/${listing.slug}#kriterien`} size="sm" variant="secondary">
            Kriterien anpassen
          </ButtonLink>
        </div>
        <ul className="flex flex-wrap gap-2">
          {criteriaLabels(listing.criteria).map((label) => (
            <li key={label} className="rounded-full bg-white px-3 py-1 text-small font-medium text-night">
              {label}
            </li>
          ))}
        </ul>
        <p className="flex items-start gap-2 text-small text-slate">
          <Scale aria-hidden className="mt-px size-4 shrink-0" />
          Herkunft, Religion, Geschlecht, Alter und Behinderung werden gemäß AGG weder abgefragt noch bewertet.
        </p>
      </Card>

      <Card padding="none">
        <div className="flex flex-col gap-3 border-b border-line p-4 md:flex-row md:items-center md:justify-between md:p-5">
          {someSelected ? (
            <div className="flex flex-wrap items-center gap-2">
              <p className="mr-2 font-medium tabular-nums">{selectedPeople.length} ausgewählt</p>
              <Button
                size="sm"
                disabled={invitable.length === 0}
                onClick={() => setConfirm({ kind: "invite", ids: invitable.map((p) => p.id) })}
                icon={<Mail aria-hidden className="size-4" />}
              >
                Zur Besichtigung einladen{invitable.length ? ` (${invitable.length})` : ""}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setConfirm({ kind: "decline", ids: selectedPeople.map((p) => p.id) })}>
                Absagen
              </Button>
              <Button size="sm" variant="tertiary" onClick={() => setSelected(new Set())}>
                Auswahl aufheben
              </Button>
            </div>
          ) : (
            <Segmented
              label="Status"
              value={tab}
              onChange={(value) => {
                setTab(value);
                setSelected(new Set());
              }}
              options={[
                { value: "alle", label: "Alle", count: counts.alle },
                { value: "neu", label: "Neu", count: counts.neu },
                { value: "eingeladen", label: "Eingeladen", count: counts.eingeladen },
                { value: "gebucht", label: "Gebucht", count: counts.gebucht },
                { value: "besichtigt", label: "Besichtigt", count: counts.besichtigt },
                { value: "abgesagt", label: "Abgesagt", count: counts.abgesagt },
              ]}
            />
          )}
          <div className="flex flex-wrap items-end gap-4">
            <label className="flex h-10 cursor-pointer items-center gap-2 font-medium text-night">
              <Checkbox checked={hideNames} onChange={(event) => setHideNames(event.target.checked)} />
              <EyeOff aria-hidden className="size-4 text-slate" />
              Namen ausblenden
            </label>
            <Select label="Sortierung" value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="w-44 [&>label]:sr-only">
              <option value="passung">Beste Passung</option>
              <option value="neueste">Neueste zuerst</option>
              <option value="einkommen">Höchstes Einkommen</option>
            </Select>
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="p-8 text-center text-slate">In dieser Ansicht gibt es noch keine Bewerbungen.</p>
        ) : (
          <>
            {/* Desktop and tablet: table */}
            <div className="hidden md:block">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell className="w-10 pr-0">
                      <Checkbox
                        aria-label="Alle auswählbaren Bewerbungen auswählen"
                        checked={allSelected}
                        indeterminate={someSelected && !allSelected}
                        onChange={toggleAll}
                        disabled={selectableRows.length === 0}
                      />
                    </TableHeaderCell>
                    <TableHeaderCell>Bewerbung</TableHeaderCell>
                    <TableHeaderCell>Passung</TableHeaderCell>
                    <TableHeaderCell>Haushalt</TableHeaderCell>
                    <TableHeaderCell align="right">Nettoeinkommen</TableHeaderCell>
                    <TableHeaderCell className="hidden 2xl:table-cell">Beschäftigung</TableHeaderCell>
                    <TableHeaderCell>Einzug</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell className="w-10">
                      <span className="sr-only">Details</span>
                    </TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((p) => {
                    const items = checks(p);
                    return (
                      <TableRow key={p.id} className={cx("cursor-pointer", selected.has(p.id) && "bg-mist hover:bg-mist")} onClick={() => setDetailId(p.id)}>
                        <TableCell className="pr-0" onClick={(event) => event.stopPropagation()}>
                          <Checkbox
                            aria-label={`${name(p)} auswählen`}
                            checked={selected.has(p.id)}
                            onChange={() => toggle(p.id)}
                            disabled={!selectable(p.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar initials={initials(p)} size="sm" />
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setDetailId(p.id);
                                }}
                                className="font-medium whitespace-nowrap text-night hover:underline"
                              >
                                {name(p)}
                              </button>
                              <p className="flex items-center gap-2 text-small whitespace-nowrap text-slate">
                                {mounted ? appliedLabel(p.minutesAgo) : " "}
                                <MessageCount applicant={p} />
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <MatchMeter items={items} />
                            <span className="flex items-center gap-1.5 text-small whitespace-nowrap text-slate">
                              {formatScore(score(p))} von {items.length}
                              <BoostHint count={items.filter((i) => i.fromMessage).length} />
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {p.persons} {p.persons === 1 ? "Person" : "Personen"}
                          {p.pet && <span className="block text-small text-slate">{p.pet}</span>}
                        </TableCell>
                        <TableCell align="right" className="whitespace-nowrap">
                          {formatEuro(p.netIncome)}
                          <span className="block text-small text-slate">{rentRatio(p)}× Miete</span>
                        </TableCell>
                        <TableCell className="hidden whitespace-nowrap 2xl:table-cell">{employmentLabels[p.employment]}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatDate(p.moveIn)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col items-start gap-1">
                            <StatusBadge status={p.status} />
                            <StatusDetail applicant={p} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <ChevronRight aria-hidden className="size-4 text-slate" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile: cards */}
            <ul className="divide-y divide-line md:hidden">
              {rows.map((p) => {
                const items = checks(p);
                return (
                  <li key={p.id} className={cx("flex gap-3 p-4", selected.has(p.id) && "bg-mist")}>
                    <Checkbox
                      aria-label={`${name(p)} auswählen`}
                      checked={selected.has(p.id)}
                      onChange={() => toggle(p.id)}
                      disabled={!selectable(p.status)}
                      className="mt-2"
                    />
                    <button type="button" onClick={() => setDetailId(p.id)} className="flex min-w-0 flex-1 flex-col gap-2 text-left">
                      <span className="flex w-full items-start justify-between gap-2">
                        <span className="min-w-0">
                          <span className="block font-medium text-night">{name(p)}</span>
                          <span className="flex flex-wrap items-center gap-x-2 text-small text-slate">
                            {mounted ? appliedLabel(p.minutesAgo) : " "}
                            <MessageCount applicant={p} />
                          </span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-1">
                          <StatusBadge status={p.status} />
                          <StatusDetail applicant={p} />
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        <MatchMeter items={items} />
                        <span className="flex items-center gap-1.5 text-small text-slate">
                          {formatScore(score(p))} von {items.length} Kriterien
                          <BoostHint count={items.filter((i) => i.fromMessage).length} />
                        </span>
                      </span>
                      <span className="text-small text-slate">
                        {formatEuro(p.netIncome)} netto, {p.household}, Einzug {formatDate(p.moveIn)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Card>

      <Dialog
        open={detail != null}
        onClose={() => setDetailId(null)}
        variant="side"
        title={detail ? name(detail) : ""}
        description={detail && `${detail.ref}${mounted ? `, beworben ${appliedLabel(detail.minutesAgo)}` : ""}`}
        footer={
          detail && detail.status !== "abgesagt" ? (
            <>
              <Button
                variant="secondary"
                onClick={() => setVideoId(detail.id)}
                icon={<Video aria-hidden className="size-4" />}
                className="sm:mr-auto"
              >
                Videokonferenz vereinbaren
              </Button>
              {selectable(detail.status) && (
                <Button variant="secondary" onClick={() => setConfirm({ kind: "decline", ids: [detail.id] })}>
                  Absagen
                </Button>
              )}
              {detail.status === "neu" && (
                <Button onClick={() => setConfirm({ kind: "invite", ids: [detail.id] })} icon={<Mail aria-hidden className="size-4" />}>
                  Zur Besichtigung einladen
                </Button>
              )}
            </>
          ) : undefined
        }
      >
        {detail && <ApplicantDetail applicant={detail} hideNames={hideNames} videoRequested={videoRequested.has(detail.id)} />}
      </Dialog>

      <Dialog
        open={confirm != null}
        onClose={() => setConfirm(null)}
        title={
          confirm?.kind === "invite"
            ? `${confirmPeople.length === 1 ? "Einladung" : `${confirmPeople.length} Einladungen`} verschicken`
            : `${confirmPeople.length === 1 ? "Absage" : `${confirmPeople.length} Absagen`} verschicken`
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(null)}>
              Abbrechen
            </Button>
            <Button onClick={() => confirm && apply(confirm.kind, confirm.ids)}>
              {confirm?.kind === "invite" ? "Einladungen senden" : "Absagen senden"}
            </Button>
          </>
        }
      >
        {confirm && (
          <div className="flex flex-col gap-4">
            <p>
              An: <span className="font-medium">{confirmPeople.map(name).join(", ")}</span>
            </p>
            {confirm.kind === "invite" ? (
              <>
                <div className="rounded-card border border-line">
                  <div className="border-b border-line px-4 py-3 text-small text-slate">
                    <p>Von: vizmo im Auftrag von {landlord.firstName} {landlord.lastName}</p>
                    <p className="mt-0.5 font-medium text-night">Betreff: Ihre Bewerbung für {listing.title}: Besichtigung buchen</p>
                  </div>
                  <div className="flex flex-col gap-3 px-4 py-3">
                    <p>
                      Guten Tag, Ihre Bewerbung hat überzeugt. Sie können die Wohnung jetzt besichtigen. Über den Link in
                      dieser E-Mail geht es in vier Schritten zu Ihrem Termin:
                    </p>
                    <StepList
                      items={[
                        { label: "Video-Rundgang ansehen", state: "upcoming" },
                        { label: "Besichtigungsslot wählen", description: `${listing.slotsPerWeek} Slots pro Woche verfügbar`, state: "upcoming" },
                        { label: "Identität mit Didit bestätigen", description: "Ausweis und Selfie, etwa 2 Minuten", state: "upcoming" },
                        { label: "25 € Kaution vormerken lassen", description: "Wird nicht abgebucht, nur reserviert", state: "upcoming" },
                      ]}
                    />
                  </div>
                </div>
                <p className="text-small text-slate">Die Einladung ist 72 Stunden gültig. Sie sehen jede Buchung in Ihrem Kalender.</p>
              </>
            ) : (
              <p className="text-slate">
                Die Absage ist neutral formuliert und enthält keine Begründung. So bleiben Sie auch im Sinne des AGG auf
                der sicheren Seite.
              </p>
            )}
          </div>
        )}
      </Dialog>

      <VideoCallDialog
        applicant={people.find((p) => p.id === videoId) ?? null}
        name={videoId ? name(people.find((p) => p.id === videoId)!) : ""}
        onClose={() => setVideoId(null)}
        onSend={(id) => {
          setVideoRequested((current) => new Set(current).add(id));
          setVideoId(null);
          setToast("Terminvorschläge für die Videokonferenz verschickt");
        }}
      />

      <Toast message={toast} onDone={clearToast} />
    </>
  );
}

function BoostHint({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="inline-flex items-center gap-1 font-medium text-deep-blue">
      <Sparkles aria-hidden className="size-3.5" />
      <span className="sr-only">{count === 1 ? "1 Kriterium durch Nachrichten belegt" : `${count} Kriterien durch Nachrichten belegt`}</span>
      <span aria-hidden>Nachricht</span>
    </span>
  );
}

function MessageCount({ applicant }: { applicant: Applicant }) {
  const count = applicant.extraMessages?.length ?? 0;
  if (!count) return null;
  return (
    <span className="inline-flex items-center gap-1 font-medium text-night">
      <MessageSquare aria-hidden className="size-3.5 text-deep-blue" />
      {count}
      <span className="sr-only">{count === 1 ? "gesendete Nachricht" : "gesendete Nachrichten"}</span>
    </span>
  );
}

function StatusDetail({ applicant }: { applicant: Applicant }) {
  if (applicant.status === "gebucht" && applicant.slot)
    return (
      <span className="text-small whitespace-nowrap text-slate">
        <SlotLabel slot={applicant.slot} />
      </span>
    );
  if (applicant.status === "besichtigt" && applicant.feedback)
    return <span className="text-small whitespace-nowrap text-slate">{interestLabels[applicant.feedback.interest].short}</span>;
  return null;
}

function ApplicantDetail({ applicant, hideNames, videoRequested }: { applicant: Applicant; hideNames: boolean; videoRequested: boolean }) {
  const items = checks(applicant);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-2">
        <StatusBadge status={applicant.status} />
        {applicant.statusNote && <p className="text-slate">{applicant.statusNote}</p>}
        {videoRequested && (
          <p className="flex items-center gap-2 font-medium">
            <Video aria-hidden className="size-4 text-deep-blue" />
            Videokonferenz angefragt, wartet auf Terminwahl
          </p>
        )}
      </div>

      <BookedSlot applicant={applicant} />
      <FeedbackSection applicant={applicant} />

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-h3">Passung zu Ihren Kriterien</h3>
          <span className="flex items-center gap-2 text-small text-slate">
            <MatchMeter items={items} />
            {formatScore(score(applicant))} von {items.length}
          </span>
        </div>
        <ul className="divide-y divide-line rounded-card border border-line">
          {items.map((item) => (
            <li key={item.label} className="flex gap-3 px-4 py-3">
              <span className="mt-0.5">
                <CheckIcon result={item.result} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap justify-between gap-x-3">
                  <span className="text-slate">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
                {item.note && (
                  <p className={cx("mt-0.5 flex items-start gap-1.5 text-small", item.fromMessage ? "font-medium text-deep-blue" : "text-slate")}>
                    {item.fromMessage && <Sparkles aria-hidden className="mt-0.5 size-3.5 shrink-0" />}
                    {item.note}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-h3">Nachricht zur Bewerbung</h3>
        <blockquote className="rounded-card bg-surface px-4 py-3 text-night">„{applicant.message}“</blockquote>
      </section>

      <ExtraMessages applicant={applicant} />

      <section className="flex flex-col gap-2">
        <h3 className="text-h3">Angaben</h3>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
          <dt className="text-slate">Tätigkeit</dt>
          <dd className="font-medium">{applicant.occupation}</dd>
          <dt className="text-slate">E-Mail-Adresse</dt>
          <dd className="font-medium">Bestätigt</dd>
          <dt className="text-slate">Identität</dt>
          <dd className="font-medium">
            {applicant.status === "gebucht" || applicant.status === "besichtigt" ? "Mit Didit geprüft" : "Wird vor der Besichtigung geprüft"}
          </dd>
        </dl>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-h3">Persönliche Angaben</h3>
        {hideNames ? (
          <p className="text-slate">Ausgeblendet, solange „Namen ausblenden“ aktiv ist.</p>
        ) : (
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            <dt className="text-slate">Anrede</dt>
            <dd className="font-medium">{applicant.salutation}</dd>
            <dt className="text-slate">Alter</dt>
            <dd className="font-medium">{applicant.age ? `${applicant.age} Jahre, freiwillige Angabe` : "Nicht angegeben"}</dd>
          </dl>
        )}
        <p className="flex items-start gap-2 rounded-card bg-mist px-4 py-3 text-small text-night">
          <Scale aria-hidden className="mt-px size-4 shrink-0 text-deep-blue" />
          Nur zur Information. Anrede und Alter fließen nicht in die Sortierung ein, und eine Auswahl danach ist nach dem
          AGG unzulässig. Das Alter zeigen wir nur, wenn die Person es freiwillig angegeben hat.
        </p>
      </section>
    </div>
  );
}
