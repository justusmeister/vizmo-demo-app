"use client";

import { Check, Minus } from "lucide-react";
import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

// Native checkbox, visually replaced. Checked uses Vizmo Blau (it's a user action).

type CheckboxProps = Omit<ComponentProps<"input">, "type"> & { indeterminate?: boolean };

export function Checkbox({ className, indeterminate = false, checked, ...props }: CheckboxProps) {
  return (
    <span className={cx("relative inline-flex size-5 shrink-0", className)}>
      <input
        type="checkbox"
        checked={checked}
        ref={(node) => {
          if (node) node.indeterminate = indeterminate;
        }}
        className="peer size-5 cursor-pointer appearance-none rounded-input border border-gray bg-white transition-colors checked:border-blue checked:bg-blue indeterminate:border-blue indeterminate:bg-blue hover:border-night checked:hover:border-deep-blue checked:hover:bg-deep-blue disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
      <Check
        aria-hidden
        strokeWidth={3}
        className="pointer-events-none absolute inset-0.5 hidden size-4 text-white peer-checked:block peer-indeterminate:hidden"
      />
      <Minus
        aria-hidden
        strokeWidth={3}
        className="pointer-events-none absolute inset-0.5 hidden size-4 text-white peer-indeterminate:block"
      />
    </span>
  );
}
