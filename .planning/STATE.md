# Project State

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-04-15)

**Core value:** Capture, qualify, and confirm pre-launch retreat host + STR demand with a manual review loop and retreat-over-STR priority enforcement.
**Current focus:** R-001 Retreats Pipeline (Specced, ready for GSD plan-phase or direct execution).

## Vault Sync

- Vault: `../../camp-monroe-vault/SESSION-STATE.md`
- Last synced: 2026-04-15
- Rule: Sync on phase completion and session end. Vault is the cross-session source of truth; this file is the within-session source of truth.

## Current Position

- Phase: 0 of 1 (R-001 not started)
- Plan: 0 of 0
- Status: Ready to plan
- Last activity: 2026-04-15 -- Spec complete, build relocated into builds/, handoff prompt generated.

Progress: [----------] 0% of R-001

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: --
- Total execution time: 0 hours

## Accumulated Context

### Decisions

- Vault-level decisions: see vault DECISION-LOG.md entries DL-001 through DL-005.
- Build-level decisions: none yet (table in `.planning/PROJECT.md` is empty).

### Pending Todos

R-001 implementation steps 1-18 as defined in the spec. No deviations yet.

### Blockers/Concerns

- **Resend DNS setup:** `retreats@monroemaine.com` requires DNS records before first email send. Kyle owns.
- **Admin alert recipients env var:** `ADMIN_ALERT_RECIPIENTS` needs Kyle + partner emails before go-live.
- **Scheduled function mechanism:** Spec leaves the choice open between Supabase pg_cron and Vercel Cron Jobs. Implementer picks and documents.

## Session Continuity

- Last session: 2026-04-15 (Cowork, strategy mode -- not Claude Code)
- Stopped at: Spec + vault artifacts complete. Handoff prompt ready at `.planning/HANDOFF-R-001.md`.
- Resume file: Open Claude Code in `builds/camp-monroe-website/`, paste the contents of `.planning/HANDOFF-R-001.md` as the first prompt.
