-- R-001 Retreats Pipeline
-- Creates 5 tables (open_windows, host_inquiries, str_inquiries, bookings, communications)
-- with indexes and RLS policies per SPEC-RETREATS-PIPELINE.md.
-- First migration in this project.

-- =============================================================================
-- open_windows
-- Admin-curated public availability layer. Public pages render blocks from here.
-- =============================================================================
create table open_windows (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date not null,
  window_type text not null check (window_type in ('host', 'str', 'both')),
  label text not null,
  description text,
  is_public boolean not null default true,
  sort_order integer not null default 0,
  notes text,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id),
  constraint open_windows_date_order check (end_date >= start_date)
);

create index on open_windows (is_public, start_date);

alter table open_windows enable row level security;

create policy "open_windows_public_read" on open_windows
  for select using (is_public = true);

create policy "open_windows_admin_all" on open_windows
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =============================================================================
-- host_inquiries
-- Primary demand capture. Up to 3 preferred date ranges per inquiry.
-- Public INSERT allowed (unauthenticated forms). Public SELECT denied.
-- =============================================================================
create table host_inquiries (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz default now(),

  -- Contact
  name text not null,
  organization text,
  email text not null,
  phone text,

  -- Retreat details
  retreat_concept text not null,
  audience_type text check (audience_type in ('wellness','creative','corporate','cultural','other')),
  group_size_bucket text check (group_size_bucket in ('8-12','12-16','16-24')),

  -- Date preferences (range #1 required, #2 and #3 optional)
  pref_start_1 date not null,
  pref_end_1 date not null,
  pref_start_2 date,
  pref_end_2 date,
  pref_start_3 date,
  pref_end_3 date,
  flexibility text check (flexibility in ('fixed','flexible')),

  -- Support
  support_needs text[],
  additional_notes text,

  -- Admin / pipeline
  status text not null default 'new'
    check (status in ('new','reviewing','hold','confirmed','declined')),
  priority_score integer check (priority_score between 1 and 5),
  assigned_owner uuid references auth.users(id),
  admin_notes text,
  hold_expires_at timestamptz,
  linked_open_window_id uuid references open_windows(id),

  created_at timestamptz default now()
);

create index on host_inquiries (status, submitted_at desc);
create index on host_inquiries (email);

alter table host_inquiries enable row level security;

create policy "host_inquiries_public_insert" on host_inquiries
  for insert with check (true);

create policy "host_inquiries_admin_all" on host_inquiries
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =============================================================================
-- str_inquiries
-- Secondary demand capture. Simpler fields.
-- Public INSERT allowed. Public SELECT denied.
-- =============================================================================
create table str_inquiries (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz default now(),

  name text not null,
  email text not null,
  start_date date not null,
  end_date date not null,
  party_size text check (party_size in ('1-2','3-4','5+')),
  purpose_of_stay text check (purpose_of_stay in ('personal','creative','friends','pre-retreat','other')),
  affiliation text check (affiliation in ('existing_member','new_member','prospective','none')),
  additional_notes text,

  status text not null default 'new'
    check (status in ('new','reviewing','hold','confirmed','declined')),
  admin_notes text,
  hold_expires_at timestamptz,
  linked_open_window_id uuid references open_windows(id),

  created_at timestamptz default now(),
  constraint str_inquiries_date_order check (end_date >= start_date)
);

create index on str_inquiries (status, submitted_at desc);

alter table str_inquiries enable row level security;

create policy "str_inquiries_public_insert" on str_inquiries
  for insert with check (true);

create policy "str_inquiries_admin_all" on str_inquiries
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =============================================================================
-- bookings
-- Confirmed bookings. Created when an inquiry moves to `confirmed`.
-- Public SELECT allowed so public pages can compute booked-out windows.
-- Clients must only select start_date/end_date. inquiry_id points to either
-- host_inquiries or str_inquiries (disambiguated by inquiry_type);
-- integrity enforced in application code.
-- =============================================================================
create table bookings (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null,
  inquiry_type text not null check (inquiry_type in ('host','str')),
  start_date date not null,
  end_date date not null,
  group_size integer,
  notes text,
  pdf_storage_path text,
  confirmed_at timestamptz default now(),
  confirmed_by uuid references auth.users(id),
  created_at timestamptz default now(),
  constraint bookings_date_order check (end_date >= start_date)
);

create index on bookings (inquiry_type, start_date);

alter table bookings enable row level security;

create policy "bookings_public_read" on bookings
  for select using (true);

create policy "bookings_admin_all" on bookings
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =============================================================================
-- communications
-- Nurture log. One row per outbound message (auto or manual).
-- Admin-only for all operations.
-- =============================================================================
create table communications (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null,
  inquiry_type text not null check (inquiry_type in ('host','str')),
  kind text not null
    check (kind in ('ack_email','review_email','hold_email','confirm_email','decline_email','manual_note')),
  sent_at timestamptz default now(),
  sent_by uuid references auth.users(id),
  subject text,
  body_preview text,
  resend_message_id text,
  created_at timestamptz default now()
);

create index on communications (inquiry_id, inquiry_type, sent_at desc);

alter table communications enable row level security;

create policy "communications_admin_all" on communications
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
