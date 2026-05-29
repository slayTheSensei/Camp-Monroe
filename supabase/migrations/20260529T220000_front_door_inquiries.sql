-- ============================================================
-- Block A: Membership requests + Partner inquiries
-- Applied via Supabase MCP on 2026-05-29
-- ============================================================
-- Captures /request (membership) and /partner (partner inquiry)
-- form submissions, mirroring the host_inquiries / buyout_inquiries
-- pattern so the existing admin triage UX can be reused.
--
-- Status enum is identical to retreats so StatusPill renders unchanged.
-- Semantics: for membership, 'confirmed' = admitted to the club.
--            for partner,     'confirmed' = engagement formalized.
-- ============================================================

-- ----------------------------------------------------------------
-- membership_requests
-- ----------------------------------------------------------------
CREATE TABLE public.membership_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_at    timestamptz NOT NULL DEFAULT now(),
  name            text NOT NULL,
  email           text NOT NULL,
  chapter         text
                  CHECK (chapter IS NULL OR chapter IN ('mens','womens')),
  has_sponsor     boolean NOT NULL DEFAULT false,
  sponsor_name    text,
  note            text,
  status          text NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new','reviewing','hold','confirmed','declined')),
  priority_score  int,
  assigned_owner  text,
  admin_notes     text,
  hold_expires_at timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX membership_requests_status_idx     ON public.membership_requests (status);
CREATE INDEX membership_requests_submitted_idx  ON public.membership_requests (submitted_at DESC);
CREATE INDEX membership_requests_email_idx      ON public.membership_requests (email);

-- ----------------------------------------------------------------
-- partner_inquiries
-- ----------------------------------------------------------------
CREATE TABLE public.partner_inquiries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_at    timestamptz NOT NULL DEFAULT now(),
  name            text NOT NULL,
  organization    text,
  email           text NOT NULL,
  context         text
                  CHECK (context IS NULL OR context IN ('capital','heritage','press','community','other')),
  message         text,
  status          text NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new','reviewing','hold','confirmed','declined')),
  priority_score  int,
  assigned_owner  text,
  admin_notes     text,
  hold_expires_at timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX partner_inquiries_status_idx     ON public.partner_inquiries (status);
CREATE INDEX partner_inquiries_submitted_idx  ON public.partner_inquiries (submitted_at DESC);
CREATE INDEX partner_inquiries_email_idx      ON public.partner_inquiries (email);

-- ----------------------------------------------------------------
-- RLS — mirrors host_inquiries policies
-- ----------------------------------------------------------------
ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_inquiries   ENABLE ROW LEVEL SECURITY;

-- Anon INSERT (public form)
CREATE POLICY membership_requests_anon_insert
  ON public.membership_requests
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY partner_inquiries_anon_insert
  ON public.partner_inquiries
  FOR INSERT TO anon
  WITH CHECK (true);

-- Authenticated (admin) — full access
CREATE POLICY membership_requests_admin_all
  ON public.membership_requests
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY partner_inquiries_admin_all
  ON public.partner_inquiries
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- ----------------------------------------------------------------
-- Extend communications.inquiry_type to cover membership + partner
-- ----------------------------------------------------------------
ALTER TABLE public.communications
  DROP CONSTRAINT IF EXISTS communications_inquiry_type_check;

ALTER TABLE public.communications
  ADD CONSTRAINT communications_inquiry_type_check
  CHECK (inquiry_type IN ('host','buyout','membership','partner'));

COMMENT ON TABLE public.membership_requests IS
  'Front-door submissions from /request. Triaged through /admin/membership.';
COMMENT ON TABLE public.partner_inquiries IS
  'Front-door submissions from /partner. Triaged through /admin/partner-inquiries.';
