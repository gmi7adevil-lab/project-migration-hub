import { useMemo } from "react";

import { cn } from "@/lib/utils";

type Hill = { cx: number; cy: number; rings: number; base: number; step: number; phase: number };

/** Deterministic, smooth closed contour around a centre (no randomness, so SSR and client match). */
function contour(h: Hill, k: number) {
  const pts: [number, number][] = [];
  const n = 72;
  const r = h.base + k * h.step;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const wobble =
      0.16 * Math.sin(3 * a + h.phase + k * 0.22) +
      0.08 * Math.sin(5 * a - h.phase * 1.7 + k * 0.11) +
      0.05 * Math.cos(7 * a + k * 0.31);
    const rr = r * (1 + wobble);
    pts.push([h.cx + Math.cos(a) * rr * 1.25, h.cy + Math.sin(a) * rr]);
  }
  const mid = (p: [number, number], q: [number, number]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2] as const;
  const first = mid(pts[n - 1]!, pts[0]!);
  let d = `M${first[0].toFixed(1)} ${first[1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i]!;
    const m = mid(p, pts[(i + 1) % n]!);
    d += `Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
  }
  return `${d}Z`;
}

const DEFAULT_HILLS: Hill[] = [
  { cx: 260, cy: 300, rings: 11, base: 26, step: 34, phase: 0.4 },
  { cx: 820, cy: 720, rings: 13, base: 20, step: 36, phase: 2.1 },
];

/**
 * Topographic contour lines drawn in `currentColor`.
 * `animated` adds a slow drift (disabled automatically for reduced motion via CSS).
 */
export function TopoLines({
  className,
  hills = DEFAULT_HILLS,
  animated = false,
}: {
  className?: string;
  hills?: Hill[];
  animated?: boolean;
}) {
  const groups = useMemo(
    () => hills.map((h) => Array.from({ length: h.rings }, (_, k) => ({ d: contour(h, k), index: k }))),
    [hills],
  );
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none", className)}
      fill="none"
      stroke="currentColor"
    >
      {groups.map((rings, g) => (
        <g key={g} className={cn(animated && (g % 2 ? "topo-drift-b" : "topo-drift-a"))} style={{ transformOrigin: `${hills[g]!.cx}px ${hills[g]!.cy}px` }}>
          {rings.map((r) => (
            <path
              key={r.index}
              d={r.d}
              strokeWidth={r.index % 5 === 4 ? 1.6 : 0.8}
              className={cn(animated && r.index % 4 === 2 && "topo-trace")}
              pathLength={animated && r.index % 4 === 2 ? 1 : undefined}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

export type { Hill };
