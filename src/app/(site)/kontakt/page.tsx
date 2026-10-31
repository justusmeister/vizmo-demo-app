import { Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/features/site/contact-form";
import { PageIntro, Section } from "@/features/site/section";
import { company } from "@/features/site/site-nav";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Schreiben Sie dem vizmo-Team: für Vermieter, Wohnungssuchende, Presse und Partner.",
};

export default function ContactPage() {
  return (
    <>
      <PageIntro title="Kontakt" lead="Fragen, Feedback oder Interesse am Pilot? Wir freuen uns auf Ihre Nachricht." />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <ContactForm />
          <aside className="flex flex-col gap-4">
            <Card padding="lg" className="flex flex-col gap-4">
              <h2 className="text-h2">Direkt erreichen</h2>
              <a href={`mailto:${company.email}`} className="flex items-center gap-3 font-medium text-blue hover:text-deep-blue">
                <Mail aria-hidden className="size-5 shrink-0" />
                {company.email}
              </a>
              <p className="flex items-start gap-3 text-slate">
                <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-deep-blue" />
                <span>
                  {company.name}
                  <br />
                  [Straße und Hausnummer]
                  <br />
                  [PLZ Ort]
                </span>
              </p>
            </Card>
            <Card tone="mist">
              <p className="font-medium">Für Interessenten</p>
              <p className="mt-1">
                Fragen zu einer konkreten Bewerbung oder Besichtigung beantworten wir am schnellsten über den Link in Ihrer E-Mail
                von vizmo.
              </p>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
