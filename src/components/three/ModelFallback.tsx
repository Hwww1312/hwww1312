/**
 * Shown when WebGL is unavailable or the visitor asked for reduced motion.
 * The page must never depend on the canvas to make sense, so this is a real
 * composition: the same celadon plate and fanned skewers the 3D scene builds,
 * drawn flat as vector art. No raster assets, nothing to download.
 */
export function ModelFallback() {
  // Five skewers, alternating beef and pork, fanned the way they settle in
  // the canvas. Angles and offsets mirror the FLIGHT table in HeroModel.
  const skewers = [
    { angle: -19, dy: -46, meat: "#5c2d18" },
    { angle: -9.5, dy: -23, meat: "#c99062" },
    { angle: 0, dy: 0, meat: "#69361d" },
    { angle: 9.5, dy: 23, meat: "#d39c72" },
    { angle: 19, dy: 46, meat: "#4e2614" },
  ];

  return (
    // Fixed, matching the canvas it stands in for: an absolutely positioned
    // root would collapse against the unpositioned page wrapper.
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute right-[-8%] top-1/2 h-[64vmin] w-[64vmin] -translate-y-1/2 lg:right-[4%]">
        <svg viewBox="0 0 600 600" className="h-full w-full">
          <defs>
            <radialGradient id="fb-glaze" cx="42%" cy="34%" r="72%">
              <stop offset="0%" stopColor="#b9cdc0" />
              <stop offset="58%" stopColor="#95ac9d" />
              <stop offset="100%" stopColor="#6f8a7b" />
            </radialGradient>
            <radialGradient id="fb-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#16251f" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#16251f" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="fb-steel" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8d949a" />
              <stop offset="50%" stopColor="#d5dade" />
              <stop offset="100%" stopColor="#8d949a" />
            </linearGradient>
          </defs>

          <ellipse cx="300" cy="366" rx="228" ry="62" fill="url(#fb-shadow)" />
          <ellipse cx="300" cy="318" rx="212" ry="82" fill="#6f8a7b" opacity="0.55" />
          <ellipse cx="300" cy="306" rx="212" ry="82" fill="url(#fb-glaze)" />
          <ellipse
            cx="300"
            cy="304"
            rx="164"
            ry="60"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.22"
          />

          {skewers.map(({ angle, dy, meat }, i) => (
            <g key={i} transform={`translate(300 ${296 + dy}) rotate(${angle})`}>
              <rect x="-176" y="-2.4" width="352" height="4.8" rx="2.4" fill="url(#fb-steel)" />
              {[-96, -48, 0, 48, 96].map((x, j) => (
                <ellipse
                  key={j}
                  cx={x}
                  cy={j % 2 ? -1.5 : 1.5}
                  rx="25"
                  ry="15"
                  fill={meat}
                  stroke="#16251f"
                  strokeOpacity="0.18"
                />
              ))}
            </g>
          ))}
        </svg>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_50%,transparent_0%,rgba(251,246,236,0.62)_46%,#fbf6ec_72%)]" />
    </div>
  );
}
