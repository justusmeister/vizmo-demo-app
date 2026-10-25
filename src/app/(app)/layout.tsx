import { AppShell } from "@/components/shell/app-shell";

// Screens inside the product shell. Routes that need no shell (for example a public
// applicant page) go outside this group.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return <AppShell>{children}</AppShell>;
}
