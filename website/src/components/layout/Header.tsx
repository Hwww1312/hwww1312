"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BUSINESS, NAV_LINKS } from "@/data/siteContent";
import { Mark } from "@/components/layout/Mark";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-lacquer/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav
        className="page-shell flex h-[68px] items-center justify-between"
        aria-label="Primary"
      >
        <Link href="/" className="flex items-center gap-2.5">
          <Mark className="h-6 w-6 text-lemongrass" />
          <span className="font-display text-[15px] font-extrabold tracking-tight">
            {BUSINESS.name}
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-sage transition-colors hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={BUSINESS.phoneHref}
            className="group relative text-sm font-medium text-lemongrass"
          >
            Call
            <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-lemongrass transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        </div>

        <MobileMenu />
      </nav>
    </header>
  );
}
