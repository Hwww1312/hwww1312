import { useEffect } from "react";

type Layer = { el: HTMLElement; speed: number; clamp: number };

/**
 * Transform-only scroll parallax.
 *
 * Elements opt in with `data-parallax="<speed>"` (negative counter-moves) and
 * an optional `data-parallax-clamp="<px>"`. Everything runs through a single
 * rAF batch and only ever writes `translate3d`, so it stays on the compositor
 * and works on touch devices, where `background-attachment: fixed` does not.
 * Honours `prefers-reduced-motion` live, clearing transforms when it turns on.
 */
export function initParallax(): () => void {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  let layers: Layer[] = [];
  let frame = 0;
  let running = false;

  const collect = () => {
    layers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    ).map((el) => ({
      el,
      speed: Number.parseFloat(el.dataset.parallax ?? "0") || 0,
      clamp: Number.parseFloat(el.dataset.parallaxClamp ?? "150") || 150,
    }));
  };

  const paint = () => {
    frame = 0;
    const vh = window.innerHeight;
    for (const { el, speed, clamp } of layers) {
      const r = el.getBoundingClientRect();
      // -1 when the layer sits below the fold, +1 once it has scrolled past.
      const progress =
        (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
      const y = Math.max(-clamp, Math.min(clamp, progress * speed * 100));
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    }
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(paint);
  };

  const remeasure = () => {
    collect();
    schedule();
  };

  const start = () => {
    if (running || media.matches) return;
    running = true;
    collect();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    window.addEventListener("orientationchange", remeasure, { passive: true });
    paint();
  };

  const stop = () => {
    if (!running) return;
    running = false;
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", remeasure);
    window.removeEventListener("orientationchange", remeasure);
    if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
    for (const { el } of layers) el.style.transform = "";
  };

  const onPreferenceChange = () => (media.matches ? stop() : start());
  media.addEventListener("change", onPreferenceChange);
  start();

  return () => {
    stop();
    media.removeEventListener("change", onPreferenceChange);
  };
}

/** Client-only: the effect never runs during server rendering. */
export function useParallax(): void {
  useEffect(() => initParallax(), []);
}
