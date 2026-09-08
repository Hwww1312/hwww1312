"use client";

import Image from "next/image";
import { DISHES } from "@/data/siteContent";

/** Static fallback when WebGL is unavailable or reduced motion is preferred. */
export function ModelFallback({
  reason = "Showing a still composition while the 3D plate loads.",
}: {
  reason?: string;
}) {
  const dish = DISHES[0];

  return (
    <div
      className="absolute inset-0 z-[1] flex items-end justify-center bg-[radial-gradient(ellipse_at_center,#0b2620_0%,#071c18_55%,#04110e_100%)]"
      role="img"
      aria-label={`${dish.name} — ${reason}`}
    >
      <div className="relative mb-[18vh] h-[min(58vw,420px)] w-[min(58vw,420px)] overflow-hidden rounded-full border border-paper/15 shadow-[0_0_80px_rgba(200,220,75,0.12)]">
        <Image
          src={`/assets/${dish.slug}.jpg`}
          alt={dish.name}
          fill
          priority
          className="object-cover"
          sizes="420px"
        />
      </div>
      <p className="pointer-events-none absolute bottom-8 left-1/2 max-w-sm -translate-x-1/2 text-center text-xs text-sage">
        {reason}
      </p>
    </div>
  );
}
