import type { Metadata } from "next";
import { ContactForm } from "@/features/site/contact-form";
import { PageIntro, Section } from "@/features/site/section";
import { company } from "@/features/site/site-nav";

export const metadata: Metadata = {
  alternates: { canonical: "/kontakt/" },
  title: "Kontakt",
  description: "Schreiben Sie dem vizmo-Team: für Vermieter, Wohnungssuchende, Presse und Partner.",
};

export default function ContactPage() {
  return (
    <>
      <PageIntro title="Kontakt" lead="Fragen, Feedback oder Interesse am Pilot? Wir freuen uns auf Ihre Nachricht." />
      <Section className="md:py-20">
        {/* Phones: form, then details. Desktop: details left, form right. */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-x-20">
          <div className="lg:col-start-2 lg:row-start-1">
            <ContactForm />
          </div>
          <dl className="flex flex-col divide-y divide-line self-start border-y border-line lg:col-start-1 lg:row-start-1">
            <div className="flex flex-col gap-1 py-4">
              <dt className="text-body text-slate">E-Mail</dt>
              <dd>
                <a href={`mailto:${company.email}`} className="font-medium text-blue hover:text-deep-blue hover:underline">
                  {company.email}
                </a>
              </dd>
            </div>
            <div className="flex flex-col gap-1 py-4">
              <dt className="text-body text-slate">Sie haben sich auf eine Wohnung beworben?</dt>
              <dd>Fragen zu Ihrer Bewerbung oder Besichtigung klären Sie am schnellsten über den Link in Ihrer E-Mail von vizmo.</dd>
            </div>
          </dl>
        </div>
      </Section>
    </>
  );
}
