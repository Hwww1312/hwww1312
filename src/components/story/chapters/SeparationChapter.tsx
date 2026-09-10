import { STORY } from "@/data/siteContent";
import { Parallax } from "../Parallax";

/** What lifts away from the bowl, in the order the scene lifts it. */
const MOVES = [
  { id: "chilli", label: "Chilli", note: "forward" },
  { id: "herbs", label: "Herbs", note: "upward" },
  { id: "lime", label: "Lime", note: "aside" },
  { id: "noodles", label: "Noodles", note: "lifted" },
] as const;

/**
 * Chapter 04.
 *
 * The garnishes drift apart and settle back. The copy sits low and quiet
 * because the dish is doing the talking here.
 */
export function SeparationChapter() {
  const { separation } = STORY;
  return (
    <section
      id="separation"
      aria-labelledby="separation-heading"
      data-tall
      className="relative flex min-h-[170vh] items-end pb-32 pt-[40vh] lg:pb-40"
    >
      <div className="shell">
        <Parallax speed={0.045} className="lg:ml-auto lg:max-w-[38rem]">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.34em] text-turmeric">
            {separation.eyebrow}
          </p>
          <h2
            id="separation-heading"
            className="display mt-6 max-w-[14ch] text-[length:var(--text-chapter)]"
          >
            {separation.headline}
          </h2>
          <p className="mt-8 max-w-[46ch] text-base leading-relaxed text-ink-soft">
            {separation.body}
          </p>

          <ul className="mt-12 grid grid-cols-2 gap-px border border-ink/12 bg-ink/12 sm:grid-cols-4">
            {MOVES.map((move) => (
              <li key={move.id} className="bg-paper px-4 py-5">
                <span className="block text-sm font-medium uppercase tracking-[0.14em]">
                  {move.label}
                </span>
                <span className="mt-1.5 block text-xs uppercase tracking-[0.2em] text-ink-faint">
                  {move.note}
                </span>
              </li>
            ))}
          </ul>
        </Parallax>
      </div>
    </section>
  );
}
