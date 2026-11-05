import type { Metadata } from "next";
import { LegalPage, LegalSection, Ph } from "@/features/site/legal";
import { company } from "@/features/site/site-nav";

export const metadata: Metadata = { title: "Datenschutz" };

// Privacy policy for the website govizmo.de (not the vizmo platform). Template with
// placeholders; have it reviewed before going live.
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Datenschutzerklärung"
      updated="Oktober 2026"
      notice={
        <>
          Vorlage für die Website govizmo.de. Markierte Angaben ersetzen und vor Veröffentlichung rechtlich prüfen lassen. Für
          die vizmo-Plattform (Bewerbung, Identitätsprüfung, Besichtigung) braucht es eine eigene, ausführlichere
          Datenschutzerklärung.
        </>
      }
    >
      <LegalSection title="1. Verantwortlicher">
        <p>
          vizmo, ein Gründungsvorhaben von {company.founders} (noch keine eingetragene Gesellschaft)
          <br />
          <Ph>Straße und Hausnummer</Ph>, <Ph>PLZ Ort</Ph>
          <br />
          E-Mail: <a href={`mailto:${company.email}`}>{company.email}</a>
        </p>
        <p>
          Datenschutzbeauftragte Person: <Ph>Name und Kontakt, falls bestellt, sonst Abschnitt streichen</Ph>
        </p>
      </LegalSection>

      <LegalSection title="2. Überblick">
        <p>
          Wir verarbeiten personenbezogene Daten nur, soweit es für den Betrieb dieser Website und die Beantwortung Ihrer
          Anfragen nötig ist. Rechtsgrundlagen sind die Datenschutz-Grundverordnung (DSGVO), das Bundesdatenschutzgesetz (BDSG)
          und das Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG).
        </p>
      </LegalSection>

      <LegalSection title="3. Hosting">
        <p>
          Diese Website wird bei <Ph>Hosting-Anbieter, Anschrift</Ph> gehostet. Beim Aufruf verarbeitet der Anbieter in unserem
          Auftrag technisch notwendige Daten (siehe Abschnitt 4). Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung
          nach Art. 28 DSGVO. Die Server stehen in <Ph>Land, z. B. Deutschland</Ph>.
        </p>
        <p>Rechtsgrundlage ist unser berechtigtes Interesse an einer sicheren und zuverlässigen Bereitstellung (Art. 6 Abs. 1 lit. f DSGVO).</p>
      </LegalSection>

      <LegalSection title="4. Server-Logfiles">
        <p>Bei jedem Aufruf werden automatisch folgende Daten erfasst:</p>
        <ul>
          <li>IP-Adresse, gekürzt oder vollständig je nach Anbieter</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>aufgerufene Seite und übertragene Datenmenge</li>
          <li>Browser, Betriebssystem und zuvor besuchte Seite (Referrer)</li>
        </ul>
        <p>
          Die Daten dienen der Sicherheit und Fehleranalyse und werden nach <Ph>Anzahl</Ph> Tagen gelöscht. Rechtsgrundlage ist
          Art. 6 Abs. 1 lit. f DSGVO.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies und lokale Speicherung">
        <p>
          Wir setzen keine Cookies zu Werbe- oder Trackingzwecken. Ihre Auswahl im Cookie-Hinweis speichern wir im lokalen
          Speicher Ihres Browsers (localStorage), damit der Hinweis nicht bei jedem Besuch erscheint. Das ist technisch
          notwendig und nach § 25 Abs. 2 Nr. 2 TDDDG ohne Einwilligung zulässig.
        </p>
        <p>
          Optionale Statistik setzen wir derzeit nicht ein. Sollte sich das ändern, geschieht das nur mit Ihrer Einwilligung
          (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO). Sie können Ihre Auswahl jederzeit über „Cookie-Einstellungen“ im
          Fuß der Seite ändern oder widerrufen.
        </p>
      </LegalSection>

      <LegalSection title="6. Schriftarten">
        <p>
          Die Schriften Poppins und Inter sind lokal in diese Website eingebunden. Beim Aufruf wird keine Verbindung zu Servern
          von Google oder anderen Drittanbietern hergestellt.
        </p>
      </LegalSection>

      <LegalSection title="7. Kontakt und Pilot-Anmeldung per E-Mail">
        <p>
          Wenn Sie uns eine E-Mail schreiben, auch über das Kontaktformular oder die Anmeldung zum Pilotprojekt, die jeweils
          eine Nachricht in Ihrem E-Mail-Programm vorbereiten, verarbeiten wir Ihre Angaben, um Ihre Anfrage zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
          DSGVO, wenn es um einen Vertrag geht, sonst Art. 6 Abs. 1 lit. f DSGVO. Wir löschen die Daten, wenn die Anfrage
          erledigt ist und keine gesetzlichen Aufbewahrungspflichten bestehen.
        </p>
        <p>
          E-Mails werden über <Ph>E-Mail-Anbieter</Ph> verarbeitet.
        </p>
      </LegalSection>

      <LegalSection title="8. Empfänger und Drittländer">
        <p>
          Wir geben Daten nur an Auftragsverarbeiter weiter, die wir sorgfältig ausgewählt und vertraglich verpflichtet haben.
          Eine Übermittlung in Länder außerhalb der EU oder des EWR findet <Ph>nicht statt / nur auf Grundlage von
          Standardvertragsklauseln oder eines Angemessenheitsbeschlusses</Ph>.
        </p>
      </LegalSection>

      <LegalSection title="9. Ihre Rechte">
        <p>Sie haben jederzeit das Recht auf</p>
        <ul>
          <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO)</li>
          <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
        </ul>
        <p>
          Schreiben Sie uns dazu an <a href={`mailto:${company.email}`}>{company.email}</a>. Außerdem können Sie sich bei einer
          Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei <Ph>zuständige Landesbehörde am Wohn- oder Geschäftssitz</Ph>.
        </p>
      </LegalSection>

      <LegalSection title="10. Änderungen">
        <p>Wir passen diese Datenschutzerklärung an, wenn sich die Website oder die Rechtslage ändert. Es gilt die jeweils hier veröffentlichte Fassung.</p>
      </LegalSection>
    </LegalPage>
  );
}
