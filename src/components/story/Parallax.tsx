"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Depth, cheaply.
 *
 * The element is offset against the scroll by a fraction of its own distance
 * from the centre of the viewport, so background marks drift against the type
 * and the type drifts against the bowl. Everything is written straight to the
 * transform inside one rAF, and nothing runs while the element is off screen.
 */
export function Parallax({
  speed = 0.12,
  className = "",
  children,
}: {
  /** Positive drifts down against the scroll, negative drifts up. */
  speed?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let onScreen = true;

    const update = () => {
      raf = 0;
      if (!onScreen) return;
      const rect = el.getBoundingClientRect();
      const middle = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-middle * speed).toFixed(2)}px, 0)`;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) schedule();
      },
      { rootMargin: "120px" },
    );
    io.observe(el);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
