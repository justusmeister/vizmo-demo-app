import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

// Selectable option (design doc 7, "Selected"): Nebel background with a Vizmo Blau border
// and check when selected. Used for single and multi choice; state is exposed via aria-pressed.

type ChoiceChipProps = Omit<ComponentProps<"button">, "type"> & {
  selected: boolean;
  icon?: ReactNode;
};

export function ChoiceChip({ selected, icon, className, children, ...props }: ChoiceChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(
        "inline-flex min-h-10 items-center gap-2 rounded-button border px-3.5 py-2 text-left font-medium transition-colors",
        selected
          ? "border-blue bg-mist text-night"
          : "border-line bg-white text-night hover:border-gray hover:bg-surface",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export function ChoiceGroup({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <fieldset className={cx("flex flex-col gap-2", className)}>
      <legend className="mb-1.5 font-medium text-slate">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}
