"use client";

import { Power } from "lucide-react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const MAX_RPM = 8;
const IDLE = 0.9;
const TICKS = Array.from({ length: MAX_RPM + 1 }, (_, i) => i);

/**
 * A small horizontal tachometer. It revs once on load; "Engine start" revs it again.
 */
export function RevMeter() {
  const reduce = useReducedMotion();
  const rpm = useMotionValue(reduce ? IDLE : 0);
  const width = useTransform(rpm, (v) => `${(v / MAX_RPM) * 100}%`);
  const readout = useTransform(rpm, (v) => (v * 1000).toFixed(0).padStart(4, "0"));
  const [running, setRunning] = useState(false);

  const rev = () => {
    if (reduce) {
      rpm.set(IDLE);
      return;
    }
    setRunning(true);
    animate(rpm, [rpm.get(), 7.4, 6.2, 7.8, IDLE], {
      duration: 1.8,
      times: [0, 0.32, 0.45, 0.62, 1],
      ease: "easeInOut",
    }).then(() => setRunning(false));
  };

  // Rev once on mount only.
  useEffect(() => {
    const t = setTimeout(rev, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full max-w-md items-center gap-4">
      <button
        type="button"
        onClick={rev}
        disabled={running}
        aria-label="Engine start: rev the tachometer"
        className={cn(
          "group grid size-12 shrink-0 place-items-center rounded-full border border-line bg-surface transition-[border-color,box-shadow] duration-300",
          "hover:border-brand hover:shadow-[0_0_18px_-4px_var(--color-brand)] disabled:cursor-default",
          running && "border-brand shadow-[0_0_18px_-4px_var(--color-brand)]",
        )}
      >
        <Power aria-hidden className={cn("size-5 text-muted-foreground transition-colors group-hover:text-brand", running && "text-brand")} />
      </button>

      <div className="flex-1" aria-hidden>
        <div className="mb-1.5 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>Engine start</span>
          <span>
            <motion.span className="tabular-nums text-fg">{readout}</motion.span> rpm
          </span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-surface-2">
          {/* redline zone */}
          <div className="absolute inset-y-0 right-0 w-[12.5%] bg-brand/20" />
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-fg/70 via-fg/90 to-brand"
            style={{ width }}
          />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[9px] text-muted-foreground/70">
          {TICKS.map((t) => (
            <span key={t} className={cn(t >= 7 && "text-brand/80")}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
