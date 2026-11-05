import type { Metadata } from "next";
import { NotFoundPage } from "@/features/site/not-found-page";
import { SiteFrame } from "@/features/site/site-frame";

export const metadata: Metadata = { title: "Seite nicht gefunden", robots: { index: false } };

export default function NotFound() {
  return (
    <SiteFrame>
      <NotFoundPage />
    </SiteFrame>
  );
}
