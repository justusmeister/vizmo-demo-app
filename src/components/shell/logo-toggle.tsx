"use client";

import { toggleDevVisible } from "@/lib/dev-mode";
import { BrandLogo } from "./brand-logo";

// The logo doubles as the hidden presenter switch for development areas.
export function LogoToggle({ width }: { width: number }) {
  return (
    <button
      type="button"
      onClick={toggleDevVisible}
      aria-label="vizmo"
      className="self-start rounded-button p-1 focus-visible:outline-white"
    >
      <BrandLogo width={width} />
    </button>
  );
}
