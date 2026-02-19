-- Camp Monroe Waitlist Table
-- Run this in your Supabase SQL editor

create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null unique,
  trip_interest text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table waitlist enable row level security;

-- Allow anyone to insert (public waitlist signup)
create policy "Allow public inserts" on waitlist
  for insert with check (true);

-- Only allow authenticated users (admins) to read
create policy "Allow authenticated reads" on waitlist
  for select using (auth.role() = 'authenticated');
