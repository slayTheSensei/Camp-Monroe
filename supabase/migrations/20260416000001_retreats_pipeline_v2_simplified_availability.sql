-- R-001 v2: Simplified availability model (DL-006, DL-007)
-- - Drop open_windows entirely
-- - Collapse host_inquiries date prefs to a single range; swap bucket -> raw int
-- - Rename str_inquiries -> buyout_inquiries (whole-camp semantics)
-- - Rename inquiry_type enum value 'str' -> 'buyout' on bookings + communications
-- - Add seasons (admin-managed operating periods) and blackouts (date blocks)
-- - Enforce 3-night minimum via CHECK constraints
-- Safe: all affected tables had 0 rows except open_windows (1 test row dropped).

-- ============================================================================
-- Drop Open Windows (retired)
-- ============================================================================
alter table host_inquiries drop column if exists linked_open_window_id;
alter table str_inquiries drop column if exists linked_open_window_id;
drop table if exists open_windows cascade;

-- ============================================================================
-- host_inquiries: collapse date prefs, bucket -> int
-- ============================================================================
alter table host_inquiries rename column pref_start_1 to start_date;
alter table host_inquiries rename column pref_end_1 to end_date;
alter table host_inquiries drop column pref_start_2;
alter table host_inquiries drop column pref_end_2;
alter table host_inquiries drop column pref_start_3;
alter table host_inquiries drop column pref_end_3;
alter table host_inquiries drop constraint host_inquiries_flexibility_check;
alter table host_inquiries drop column flexibility;
alter table host_inquiries drop constraint host_inquiries_group_size_bucket_check;
alter table host_inquiries drop column group_size_bucket;
alter table host_inquiries add column group_size integer;
alter table host_inquiries add constraint host_inquiries_date_order check (end_date >= start_date);
alter table host_inquiries add constraint host_inquiries_min_nights check (end_date >= start_date + 2);

-- ============================================================================
-- str_inquiries -> buyout_inquiries (whole-camp semantics)
-- ============================================================================
alter table str_inquiries rename to buyout_inquiries;

-- Rename constraints to match the new table name
alter table buyout_inquiries rename constraint str_inquiries_date_order to buyout_inquiries_date_order;
alter table buyout_inquiries rename constraint str_inquiries_affiliation_check to buyout_inquiries_affiliation_check;
alter table buyout_inquiries rename constraint str_inquiries_party_size_check to buyout_inquiries_party_size_check;
alter table buyout_inquiries rename constraint str_inquiries_purpose_of_stay_check to buyout_inquiries_purpose_of_stay_check;
alter table buyout_inquiries rename constraint str_inquiries_status_check to buyout_inquiries_status_check;

-- Add 3-night minimum
alter table buyout_inquiries add constraint buyout_inquiries_min_nights check (end_date >= start_date + 2);

-- Rebuild RLS policies for the renamed table
drop policy if exists str_inquiries_public_insert on buyout_inquiries;
drop policy if exists str_inquiries_admin_all on buyout_inquiries;
create policy buyout_inquiries_public_insert on buyout_inquiries for insert with check (true);
create policy buyout_inquiries_admin_all on buyout_inquiries for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================================
-- bookings: inquiry_type 'str' -> 'buyout', add 3-night check
-- ============================================================================
alter table bookings drop constraint bookings_inquiry_type_check;
update bookings set inquiry_type = 'buyout' where inquiry_type = 'str';
alter table bookings add constraint bookings_inquiry_type_check check (inquiry_type in ('host', 'buyout'));
alter table bookings add constraint bookings_min_nights check (end_date >= start_date + 2);

-- ============================================================================
-- communications: same inquiry_type rename
-- ============================================================================
alter table communications drop constraint communications_inquiry_type_check;
update communications set inquiry_type = 'buyout' where inquiry_type = 'str';
alter table communications add constraint communications_inquiry_type_check check (inquiry_type in ('host', 'buyout'));

-- ============================================================================
-- NEW: seasons (admin-curated operating periods)
-- ============================================================================
create table seasons (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  start_date date not null,
  end_date date not null,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id),
  constraint seasons_date_order check (end_date >= start_date)
);
create index on seasons (is_active, start_date);
alter table seasons enable row level security;
create policy seasons_public_read on seasons for select using (is_active = true);
create policy seasons_admin_all on seasons for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Seed main summer season
insert into seasons (label, start_date, end_date, is_active)
values ('Main Summer 2026', '2026-05-01', '2026-10-31', true);

-- ============================================================================
-- NEW: blackouts (internal events, member buyouts, other)
-- ============================================================================
create table blackouts (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date not null,
  category text not null check (category in ('internal_event', 'member_buyout', 'other')),
  label text not null,
  admin_notes text,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id),
  constraint blackouts_date_order check (end_date >= start_date)
);
create index on blackouts (start_date);
alter table blackouts enable row level security;
-- Public reads dates + label for the calendar; admin_notes stays hidden via client self-discipline
create policy blackouts_public_read on blackouts for select using (true);
create policy blackouts_admin_all on blackouts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
