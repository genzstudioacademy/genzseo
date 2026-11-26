-- Run this entire script in Supabase Dashboard > SQL Editor.
create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  business_name text not null,
  category text,
  phone text,
  email text,
  website text,
  address text,
  city text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.business_profiles enable row level security;
drop policy if exists "Users can view own business profile" on public.business_profiles;
create policy "Users can view own business profile"
  on public.business_profiles for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own business profile" on public.business_profiles;
create policy "Users can insert own business profile"
  on public.business_profiles for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own business profile" on public.business_profiles;
create policy "Users can update own business profile"
  on public.business_profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete own business profile" on public.business_profiles;
create policy "Users can delete own business profile"
  on public.business_profiles for delete using (auth.uid() = user_id);


-- GENZ SEO website builder drafts. Run after the existing business_profiles schema.
create table if not exists public.generated_sites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  business_name text not null,
  category text,
  city text,
  phone text,
  email text,
  address text,
  website text,
  description text,
  tagline text,
  services jsonb not null default '[]'::jsonb,
  template text not null default 'modern',
  primary_color text not null default '#0d8067',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.generated_sites enable row level security;
drop policy if exists "Users can view own generated site" on public.generated_sites;
create policy "Users can view own generated site" on public.generated_sites
  for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own generated site" on public.generated_sites;
create policy "Users can insert own generated site" on public.generated_sites
  for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own generated site" on public.generated_sites;
create policy "Users can update own generated site" on public.generated_sites
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete own generated site" on public.generated_sites;
create policy "Users can delete own generated site" on public.generated_sites
  for delete using (auth.uid() = user_id);
