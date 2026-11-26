import { Clock } from "lucide-react";
import { cx } from "@/lib/cx";

// Pricing building blocks shared by the homepage and /preise. Figures come from the pitch
// deck (Finale V2, Oktober 2026): 39 € at sign-up, 45 % of the first cold rent on success.

const comparison = [
  { label: "Direkte Kosten", makler: "2 Kaltmieten zzgl. MwSt.", selbst: "50–150 €", vizmo: "39 € + 45 % der ersten Kaltmiete" },
  { label: "Leerstand", makler: "1–2 Kaltmieten", selbst: "1–2 Kaltmieten", vizmo: "ca. 1 Kaltmiete" },
  { label: "Ihr Zeitaufwand", makler: "1–2 Stunden", selbst: "15–30 Stunden", vizmo: "Minimal, läuft automatisch" },
  { label: "Tempo", makler: "Langsam bis mittel", selbst: "Langsam", vizmo: "Schnell, Slots rund um die Uhr" },
];

/** Price card: base fee, success fee and a worked example. */
export function PricingCard() {
  return (
    <div className="overflow-hidden rounded-modal border border-line">
      <div className="grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="flex flex-col gap-2 p-6">
          <p className="text-body font-medium text-slate">Bei der Anmeldung</p>
          <p className="font-display text-hero font-bold tabular-nums">39 €</p>
          <p className="text-slate">Software freischalten, Smartlock und Zubehör werden geliefert.</p>
        </div>
        <div className="flex flex-col gap-2 bg-mist p-6">
          <p className="text-body font-medium text-slate">Nur wenn vermietet wird</p>
          <p className="font-display text-hero font-bold tabular-nums">45 %</p>
          <p className="text-slate">der ersten Kaltmiete als Erfolgsgebühr.</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-line bg-surface p-6">
        <p className="flex items-center gap-2 font-medium">
          <Clock aria-hidden className="size-4 text-deep-blue" />
          Beispiel bei 865 € Kaltmiete
        </p>
        <p className="text-slate tabular-nums">
          39 € + 389 € = <span className="font-medium text-night">428 €</span>. Ein Makler kostet bis zu zwei Kaltmieten, also bis zu
          1.730 € zzgl. MwSt.
        </p>
      </div>
    </div>
  );
}

/**
 * Makler vs. selbst vs. vizmo, without boxes: hairline rows on a Nachtblau top rule, and the
 * vizmo column as a square-cut Nachtblau band that rises above the header row. Stacked rows on
 * phones, a table from 768 px.
 */
export function ComparisonTable() {
  return (
    <>
      {/* Phones: one block per criterion, so nothing scrolls sideways. */}
      <ul className="mt-10 flex flex-col gap-8 md:hidden">
        {comparison.map((row) => (
          <li key={row.label} className="border-t-2 border-night pt-4">
            <p className="font-medium">{row.label}</p>
            <dl className="mt-3 flex flex-col">
              <div className="flex justify-between gap-4 border-b border-line py-2.5">
                <dt className="text-slate">Makler</dt>
                <dd className="text-right">{row.makler}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-line py-2.5">
                <dt className="text-slate">Selbst vermieten</dt>
                <dd className="text-right">{row.selbst}</dd>
              </div>
              <div className="mt-2 flex justify-between gap-4 bg-night px-3 py-3 text-white">
                <dt className="font-display font-bold">vizmo</dt>
                <dd className="text-right font-medium">{row.vizmo}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <table className="mt-14 hidden w-full border-collapse text-left md:table">
        <thead>
          <tr>
            <th scope="col" className="w-[22%] border-b-2 border-night px-4 pb-4 align-bottom">
              <span className="sr-only">Merkmal</span>
            </th>
            <th scope="col" className="border-b-2 border-night px-4 pb-4 align-bottom font-medium">
              Makler
            </th>
            <th scope="col" className="border-b-2 border-night px-4 pb-4 align-bottom font-medium">
              Selbst vermieten
            </th>
            <th scope="col" className="w-[30%] border-b-2 border-night bg-night px-5 pt-7 pb-4 align-bottom font-display text-h2 font-bold text-white">
              vizmo
            </th>
          </tr>
        </thead>
        <tbody>
          {comparison.map((row, index) => {
            const last = index === comparison.length - 1;
            return (
              <tr key={row.label}>
                <th scope="row" className={cx("px-4 py-4 align-top font-medium text-slate", !last && "border-b border-line")}>
                  {row.label}
                </th>
                <td className={cx("px-4 py-4 align-top", !last && "border-b border-line")}>{row.makler}</td>
                <td className={cx("px-4 py-4 align-top", !last && "border-b border-line")}>{row.selbst}</td>
                <td className={cx("bg-night px-5 py-4 align-top font-medium text-white", !last ? "border-b border-white/15" : "pb-7")}>{row.vizmo}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-4 text-body text-slate">Quellen: eigene Darstellung; ImmoScout24 WohnBarometer 2026, IW Köln Vermieterreport 2026, § 3 WoVermittG</p>
    </>
  );
}
