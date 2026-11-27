import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/features/site/legal";
import { WEB3FORMS_KEY } from "@/features/site/send-form";
import { company } from "@/features/site/site-nav";

export const metadata: Metadata = {
  alternates: { canonical: "/datenschutz/" }, title: "Datenschutz" };

// Privacy policy for the website govizmo.de (not the vizmo platform, which needs its own,
// more detailed one). Hosting: Vercel; DNS: Cloudflare (DNS only, no proxy); e-mail: IONOS;
// forms: Web3Forms (facts from its DPA v1.0 and privacy policy, 13 Jul 2026) once a key is set.
export default function PrivacyPage() {
  return (
    <LegalPage
      title={"Datenschutz\u00ADerklärung"}
      updated="November 2026"
    >
      <LegalSection title="1. Verantwortlicher">
        <p>
          {company.responsible}, vizmo (Gründungsvorhaben, noch keine eingetragene Gesellschaft)
          <br />
          {company.street}, {company.city}
          <br />
          E-Mail: <a href={`mailto:${company.email}`}>{company.email}</a>
        </p>
        <p>
          Einen Datenschutzbeauftragten haben wir nicht bestellt, weil dafür keine gesetzliche Pflicht besteht. Ansprechpartner
          für alle Fragen zum Datenschutz ist {company.responsible}, erreichbar unter{" "}
          <a href={`mailto:${company.email}`}>{company.email}</a>.
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
          Diese Website wird bei Vercel Inc., 440 N Barranca Ave, Suite 4133, Covina, CA 91723, USA, gehostet. Vercel liefert die
          Seiten über ein weltweites Servernetz aus; dabei können Daten auch in den USA verarbeitet werden. Beim Aufruf
          verarbeitet Vercel in unserem Auftrag technisch notwendige Daten (siehe Abschnitt 4). Grundlage ist das Data
          Processing Addendum von Vercel, ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO.
        </p>
        <p>Rechtsgrundlage ist unser berechtigtes Interesse an einer sicheren und zuverlässigen Bereitstellung (Art. 6 Abs. 1 lit. f DSGVO).</p>
        <p>
          Die Domain govizmo.de ist bei der IONOS SE registriert. Die Namensauflösung (DNS) übernimmt Cloudflare, Inc. Dabei
          wird nur der Domainname in die Adresse des Servers übersetzt; der Datenverkehr der Website läuft nicht über
          Cloudflare.
        </p>
      </LegalSection>

      <LegalSection title="4. Server-Logfiles">
        <p>Bei jedem Aufruf werden automatisch folgende Daten erfasst:</p>
        <ul>
          <li>IP-Adresse</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>aufgerufene Seite und übertragene Datenmenge</li>
          <li>Browser, Betriebssystem und zuvor besuchte Seite (Referrer)</li>
        </ul>
        <p>
          Die Daten dienen der Sicherheit und Fehleranalyse. Wir werten sie nicht aus und führen sie nicht mit anderen Daten
          zusammen. Vercel speichert sie nur so lange, wie es für diese Zwecke nötig ist, und löscht sie danach automatisch.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies und lokale Speicherung">
        <p>
          Wir setzen keine Cookies zu Werbe- oder Trackingzwecken. Ihre Auswahl im Cookie-Hinweis speichern wir im lokalen
          Speicher Ihres Browsers (localStorage), damit der Hinweis nicht bei jedem Besuch erscheint. Das ist technisch
          notwendig und nach § 25 Abs. 2 Nr. 2 TDDDG ohne Einwilligung zulässig.
        </p>
        <p>
          Nur wenn Sie im Cookie-Hinweis der Statistik zustimmen, nutzen wir Vercel Web Analytics von Vercel Inc. (Anschrift
          siehe Abschnitt 3). Es zählt Seitenaufrufe, damit wir sehen, wie viele Menschen die Website wann besuchen. Erfasst
          werden die aufgerufene Seite, die verweisende Seite, Browser, Betriebssystem, Gerätetyp und das Land. Es werden keine
          Cookies gesetzt. Besucher werden über einen Hashwert aus der Anfrage unterschieden, der nach 24 Stunden verworfen
          wird; Ihre IP-Adresse wird dafür nicht gespeichert. Rechtsgrundlage ist Ihre Einwilligung (§ 25 Abs. 1 TDDDG, Art. 6
          Abs. 1 lit. a DSGVO). Sie können sie jederzeit über das Cookie-Symbol unten links oder „Cookie-Einstellungen“ im Fuß der
          Seite widerrufen; danach lädt die Statistik nicht mehr.
        </p>
      </LegalSection>

      <LegalSection title="6. Schriftarten">
        <p>
          Die Schriften Poppins und Inter sind lokal in diese Website eingebunden. Beim Aufruf wird keine Verbindung zu Servern
          von Google oder anderen Drittanbietern hergestellt.
        </p>
      </LegalSection>

      <LegalSection title="7. Kontakt und Pilot-Anmeldung">
        <p>
          Wenn Sie uns eine E-Mail schreiben, das Kontaktformular nutzen oder sich für das Pilotprojekt vormerken, verarbeiten
          wir Ihre Angaben, um Ihre Anfrage zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
          DSGVO, wenn es um einen Vertrag geht, sonst Art. 6 Abs. 1 lit. f DSGVO. Wir löschen die Daten, wenn die Anfrage
          erledigt ist und keine gesetzlichen Aufbewahrungspflichten bestehen.
        </p>
        <p>
          E-Mails an {company.email} werden über die IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, verarbeitet, mit der ein
          Vertrag zur Auftragsverarbeitung besteht. Die Server stehen in der EU.
        </p>
        {WEB3FORMS_KEY ? (
          <>
            <p>
              Das Kontaktformular und die Pilot-Anmeldung übermitteln Ihre Angaben (je nach Formular E-Mail-Adresse, Name,
              Nachricht und Ihre Antworten) über den Dienst Web3Forms an uns. Anbieter ist Web3Creative mit Sitz in Indien
              (support@web3forms.com). Web3Forms leitet die Angaben als E-Mail an {company.email} weiter und verarbeitet dabei
              auch technische Daten wie Ihre IP-Adresse, Zeitpunkt und aufrufende Seite. Mit Web3Creative besteht ein Vertrag
              zur Auftragsverarbeitung nach Art. 28 DSGVO.
            </p>
            <p>
              Web3Forms setzt dafür Unterauftragsverarbeiter ein, insbesondere Amazon Web Services (Hosting, Speicherung,
              E-Mail-Versand), Cloudflare (Netzwerk und Sicherheit) und Hetzner Online (Server in der EU). Zum Schutz vor Spam
              werden Ihre IP-Adresse und E-Mail-Adresse an die Spamfilter CleanTalk und Akismet (Automattic) übermittelt, die
              auch in den USA verarbeiten. Web3Forms speichert eingereichte Formulardaten höchstens drei Jahre und löscht sie
              dann automatisch; wir löschen Anfragen bei uns, sobald sie erledigt sind.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage auf einen Vertrag zielt (etwa die Teilnahme am
              Pilotprojekt), sonst unser berechtigtes Interesse an der Beantwortung von Anfragen (Art. 6 Abs. 1 lit. f DSGVO).
              Wenn Sie den Weg über Web3Forms nicht möchten, schreiben Sie uns einfach direkt an{" "}
              <a href={`mailto:${company.email}`}>{company.email}</a>.
            </p>
          </>
        ) : (
          <p>
            Das Kontaktformular und die Pilot-Anmeldung bereiten eine Nachricht in Ihrem E-Mail-Programm vor. Daten werden
            erst übermittelt, wenn Sie diese E-Mail selbst absenden.
          </p>
        )}
      </LegalSection>

      <LegalSection title="8. Empfänger und Drittländer">
        <p>
          Wir geben Daten nur an Auftragsverarbeiter weiter, die wir sorgfältig ausgewählt und vertraglich verpflichtet haben.
          Beim Hosting durch Vercel und bei der Namensauflösung durch Cloudflare können Daten in die USA übermittelt werden.
          Beide Unternehmen sind nach dem EU-US Data Privacy Framework zertifiziert, für das die EU-Kommission einen
          Angemessenheitsbeschluss erlassen hat (Art. 45 DSGVO). Zusätzlich sind die Standardvertragsklauseln der
          EU-Kommission vereinbart (Art. 46 Abs. 2 lit. c DSGVO).
        </p>
        {WEB3FORMS_KEY && (
          <p>
            Bei der Nutzung der Formulare werden Daten an Web3Creative in Indien sowie an dessen Unterauftragsverarbeiter
            übermittelt (siehe Abschnitt 7). Für Indien gibt es keinen Angemessenheitsbeschluss der EU-Kommission. Die
            Übermittlung stützt sich auf die Standardvertragsklauseln der EU-Kommission, die Bestandteil des Vertrags zur
            Auftragsverarbeitung sind (Art. 46 Abs. 2 lit. c DSGVO). Eine Kopie können Sie bei uns anfordern.
          </p>
        )}
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
          Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei der für uns zuständigen Behörde: Die Landesbeauftragte für den Datenschutz Niedersachsen, Prinzenstraße 5,
          30159 Hannover.
        </p>
      </LegalSection>

      <LegalSection title="10. Änderungen">
        <p>Wir passen diese Datenschutzerklärung an, wenn sich die Website oder die Rechtslage ändert. Es gilt die jeweils hier veröffentlichte Fassung.</p>
      </LegalSection>
    </LegalPage>
  );
}
