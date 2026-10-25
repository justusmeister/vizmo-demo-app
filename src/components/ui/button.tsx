import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

// Design doc 6.1 and 7. Primary is Vizmo Blau with Tiefblau hover/pressed.
// Use one primary per view region. Labels name the next step („Slot buchen").

type Variant = "primary" | "secondary" | "tertiary";
type Size = "sm" | "md";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-button font-medium whitespace-nowrap transition-colors select-none disabled:cursor-not-allowed aria-disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-blue text-white hover:bg-deep-blue active:bg-deep-blue disabled:bg-gray aria-disabled:bg-gray",
  secondary:
    "border border-line bg-white text-night hover:border-gray hover:bg-mist active:bg-mist disabled:border-line disabled:bg-white disabled:text-gray aria-disabled:text-gray",
  tertiary:
    "text-blue hover:bg-mist hover:text-deep-blue active:text-deep-blue disabled:bg-transparent disabled:text-gray aria-disabled:text-gray",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-body",
  md: "h-10 px-4 text-body",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cx(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  loading?: boolean;
};

export function Button({
  variant,
  size,
  icon,
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {loading ? (
        <LoaderCircle aria-hidden className="size-4 animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
};

export function ButtonLink({ variant, size, icon, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonStyles({ variant, size, className })} {...props}>
      {icon}
      {children}
    </Link>
  );
}
