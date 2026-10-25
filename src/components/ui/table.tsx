import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

// Design doc 6.7. Schiefer header row, Linie dividers, tabular numerals, Fläche row hover.
// The wrapper scrolls horizontally on narrow viewports instead of squeezing columns.

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto">
      <table className={cx("w-full border-collapse text-left tabular-nums", className)} {...props} />
    </div>
  );
}

export function TableHead(props: ComponentProps<"thead">) {
  return <thead className="border-b border-line" {...props} />;
}

export function TableBody(props: ComponentProps<"tbody">) {
  return <tbody className="divide-y divide-line" {...props} />;
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return <tr className={cx("transition-colors [tbody_&]:hover:bg-surface", className)} {...props} />;
}

type Align = { align?: "left" | "right" };

export function TableHeaderCell({ align = "left", className, ...props }: ComponentProps<"th"> & Align) {
  return (
    <th
      scope="col"
      className={cx(
        "h-10 px-4 text-small font-medium whitespace-nowrap text-slate",
        align === "right" && "text-right",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ align = "left", className, ...props }: ComponentProps<"td"> & Align) {
  return (
    <td className={cx("h-12 px-4 align-middle", align === "right" && "text-right", className)} {...props} />
  );
}
