-- Customer-service guarantees: no two overlapping confirmed bookings, and
-- public calendar greys out held dates so prospects don't submit on them.

-- ============================================================================
-- Fix 1: DB-level exclusion constraint on bookings
-- Makes overlapping confirmed bookings physically impossible to insert,
-- regardless of code path (app, edge function, manual SQL, etc.).
-- ============================================================================
create extension if not exists btree_gist;

alter table bookings
  add constraint bookings_no_overlap
  exclude using gist (
    daterange(start_date, end_date, '[]') with &&
  );

-- ============================================================================
-- Fix 2: expose held date ranges to anon (dates only, no PII)
-- Used by the public AvailabilityCalendar so held dates render as unavailable
-- and prospects don't submit inquiries on dates already being finalized.
-- SECURITY DEFINER function: bypasses inquiry-table RLS but intentionally
-- returns only start/end dates, never identifying columns.
-- ============================================================================
create or replace function public.get_held_ranges()
returns table (start_date date, end_date date, inquiry_type text)
language sql
security definer
stable
set search_path = public
as $$
  select start_date, end_date, 'host'::text from host_inquiries where status = 'hold'
  union all
  select start_date, end_date, 'buyout'::text from buyout_inquiries where status = 'hold'
$$;

revoke all on function public.get_held_ranges() from public;
grant execute on function public.get_held_ranges() to anon, authenticated;
