import { House, Shapes, type LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

// Add one entry per demo screen as screens are built.
export const mainNav: NavItem[] = [{ href: "/", label: "Übersicht", icon: House }];

export const devNav: NavItem[] = [{ href: "/primitives", label: "Komponenten", icon: Shapes }];
