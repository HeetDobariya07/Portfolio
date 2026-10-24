"use client";

import { useEffect, useRef } from "react";

// 2×2 twill geometry. The weave repeats every 4×4 cells; each visible tow spans 2 cells.
const CELL = 7; // px, tow width
const N = 4;
const TILE = CELL * N;
const GAP = 0.35; // resin gap between tows

type Tow = { x: number; y: number; w: number; h: number; dir: "h" | "v" };

/**
 * Tows of a 2/2 twill: in row r the horizontal tow starts at column r; in column c the vertical
 * tow starts at row c + 1 (both mod 4). Tows that cross the tile edge are drawn twice so the
 * pattern wraps seamlessly.
 */
function twill(): Tow[] {
  const tows: Tow[] = [];
  for (let i = 0; i < N; i++) {
    const hx = (i % N) * CELL;
    const vy = ((i + 1) % N) * CELL;
    for (const dx of [0, -TILE]) tows.push({ x: hx + dx, y: i * CELL, w: CELL * 2, h: CELL, dir: "h" });
    for (const dy of [0, -TILE]) tows.push({ x: i * CELL, y: vy + dy, w: CELL, h: CELL * 2, dir: "v" });
  }
  return tows;
}

const TOWS = twill();

/**
 * Carbon-fibre background: an SVG 2×2 twill (rounded, lacquered tows with fibre striations and
 * anisotropic reflection: horizontal tows catch more light than vertical ones), fine resin grain,
 * a clear-coat sheen that drifts slightly with scroll, a brand spotlight and a vignette.
 */
export function CarbonBackdrop() {
  const sheen = useRef<HTMLDivElement>(null);

  // Clear-coat highlight slides a little as the page scrolls, like light moving across lacquer.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        sheen.current?.style.setProperty("--sheen", `${(p * 60 - 30).toFixed(2)}%`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-bg">
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Round bundle under lacquer: dark edges, bright core. Horizontal tows reflect more. */}
          <linearGradient id="cf-h" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0c0d10" />
            <stop offset="0.28" stopColor="#1f2226" />
            <stop offset="0.5" stopColor="#2c2f35" />
            <stop offset="0.72" stopColor="#1f2226" />
            <stop offset="1" stopColor="#0c0d10" />
          </linearGradient>
          <linearGradient id="cf-v" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0a0b0d" />
            <stop offset="0.28" stopColor="#17191d" />
            <stop offset="0.5" stopColor="#22252a" />
            <stop offset="0.72" stopColor="#17191d" />
            <stop offset="1" stopColor="#0a0b0d" />
          </linearGradient>
          {/* Fine fibre striations running along each tow. */}
          <pattern id="cf-fibre-h" width="4" height="1.2" patternUnits="userSpaceOnUse">
            <rect width="4" height="0.35" fill="#000" opacity="0.25" />
          </pattern>
          <pattern id="cf-fibre-v" width="1.2" height="4" patternUnits="userSpaceOnUse">
            <rect width="0.35" height="4" fill="#000" opacity="0.25" />
          </pattern>
          <pattern id="cf-twill" width={TILE} height={TILE} patternUnits="userSpaceOnUse">
            <rect width={TILE} height={TILE} fill="#08090b" />
            {TOWS.map((t) => (
              <g key={`${t.dir}-${t.x}-${t.y}`}>
                <rect
                  x={t.x + GAP}
                  y={t.y + GAP}
                  width={t.w - GAP * 2}
                  height={t.h - GAP * 2}
                  rx="1.2"
                  fill={`url(#cf-${t.dir})`}
                />
                <rect
                  x={t.x + GAP}
                  y={t.y + GAP}
                  width={t.w - GAP * 2}
                  height={t.h - GAP * 2}
                  rx="1.2"
                  fill={`url(#cf-fibre-${t.dir})`}
                />
              </g>
            ))}
          </pattern>
          {/* Resin grain. */}
          <filter id="cf-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#cf-twill)" />
        <rect width="100%" height="100%" filter="url(#cf-grain)" opacity="0.035" />
      </svg>

      {/* tone the weave down so it reads as a surface, not a pattern */}
      <div className="absolute inset-0 bg-bg/40" />

      {/* clear-coat sheen: a broad diagonal highlight plus a tighter glint, drifting with scroll */}
      <div
        ref={sheen}
        className="absolute inset-0 [--sheen:0%]"
        style={{
          backgroundImage:
            "linear-gradient(115deg, transparent calc(28% + var(--sheen)), rgba(255,255,255,0.045) calc(42% + var(--sheen)), rgba(255,255,255,0.075) calc(46% + var(--sheen)), rgba(255,255,255,0.03) calc(52% + var(--sheen)), transparent calc(64% + var(--sheen)))",
        }}
      />

      {/* brand spotlight from the top */}
      <div className="absolute inset-x-0 top-0 h-[80vh] bg-[radial-gradient(ellipse_55%_60%_at_50%_0%,color-mix(in_oklab,var(--color-brand)_14%,transparent),transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(ellipse_35%_40%_at_50%_0%,color-mix(in_oklab,var(--color-fg)_6%,transparent),transparent_70%)]" />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_75%_at_50%_40%,transparent_35%,color-mix(in_oklab,var(--color-bg)_90%,transparent)_100%)]" />
    </div>
  );
}
