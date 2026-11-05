import { CalendarCheck, LockKeyhole, ScanFace } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cx } from "@/lib/cx";

// Hero illustration built from real product UI: sorted applications, a booked slot and a
// verified identity. Decorative, so hidden from assistive tech (the copy says the same).

const rows = [
  { initials: "MS", name: "Marie S.", score: 6, status: "Neu" },
  { initials: "LH", name: "Lena H.", score: 6, status: "Slot gebucht" },
  { initials: "AK", name: "Anna K.", score: 5, status: "Besichtigt" },
];

function Meter({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} className={cx("h-1.5 w-2 rounded-full min-[360px]:w-3", i < value ? "bg-night" : "bg-line")} />
      ))}
    </span>
  );
}

export function HeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="rounded-modal bg-white p-5 text-night shadow-overlay">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-h3 font-bold">Bewerbungen</p>
          <p className="text-small text-slate">Gneisenaustraße 41</p>
        </div>
        <p className="mt-0.5 text-small text-slate">14 Bewerbungen, sortiert nach Ihren Kriterien</p>
        <ul className="mt-4 divide-y divide-line">
          {rows.map((row) => (
            <li key={row.name} className="flex items-center gap-3 py-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mist text-small font-medium">{row.initials}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{row.name}</span>
                <span className="mt-1 flex items-center gap-2 text-small text-slate">
                  <Meter value={row.score} />
                  {/* Hidden on the narrowest phones so the row never overflows. */}
                  <span className="hidden min-[360px]:inline">{row.score} von 6</span>
                </span>
              </span>
              <Badge tone={row.status === "Slot gebucht" ? "success" : "neutral"}>{row.status}</Badge>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute -bottom-8 -left-3 flex items-center gap-3 rounded-card bg-white p-3 pr-4 text-night shadow-overlay sm:-left-8">
        <span className="flex size-10 items-center justify-center rounded-button bg-mist text-deep-blue">
          <CalendarCheck className="size-5" />
        </span>
        <span>
          <span className="block text-small text-slate">Besichtigung gebucht</span>
          <span className="block font-medium tabular-nums">Di, 17:40–18:00</span>
        </span>
      </div>

      <div className="absolute -top-6 -right-2 flex items-center gap-2 rounded-card bg-white px-3 py-2 text-night shadow-overlay sm:-right-6">
        <span className="flex size-7 items-center justify-center rounded-full bg-success text-white">
          <ScanFace className="size-4" />
        </span>
        <span className="text-small font-medium">Identität bestätigt</span>
      </div>

      <div className="absolute right-6 -bottom-10 hidden items-center gap-2 rounded-card bg-night px-3 py-2 text-white ring-1 ring-white/15 shadow-overlay sm:flex">
        <LockKeyhole className="size-4 text-lavender" />
        <span className="text-small font-medium">Tür öffnet 17:40</span>
      </div>
    </div>
  );
}
