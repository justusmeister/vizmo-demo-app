"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { landlord } from "@/config/account";
import { devNav, mainNav, type NavItem } from "@/config/navigation";
import { cx } from "@/lib/cx";
import { useDevVisible } from "@/lib/dev-mode";

// Design doc 6.8: Nachtblau navigation, Lavendel inactive items (8.6:1 on Nachtblau),
// white active item with a Lavendel indicator.

function isActive(pathname: string, href: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  return href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
}

type NavListProps = {
  items: NavItem[];
  label: string;
  onNavigate?: () => void;
};

function NavList({ items, label, onNavigate }: NavListProps) {
  const pathname = usePathname();

  return (
    <div>
      <p className="px-3 pb-2 text-small font-medium text-lavender">{label}</p>
      <ul className="flex flex-col gap-0.5">
        {items.map(({ href, label: itemLabel, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "relative flex h-10 items-center gap-3 rounded-button px-3 font-medium transition-colors focus-visible:outline-white",
                  active ? "bg-white/10 text-white" : "text-lavender hover:bg-white/5 hover:text-white",
                )}
              >
                {active && (
                  <span aria-hidden className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-lavender" />
                )}
                <Icon aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
                {itemLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Icons are components, so the nav config is read here on the client rather than
// passed in as props from the server shell.
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const devVisible = useDevVisible();
  return (
    <nav aria-label="Hauptnavigation" className="flex flex-1 flex-col gap-6">
      <NavList items={mainNav} label="Vermieter" onNavigate={onNavigate} />
      <div className="mt-auto flex flex-col gap-4">
        {devVisible && <NavList items={devNav} label="Entwicklung" onNavigate={onNavigate} />}
        <div className="flex items-center gap-3 border-t border-white/10 px-3 pt-4">
          <span
            aria-hidden
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-lavender text-small font-medium text-night"
          >
            {landlord.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-white">
              {landlord.firstName} {landlord.lastName}
            </p>
            <p className="truncate text-small text-lavender">Privatvermieter</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
