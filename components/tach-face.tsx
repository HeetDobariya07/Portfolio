import type { CSSProperties, ReactNode, Ref } from "react";

// Shared dial face (viewBox 500×500): a 240° sweep from -120° (min) to +120° (max).
export const TACH = { SWEEP: 240, START: -120, C: 250, R: 230 } as const;
const { SWEEP, START, C, R } = TACH;

// Trig results can differ in the last digits between Node (SSR) and the browser, which React
// reports as a hydration mismatch. Rounding SVG coordinates to 2 decimals makes them identical.
const fixed = (n: number) => Math.round(n * 100) / 100;

function polar(angleDeg: number, radius: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: fixed(C + radius * Math.cos(a)), y: fixed(C + radius * Math.sin(a)) };
}

function arc(from: number, to: number, radius: number) {
  const s = polar(from, radius);
  const e = polar(to, radius);
  return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${to - from > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
}

const round = (n: number) => Math.round(n * 1000) / 1000;

/** Angle (deg) of a value on a dial running from `min` to `max`. */
export const dialAngle = (v: number, min: number, max: number) =>
  START + (SWEEP * (Math.min(Math.max(v, min), max) - min)) / (max - min);

type Props = {
  min: number;
  max: number;
  /** Distance between numbered marks; ticks are drawn every quarter of it. */
  labelStep: number;
  /** Start of the red zone. */
  redline: number;
  /** Text drawn in the lower half of the face (below the hub). */
  caption: ReactNode;
  needleRef?: Ref<SVGGElement>;
  needleStyle?: CSSProperties;
  className?: string;
};

/**
 * The site's tachometer face: thin rings, quarter ticks with bold numbered majors, a red zone,
 * and a tapered red needle on a dark hub. Used by the hero tach and the About dials.
 */
export function TachFace({ min, max, labelStep, redline, caption, needleRef, needleStyle, className }: Props) {
  const minor = labelStep / 4;
  const ticks = Array.from({ length: Math.round((max - min) / minor) + 1 }, (_, i) => round(min + i * minor));
  const angleOf = (v: number) => dialAngle(v, min, max);

  return (
    <svg viewBox="0 0 500 500" className={className} aria-hidden>
      <circle cx={C} cy={C} r={R + 12} fill="none" stroke="var(--color-line)" strokeWidth="1.5" />
      <circle cx={C} cy={C} r={R - 70} fill="none" stroke="var(--color-line)" strokeOpacity="0.5" />
      <path d={arc(START, START + SWEEP, R)} fill="none" stroke="var(--color-fg)" strokeOpacity="0.15" strokeWidth="2" />
      <path d={arc(angleOf(redline), START + SWEEP, R - 6)} fill="none" stroke="#e8322b" strokeWidth="10" opacity="0.85" />
      {ticks.map((t) => {
        const a = angleOf(t);
        const k = round((t - min) / labelStep);
        const major = Number.isInteger(k);
        const half = !major && Number.isInteger(round(k * 2));
        const red = t >= redline - 1e-9;
        const p1 = polar(a, R - 12);
        const p2 = polar(a, R - (major ? 40 : half ? 28 : 20));
        const lp = polar(a, R - 68);
        return (
          <g key={t}>
            <line
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={red ? "#ff4a3d" : "var(--color-fg)"}
              strokeOpacity={major ? 0.85 : 0.4}
              strokeWidth={major ? 5 : 2}
            />
            {major ? (
              <text
                x={lp.x}
                y={lp.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={red ? "#ff4a3d" : "var(--color-fg)"}
                fillOpacity={red ? 0.95 : 0.75}
                className="font-sans text-[34px] font-semibold"
              >
                {t}
              </text>
            ) : null}
          </g>
        );
      })}
      {caption}
      <g ref={needleRef} transform={needleStyle ? undefined : `rotate(${START} ${C} ${C})`} style={needleStyle}>
        <path d={`M ${C - 6} ${C + 16} L ${C - 2} ${C - R + 30} L ${C + 2} ${C - R + 30} L ${C + 6} ${C + 16} Z`} fill="var(--color-brand)" />
      </g>
      <circle cx={C} cy={C} r="20" fill="var(--color-surface)" stroke="var(--color-line)" strokeWidth="2" />
    </svg>
  );
}
