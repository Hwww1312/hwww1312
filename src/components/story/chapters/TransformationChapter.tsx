import { STORY } from "@/data/siteContent";

export function TransformationChapter() {
  const { transformation } = STORY;
  return (
    <section
      id="transformation"
      aria-labelledby="transformation-heading"
      className="relative flex min-h-dvh items-end py-28"
    >
      <div className="shell">
        {/* The object owns the frame here, so the copy sits low and quiet. */}
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-jade">
          {transformation.eyebrow}
        </p>
        <h2
          id="transformation-heading"
          className="mt-5 max-w-[16ch] text-[length:var(--text-chapter)] leading-[0.98]"
        >
          {transformation.headline}
        </h2>
        <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-ink-soft">
          {transformation.body}
        </p>
      </div>
    </section>
  );
}
