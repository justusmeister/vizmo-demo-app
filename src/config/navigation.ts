import { House, HousePlus, Shapes, UsersRound, type LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

// Add one entry per demo screen as screens are built. Landlord routes live under /p/,
// applicant routes under /u/, mirroring app.govizmo.de.
export const mainNav: NavItem[] = [
  { href: "/", label: "Meine Inserate", icon: House },
  { href: "/p/inserate/neu", label: "Neues Inserat", icon: HousePlus },
  { href: "/p/inserate/gneisenaustrasse-41/bewerbungen", label: "Bewerbungen", icon: UsersRound },
];

export const devNav: NavItem[] = [{ href: "/primitives", label: "Komponenten", icon: Shapes }];
