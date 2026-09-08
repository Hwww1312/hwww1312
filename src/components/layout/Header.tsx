import Link from "next/link";
import { BUSINESS, NAV_LINKS } from "@/data/siteContent";
import { Mark } from "@/components/ui/Mark";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[72px] bg-gradient-to-b from-lacquer/95 to-lacquer/0 backdrop-blur-[2px]">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Mark className="h-6 w-6 text-lemongrass" />
          <span className="font-[family-name:var(--font-display)] text-[15px] font-extrabold tracking-tight">
            {BUSINESS.name}
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <nav aria-label="Primary" className="hidden items-center gap-8 text-sm text-sage md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-ivory">
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/contact"
            className="hidden bg-lemongrass px-5 py-2.5 text-sm font-semibold text-lacquer transition-colors hover:bg-ivory md:inline-flex"
          >
            Reserve a table
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
