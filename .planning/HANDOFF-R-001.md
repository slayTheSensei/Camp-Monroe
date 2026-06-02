# Claude Code Handoff -- R-001 Retreats Pipeline

Copy everything below the ---- line into Claude Code when you open the `builds/camp-monroe-website/` directory to kick off implementation.

---

## Directive

Implement **R-001: Retreats Pipeline** -- a pre-launch booking system for Camp Monroe retreat hosts and STR prospects, built as a native feature inside this Next.js + Supabase admin dashboard.

## Read First

1. This build's scope + conventions: `./CLAUDE.md`
2. The full spec (the contract for this work): `../../camp-monroe-vault/specs/SPEC-RETREATS-PIPELINE.md`
3. The locked decisions behind it: `../../camp-monroe-vault/DECISION-LOG.md` (entries DL-001 through DL-005)
4. The current session state: `../../camp-monroe-vault/SESSION-STATE.md`

The spec contains the full data model, file list, acceptance criteria, and step-by-step implementation order. Read it before writing any code. Do not summarize -- read it.

## Summary of the Work

Extend the existing admin (`src/app/admin/(dashboard)/`) with a new `Retreats` module and add two public pages. Net-new:

1. **Supabase migration** -- 5 new tables (`open_windows`, `host_inquiries`, `str_inquiries`, `bookings`, `communications`) with indexes and RLS policies. First migration in the project; create `supabase/migrations/20260415000001_retreats_pipeline.sql`.
2. **Shared lib** -- `src/lib/types/retreats.ts`, `src/lib/data/retreats.ts` (follow the `mapRow()` pattern used in `src/lib/data/` for existing modules), `src/lib/pipeline/conflicts.ts`, `src/lib/pipeline/holds.ts`.
3. **Transactional email** -- Resend client (`src/lib/email/resend.ts`), 5 React Email templates (`src/lib/email/templates/*.tsx`), high-level senders (`src/lib/email/send.ts`). Each sender inserts a `communications` row after sending.
4. **PDF generation** -- `@react-pdf/renderer` component for booking confirmation summary. Upload to a new Supabase Storage bucket `booking-pdfs`. Admin gets signed URL.
5. **Admin server actions** -- `src/app/admin/(dashboard)/retreats/actions.ts` with: `placeHold`, `releaseHold`, `confirmBooking`, `declineInquiry`, `sendCommunication`, `updateInquiryField`.
6. **Admin UI** -- Inbox page (tabbed by status), inquiry detail (tabbed editor modeled on `ExperienceForm.tsx`), calendar month grid, Open Windows editor. All under `src/app/admin/(dashboard)/retreats/` and `src/components/admin/retreats/`.
7. **Public pages** -- `/host-a-retreat` and `/stay-at-camp`. Each has Hero + Open Windows list (shared component, filtered by window_type) + inquiry form (client component, direct Supabase insert per existing RLS pattern, fires post-submit API route for email fan-out).
8. **Scheduled edge function** -- `supabase/functions/expire-holds/index.ts`. Moves expired holds back to `reviewing`. Daily at 07:00 UTC. Choose Supabase pg_cron or Vercel Cron and document the choice.
9. **Admin sidebar** -- add `Retreats` nav item to `src/components/admin/AdminSidebar.tsx` between Experiences and Waitlist.
10. **Public top nav** -- add links to `/host-a-retreat` and `/stay-at-camp` in `Nav.tsx` + `NavClient.tsx`.

## Implementation Order

Follow the 18-step order in the spec's "Implementation Order" section. Each step ends with a working, committable state. Run `npm run build` and lint after each. The steps are:

1. Migration + apply to Supabase.
2. Install deps + env vars (Vercel + .env.local).
3. Types + data layer.
4. Email stack.
5. PDF stack + Storage bucket.
6. Conflicts + holds pipeline logic (with unit tests on overlap detection).
7. Server actions.
8. Admin inbox.
9. Admin inquiry detail (largest step).
10. Open Windows editor.
11. Admin calendar view.
12. Sidebar integration + regression smoke test on existing admin modules.
13. Public pages.
14. Post-submit email API route.
15. Public nav integration + smoke test.
16. Scheduled edge function.
17. E2E test pass (host and STR flows).
18. README + CLAUDE updates.

## Key Technical Details (easy to miss)

- **Deployment guardrail:** Never `git push` or `vercel deploy` without Kyle's explicit permission. See `./CLAUDE.md`. Commits are fine; pushes are not.
- **New env vars:** `RESEND_API_KEY`, `RESEND_FROM_ADDRESS` (default `retreats@monroemaine.com`), `ADMIN_ALERT_RECIPIENTS` (comma-separated). Add to `.env.local` and to Vercel **Project Settings -> Environment Variables** before running email-sending code locally or in production.
- **Resend DNS:** `retreats@monroemaine.com` needs TXT/CNAME records at the domain registrar before first send. Flag this to Kyle when you reach Step 4. Do not attempt to configure DNS yourself.
- **Supabase migration application:** the migration should be applied via `supabase db push` or the Supabase dashboard SQL editor. Do not run it directly on prod without confirming with Kyle. Test locally first if a local Supabase is available.
- **RLS is critical:** `host_inquiries`, `str_inquiries` allow public INSERT (unauthenticated forms submit directly). They must NOT allow public SELECT. `communications` is admin-only. `bookings` allows public SELECT (so the public page can compute booked-out windows) but only expose `start_date`/`end_date` client-side; do not SELECT * in client queries.
- **Conflict detection:** The overlap algorithm (`pipeline/conflicts.ts`) needs to return conflicts with both holds and confirmed bookings. Standard interval overlap: `!(end1 < start2 || end2 < start1)`. Write 6+ unit tests covering: exact match, partial overlap (both directions), contained-within, adjacent (not overlapping), exclude-self when editing.
- **Priority over STR:** When a host inquiry is confirmed, the UI must visually flag any STR inquiry (not just hold, but even "reviewing") whose dates overlap the new booking. Do not auto-decline or auto-release the STR. Admin must act manually. Implement this as a read-side query in the STR row render, not a write-side trigger.
- **Hold expiration:** Holds carry `hold_expires_at`. Inquiry detail shows relative countdown ("Expires in 3 days"). The edge function moves expired holds back to `reviewing` and clears `hold_expires_at` -- but does not send an email to the prospect (that's R-004 in the roadmap).
- **React 19 / Next 16 compatibility:** Confirm `react-day-picker` (v9+), `resend` (v4+), and `@react-pdf/renderer` (v4+) all work before committing to versions. If any have React 19 issues, stop and consult the spec + Decision Log before swapping.
- **Design tokens:** Use existing `forest`, `cream`, `amber`, `bark`, `font-display`. Do not introduce new colors or fonts. Every new component must pass a quick visual diff against the existing admin look.
- **Brand tone on public pages:** grounded, human, not luxury-coded. No "book now" urgency, no trust badges, no scarcity countdowns. Copy leans toward invitation and qualification, not conversion pressure.

## Acceptance Criteria

Acceptance criteria R001-01 through R001-18 are in the spec. Run the acceptance check after each major step where it applies. Step 17 is the full e2e pass -- before reaching that step, individual criteria can be verified incrementally.

## End-of-Session Protocol

When pausing for the day or hitting a stop point:

1. Commit any working state locally. Do not push.
2. Update `.planning/STATE.md` with current phase, plan, and blockers.
3. Do a drift check: any file changed today against the corresponding spec section. Flag any divergence in the vault if needed.
4. Update `../../camp-monroe-vault/SESSION-STATE.md` session notes to reflect progress.
5. If you made any build-time decisions that affect future phases, log them in `.planning/PROJECT.md` Key Decisions table (not the vault DECISION-LOG unless they rise to that level).

## If Something Feels Wrong

If while reading the spec or implementing you hit something that feels contradictory to a locked decision, stop. Do not silently work around it. Flag it -- either in the vault DECISION-LOG as a revision candidate, or directly to Kyle. The spec + decision log are contracts; any deviation needs explicit ratification.

---

*Spec v1.0 dated 2026-04-15. Handoff prompt generated 2026-04-15.*
