# Camp Monroe — Claude Guidelines

## Deployment Rules

**NEVER push to git or deploy without explicit permission from the user.**

Before running any of the following, always ask first and wait for a clear "yes" or "go ahead":
- `git push`
- `vercel deploy`
- Any command that triggers a CI/CD pipeline

This rule has no exceptions. Even if the work is complete and looks ready, always ask.

## Project Overview

Camp Monroe is a Next.js + Supabase landing page for an outdoor recreation business in Maine.

- **Repo:** github.com/slayTheSensei/Camp-Monroe
- **Live site:** camp-monroe.vercel.app
- **Supabase project:** CGRC (id: hnnqplsggulxejnyegvw, region: us-east-2)
- **Vercel team:** team_7vhV4vC0Sk3kf5PxHtEJScgO

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- Supabase JS client (lazy init pattern in `src/lib/supabase.ts`)
- Deployed via GitHub Actions → Vercel CLI on push to `main`

## Key Conventions

- Colors: `forest` (dark green), `cream` (off-white), `amber` (gold)
- Font: `font-display` for headings (uppercase), system sans for body
- All experience data lives in `src/data/experiences.ts`
- Experience types defined in `src/types/experience.ts`
- Nav has three states: transparent (top), forest bg (scrolled/homepage), cream bg (detail pages)
- Mobile-first responsive design with Tailwind breakpoints (sm/md/lg)
