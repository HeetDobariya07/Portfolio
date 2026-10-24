import { ArrowUpRight, Award, Users } from "lucide-react";
import { BrandIcon } from "@/components/brand-icons";
import { ContactForm } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";
import { Gauge } from "@/components/gauge";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { RoadTimeline } from "@/components/road-timeline";
import { SectionHeading } from "@/components/section-heading";
import { SiteBackground } from "@/components/site-background";
import { SiteNav } from "@/components/site-nav";
import {
  about,
  certifications,
  experience,
  leadership,
  moreBuilds,
  profile,
  projects,
  SITE_URL,
  sections,
  skills,
  socials,
  stats,
} from "@/lib/content";

const gear = Object.fromEntries(sections.map((s) => [s.id, s])) as Record<
  (typeof sections)[number]["id"],
  (typeof sections)[number]
>;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: SITE_URL,
  jobTitle: profile.role,
  worksFor: { "@type": "Organization", name: "Serin Labs" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Pandit Deendayal Energy University" },
  sameAs: socials.map((s) => s.href),
};

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <SiteBackground />
      <SiteNav />

      <main id="main">
        <Hero />

        {/* 1 · About */}
        <section id="about" className="border-t border-line py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <SectionHeading gear={gear.about.gear} label={gear.about.label} title="Where backend engineering meets applied AI." />
            <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
              <div className="space-y-5 text-lg leading-relaxed text-pretty text-muted-foreground">
                {about.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <p className="border-l-2 border-brand pl-4 text-base">{about.offTheClock}</p>
              </div>
              <div className="grid grid-cols-2 content-start items-start gap-3 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((s) => (
                  <Gauge key={s.label} stat={s} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2 · Experience */}
        <section id="experience" className="border-t border-line py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <SectionHeading
              gear={gear.experience.gear}
              label={gear.experience.label}
              title="The road so far."
              intro="From internships to founding-team work on production AI."
            />
            <div className="max-w-3xl">
              <RoadTimeline roles={experience} />
            </div>
          </div>
        </section>

        {/* 3 · Projects */}
        <section id="projects" className="border-t border-line py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <SectionHeading
              gear={gear.projects.gear}
              label={gear.projects.label}
              title="Selected builds."
              intro="RAG systems, NLP tools and a little hardware."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((p) => (
                <ProjectCard key={p.name} project={p} />
              ))}
            </div>

            <h3 className="mt-20 mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">More from the garage</h3>
            <ul className="divide-y divide-line border-y border-line">
              {moreBuilds.map((b) => {
                const row = (
                  <>
                    <span className="font-medium text-fg">{b.name}</span>
                    <span className="text-sm text-pretty text-muted-foreground md:col-span-1">{b.summary}</span>
                    <span className="flex items-center justify-between gap-3 font-mono text-[11px] text-muted-foreground md:justify-end">
                      {b.stack}
                      {b.href ? (
                        <ArrowUpRight aria-hidden className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                      ) : (
                        <span className="size-4 shrink-0" />
                      )}
                    </span>
                  </>
                );
                const cls = "group grid gap-1 py-4 md:grid-cols-[1fr_1.6fr_1fr] md:items-center md:gap-6";
                return (
                  <li key={b.name}>
                    {b.href ? (
                      <a href={b.href} target="_blank" rel="noreferrer" className={`${cls} -mx-3 rounded-lg px-3 transition-colors hover:bg-surface`}>
                        {row}
                      </a>
                    ) : (
                      <div className={cls}>{row}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* 4 · Skills */}
        <section id="skills" className="border-t border-line py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <SectionHeading gear={gear.skills.gear} label={gear.skills.label} title="What's under the hood." />
            <dl className="grid gap-x-12 gap-y-8 md:grid-cols-2">
              {skills.map((g) => (
                <div key={g.group}>
                  <dt className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{g.group}</dt>
                  <dd className="flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <span key={s} className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm">
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-16 grid gap-4 md:grid-cols-[1.6fr_1fr]">
              <div className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <Award aria-hidden className="size-4 text-brand" /> Certifications
                </h3>
                <ul className="mt-4 space-y-3">
                  {certifications.map((c) => (
                    <li key={c.name} className="flex items-baseline justify-between gap-4 text-sm">
                      <span>
                        {c.name} <span className="text-muted-foreground">· {c.detail}</span>
                      </span>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">{c.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <Users aria-hidden className="size-4 text-brand" /> Leadership
                </h3>
                <p className="mt-4 text-sm">{leadership.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{leadership.org}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{leadership.period}</p>
              </div>
            </div>
          </div>
        </section>

        {/* N · Contact */}
        <section id="contact" className="border-t border-line py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <SectionHeading
              gear={gear.contact.gear}
              label={gear.contact.label}
              title="Let's take it for a spin."
              intro="Open to AI engineering roles, interesting projects and good conversations."
            />
            <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
              <ContactForm />
              <div className="space-y-6">
                <div>
                  <p className="mb-2 font-mono text-xs text-muted-foreground">Email</p>
                  <CopyEmail email={profile.email} />
                </div>
                <div>
                  <p className="mb-2 font-mono text-xs text-muted-foreground">Elsewhere</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {socials.map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 text-sm transition-colors hover:border-fg/30"
                        >
                          <BrandIcon name={s.icon} className="size-4 text-muted-foreground" />
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 font-mono text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <p>
            © {profile.name} · <span className="text-fg">Keep calm and redline on.</span>
          </p>
          <ul className="flex flex-wrap gap-4">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-fg">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="hover:text-fg">
                Resume
              </a>
            </li>
          </ul>
        </div>
      </footer>

      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD built from our own content
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
