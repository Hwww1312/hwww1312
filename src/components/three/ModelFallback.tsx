import Image from "next/image";

/**
 * Shown when WebGL is unavailable or the visitor asked for reduced motion.
 * The page must never depend on the canvas to make sense, so this is a real
 * composition rather than a spinner.
 */
export function ModelFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute right-[-12%] top-1/2 h-[78vmin] w-[78vmin] -translate-y-1/2 lg:right-[4%]">
        <Image
          src="/images/dishes/lok-lak.jpg"
          alt=""
          fill
          priority
          sizes="78vmin"
          className="object-cover [mask-image:radial-gradient(circle_at_50%_50%,#000_38%,transparent_72%)]"
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_50%,transparent_0%,rgba(251,246,236,0.55)_55%,#fbf6ec_82%)]" />
    </div>
  );
}
