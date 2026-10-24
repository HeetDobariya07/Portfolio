@AGENTS.md

# Portfolio: Heet Dobariya

Single-page portfolio (Next 16 App Router, React 19, Tailwind v4, bun). Read `AGENTS.md` first: this Next.js version differs from training data, so check `node_modules/next/dist/docs/` before using an API.

## Where things live
- All copy and data: `lib/content.ts`. Edit text there, not in components.
- Page: `app/page.tsx` (server component). Interactive pieces are small client components in `components/`.
- Contact form: `app/actions/contact.ts` (server action + Resend). Needs `RESEND_API_KEY` and `CONTACT_TO_EMAIL` (see `.env.example`).

## Design direction: "night drive"
- Dark only (`<html class="dark">`). Tokens are in `app/globals.css`: the site's own `bg`, `surface`, `surface-2`, `line`, `fg`, `brand` (racing red, the only accent), plus shadcn's semantic tokens (`background`, `foreground`, `muted-foreground`, `primary`, `border`, …) mapped onto the same palette. Use `text-muted-foreground` for secondary text and `brand` for red. Don't use shadcn's `accent`, which is a neutral hover background.
- Fonts: Merriweather (`font-heading`, applied to h1–h3 in base styles), Space Grotesk (`font-sans`, the default), Geist Mono (`font-mono`, small labels).
- UI primitives come from shadcn (`components/ui`, base-mira style, `cn` from `@/lib/utils`).
- Show the car passion through design elements only. Never say it in the copy ("car enthusiast", "about cars", "CAR" tags), the same way the reference sites show sports, trading or space without spelling it out.
- Car touches stay subtle: gear-shift nav, tachometer in the hero, speedometer stat gauges, road-line experience timeline, brake-light card hover. Don't add more car elements without asking.
- Every animation needs a `prefers-reduced-motion` fallback.

## Skills
Project skills are in `.claude/skills` (mirrored in `.agents/skills`, pinned in `skills-lock.json`). Useful ones: `design-taste-frontend`, `high-end-visual-design`, `review-animations`, `transitions-dev`, `vercel-react-best-practices`, `web-design-guidelines`, `react-doctor`, `seo-audit`.

## Checks
`bun run lint`, `bunx tsc --noEmit`, `bun run build`.
