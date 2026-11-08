import type { Metadata } from "next";
import { ContactForm } from "@/features/site/contact-form";
import { Container } from "@/features/site/section";
import { company } from "@/features/site/site-nav";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Schreiben Sie dem vizmo-Team: für Vermieter, Wohnungssuchende, Presse und Partner.",
};

export default function ContactPage() {
  return (
    <Container className="py-12 md:py-20">
      {/* Phones: intro, form, details. Desktop: intro and details left, form right. */}
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:grid-rows-[auto_1fr] lg:gap-x-20">
        <div className="lg:col-start-1">
          <h1 className="font-display text-hero font-bold">Kontakt</h1>
          <p className="mt-4 text-lead text-slate">Fragen, Feedback oder Interesse am Pilot? Wir freuen uns auf Ihre Nachricht.</p>
        </div>
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ContactForm />
        </div>
        <dl className="flex flex-col divide-y divide-line self-start border-y border-line lg:col-start-1">
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
  </Container>
  );
}
