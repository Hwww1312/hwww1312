import Link from "next/link";
import { BUSINESS, NAV_LINKS } from "@/data/siteContent";
import { Mark } from "@/components/ui/Mark";

export function Footer() {
  return (
    <footer className="relative border-t border-ivory/15 bg-lacquer">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
        <p className="text-sm uppercase tracking-[0.2em] text-sage">Call the restaurant</p>
        <a
          href={BUSINESS.phoneHref}
          className="mt-6 block font-[family-name:var(--font-display)] text-[13vw] font-extrabold leading-[0.86] tracking-tighter transition-colors duration-300 hover:text-lemongrass sm:text-[11vw] lg:text-[8.5vw]"
        >
          {BUSINESS.phoneDisplay}
        </a>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-ivory/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="flex items-center gap-2.5">
              <Mark className="h-5 w-5 text-lemongrass" />
              <span className="font-[family-name:var(--font-display)] text-[15px] font-extrabold tracking-tight">
                {BUSINESS.name}
              </span>
            </p>
            <p className="mt-3 text-sm text-sage">{BUSINESS.category}</p>
          </div>

          <address className="text-sm not-italic text-sage">
            <p className="text-ivory">{BUSINESS.street}</p>
            <p>{BUSINESS.locality}</p>
            <a
              href={BUSINESS.mapsDirections}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-ivory underline decoration-lemongrass/45 underline-offset-4 hover:decoration-lemongrass"
            >
              Get directions
            </a>
          </address>

          <div className="text-sm text-sage">
            <p className="text-ivory">Closes {BUSINESS.closingTime}</p>
            <p className="mt-1">Busiest {BUSINESS.busiest}</p>
            <p className="mt-3">Opening times can change, so call before you travel.</p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2 text-sm text-sage">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-ivory">
                {link.label}
              </Link>
            ))}
            <Link href="/privacy" className="hover:text-ivory">
              Privacy
            </Link>
          </nav>
        </div>

        <p className="mt-12 border-t border-ivory/10 pt-8 text-xs text-sage-dim">
          Listing details, photographs and reviews from the restaurant&rsquo;s Google
          Business profile.
        </p>
      </div>
    </footer>
  );
}
