-- ============================================================
-- Block B1: New CMS surface for the new public copy
-- Applied via Supabase MCP on 2026-05-29
-- ============================================================
-- Three new tables and seed data. The old site_content table is preserved
-- untouched for legacy reference.
--   * page_content        — singular (page, block, field) → value lookup
--   * timeline_items      — ordered History timeline (CRUD + reorder)
--   * ways_to_partner_items — ordered Partner "ways to partner" grid
--
-- See the live applied migration for the full statement set.
-- ============================================================

CREATE TABLE public.page_content (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page        text NOT NULL,
  block       text NOT NULL,
  field       text NOT NULL,
  value       text NOT NULL DEFAULT '',
  type        text NOT NULL DEFAULT 'text'
              CHECK (type IN ('text','longtext','markdown','image_url','href')),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  uuid REFERENCES auth.users(id),
  UNIQUE (page, block, field)
);

CREATE INDEX page_content_page_idx ON public.page_content (page);
CREATE INDEX page_content_lookup_idx ON public.page_content (page, block, field);

CREATE TABLE public.timeline_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year        text NOT NULL,
  head        text NOT NULL,
  body        text NOT NULL,
  sort_order  int NOT NULL DEFAULT 0,
  is_visible  boolean NOT NULL DEFAULT true,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  uuid REFERENCES auth.users(id)
);

CREATE INDEX timeline_items_sort_idx ON public.timeline_items (sort_order, year);

CREATE TABLE public.ways_to_partner_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number      text NOT NULL,
  title       text NOT NULL,
  description text NOT NULL,
  sort_order  int NOT NULL DEFAULT 0,
  is_visible  boolean NOT NULL DEFAULT true,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  uuid REFERENCES auth.users(id)
);

CREATE INDEX ways_to_partner_items_sort_idx ON public.ways_to_partner_items (sort_order);

ALTER TABLE public.page_content        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ways_to_partner_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY page_content_public_read
  ON public.page_content FOR SELECT TO anon USING (true);
CREATE POLICY page_content_admin_all
  ON public.page_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY timeline_items_public_read
  ON public.timeline_items FOR SELECT TO anon USING (is_visible = true);
CREATE POLICY timeline_items_admin_all
  ON public.timeline_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY ways_to_partner_items_public_read
  ON public.ways_to_partner_items FOR SELECT TO anon USING (is_visible = true);
CREATE POLICY ways_to_partner_items_admin_all
  ON public.ways_to_partner_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed timeline_items + ways_to_partner_items + page_content with the
-- copy currently hardcoded in JSX. See the applied migration in the
-- supabase project for the full seed list.

COMMENT ON TABLE public.page_content IS
  'Editable singular copy fields keyed by (page, block, field). New site reads with hardcoded fallback.';
COMMENT ON TABLE public.timeline_items IS
  'Ordered History timeline items. Rendered on /history. Reorderable in admin.';
COMMENT ON TABLE public.ways_to_partner_items IS
  'Ordered Partner page "ways to partner" items. Rendered on /partner. Reorderable in admin.';
