import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/features/site/legal";
import { company } from "@/features/site/site-nav";

export const metadata: Metadata = {
  alternates: { canonical: "/datenschutz/" }, title: "Datenschutz" };

// Privacy policy for the website govizmo.de (not the vizmo platform, which needs its own,
// more detailed one). Hosting: Vercel; DNS: Cloudflare (DNS only, no proxy); e-mail: IONOS.
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
          E-Mails an {company.email} werden über die IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, verarbeitet, mit der ein
          Vertrag zur Auftragsverarbeitung besteht. Die Server stehen in der EU.
        </p>
      </LegalSection>

      <LegalSection title="8. Empfänger und Drittländer">
        <p>
          Wir geben Daten nur an Auftragsverarbeiter weiter, die wir sorgfältig ausgewählt und vertraglich verpflichtet haben.
          Beim Hosting durch Vercel und bei der Namensauflösung durch Cloudflare können Daten in die USA übermittelt werden.
          Beide Unternehmen sind nach dem EU-US Data Privacy Framework zertifiziert, für das die EU-Kommission einen
          Angemessenheitsbeschluss erlassen hat (Art. 45 DSGVO). Zusätzlich sind die Standardvertragsklauseln der
          EU-Kommission vereinbart (Art. 46 Abs. 2 lit. c DSGVO).
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
