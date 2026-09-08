import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  children,
  as: Tag = "h2",
  className = "",
}: {
  eyebrow?: string;
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-jade">
          {eyebrow}
        </p>
      )}
      {/* The measure lives on the heading itself: `ch` resolves against the
          element's own font size, so putting it on the wrapper would size it
          against 16px body text and collapse the column. */}
      <Tag className="max-w-[18ch] text-[length:var(--text-chapter)] leading-[0.98]">
        {children}
      </Tag>
    </div>
  );
}
