"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { INGREDIENTS } from "@/data/siteContent";
import { resolveStory, storyState, window01 } from "@/lib/story/state";

/**
 * The ingredient call-outs for chapter 02.
 *
 * Each label is anchored to a point in the bowl's own model space — the
 * component renders inside the bowl's frame, so the anchors inherit its
 * position, rotation and scale — and is projected to the screen every frame.
 * The leader therefore stays attached to the thing it names while the camera
 * climbs and the dish turns. They are drawn
 * in HTML rather than in the scene because a hairline and a line of type
 * belong to the page's typography, not to its lighting.
 *
 * The leader is a two-segment polyline — out and away from the dish, then
 * flat under the type — drawn with `pathLength="1"` so it can be dashed open
 * from a single normalised number as the section arrives.
 *
 * Decorative only: the same seven ingredients are set as real text in the
 * section beside them, so nothing here is load-bearing for a screen reader,
 * and on a phone the labels are dropped rather than crammed around a small
 * bowl.
 */
export function IngredientLabels() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useFrame(() => {
    const { labels } = resolveStory(storyState.progress, storyState.isMobile);
    const hide = storyState.isMobile;

    for (let i = 0; i < INGREDIENTS.length; i += 1) {
      const node = refs.current[i];
      if (!node) continue;
      // Staggered, so the seven arrive one after another rather than as a
      // single block of text landing on the dish.
      const t = hide ? 0 : window01(labels, i * 0.055, 0.5 + i * 0.055);
      if (t < 0.01) {
        if (node.style.display !== "none") node.style.display = "none";
        continue;
      }
      if (node.style.display === "none") node.style.display = "";
      node.style.opacity = String(t);
      node.style.setProperty("--reach", `${t}`);
    }
  });

  return (
    <>
      {INGREDIENTS.map((ingredient, i) => {
        const [dx, dy] = ingredient.lead;
        // Out at an angle first, then flat: the horizontal run is what the
        // type sits on, and it always points back towards the dish.
        const elbowX = dx * 0.42;
        const side = dx < 0 ? "left" : "right";

        return (
          <group key={ingredient.id} position={[...ingredient.anchor]}>
            <Html
              center={false}
              zIndexRange={[24, 12]}
              style={{ pointerEvents: "none" }}
              wrapperClass="ingredient-label-wrapper"
            >
              <div
                ref={(el) => {
                  refs.current[i] = el;
                }}
                aria-hidden="true"
                className="ingredient-label"
                data-side={side}
                style={{ opacity: 0 }}
              >
                <span className="ingredient-dot" />
                <svg className="ingredient-leader" width="1" height="1">
                  <polyline
                    pathLength="1"
                    points={`0,0 ${elbowX},${dy} ${dx},${dy}`}
                    fill="none"
                  />
                </svg>
                <span
                  className="ingredient-text"
                  style={{ transform: `translate(${dx}px, ${dy}px)` }}
                >
                  <span className="ingredient-name">{ingredient.label}</span>
                  <span className="ingredient-note">{ingredient.note}</span>
                </span>
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}
