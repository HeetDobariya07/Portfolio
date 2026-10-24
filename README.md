# Heet Dobariya · AI Engineer

A single-page portfolio built like a night drive: a carbon-fibre backdrop, tachometer hero, gear-shift navigation, a road-timeline career history, a diagnostic-scanner project browser and a garage-door skills reveal.

[Live site](https://heetdobariya.vercel.app) · [Resume](https://heetdobariya.vercel.app/Heet_Dobariya_Resume.pdf) · [GitHub](https://github.com/HeetDobariya07) · [LinkedIn](https://linkedin.com/in/heet-dobariya-30758a28a)

## Design direction

Dark-only graphite palette with a single papaya-orange accent (`#ff7a1a`). The car references stay in the interface — gauges, gear positions, asphalt, a garage shutter — rather than in the copy. Theme tokens live in `app/globals.css`; fonts are declared in `app/layout.tsx`.

## Features

- Interactive hero with engine start, test drive, rev meter and tachometer sharing one RPM state
- Gear-position navigation, About instrument cluster and scroll-driven experience road
- Projects presented as a diagnostic scanner with keyboard-accessible tabs
- Skills revealed behind a garage roller shutter
- Ask AI buttons for ChatGPT, Claude, Perplexity, Gemini (via Google AI Mode) and Grok, pre-filled with a review prompt that points at `/llms.txt`
- Contact form backed by a server action, Zod validation, Resend, a honeypot and a best-effort per-instance rate limit
- Metadata, Open Graph image, Person JSON-LD, sitemap, robots and an LLM-friendly `/llms.txt`
- Skip link, keyboard-friendly controls and `prefers-reduced-motion` fallbacks

## Tech stack

- **Framework:** Next.js 16 App Router, React 19, TypeScript 5
- **UI:** Tailwind CSS 4, shadcn/Base UI, Motion, Lucide
- **Forms:** Resend, Zod
- **Tooling and deploy:** Bun, ESLint, Vercel

## Getting started

Requires Node.js 20.9+ and Bun. Bun is pinned in `package.json`; npm and pnpm also work.

```bash
git clone https://github.com/HeetDobariya07/portfolio.git
cd portfolio
bun install
cp .env.example .env.local
bun dev
```

On PowerShell, copy the env file with `Copy-Item .env.example .env.local`. Then open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes* | Resend API key used by the contact form |
| `CONTACT_TO_EMAIL` | Yes* | Inbox that receives contact messages |
| `CONTACT_FROM_EMAIL` | No | Verified Resend sender; defaults to `Portfolio <onboarding@resend.dev>` |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL used by metadata, sitemap, robots and the AI prompt; defaults to `https://heetdobariya.vercel.app` |

\* Required for the contact form. The rest of the site builds and runs without them.

## Scripts

| Command | Description |
| --- | --- |
| `bun dev` | Start the development server |
| `bun run build` | Create a production build |
| `bun start` | Serve the production build |
| `bun run lint` | Run ESLint |
| `bun run typecheck` | Type-check without emitting files |

There is no test suite yet.

## Project structure

```text
app/
  page.tsx                 Single-page layout and section composition
  layout.tsx               Metadata, fonts and theme
  actions/contact.ts       Contact form server action
  llms.txt/route.ts        Generated llms.txt
  opengraph-image.tsx      Social preview image
  robots.ts, sitemap.ts    Crawler metadata
components/                Page sections, dashboard widgets and UI primitives
lib/content.ts             All copy and structured data
public/
  Heet_Dobariya_Resume.pdf
  logos/ai/                AI assistant logos
```

## Editing content

- Update `lib/content.ts` for the profile, hero copy, about, experience, projects, skills, certifications, socials and section list.
- Replace `public/Heet_Dobariya_Resume.pdf` and keep `profile.resumeUrl` in sync.
- Change theme tokens in `app/globals.css` and fonts in `app/layout.tsx`.
- The Ask AI order lives in `components/ask-ai.tsx`; Gemini opens Google AI Mode because `gemini.google.com` does not support URL prompt prefill.
- Point `NEXT_PUBLIC_SITE_URL` at the deployed domain if it differs from the default.

## Deployment

1. Push the repository to GitHub.
2. Import it into Vercel and name the project `heetdobariya` to get `https://heetdobariya.vercel.app`.
3. Add the environment variables above to the Vercel project.
4. Deploy. Vercel detects Bun from `bun.lock`; no custom build settings are needed.

`NEXT_PUBLIC_SITE_URL` is inlined at build time, so redeploy after changing it.

## Copyright

© 2026 Heet Dobariya. All rights reserved.
