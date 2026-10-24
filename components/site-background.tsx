"use client";

import PixelBlast from "./PixelBlast";

/**
 * Fixed, full-viewport pixel field behind the whole page, in brand red on the night-black base.
 * Pointer events pass through; PixelBlast listens on window, so hover still works.
 */
export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-bg">
      <PixelBlast
        className="opacity-25"
        variant="square"
        pixelSize={2}
        color="#ff5a52"
        patternScale={2.6}
        patternDensity={1.1}
        softness={0.6}
        glow={0.11}
        twinkle={0.25}
        drift={0.2}
        hoverEffect="grow"
        enableRipples
        edgeFade={0.25}
        hoverRadius={70}
        transparent
      />
    </div>
  );
}
