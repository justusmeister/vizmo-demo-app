import { cx } from "@/lib/cx";

// Segmented control for switching a view (e.g. list status). Selected segment is white on Fläche.

type Option<T extends string> = { value: T; label: string; count?: number };

type SegmentedProps<T extends string> = {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function Segmented<T extends string>({ label, options, value, onChange, className }: SegmentedProps<T>) {
  return (
    <div role="group" aria-label={label} className={cx("inline-flex max-w-full overflow-x-auto rounded-button bg-line/60 p-1", className)}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cx(
              "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-input px-3 font-medium whitespace-nowrap transition-colors",
              selected ? "bg-white text-night ring-1 ring-line" : "text-slate hover:text-night",
            )}
          >
            {option.label}
            {option.count != null && (
              <span className="text-slate tabular-nums">{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
