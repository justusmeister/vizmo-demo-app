// Hidden spam trap for the site forms: invisible and unreachable for people (and screen
// readers), but bots that fill every field tick it. See send-form.ts.
export function Honeypot() {
  return <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />;
}
