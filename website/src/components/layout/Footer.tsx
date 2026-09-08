import Link from "next/link";
import { BUSINESS } from "@/data/siteContent";
import { Mark } from "@/components/layout/Mark";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-paper/10 bg-ink">
      <div className="page-shell py-16 sm:py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-6 flex items-center gap-2.5 text-lemongrass">
              <Mark className="h-7 w-7" />
              <span className="font-display text-lg font-extrabold text-paper">
                {BUSINESS.name}
              </span>
            </div>
            <p className="max-w-[36ch] text-sage">
              {BUSINESS.category} · {BUSINESS.suburb}
              <br />
              {BUSINESS.addressFull}
            </p>
          </div>

          <a
            href={BUSINESS.phoneHref}
            className="font-display text-[clamp(2.5rem,8.5vw,6rem)] font-extrabold tracking-tighter text-paper transition-colors hover:text-lemongrass"
          >
            {BUSINESS.phoneDisplay}
          </a>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-paper/10 pt-8 text-sm text-sage sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-5" aria-label="Footer">
            <Link href="/about" className="hover:text-paper">
              About
            </Link>
            <Link href="/contact" className="hover:text-paper">
              Reserve
            </Link>
            <Link href="/privacy" className="hover:text-paper">
              Privacy
            </Link>
            <a href={BUSINESS.mapsDirections} className="hover:text-paper">
              Directions
            </a>
          </nav>
          <p>© {new Date().getFullYear()} {BUSINESS.name}</p>
        </div>
      </div>
    </footer>
  );
}
