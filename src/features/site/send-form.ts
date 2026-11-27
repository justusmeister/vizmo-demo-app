import { openMail } from "./mailto";

// Forms on govizmo.de go straight to kontakt@govizmo.de through Web3Forms, a form backend
// that turns a POST into an e-mail (processor under Art. 28 DSGVO, see Datenschutz §7). The
// access key is public by design: it only lets someone send to our inbox, nothing else. The
// env var can override it; the mail-app fallback in deliver() only runs if no key exists.

export const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "6de3f965-4ed4-4cf5-8034-e6a9928a6e36";

const ENDPOINT = "https://api.web3forms.com/submit";

export type Delivery = "sent" | "mail" | "error";

type Message = {
  subject: string;
  email: string;
  name?: string;
  body: string;
  /** Value of the hidden honeypot field. Bots fill it, people never see it. */
  trap?: boolean;
};

export async function deliver({ subject, email, name, body, trap }: Message): Promise<Delivery> {
  // Pretend success to bots, so they don't retry.
  if (trap) return "sent";
  if (!WEB3FORMS_KEY) return openMail(subject, body) ? "mail" : "error";
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject, from_name: "govizmo.de", email, name, message: body }),
    });
    const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
    return response.ok && result?.success ? "sent" : "error";
  } catch {
    return "error";
  }
}

/** Reads the honeypot checkbox (`<Honeypot />`) of a submitted form. */
export function trapped(form: HTMLFormElement) {
  const field = form.elements.namedItem("botcheck");
  return field instanceof HTMLInputElement && field.checked;
}
