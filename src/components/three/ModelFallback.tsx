/**
 * Shown when WebGL is unavailable.
 *
 * The page must never depend on the canvas to make sense, so this is a real
 * composition rather than a grey box: the same bowl of curry the 3D scene
 * builds, drawn flat as vector art in the same palette and lit from the same
 * side. No raster assets, nothing to download.
 */
export function ModelFallback() {
  // The garnishes, at the angles they settle at in the modelled dish.
  const garnish = [
    { cx: 268, cy: 268, rx: 54, ry: 15, fill: "#4f7d33", rot: -18 },
    { cx: 352, cy: 258, rx: 50, ry: 14, fill: "#4f7d33", rot: 26 },
    { cx: 232, cy: 300, rx: 46, ry: 11, fill: "#efe9d8", rot: 8 },
    { cx: 300, cy: 316, rx: 52, ry: 12, fill: "#d5e5ab", rot: -6 },
    { cx: 372, cy: 300, rx: 40, ry: 11, fill: "#bf3319", rot: 14 },
    { cx: 262, cy: 236, rx: 34, ry: 13, fill: "#43843b", rot: -30 },
    { cx: 338, cy: 226, rx: 30, ry: 12, fill: "#43843b", rot: 22 },
  ];

  return (
    // Fixed, matching the canvas it stands in for: an absolutely positioned
    // root would collapse against the unpositioned page wrapper.
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-[78vmin] w-[78vmin] -translate-x-1/2 -translate-y-1/2 lg:left-[64%]">
        <svg viewBox="0 0 600 600" className="h-full w-full">
          <defs>
            <radialGradient id="fb-pool" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffb258" stopOpacity="0.3" />
              <stop offset="55%" stopColor="#b0601f" stopOpacity="0.11" />
              <stop offset="100%" stopColor="#100d0b" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="fb-broth" cx="38%" cy="30%" r="78%">
              <stop offset="0%" stopColor="#f6bc55" />
              <stop offset="52%" stopColor="#d8952a" />
              <stop offset="100%" stopColor="#8f5711" />
            </radialGradient>
            <linearGradient id="fb-glaze" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#f4ece0" />
              <stop offset="46%" stopColor="#d9cfbd" />
              <stop offset="100%" stopColor="#6f6355" />
            </linearGradient>
            <radialGradient id="fb-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* The pool of warm light the bowl floats in. */}
          <circle cx="300" cy="290" r="290" fill="url(#fb-pool)" />
          <ellipse cx="300" cy="430" rx="196" ry="44" fill="url(#fb-shadow)" />

          {/* The bowl, then the curry, then what is laid over it. */}
          <path
            d="M92 268 A208 208 0 0 0 508 268 A208 96 0 0 1 92 268 Z"
            fill="url(#fb-glaze)"
          />
          <ellipse cx="300" cy="268" rx="208" ry="96" fill="#efe7da" />
          <ellipse cx="300" cy="272" rx="176" ry="79" fill="url(#fb-broth)" />

          {/* Rice noodles, coiled under everything else. */}
          {[0, 1, 2, 3].map((i) => (
            <ellipse
              key={i}
              cx={300 + (i - 1.5) * 18}
              cy={278 + (i % 2) * 10}
              rx={92 - i * 9}
              ry={30 - i * 2}
              fill="none"
              stroke="#f1e6cf"
              strokeOpacity="0.72"
              strokeWidth="5"
              transform={`rotate(${i * 24 - 30} 300 278)`}
            />
          ))}

          {garnish.map((g, i) => (
            <ellipse
              key={i}
              cx={g.cx}
              cy={g.cy}
              rx={g.rx}
              ry={g.ry}
              fill={g.fill}
              transform={`rotate(${g.rot} ${g.cx} ${g.cy})`}
            />
          ))}

          {/* Lime, and the specular the key light leaves on the rim. */}
          <path d="M404 246 a44 44 0 0 1 42 26 l-42 6 Z" fill="#d9e68b" />
          <ellipse
            cx="252"
            cy="212"
            rx="86"
            ry="20"
            fill="none"
            stroke="#fff3dd"
            strokeOpacity="0.5"
            strokeWidth="3"
            transform="rotate(-16 252 212)"
          />
        </svg>
      </div>
    </div>
  );
}
