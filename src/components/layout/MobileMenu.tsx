"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BUSINESS, NAV_LINKS } from "@/data/siteContent";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Escape closes, and the body must not scroll behind the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex h-11 w-11 items-center justify-center text-ivory"
      >
        <span className="sr-only">Open menu</span>
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="fixed inset-0 z-[60] flex flex-col bg-lacquer"
        >
          <div className="flex h-[72px] items-center justify-end px-5">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              className="flex h-11 w-11 items-center justify-center text-ivory"
            >
              <span className="sr-only">Close menu</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-2 px-6 pb-24">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-ivory/12 py-5 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={BUSINESS.phoneHref}
              className="mt-8 bg-lemongrass px-7 py-4 text-center text-base font-semibold text-lacquer"
            >
              Call {BUSINESS.phoneDisplay}
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
