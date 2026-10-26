// Builds a downloadable calendar file (.ics) for the booked viewing. Times are local
// Berlin time (floating), which all common calendar apps import correctly.

const stamp = (iso: string, time: string) => `${iso.replace(/-/g, "")}T${time.replace(":", "")}00`;

const escape = (text: string) => text.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");

export function downloadIcs({ iso, start, end, title, location, description }: { iso: string; start: string; end: string; title: string; location: string; description: string }) {
  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//vizmo//Besichtigung//DE",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${iso}-${start.replace(":", "")}@govizmo.de`,
    `DTSTAMP:${now}`,
    `DTSTART:${stamp(iso, start)}`,
    `DTEND:${stamp(iso, end)}`,
    `SUMMARY:${escape(title)}`,
    `LOCATION:${escape(location)}`,
    `DESCRIPTION:${escape(description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Besichtigung in einer Stunde",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const link = Object.assign(window.document.createElement("a"), { href: url, download: "vizmo-besichtigung.ics" });
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
