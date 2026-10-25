import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { intro, profile } from "@/lib/content";
import { AskAi } from "./ask-ai";
import { HeroTach } from "./hero-tach";
import { LiveClock } from "./live-clock";
import { RevMeter } from "./rev-meter";
import { RpmProvider } from "./rpm-context";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-dvh flex-col overflow-hidden pt-20 md:pt-24">
      <RpmProvider>
        <HeroTach />
        <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-3 md:px-6">
          <p className="font-mono text-sm tracking-[0.15em] text-muted-foreground uppercase">{intro.greeting}</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl">{profile.name}</h1>
          <p className="mt-5 max-w-2xl text-2xl font-medium tracking-tight text-balance text-fg md:text-3xl">
            {intro.lead} <span className="text-brand">{intro.highlight}</span>.
          </p>
          <p className="mt-4 max-w-xl text-lg text-pretty text-muted-foreground">{intro.detail}</p>

          <div className="mt-7">
            <AskAi />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              View my work <ArrowDown aria-hidden className="size-4" />
            </a>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:border-fg"
            >
              Resume <ArrowUpRight aria-hidden className="size-4" />
            </a>
            <a href="#contact" className="col-span-2 py-2 text-center text-sm text-muted-foreground underline-offset-4 hover:text-fg hover:underline sm:col-span-1 sm:px-2 sm:text-left">
              Get in touch
            </a>
          </div>

          <div className="mt-8 flex flex-col gap-6 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
            <RevMeter />
            <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <MapPin aria-hidden className="size-3.5" />
              {profile.location} · <LiveClock timeZone={profile.timeZone} /> IST
            </p>
          </div>
        </div>

        {/* scroll cue: a short stretch of road with a lane dash rolling down */}
        <a
          href="#about"
          className="group relative mx-auto mt-2 mb-6 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-fg"
        >
          <span className="relative h-10 w-6 overflow-hidden rounded-full border border-fg/30 group-hover:border-fg/60">
            <span className="absolute left-1/2 h-3 w-[3px] -translate-x-1/2 animate-[cue-drive_1.6s_ease-in-out_infinite] rounded-full bg-[#f2c14e] motion-reduce:top-3 motion-reduce:animate-none" />
          </span>
          Scroll
        </a>
      </RpmProvider>
    </section>
  );
}
