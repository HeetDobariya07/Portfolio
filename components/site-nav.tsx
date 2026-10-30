"use client";

import { Download } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { ScrollProgress } from "./scroll-progress";
import { cn } from "@/lib/utils";
import { profile, sections } from "@/lib/content";

/**
 * Sticky top bar. Sections are shown as gear positions; the one in view is "engaged".
 */
export function SiteNav() {
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    // #top is observed too, so scrolling back into the hero releases the highlight.
    const targets = ["top", ...sections.map((s) => s.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id === "top" ? null : entry.target.id);
        }
      },
      // A thin band across the middle of the viewport decides the active section.
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-bg/75 backdrop-blur-md">
      <nav
        aria-label="Sections"
        className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 md:px-6"
      >
        <a href="#top" className="group flex items-center gap-2 font-mono text-sm font-semibold tracking-wider transition-colors hover:text-brand">
          <span aria-hidden className="size-2 rounded-full bg-brand shadow-[0_0_10px_var(--color-brand)] transition-transform duration-200 motion-safe:group-hover:scale-150" />
          HD
          <span className="sr-only">{profile.name}, back to top</span>
        </a>

        <ol className="flex items-center gap-0.5 rounded-full border border-line bg-surface/80 p-1">
          {sections.map((s) => {
            const engaged = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={engaged ? "true" : undefined}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-mono text-xs transition-colors duration-200 sm:px-3",
                    engaged ? "text-bg" : "text-muted-foreground hover:bg-fg/5 hover:text-fg",
                  )}
                >
                  {/* the papaya pill glides between gears like a shifter */}
                  {engaged ? (
                    <motion.span
                      aria-hidden
                      layoutId="gear-pill"
                      className="absolute inset-0 rounded-full bg-brand"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
                    />
                  ) : null}
                  <span className="relative font-semibold">{s.gear}</span>
                  <span className="relative hidden md:inline">{s.label}</span>
                  <span className="sr-only md:hidden">{s.label}</span>
                </a>
              </li>
            );
          })}
        </ol>

        {/* Resume: the one solid call-to-action in the bar. Icon-only on phones. */}
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Resume (PDF)"
          title="Open resume (PDF)"
          className="group inline-flex size-9 shrink-0 items-center justify-center gap-2 rounded-full bg-brand font-mono text-xs font-semibold text-bg transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_var(--color-brand)] sm:size-auto sm:h-9 sm:px-4"
        >
          <Download aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-y-0.5" />
          <span className="hidden sm:inline">Resume</span>
        </a>
      </nav>
      <ScrollProgress />
    </header>
  );
}
