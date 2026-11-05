import type { ReactNode } from "react";
import { Container } from "./section";

// Shared layout for legal texts. Placeholders are highlighted in green so they're easy to
// find and replace before going live; use Ph for every open detail across the site.

export function Ph({ children }: { children: ReactNode }) {
  return <mark className="rounded-input bg-todo px-1 py-0.5 font-medium text-night ring-1 ring-success">[{children}]</mark>;
}

export function LegalPage({ title, updated, notice, children }: { title: string; updated: string; notice?: ReactNode; children: ReactNode }) {
  return (
    <Container className="py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-hero font-bold">{title}</h1>
        <p className="mt-3 text-slate">Stand: {updated}</p>
        {notice && <div className="mt-6 rounded-card border border-line bg-surface p-4 text-body text-night">{notice}</div>}
        <div className="mt-10 flex flex-col gap-10">{children}</div>
      </div>
    </Container>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-h1 font-bold">{title}</h2>
      <div className="flex flex-col gap-3 text-night [&_a]:font-medium [&_a]:text-blue [&_a]:underline [&_li]:ml-5 [&_li]:list-disc">{children}</div>
    </section>
  );
}
