# Camp Monroe Website -- GSD Project Reference

## Source of Truth

This project's requirements, decisions, and constraints live in the vault system. GSD provides execution scaffolding, not project definition.

- **Build instructions:** `../CLAUDE.md`
- **Vault home:** `../../camp-monroe-vault/HOME.md`
- **Vault session state:** `../../camp-monroe-vault/SESSION-STATE.md`
- **Vault decision log:** `../../camp-monroe-vault/DECISION-LOG.md`
- **Vault roadmap:** `../../camp-monroe-vault/ROADMAP.md`
- **Active spec:** `../../camp-monroe-vault/specs/SPEC-RETREATS-PIPELINE.md` (R-001)

## Core Value

Capture, qualify, and confirm pre-launch retreat host + STR demand with a manual review loop and retreat-over-STR priority enforcement -- so Camp Monroe enters its June 2026 go-live with real pipeline data and a controlled booking rhythm, not a flood of unqualified inquiries.

## Active Build Scope

**V1 (target June 2026 go-live):** R-001 Retreats Pipeline. Native admin module in the existing monroemaine.com Next.js app + two new public pages (`/host-a-retreat`, `/stay-at-camp`). See spec for the 18 acceptance criteria and 18 implementation steps.

## Constraints

Inherited from vault specs. Build-specific constraints not covered elsewhere:

- **Deployment:** Vercel CI triggers on push to `main`. **Never push without Kyle's explicit permission** (see build CLAUDE.md).
- **Browser support:** modern evergreens. No IE, no legacy Edge.
- **Mobile-first:** every public and admin page must work at 375px width.
- **React 19 / Next 16:** confirm any new dependency is compatible before installing.
- **Supabase project:** `hnnqplsggulxejnyegvw` (CGRC, us-east-2). Existing tables: `waitlist`, `experiences`, `site_content` + any implied by the admin modules. R-001 adds 5 new tables.

## Key Decisions (Build-Specific)

Vault-level decisions are tracked in the vault's DECISION-LOG.md. This table captures build-time decisions that don't rise to vault level but affect future GSD phases.

| Decision | Rationale | Phase |
|----------|-----------|-------|
| (none yet -- GSD execution of R-001 has not started) | | |

---
*Last updated: 2026-04-15 after R-001 spec completion and codebase relocation into builds/.*
