import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "outline" | "inline";

const base =
  "inline-flex items-center gap-3 font-medium transition-colors duration-200 active:translate-y-px";

const variants: Record<Variant, string> = {
  /** Solid lemongrass slab. The single strongest action on any screen. */
  primary:
    "bg-lemongrass px-7 py-4 text-base font-semibold text-lacquer hover:bg-ivory",
  /** Hairline frame that fills on hover. Always secondary to `primary`. */
  outline:
    "group relative overflow-hidden border border-ivory/35 px-7 py-4 text-base text-ivory",
  /** Inline text link with an accent rule beneath. */
  inline:
    "group relative items-baseline gap-1.5 text-ivory hover:text-lemongrass",
};

type Props = {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...rest
}: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;

  const inner = (
    <>
      {variant === "outline" && (
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-bottom scale-y-0 bg-ivory/10 transition-transform duration-300 ease-out group-hover:scale-y-100"
        />
      )}
      <span className={variant === "outline" ? "relative" : undefined}>
        {children}
      </span>
      {variant === "inline" && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-1 h-px bg-lemongrass/45 transition-colors duration-300 group-hover:bg-lemongrass"
        />
      )}
    </>
  );

  if (href) {
    const external = href.startsWith("http") || href.startsWith("tel:");
    if (external) {
      return (
        <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}
