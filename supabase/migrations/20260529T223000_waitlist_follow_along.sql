-- ============================================================
-- Block D: Repurpose waitlist as "Follow along"
-- Applied via Supabase MCP on 2026-05-29
-- ============================================================
-- The pre-redesign waitlist captured trip-interest signups. The new site
-- has no trip concept; instead it offers a "follow along" email capture
-- for the 2026 renovation reveal + women's chapter launch. Existing rows
-- preserved; flagged with source='legacy_trip' by the column DEFAULT.
-- ============================================================

-- Make name + trip_interest nullable so a follow-along signup
-- (email only) is valid.
ALTER TABLE public.waitlist ALTER COLUMN name DROP NOT NULL;
ALTER TABLE public.waitlist ALTER COLUMN trip_interest DROP NOT NULL;

-- Track where each signup came from.
ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'legacy_trip'
    CHECK (source IN ('legacy_trip','home_follow_along','renovation_reveal','womens_chapter','other'));

-- All existing rows are flagged 'legacy_trip' by the DEFAULT above.
CREATE INDEX IF NOT EXISTS waitlist_source_idx ON public.waitlist (source);
CREATE INDEX IF NOT EXISTS waitlist_created_idx ON public.waitlist (created_at DESC);

COMMENT ON COLUMN public.waitlist.source IS
  'Origin of the signup. legacy_trip = pre-redesign trip waitlist. home_follow_along = new front-door follow-along signup.';
