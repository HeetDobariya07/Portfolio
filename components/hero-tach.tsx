"use client";

import { useMotionValueEvent } from "motion/react";
import { useEffect, useRef } from "react";
import { MAX_RPM, useRpm } from "./rpm-context";
import { dialAngle, TACH, TachFace } from "./tach-face";

const rotate = (v: number) => `rotate(${dialAngle(v, 0, MAX_RPM)} ${TACH.C} ${TACH.C})`;

/**
 * Large, faint tachometer on the right of the hero. Its needle reads the shared rpm: it rests at
 * 0 with the engine off, cranks and holds cruise during a test drive, and climbs with scroll speed while idling.
 */
export function HeroTach() {
  const { rpm } = useRpm();
  const needle = useRef<SVGGElement>(null);

  useMotionValueEvent(rpm, "change", (v) => needle.current?.setAttribute("transform", rotate(v)));
  useEffect(() => {
    needle.current?.setAttribute("transform", rotate(rpm.get()));
  }, [rpm]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-1/2 -right-40 hidden w-[560px] -translate-y-1/2 opacity-60 [mask-image:linear-gradient(to_right,transparent,black_35%)] lg:block xl:-right-24"
    >
      <TachFace
        className="w-full"
        min={0}
        max={MAX_RPM}
        labelStep={1}
        redline={7}
        needleRef={needle}
        caption={
          <text x={TACH.C} y={TACH.C + 70} textAnchor="middle" fill="var(--color-fg)" fillOpacity="0.45" className="font-mono text-[14px] tracking-[0.3em]">
            ×1000 r/min
          </text>
        }
      />
    </div>
  );
}
