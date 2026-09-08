import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "frame";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-3 px-7 py-4 text-base font-semibold transition-colors duration-200 active:translate-y-px";

  const styles =
    variant === "primary"
      ? "bg-lemongrass text-lacquer hover:bg-paper"
      : variant === "ghost"
        ? "text-lemongrass hover:text-paper"
        : "border border-paper/25 text-paper hover:border-lemongrass hover:text-lemongrass";

  return (
    <a href={href} className={`${base} ${styles} ${className}`.trim()}>
      {children}
      {variant === "primary" ? <span aria-hidden="true">→</span> : null}
    </a>
  );
}
