"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CHAPTERS,
  sampleSceneState,
  STORY_SCROLL,
} from "@/data/storyConfig";
import { setStoryRuntime } from "@/lib/animation/storyRuntime";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/accessibility/hooks";

gsap.registerPlugin(ScrollTrigger);

type StoryControllerProps = {
  children: React.ReactNode;
};

function applyChapterVisibility(root: HTMLElement, active: string) {
  root.querySelectorAll<HTMLElement>("[data-chapter]").forEach((el) => {
    const activeEl = el.dataset.chapter === active;
    el.classList.toggle("is-active", activeEl);
    el.setAttribute("aria-hidden", activeEl ? "false" : "true");
    el.style.opacity = activeEl ? "1" : "0";
    el.style.pointerEvents = activeEl ? "auto" : "none";
  });
}

function resolveActiveChapter(progress: number) {
  if (progress >= 1) return CHAPTERS[CHAPTERS.length - 1].id;
  for (const chapter of CHAPTERS) {
    if (progress >= chapter.range[0] && progress < chapter.range[1]) {
      return chapter.id;
    }
  }
  return CHAPTERS[0].id;
}

/**
 * Pins the story shell and maps scroll progress → scene state.
 * HTML chapter visibility is driven from the same progress value.
 */
export function StoryController({ children }: StoryControllerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setStoryRuntime({ mobile, reducedMotion });
  }, [mobile, reducedMotion]);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;

    if (reducedMotion) {
      setStoryRuntime({
        progress: 0,
        activeChapter: CHAPTERS[0].id,
        state: { ...CHAPTERS[0].state },
      });
      return;
    }

    const progressProxy = { value: 0 };
    const vh = mobile ? STORY_SCROLL.mobileVh : STORY_SCROLL.desktopVh;

    const tween = gsap.to(progressProxy, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: `+=${vh}%`,
        scrub: 0.65,
        pin: pin,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const state = sampleSceneState(progress);
          const active = resolveActiveChapter(progress);
          setStoryRuntime({ progress, activeChapter: active, state });
          applyChapterVisibility(root, active);
        },
      },
    });

    const state = sampleSceneState(0);
    setStoryRuntime({
      progress: 0,
      activeChapter: CHAPTERS[0].id,
      state,
    });
    applyChapterVisibility(root, CHAPTERS[0].id);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      tween.scrollTrigger?.kill();
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === root) st.kill();
      });
    };
  }, [mobile, reducedMotion]);

  return (
    <div ref={rootRef} id="story" className="relative">
      <div ref={pinRef} className="relative min-h-dvh">
        {children}
      </div>
    </div>
  );
}
