import { Clock } from "lucide-react";

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

/** Makler vs. selbst vs. vizmo. Cards on phones, a table from 768 px. */
export function ComparisonTable() {
  return (
    <>
      {/* Phones: one card per criterion, so nothing scrolls sideways. */}
      <ul className="mt-10 flex flex-col gap-3 md:hidden">
        {comparison.map((row) => (
          <li key={row.label} className="rounded-card border border-line bg-white">
            <p className="px-4 pt-4 pb-2 font-medium text-slate">{row.label}</p>
            <dl className="divide-y divide-line">
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-slate">Makler</dt>
                <dd className="text-right">{row.makler}</dd>
              </div>
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-slate">Selbst vermieten</dt>
                <dd className="text-right">{row.selbst}</dd>
              </div>
              <div className="flex justify-between gap-4 rounded-b-card bg-mist px-4 py-3">
                <dt className="font-display font-bold">vizmo</dt>
                <dd className="text-right font-medium">{row.vizmo}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <div className="mt-10 hidden overflow-hidden rounded-card border border-line bg-white md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="p-4 text-body font-medium text-slate">
                <span className="sr-only">Merkmal</span>
              </th>
              <th scope="col" className="p-4 font-medium">Makler</th>
              <th scope="col" className="p-4 font-medium">Selbst vermieten</th>
              <th scope="col" className="bg-mist p-4 font-display font-bold">vizmo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {comparison.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="p-4 font-medium text-slate">{row.label}</th>
                <td className="p-4">{row.makler}</td>
                <td className="p-4">{row.selbst}</td>
                <td className="bg-mist p-4 font-medium">{row.vizmo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-body text-slate">Quellen: eigene Darstellung; ImmoScout24 WohnBarometer 2026, IW Köln Vermieterreport 2026, § 3 WoVermittG</p>
    </>
  );
}
