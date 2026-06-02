# Camp Monroe Website — Build CLAUDE.md

This file scopes Claude Code sessions to the files and decisions relevant to this build. **Strategy, brand, and product decisions live in the vault, not in the code.** Read the vault first.

---

## Deployment Rules (Absolute)

**NEVER push to git or deploy without explicit permission from the user.**

Before running any of the following, always ask first and wait for a clear "yes" or "go ahead":
- `git push`
- `vercel deploy`
- Any command that triggers a CI/CD pipeline

This rule has no exceptions. Even if the work is complete and looks ready, always ask.

---

## Project Overview

Marketing and booking website for Camp Monroe, a historic Maine lakefront property (Lake Cobbosseecontee, West Gardiner), repositioning as a premier cultural retreat destination.

- **Repo:** github.com/slayTheSensei/Camp-Monroe
- **Live site:** https://www.monroemaine.com
- **Admin dashboard:** https://www.monroemaine.com/admin
- **Supabase project:** CGRC (id: hnnqplsggulxejnyegvw, region: us-east-2)
- **Vercel team:** team_7vhV4vC0Sk3kf5PxHtEJScgO

---

## Stack

- Next.js 16 (App Router, TypeScript)
- React 19
- Tailwind CSS v4
- Supabase (Postgres + Auth + Storage) via `@supabase/ssr` and `@supabase/supabase-js`
- Deployed via GitHub Actions -> Vercel CLI on push to `main`

---

## Vault Sources of Truth

For any architectural, brand, product, or scope question, read these vault files. **The vault wins if there's a conflict with the codebase.**

| Vault File | When to Read |
|------------|--------------|
| `../../camp-monroe-vault/SESSION-STATE.md` | Start of every session. Current status + locked decisions table. |
| `../../camp-monroe-vault/DECISION-LOG.md` | Whenever you're about to make an architectural choice. Understand *why* past decisions were made before contradicting them. |
| `../../camp-monroe-vault/ROADMAP.md` | Product feature tracking. What's next, what's deferred, what version we're on. |
| `../../camp-monroe-vault/CLAUDE.md` | Vault-level rules (formatting, cross-references, domain conventions). |
| `../../camp-monroe-vault/specs/SPEC-*.md` | Feature specs. Each spec is the contract for what to build. |
| `../../camp-monroe-vault/core-identity/` | Brand narrative, manifesto, mission, positioning when working on public-facing copy. |

**Critical locked decisions affecting this build (see DECISION-LOG for full reasoning):**

- DL-001: Features for the Camp Monroe operation live in this Next.js admin, not third-party tools (Airtable, Softr, Google-sheets-based).
- DL-002: Public calendar shows admin-curated state only. *(Revised by DL-006.)*
- DL-003: Retreats Pipeline V1 is pipeline + confirmation tooling. No contracts, deposits, or payments in V1. *(Refined by DL-007.)*
- DL-005: Approved net-new dependencies: `react-day-picker`, `resend`, `@react-pdf/renderer`, `@react-email/components`, `@react-email/render`. Additional deps added for the docsite: `react-markdown`, `remark-gfm`, `remark-directive`, `rehype-slug`, `rehype-highlight`, `gray-matter`, `unist-util-visit`. Do not swap any of these without updating the Decision Log first.
- **DL-006**: Availability model inverts. Public calendar computes from **seasons** (admin-editable operating periods) minus **blackouts** (admin-editable date blocks) minus **confirmed bookings**. The `open_windows` concept is retired. Held dates also grey out for public prospects via the `public.get_held_ranges()` SECURITY DEFINER function (returns dates only, no PII).
- **DL-007**: Simplified inquiry model. `str_inquiries` renamed to `buyout_inquiries` (whole-camp semantics). Single date range. Raw integer group size. 3-night minimum enforced at the DB via CHECK constraints. No-overlap on `bookings` physically guaranteed via `EXCLUDE USING gist` — no code path can produce two overlapping confirmed bookings.

---

## Key Code Conventions

- **Colors:** `forest` (dark green `#1a2e1a`), `cream` (off-white `#f5f0e8`), `amber` (gold `#d4a843`), `bark` (brown `#5c3d2e`). Defined in CSS `@theme`.
- **Font:** `font-display` (Georgia serif) for headings (uppercase), system sans for body.
- **Experience data:** lives in `src/data/experiences.ts` (seed) + `experiences` Supabase table.
- **Experience types:** defined in `src/types/experience.ts`.
- **Retreats data:** `src/lib/types/retreats.ts` + `src/lib/data/retreats.ts`. Tables: `host_inquiries`, `buyout_inquiries`, `bookings`, `communications`, `seasons`, `blackouts`. PDF storage: `booking-pdfs` Supabase Storage bucket (private).
- **Nav states:** transparent (top), forest bg (scrolled/homepage), cream bg (detail pages).
- **Mobile-first** responsive design with Tailwind breakpoints (sm/md/lg).
- **Database rows:** snake_case columns; map to camelCase via `mapRow()` helpers in `src/lib/data/*.ts`.
- **Types:** manual TypeScript types. No Zod, no generated types. Stay consistent with existing modules.
- **Admin auth guard:** `src/app/admin/(dashboard)/layout.tsx` does the server-side check + redirect. Middleware at `middleware.ts` handles session refresh. No per-route checks needed once you're inside the dashboard layout.
- **Admin page scaffold:** every admin page uses the shared primitives in `src/components/admin/ui/` — `PageHeader`, `PageBody`, `Section`, `StatCard`, `Card`, `Button`/`ButtonLink`, `EmptyState`. Do not hand-roll page headers, spacing, or buttons. The scaffolding enforces viewport-fixed sidebar + single content scroll region + consistent padding + max-w-7xl cap.
- **Form pattern:** client component with `useState` + dirty flag + `beforeunload` warning (see `ExperienceForm.tsx` for the canonical example). For anon-submittable public forms, generate a UUID client-side via `crypto.randomUUID()` and insert without `.select()` — anon has no SELECT policy on inquiry tables so RETURNING would fail.
- **Image uploads:** direct Supabase Storage uploads, public URL stored in DB. See `src/components/admin/ExperienceFormFields/Images.tsx`.
- **Admin guide / SOPs:** markdown lives in `docs/` as a categorized tree with YAML frontmatter. Rendered in-app at `/admin/help` via `react-markdown` + admonition directives + syntax highlighting. Adding a new topic = drop a `.md` file into `docs/sop/` or `docs/reference/`.

---

## Session Protocol

1. **Before writing any code:** read the relevant vault SPEC + SESSION-STATE + DECISION-LOG. The spec is the contract.
2. **Enter plan mode for tasks touching 3+ files or making architectural choices.**
3. **Increment by step.** Never build multiple steps in one pass. Commit after each step.
4. **Verify before marking done.** Tests pass (when present), the feature works when clicked through locally, and the spec's acceptance criteria are checked off. Screenshots for UI changes.
5. **End-of-session drift check.** Before updating SESSION-STATE.md, scan the SPEC sections you touched against the actual code. Flag any divergence.
6. **Sync back to the vault.** Update `../../camp-monroe-vault/SESSION-STATE.md` with session notes and any newly-locked or -unlocked decisions.

---

## GSD (Execution System)

This build uses `.planning/` with the Full-Stack Web profile. See `.planning/PROJECT.md` for the bootstrap reference. Do not run `/gsd:new-project` -- the vault is the project definition. GSD commands (`/gsd:plan-phase`, `/gsd:execute-phase`, `/gsd:verify-work`, etc.) are tools; they do not replace the vault.

When planning execution waves for R-001 or later features, validate each planned task against the locked decisions list before starting. If a plan would contradict a locked decision, flag it -- do not silently deviate.

---

## Local Development

```bash
npm install
npm run dev -- --port 3001
```

Local env (`.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3001
RESEND_API_KEY=<resend-key>                     # required for Retreats Pipeline
RESEND_FROM_ADDRESS=retreats@monroemaine.com    # verify DNS before sending
ADMIN_ALERT_RECIPIENTS=kyle@...,partner@...     # comma-separated
```

Open `http://localhost:3001` for the public site, `/admin/login` for the dashboard.

---

## Project Structure

```
builds/camp-monroe-website/
├── .planning/                        GSD execution state
├── docs/                             Team operating guide (in-app docsite source)
│   ├── getting-started.md
│   ├── sop/                          Standard operating procedures (10 articles)
│   └── reference/                    Calendar legend, email triggers, troubleshooting, etc.
├── src/
│   ├── app/
│   │   ├── admin/(auth)/             Login, update password
│   │   ├── admin/(dashboard)/        Authenticated admin pages
│   │   │   ├── page.tsx              Main dashboard
│   │   │   ├── experiences/
│   │   │   ├── retreats/             Inbox, calendar, seasons/*, blackouts/*, [type]/[id]
│   │   │   ├── waitlist/
│   │   │   ├── content/
│   │   │   ├── users/
│   │   │   └── help/                 In-app docsite (renders docs/*.md)
│   │   ├── api/retreats/post-submit/ Email fan-out on public form submit
│   │   ├── experiences/[slug]        Public experience detail
│   │   ├── host-a-retreat/           Public retreat inquiry page
│   │   ├── stay-at-camp/             Public whole-camp buyout inquiry page
│   │   └── page.tsx                  Public home
│   ├── components/
│   │   ├── admin/
│   │   │   ├── ui/                   Shared page primitives (PageHeader, Section, StatCard, Button, Card, EmptyState, PageBody)
│   │   │   ├── retreats/             Inquiry inbox, form, calendar, editors
│   │   │   ├── help/                 Markdown renderer, TOC, docs sidebar
│   │   │   └── AdminShell, AdminSidebar, ExperienceForm, WaitlistTable, SiteContentEditor, ...
│   │   ├── availability/             Public AvailabilityCalendar + legend
│   │   ├── host-retreat/             Public /host-a-retreat pieces
│   │   ├── stay-at-camp/             Public /stay-at-camp pieces
│   │   └── Nav, Hero, Mission, Story, Trips, Waitlist, Footer, ...
│   ├── data/                         Experience seed data
│   ├── lib/
│   │   ├── data/retreats.ts          Server queries + mapRow helpers
│   │   ├── types/retreats.ts         TypeScript types
│   │   ├── pipeline/                 Conflict detection, hold expiry
│   │   ├── email/                    Resend client + templates + senders
│   │   ├── pdf/                      BookingSummary + generate/upload helpers
│   │   ├── docs/                     Markdown loader for the in-app docsite
│   │   ├── availability.ts           Public availability computation
│   │   └── supabase.ts, supabase-server.ts, supabase-admin.ts, supabase-middleware.ts
│   └── types/                        TypeScript type definitions
├── supabase/
│   ├── migrations/                   (three migrations — R-001 v1, R-001 v2, no-overlap + held ranges)
│   └── functions/expire-holds/       Scheduled edge function (deployed, needs pg_cron schedule)
├── middleware.ts
├── next.config.ts
└── package.json
```

---

*Last Updated: 2026-04-16 (after R-001 v2 ship + admin refactor + docsite).*
