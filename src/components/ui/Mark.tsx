/** The star of "Food Stars", set over a bowl. Inherits currentColor. */
export function Mark({ className = "" }: { className?: string }) {
  const points: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 === 0 ? 17.05 : 7.16;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    points.push(
      `${(32 + r * Math.cos(a)).toFixed(2)},${(26.79 + r * Math.sin(a)).toFixed(2)}`,
    );
  }
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <polygon points={points.join(" ")} fill="currentColor" />
      <path
        d="M 51.92 37.91 A 20.37 10.18 0 0 1 12.08 37.91"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
