import { company } from "./site-nav";

// The site has no backend: forms compose an e-mail to kontakt@govizmo.de in the visitor's
// mail app. Nothing leaves the browser until they press send there. Inputs are cleaned and
// length-capped, and every part of the URL is percent-encoded, so a field can't inject
// extra headers (cc, bcc), change the recipient or break out of the mailto: scheme.

export const limits = { name: 100, email: 254, message: 4000 } as const;

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

/** Trims, strips control characters (line breaks only where allowed) and caps the length. */
export function clean(value: string, max: number, multiline = false) {
  const pattern = multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return value.replace(/\r\n?/g, "\n").replace(pattern, "").trim().slice(0, max);
}

export function isEmail(value: string) {
  return value.length <= limits.email && EMAIL.test(value);
}

/** Opens the visitor's mail app with a prepared message. Returns false if the result would be too long. */
export function openMail(subject: string, body: string) {
  const url = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  // Some mail clients truncate or refuse very long mailto URLs.
  if (url.length > 8000) return false;
  window.location.href = url;
  return true;
}
