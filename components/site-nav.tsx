"use client";

import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { profile, sections } from "@/lib/content";

/**
 * Sticky top bar. Sections are shown as gear positions; the one in view is "engaged".
 */
export function SiteNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
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
        <a href="#top" className="flex items-center gap-2 font-mono text-sm font-semibold tracking-wider">
          <span aria-hidden className="size-2 rounded-full bg-brand shadow-[0_0_10px_var(--color-brand)]" />
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
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-mono text-xs transition-colors duration-200 sm:px-3",
                    engaged ? "bg-brand text-bg" : "text-muted-foreground hover:text-fg",
                  )}
                >
                  <span className="font-semibold">{s.gear}</span>
                  <span className="hidden md:inline">{s.label}</span>
                  <span className="sr-only md:hidden">{s.label}</span>
                </a>
              </li>
            );
          })}
        </ol>

        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-xs text-fg transition-colors hover:border-brand hover:text-brand sm:flex"
        >
          <FileText aria-hidden className="size-3.5" />
          Resume
        </a>
      </nav>
    </header>
  );
}
