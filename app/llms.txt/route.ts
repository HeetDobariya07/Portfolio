import { about, certifications, experience, profile, projects, SITE_URL, skills, socials } from "@/lib/content";

// llms.txt (https://llmstxt.org): a plain Markdown summary of the site for LLMs and AI search.
// Built from lib/content.ts so it stays in sync; no request-time data, so it's prerendered.
export function GET() {
  const lines = [
    `# ${profile.name}`,
    "",
    `> ${profile.role} and ${profile.headline}. ${profile.pitch}`,
    "",
    "## About",
    "",
    ...about.paragraphs.map((p) => `- ${p}`),
    "",
    "## Experience",
    "",
    ...experience.flatMap((r) => [
      `### ${r.title}, ${r.company} (${r.period}, ${r.place})`,
      ...r.points.map((p) => `- ${p}`),
      "",
    ]),
    "## Projects",
    "",
    ...projects.flatMap((p) => {
      const link = p.live ?? p.href;
      return [
        link ? `### [${p.name}](${link}): ${p.tagline}` : `### ${p.name}: ${p.tagline}`,
        p.description,
        `Stack: ${p.stack.join(", ")}`,
        "",
      ];
    }),
    "## Skills",
    "",
    ...skills.map((g) => `- ${g.group}: ${g.items.join(", ")}`),
    "",
    "## Certifications",
    "",
    ...certifications.map((c) => `- ${c.name} (${c.detail}, ${c.date})`),
    "",
    "## Links",
    "",
    `- [Portfolio](${SITE_URL})`,
    `- [Resume](${SITE_URL}${profile.resumeUrl})`,
    `- Email: ${profile.email}`,
    ...socials.map((s) => `- [${s.label}](${s.href})`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
