"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { BUSINESS, NAV_LINKS } from "@/data/siteContent";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center border border-paper/20 text-paper"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span aria-hidden="true" className="text-lg leading-none">
          {open ? "×" : "☰"}
        </span>
      </button>

      {open ? (
        <div
          id={panelId}
          className="fixed inset-0 top-[68px] z-50 bg-lacquer/98 px-5 py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-6 text-2xl font-display font-extrabold">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={BUSINESS.phoneHref} onClick={() => setOpen(false)}>
                Call {BUSINESS.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
