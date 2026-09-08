import { useId, type ReactNode } from "react";
import { BUSINESS } from "../../lib/business";

/* ------------------------------------------------------------------ *
 * Brand mark: the star of "Food Stars", set over a bowl.
 * ------------------------------------------------------------------ */
function starPoints(cx: number, cy: number, ro: number, ri: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 === 0 ? ro : ri;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className} focusable="false">
      <polygon points={starPoints(32, 26.79, 17.05, 7.16)} fill="currentColor" />
      <path
        d="M 51.92 37.91 A 20.37 10.18 0 0 1 12.08 37.91"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Rating stars, with the trailing star clipped to the fractional part. */
export function Stars({ value, className = "" }: { value: number; className?: string }) {
  // useId keeps the clip path unique when several ratings share a value.
  const id = useId();
  const full = Math.floor(value);
  const frac = value - full;
  return (
    <svg
      viewBox="0 0 116 20"
      className={className}
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={full * 24 + frac * 20} height="20" />
        </clipPath>
      </defs>
      <g fill="currentColor" opacity="0.24">
        {[0, 1, 2, 3, 4].map((i) => (
          <polygon key={i} points={starPoints(10 + i * 24, 10, 9.6, 4.1)} />
        ))}
      </g>
      <g fill="currentColor" clipPath={`url(#${id})`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <polygon key={i} points={starPoints(10 + i * 24, 10, 9.6, 4.1)} />
        ))}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * CTA garments. Every call to action owns its interaction identity;
 * there is deliberately no shared button class on this page.
 * ------------------------------------------------------------------ */

/** Nav: quiet text link with a rule that fills from the left. */
export function NavCall() {
  return (
    <a
      href={BUSINESS.phoneHref}
      className="group relative inline-flex items-center gap-2 py-1 text-sm font-medium tracking-wide text-lemongrass"
    >
      <Mark className="h-3.5 w-3.5" />
      Call
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-lemongrass transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </a>
  );
}

/** Hero primary: a solid lemongrass slab, arrow steps out on hover. */
export function CallPrimary() {
  return (
    <a
      href={BUSINESS.phoneHref}
      className="group inline-flex items-center gap-3 bg-lemongrass px-7 py-4 text-base font-semibold text-lacquer transition-colors duration-200 hover:bg-paper active:translate-y-px"
    >
      Call
      <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5">
        &#8594;
      </span>
    </a>
  );
}

/** Hero secondary: hairline frame that fills from the bottom edge. */
export function MenuAnchor() {
  return (
    <a
      href="#menu"
      className="group relative inline-flex items-center overflow-hidden border border-paper/35 px-7 py-4 text-base font-medium text-paper active:translate-y-px"
    >
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-paper/10 transition-transform duration-300 ease-out group-hover:scale-y-100" />
      <span className="relative">See the menu</span>
    </a>
  );
}

/** Body copy: inline link, lemongrass rule slides under the words. */
export function DirectionsInline({ children }: { children?: ReactNode }) {
  return (
    <a
      href={BUSINESS.mapsDirections}
      target="_blank"
      rel="noreferrer"
      className="group relative inline-flex items-baseline gap-1.5 font-medium text-paper"
    >
      {children ?? "Get directions"}
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        &#8599;
      </span>
      <span className="absolute inset-x-0 -bottom-1 h-px bg-lemongrass/45 transition-[background-color] duration-300 group-hover:bg-lemongrass" />
    </a>
  );
}

/** Footer: the phone number itself, set as the largest thing on the page. */
export function PhoneMonolith() {
  return (
    <a
      href={BUSINESS.phoneHref}
      className="group block font-display text-[13vw] leading-[0.86] font-extrabold tracking-tighter text-paper transition-colors duration-300 hover:text-lemongrass sm:text-[11vw] lg:text-[8.5vw]"
    >
      {BUSINESS.phoneDisplay}
    </a>
  );
}
