"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { StoryCanvas } from "./StoryCanvas";
import { StoryController } from "./StoryController";
import { StoryProgress } from "./StoryProgress";
import { StoryContent } from "./StoryContent";

/**
 * Composes the story: the semantic HTML, the persistent canvas that runs
 * through the middle of it, and the controller that binds scroll to the
 * scene. The HTML renders on the server and is complete on its own;
 * everything else here is enhancement.
 */
export function StoryExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [inView, setInView] = useState(true);

  // Only fires when the chapter changes, not on every scroll frame.
  const onChapterChange = useCallback((i: number) => setActiveChapter(i), []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* The pool of warm light, painted in CSS so the page is never a flat
          black rectangle in the moment before WebGL starts. */}
      <div
        aria-hidden="true"
        className="glow-warm pointer-events-none fixed inset-0 z-0"
      />
      <StoryCanvas ref={canvasRef} inView={inView} />
      <StoryController
        containerRef={containerRef}
        canvasRef={canvasRef}
        onChapterChange={onChapterChange}
      />
      <StoryProgress active={activeChapter} />
      <StoryContent />
    </div>
  );
}
