import type { Metadata } from "next";
import { LegalPage, LegalSection, Ph } from "@/features/site/legal";
import { company } from "@/features/site/site-nav";

export const metadata: Metadata = { title: "Impressum", robots: { index: true, follow: true } };

// Template with placeholders. Have it reviewed before going live.
export default function ImprintPage() {
  return (
    <LegalPage
      title="Impressum"
      updated="Oktober 2026"
      notice={
        <>
          Vorlage: Markierte Angaben in eckigen Klammern vor Veröffentlichung ersetzen und den Text rechtlich prüfen lassen.
          Solange die GmbH in Gründung ist, haften die Gründerinnen und Gründer persönlich. Das Impressum muss dann die
          handelnden Personen nennen.
        </>
      }
    >
      <LegalSection title="Angaben gemäß § 5 DDG">
        <p>
          {company.name}
          <br />
          <Ph>Straße und Hausnummer</Ph>
          <br />
          <Ph>PLZ Ort</Ph>
          <br />
          Deutschland
        </p>
      </LegalSection>

      <LegalSection title="Vertreten durch">
        <p>
          Die Geschäftsführung: <Ph>Vor- und Nachname der Geschäftsführerin oder des Geschäftsführers</Ph>
        </p>
        <p>
          Gründungsgesellschafter: Jan Witte, Johanna Spratte, Justus Meister, Theo Gutendorf <Ph>bitte prüfen</Ph>
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          E-Mail: <a href={`mailto:${company.email}`}>{company.email}</a>
          <br />
          Telefon: <Ph>Telefonnummer</Ph>
        </p>
      </LegalSection>

      <LegalSection title="Registereintrag">
        <p>
          Die Gesellschaft befindet sich in Gründung. Nach Eintragung:
          <br />
          Registergericht: <Ph>Amtsgericht Ort</Ph>
          <br />
          Registernummer: <Ph>HRB 000000</Ph>
        </p>
      </LegalSection>

      <LegalSection title="Umsatzsteuer-ID">
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: <Ph>DE000000000</Ph>
        </p>
      </LegalSection>

      <LegalSection title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p>
          <Ph>Vor- und Nachname</Ph>
          <br />
          <Ph>Anschrift wie oben</Ph>
        </p>
      </LegalSection>

      <LegalSection title="Verbraucherstreitbeilegung">
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
          vizmo ist eine Bezeichnung der {company.name}. Genannte Produkt- und Firmennamen wie Nuki, Huawei, Didit, Stripe und
          DHL sind Marken ihrer jeweiligen Inhaber. Teamfotos: <Ph>Fotograf oder eigene Aufnahmen</Ph>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
