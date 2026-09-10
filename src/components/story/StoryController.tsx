"use client";

import { useEffect } from "react";
import { setMeasuredRanges, storyState, resolveStory, resolveIntro } from "@/lib/story/state";
import { CHAPTERS } from "@/data/storyConfig";

/**
 * Maps scroll position onto `storyState.progress`.
 *
 * GSAP ScrollTrigger drives it with `scrub`, so the scene is a pure function
 * of scroll offset: stop mid-transition and it holds, scroll back up and it
 * retraces the exact states it came through. No autoplay, no one-way triggers.
 *
 * Nothing is pinned. The canvas is already fixed, so pinning would only add a
 * spacer to the document and a resize hazard.
 */
export function StoryController({
  containerRef,
  canvasRef,
  onChapterChange,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onChapterChange?: (index: number) => void;
}) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 1023px)");
    storyState.isMobile = narrow.matches;
    storyState.reducedMotion = motion.matches;
    storyState.skipIntro = window.scrollY > 40;

    /**
     * Measure where each chapter section actually sits, and express it as a
     * range in container-progress space. Without this the timeline is guessed
     * and the chapters drift out of sync with the copy beside them.
     */
    const measure = () => {
      const vh = window.innerHeight;
      const scrollable = el.offsetHeight - vh;
      if (scrollable <= 0) {
        setMeasuredRanges(null);
        return;
      }
      const containerTop = el.getBoundingClientRect().top + window.scrollY;
      const ranges: [number, number][] = [];
      let previousEnd = 0;

      CHAPTERS.forEach((chapter) => {
        const section = document.getElementById(chapter.domId);
        if (!section) {
          // Keep the chapter in the list but give it no span, then close the
          // gap below so scroll can never land outside every range.
          ranges.push([previousEnd, previousEnd]);
          return;
        }
        const top = section.getBoundingClientRect().top + window.scrollY - containerTop;
        const height = section.offsetHeight;
        // A chapter is active while its section crosses the viewport centre.
        const startPx = Math.max(0, top - vh * 0.5);
        const endPx = Math.max(startPx + 1, top + height - vh * 0.5);
        const start = Math.max(previousEnd, Math.min(1, startPx / scrollable));
        const end = Math.max(start + 0.001, Math.min(1, endPx / scrollable));
        ranges.push([start, end]);
        previousEnd = end;
      });

      // The ranges must tile [0, 1] with no gaps. A gap means some scroll
      // position matches no chapter, and the lookup falls through to the last
      // one, which snaps the scene to the closing shot mid-page.
      ranges[0][0] = 0;
      for (let i = 1; i < ranges.length; i += 1) {
        ranges[i][0] = ranges[i - 1][1];
        if (ranges[i][1] < ranges[i][0]) ranges[i][1] = ranges[i][0];
      }
      ranges[ranges.length - 1][1] = 1;

      debugRanges = ranges;
      setMeasuredRanges(ranges);
    };

    let cleanup: (() => void) | undefined;
    let cancelled = false;
    let lastChapter = -1;
    // Opt-in diagnostics: ?storydebug exposes the resolved scene state so the
    // timeline can be inspected without guessing from screenshots.
    const debug =
      typeof window !== "undefined" && window.location.search.includes("storydebug");
    let debugRanges: [number, number][] = [];

    const publish = (progress: number) => {
      storyState.progress = progress;
      const resolved = resolveStory(progress, storyState.isMobile);
      // Written straight to the DOM: routing this through React state would
      // re-render the tree on every scroll frame.
      if (canvasRef.current) {
        canvasRef.current.style.opacity = String(1 - resolved.veil * 0.92);
      }
      if (debug) {
        (window as unknown as { __story?: unknown }).__story = {
          progress,
          chapter: CHAPTERS[resolved.chapterIndex]?.id,
          index: resolved.chapterIndex,
          local: resolved.local,
          model: resolved.model,
          camera: resolved.camera,
          ranges: debugRanges,
          isMobile: storyState.isMobile,
          grading: storyState.grading,
          intro: resolveIntro(storyState.elapsed - storyState.startedAt),
        };
      }
      if (resolved.chapterIndex !== lastChapter) {
        lastChapter = resolved.chapterIndex;
        onChapterChange?.(resolved.chapterIndex);
      }
    };

    const attach = async () => {
      measure();

      // Reduced motion: park the scene on the composed hero frame and never
      // move it again. The canvas is fixed, so it would otherwise sit over the
      // menu for the rest of the page — it is faded out past the hero instead.
      // A cross-fade is not motion, and without it the type is unreadable.
      if (motion.matches) {
        publish(0);
        const fade = () => {
          if (!canvasRef.current) return;
          const past = window.scrollY / Math.max(1, window.innerHeight * 0.9);
          canvasRef.current.style.opacity = String(Math.max(0, 1 - past));
        };
        fade();
        window.addEventListener("scroll", fade, { passive: true });
        cleanup = () => window.removeEventListener("scroll", fade);
        return;
      }

      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.15,
        invalidateOnRefresh: true,
        onRefresh: measure,
        onUpdate: (self) => publish(self.progress),
      });

      // ScrollTrigger only fires onUpdate when the value changes, so at the
      // very top of the page the scene would otherwise keep its default pose.
      publish(trigger.progress);

      const onResize = () => {
        storyState.isMobile = narrow.matches;
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);
      window.addEventListener("orientationchange", onResize);

      cleanup = () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
        trigger.kill();
        setMeasuredRanges(null);
      };
    };

    void attach();

    const onPreference = () => window.location.reload();
    motion.addEventListener("change", onPreference);

    return () => {
      cancelled = true;
      cleanup?.();
      motion.removeEventListener("change", onPreference);
    };
  }, [containerRef, canvasRef, onChapterChange]);

  return null;
}
