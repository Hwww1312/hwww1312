/** Rating stars, trailing star clipped to the fractional part. */
export function Stars({ value, className = "" }: { value: number; className?: string }) {
  const id = `stars-${String(value).replace(".", "-")}`;
  const full = Math.floor(value);
  const frac = value - full;
  const pts = (cx: number) => {
    const out: string[] = [];
    for (let i = 0; i < 10; i += 1) {
      const r = i % 2 === 0 ? 9.6 : 4.1;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      out.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(10 + r * Math.sin(a)).toFixed(2)}`);
    }
    return out.join(" ");
  };
  return (
    <svg viewBox="0 0 116 20" className={className} role="img" aria-label={`${value} out of 5 stars`}>
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={full * 24 + frac * 20} height="20" />
        </clipPath>
      </defs>
      <g fill="currentColor" opacity="0.24">
        {[0, 1, 2, 3, 4].map((i) => <polygon key={i} points={pts(10 + i * 24)} />)}
      </g>
      <g fill="currentColor" clipPath={`url(#${id})`}>
        {[0, 1, 2, 3, 4].map((i) => <polygon key={i} points={pts(10 + i * 24)} />)}
      </g>
    </svg>
  );
}
