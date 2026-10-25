import { Shapes } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Placeholder index. It will link to the 10 demo screens once they exist.
export default function Home() {
  return (
    <>
      <PageHeader title="vizmo Demo" description="Besichtigungen, die sich selbst organisieren." />
      <Card padding="lg" className="flex flex-col items-start gap-4">
        <div>
          <h2 className="text-h3">Noch keine Screens angelegt</h2>
          <p className="mt-1 text-slate">
            Die Bausteine für alle Screens stehen bereit. Neue Screens erscheinen hier und in der Navigation.
          </p>
        </div>
        <ButtonLink href="/primitives" variant="secondary" icon={<Shapes aria-hidden className="size-4" />}>
          Komponenten ansehen
        </ButtonLink>
      </Card>
    </>
  );
}
