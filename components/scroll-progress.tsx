"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/** Thin papaya line along the bottom edge of the header showing how far down the page you are. */
export function ScrollProgress() {
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-brand shadow-[0_0_8px_var(--color-brand)]"
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
    />
  );
}
