import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, Section } from "@/features/site/section";

export const metadata: Metadata = {
  alternates: { canonical: "/faq/" },
  title: "Häufige Fragen",
  description: "Antworten zu Ablauf, Kosten, Smartlock, Datenschutz und fairer Auswahl bei vizmo.",
};

const groups = [
  {
    title: "Für Vermieter",
    items: [
      {
        q: "Was kostet vizmo?",
        a: "39 € Grundgebühr bei der Anmeldung. Kommt über vizmo ein Mietvertrag zustande, berechnen wir 45 % der ersten Kaltmiete. Ohne Vermietung bleibt es bei den 39 €.",
      },
      {
        q: "Muss ich bei den Besichtigungen dabei sein?",
        a: "Nein. Ist die Wohnung leer, besichtigen Interessenten allein in ihrem gebuchten Zeitfenster. Ist sie noch bewohnt, organisiert vizmo begleitete Termine, zu denen Sie oder die Mieter vor Ort sind.",
      },
      {
        q: "Wie kommt das Smartlock an die Tür?",
        a: "Wir schicken Ihnen ein Nuki Smart Lock und einen LTE-Stick per Post. Das Schloss wird innen auf den Schlüssel gesetzt, ohne Bohren, in etwa zehn Minuten. Für Häuser mit Gegensprechanlage gibt es einen Öffner für die Haustür.",
      },
      {
        q: "Wer entscheidet, wer besichtigen darf?",
        a: "Immer Sie. vizmo sortiert die Bewerbungen nach Ihren Kriterien und zeigt, wer am besten passt. Einladen und absagen tun Sie selbst, mit einem Klick.",
      },
      {
        q: "Was passiert bei einem Schaden?",
        a: "Vor jeder Besichtigung wird eine kleine Kaution vorgemerkt. Am Ende fotografieren Interessenten die Räume, vizmo vergleicht mit Ihren Zustandsfotos. Fällt etwas auf, werden Sie informiert, bevor die Kaution freigegeben wird.",
      },
    ],
  },
  {
    title: "Für Interessenten",
    items: [
      { q: "Kostet die Bewerbung etwas?", a: "Nein. Für Interessenten ist vizmo kostenlos. Die Kaution für die Besichtigung wird nur vorgemerkt und danach wieder freigegeben." },
      {
        q: "Warum muss ich meine Identität bestätigen?",
        a: "Weil Sie die Wohnung allein besichtigen. Die Prüfung mit Ausweis und Selfie dauert etwa zwei Minuten und läuft über unseren Partner Didit. Ihre Ausweisdaten bleiben dort, der Vermieter erfährt nur das Ergebnis.",
      },
      { q: "Kann ich meinen Termin verschieben?", a: "Ja, bis kurz vor der Besichtigung über den Link in Ihrer Bestätigungs-E-Mail, solange andere Slots frei sind." },
    ],
  },
  {
    title: "Datenschutz und Fairness",
    items: [
      {
        q: "Wo werden meine Daten gespeichert?",
        a: "Auf Servern in Deutschland. Wir erheben nur, was für die Vermietung nötig ist, und löschen Daten nach Abschluss der Vermietung. Mehr dazu in unserer Datenschutzerklärung.",
      },
      {
        q: "Wie stellt vizmo eine faire Auswahl sicher?",
        a: "Kriterien wie Einkommen, Einzugstermin oder Haustiere sortieren Bewerbungen nur, niemand wird automatisch aussortiert. Merkmale, die das Allgemeine Gleichbehandlungsgesetz schützt, etwa Herkunft, Religion, Geschlecht, Alter oder Behinderung, fragen wir nicht ab. Eigene Kriterien von Vermietern prüft eine KI und lässt unzulässige nicht zu.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageIntro title="Häufige Fragen" lead="Die wichtigsten Antworten rund um vizmo. Ihre Frage ist nicht dabei? Schreiben Sie uns." />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[16rem_1fr]">
          <nav aria-label="Themen" className="hidden lg:block">
            <ul className="sticky top-24 flex flex-col gap-2">
              {groups.map((group) => (
                <li key={group.title}>
                  <a href={`#${group.title.replace(/\s+/g, "-").toLowerCase()}`} className="font-medium text-slate hover:text-night">
                    {group.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-12">
            {groups.map((group) => (
              <section key={group.title} id={group.title.replace(/\s+/g, "-").toLowerCase()} className="scroll-mt-24">
                <h2 className="mb-4 font-display text-section font-bold">{group.title}</h2>
                <ul className="divide-y divide-line border-y border-line">
                  {group.items.map((item) => (
                    <li key={item.q}>
                      <details className="group">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-h2 font-display font-bold">
                          {item.q}
                          <ChevronDown aria-hidden className="size-5 shrink-0 text-slate transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="max-w-3xl pb-5 text-slate">{item.a}</p>
                      </details>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <p className="text-slate">
              Noch Fragen?{" "}
              <Link href="/kontakt" className="font-medium text-blue underline hover:text-deep-blue">
                Schreiben Sie uns
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
