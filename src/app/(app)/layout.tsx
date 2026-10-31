import type { Metadata } from "next";
import { AppShell } from "@/components/shell/app-shell";

// Demo with mock data: keep it out of search engines.
export const metadata: Metadata = { robots: { index: false, follow: false } };

// Screens inside the product shell. Routes that need no shell (for example a public
// applicant page) go outside this group.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return <AppShell>{children}</AppShell>;
}
