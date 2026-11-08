import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/features/site/legal";
import { company } from "@/features/site/site-nav";

export const metadata: Metadata = {
  alternates: { canonical: "/impressum/" }, title: "Impressum", robots: { index: true, follow: true } };

// Pre-founding phase: no register entry or VAT ID yet. Update after founding.
export default function ImprintPage() {
  return (
    <LegalPage
      title="Impressum"
      updated="November 2026"
    >
      <LegalSection title="Angaben gemäß § 5 DDG">
        <p>
          {company.responsible}
          <br />
          vizmo, Gründungsvorhaben (noch keine eingetragene Gesellschaft)
        </p>
        <p>
          {company.street}
          <br />
          {company.city}
          <br />
          Deutschland
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          E-Mail: <a href={`mailto:${company.email}`}>{company.email}</a>
        </p>
      </LegalSection>

      <LegalSection title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p>
          {company.responsible}
          <br />
          Anschrift wie oben
        </p>
      </LegalSection>

      <LegalSection title={"Verbraucher\u00ADstreit\u00ADbeilegung"}>
        <p>
          Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </LegalSection>

      <LegalSection title="Haftung für Inhalte">
        <p>
          Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Wir
          sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
          zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung
          von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine Haftung ist erst ab dem Zeitpunkt der
          Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen entfernen wir
          diese Inhalte umgehend.
        </p>
      </LegalSection>

      <LegalSection title="Haftung für Links">
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für diese
          fremden Inhalte übernehmen wir keine Gewähr. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
          oder Betreiber verantwortlich. Bei Bekanntwerden von Rechtsverletzungen entfernen wir derartige Links umgehend.
        </p>
      </LegalSection>

      <LegalSection title="Urheberrecht">
        <p>
          Die auf diesen Seiten erstellten Inhalte und Werke unterliegen dem deutschen Urheberrecht. Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen
          Zustimmung des jeweiligen Autors bzw. Erstellers. Soweit Inhalte nicht von uns erstellt wurden, werden die
          Urheberrechte Dritter beachtet.
        </p>
      </LegalSection>

      <LegalSection title="Marken und Bildnachweise">
        <p>
          vizmo ist der Name des Gründungsvorhabens von {company.responsible}. Genannte Produkt- und Firmennamen wie
          Nuki, Huawei, Didit, Stripe und DHL sind Marken ihrer jeweiligen Inhaber.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
