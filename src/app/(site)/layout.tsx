import { SiteFrame } from "@/features/site/site-frame";

// Public website (govizmo.de): marketing pages, legal pages, cookie banner.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteFrame>{children}</SiteFrame>;
}
