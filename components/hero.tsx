import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { profile } from "@/lib/content";
import { LiveClock } from "./live-clock";
import { RevMeter } from "./rev-meter";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="relative mx-auto max-w-5xl px-4 md:px-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 font-mono text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          {profile.headline}
        </p>

        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl">
          {profile.name}
        </h1>
        <p className="mt-3 font-mono text-sm uppercase tracking-[0.25em] text-brand">{profile.role}</p>
        <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground md:text-xl">{profile.pitch}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            View my work <ArrowDown aria-hidden className="size-4" />
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:border-fg"
          >
            Resume <ArrowUpRight aria-hidden className="size-4" />
          </a>
          <a href="#contact" className="px-2 py-2.5 text-sm text-muted-foreground underline-offset-4 hover:text-fg hover:underline">
            Get in touch
          </a>
        </div>

        <div className="mt-14 flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <RevMeter />
          <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <MapPin aria-hidden className="size-3.5" />
            {profile.location} · <LiveClock timeZone={profile.timeZone} /> IST
          </p>
        </div>
      </div>
    </section>
  );
}
