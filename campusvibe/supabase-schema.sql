-- ================================================================
-- CampusVibe — Complete Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── AUTH USERS (CUSTOM JWT AUTH) ────────────────────────────────
create table if not exists public.users (
  id            uuid primary key default uuid_generate_v4(),
  email         text not null unique,
  password_hash text not null,
  full_name     text not null,
  university    text,
  roles         text[] not null default '{student}',
  email_verified boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_users_email on public.users(email);

-- ── PROFILES ──────────────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid references auth.users on delete cascade primary key,
  full_name    text,
  email        text,
  phone        text,
  university   text,
  avatar_url   text,
  bio          text,
  roles        text[]  not null default '{}',
  is_verified  boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and 'administrator' = any(p.roles)
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, roles)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    array['student']
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at before update on public.users
  for each row execute procedure public.set_updated_at();

-- ── NEWS ARTICLES ─────────────────────────────────────────────────
create table if not exists public.news_articles (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  slug         text not null unique,
  excerpt      text,
  content      text,
  category     text not null,
  author_id    uuid references public.profiles(id) on delete set null,
  author_name  text,
  image_url    text,
  is_featured  boolean not null default false,
  is_trending  boolean not null default false,
  is_published boolean not null default false,
  read_time    text,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.news_articles enable row level security;

drop policy if exists "Published articles are publicly readable" on public.news_articles;
create policy "Published articles are publicly readable"
  on public.news_articles for select
  using (is_published = true);

drop policy if exists "Admins can manage articles" on public.news_articles;
create policy "Admins can manage articles"
  on public.news_articles for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and 'administrator' = any(p.roles)
    )
  );

drop policy if exists "Contributors can manage their own articles" on public.news_articles;
create policy "Contributors can manage their own articles"
  on public.news_articles for all
  using (author_id = auth.uid());

create index if not exists idx_news_slug on public.news_articles(slug);
create index if not exists idx_news_published on public.news_articles(is_published, published_at desc);
create index if not exists idx_news_category on public.news_articles(category);

drop trigger if exists news_updated_at on public.news_articles;
create trigger news_updated_at before update on public.news_articles
  for each row execute procedure public.set_updated_at();

-- ── EVENTS ────────────────────────────────────────────────────────
create table if not exists public.events (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  slug            text not null unique,
  description     text,
  date            date not null,
  time            text,
  location        text,
  university      text,
  category        text not null,
  attendees_count int  not null default 0,
  is_featured     boolean not null default false,
  is_published    boolean not null default false,
  image_url       text,
  rsvp_url        text,
  organizer_id    uuid references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "Published events are publicly readable" on public.events;
create policy "Published events are publicly readable"
  on public.events for select
  using (is_published = true);

drop policy if exists "Admins can manage events" on public.events;
create policy "Admins can manage events"
  on public.events for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and 'administrator' = any(p.roles)
    )
  );

create index if not exists idx_events_slug on public.events(slug);
create index if not exists idx_events_date on public.events(date);
create index if not exists idx_events_published on public.events(is_published, date asc);

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at before update on public.events
  for each row execute procedure public.set_updated_at();

-- ── EVENT RSVPs ───────────────────────────────────────────────────
create table if not exists public.event_rsvps (
  id         uuid primary key default uuid_generate_v4(),
  event_id   uuid references public.events(id) on delete cascade not null,
  user_id    uuid references public.profiles(id) on delete cascade not null,
  name       text not null,
  email      text not null,
  created_at timestamptz not null default now(),
  unique(event_id, user_id)
);

alter table public.event_rsvps enable row level security;

drop policy if exists "Users can manage their own RSVPs" on public.event_rsvps;
create policy "Users can manage their own RSVPs"
  on public.event_rsvps for all
  using (user_id = auth.uid());

drop policy if exists "Admins can view all RSVPs" on public.event_rsvps;
create policy "Admins can view all RSVPs"
  on public.event_rsvps for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and 'administrator' = any(p.roles)
    )
  );

-- ── MEDIA ITEMS ───────────────────────────────────────────────────
create table if not exists public.media_items (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  slug         text not null unique,
  type         text not null check (type in ('video', 'podcast', 'photo')),
  duration     text,
  channel      text,
  views_count  int  not null default 0,
  image_url    text,
  media_url    text,
  is_featured  boolean not null default false,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.media_items enable row level security;

drop policy if exists "Published media is publicly readable" on public.media_items;
create policy "Published media is publicly readable"
  on public.media_items for select
  using (is_published = true);

drop policy if exists "Admins can manage media" on public.media_items;
create policy "Admins can manage media"
  on public.media_items for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and 'administrator' = any(p.roles)
    )
  );

create index if not exists idx_media_slug on public.media_items(slug);
create index if not exists idx_media_published on public.media_items(is_published, created_at desc);

drop trigger if exists media_updated_at on public.media_items;
create trigger media_updated_at before update on public.media_items
  for each row execute procedure public.set_updated_at();

-- ── MARKETPLACE LISTINGS ──────────────────────────────────────────
create table if not exists public.marketplace_listings (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  slug         text not null unique,
  description  text,
  price        numeric(12,2) not null,
  currency     text not null default 'TZS',
  category     text not null,
  condition    text not null check (condition in ('New', 'Like New', 'Very Good', 'Good', 'Fair')),
  seller_id    uuid references public.profiles(id) on delete set null,
  seller_name  text,
  university   text,
  image_url    text,
  images       text[] not null default '{}',
  is_sold      boolean not null default false,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.marketplace_listings enable row level security;

drop policy if exists "Published listings are publicly readable" on public.marketplace_listings;
create policy "Published listings are publicly readable"
  on public.marketplace_listings for select
  using (is_published = true and is_sold = false);

drop policy if exists "Sellers can manage their own listings" on public.marketplace_listings;
create policy "Sellers can manage their own listings"
  on public.marketplace_listings for all
  using (seller_id = auth.uid());

drop policy if exists "Admins can manage all listings" on public.marketplace_listings;
create policy "Admins can manage all listings"
  on public.marketplace_listings for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and 'administrator' = any(p.roles)
    )
  );

create index if not exists idx_marketplace_slug on public.marketplace_listings(slug);
create index if not exists idx_marketplace_published on public.marketplace_listings(is_published, is_sold, created_at desc);
create index if not exists idx_marketplace_seller on public.marketplace_listings(seller_id);
create index if not exists idx_marketplace_category on public.marketplace_listings(category);

drop trigger if exists marketplace_updated_at on public.marketplace_listings;
create trigger marketplace_updated_at before update on public.marketplace_listings
  for each row execute procedure public.set_updated_at();

-- ── CONTACT SUBMISSIONS ───────────────────────────────────────────
create table if not exists public.contact_submissions (
  id           uuid primary key default uuid_generate_v4(),
  full_name    text not null,
  email        text not null,
  organization text,
  interest     text not null,
  message      text not null,
  is_read      boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

drop policy if exists "Anyone can insert contact submissions" on public.contact_submissions;
create policy "Anyone can insert contact submissions"
  on public.contact_submissions for insert
  with check (true);

drop policy if exists "Admins can view contact submissions" on public.contact_submissions;
create policy "Admins can view contact submissions"
  on public.contact_submissions for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and 'administrator' = any(p.roles)
    )
  );

drop policy if exists "Admins can update contact submissions" on public.contact_submissions;
create policy "Admins can update contact submissions"
  on public.contact_submissions for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and 'administrator' = any(p.roles)
    )
  );

-- ── BREAKING NEWS ─────────────────────────────────────────────────
create table if not exists public.breaking_news (
  id          uuid primary key default uuid_generate_v4(),
  text        text not null,
  is_active   boolean not null default true,
  order_index int  not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.breaking_news enable row level security;

drop policy if exists "Active breaking news is publicly readable" on public.breaking_news;
create policy "Active breaking news is publicly readable"
  on public.breaking_news for select
  using (is_active = true);

drop policy if exists "Admins can manage breaking news" on public.breaking_news;
create policy "Admins can manage breaking news"
  on public.breaking_news for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and 'administrator' = any(p.roles)
    )
  );

-- ── PLATFORM STATS ────────────────────────────────────────────────
create table if not exists public.platform_stats (
  id         uuid primary key default uuid_generate_v4(),
  key        text not null unique,
  value      text not null,
  label      text not null,
  updated_at timestamptz not null default now()
);

alter table public.platform_stats enable row level security;

drop policy if exists "Stats are publicly readable" on public.platform_stats;
create policy "Stats are publicly readable"
  on public.platform_stats for select
  using (true);

drop policy if exists "Admins can manage stats" on public.platform_stats;
create policy "Admins can manage stats"
  on public.platform_stats for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and 'administrator' = any(p.roles)
    )
  );

-- ── COMPANY PROFILE & SOCIAL HANDLES ────────────────────────────
create table if not exists public.company_profile (
  id                    uuid primary key default uuid_generate_v4(),
  company_name          text not null default 'Campus Vibe',
  tagline               text,
  website_url           text,
  support_email         text,
  contact_phone         text,
  headquarters          text,
  registration_number   text,
  tax_number            text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create table if not exists public.company_social_handles (
  id            uuid primary key default uuid_generate_v4(),
  platform      text not null check (platform in ('x', 'instagram', 'youtube', 'linkedin', 'facebook', 'tiktok', 'whatsapp', 'telegram')),
  handle        text not null,
  url           text not null,
  is_active     boolean not null default true,
  display_order int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_company_social_order on public.company_social_handles(display_order, created_at);

alter table public.company_profile enable row level security;
alter table public.company_social_handles enable row level security;

drop policy if exists "Company profile is publicly readable" on public.company_profile;
create policy "Company profile is publicly readable"
  on public.company_profile for select
  using (true);

drop policy if exists "Admins can manage company profile" on public.company_profile;
create policy "Admins can manage company profile"
  on public.company_profile for all
  using (
    exists (
      select 1 from public.users u
      where u.id::text = auth.uid()::text and 'administrator' = any(u.roles)
    )
  );

drop policy if exists "Social handles are publicly readable" on public.company_social_handles;
create policy "Social handles are publicly readable"
  on public.company_social_handles for select
  using (true);

drop policy if exists "Admins can manage social handles" on public.company_social_handles;
create policy "Admins can manage social handles"
  on public.company_social_handles for all
  using (
    exists (
      select 1 from public.users u
      where u.id::text = auth.uid()::text and 'administrator' = any(u.roles)
    )
  );

drop trigger if exists company_profile_updated_at on public.company_profile;
create trigger company_profile_updated_at before update on public.company_profile
  for each row execute procedure public.set_updated_at();

drop trigger if exists company_social_handles_updated_at on public.company_social_handles;
create trigger company_social_handles_updated_at before update on public.company_social_handles
  for each row execute procedure public.set_updated_at();

-- ── CAMPUS REGISTRATION & VERIFICATION ───────────────────────────
create table if not exists public.campuses (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null,
  short_name          text,
  city                text,
  country             text not null default 'Tanzania',
  status              text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  verification_notes  text,
  contact_email       text,
  contact_phone       text,
  created_by          uuid references public.users(id) on delete set null,
  verified_by         uuid references public.users(id) on delete set null,
  verified_at         timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_campuses_status on public.campuses(status, created_at desc);
create index if not exists idx_campuses_name on public.campuses(name);

alter table public.campuses enable row level security;

drop policy if exists "Campuses are publicly readable" on public.campuses;
create policy "Campuses are publicly readable"
  on public.campuses for select
  using (true);

drop policy if exists "Admins can manage campuses" on public.campuses;
create policy "Admins can manage campuses"
  on public.campuses for all
  using (
    exists (
      select 1 from public.users u
      where u.id::text = auth.uid()::text and 'administrator' = any(u.roles)
    )
  );

drop trigger if exists campuses_updated_at on public.campuses;
create trigger campuses_updated_at before update on public.campuses
  for each row execute procedure public.set_updated_at();

-- ── WEBSITE VISITS & AUDIT LOGS ──────────────────────────────────
create table if not exists public.site_visits (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.users(id) on delete set null,
  visitor_token text,
  path          text not null,
  referrer      text,
  ip_address    text,
  user_agent    text,
  created_at    timestamptz not null default now()
);

create index if not exists idx_site_visits_created_at on public.site_visits(created_at desc);
create index if not exists idx_site_visits_path on public.site_visits(path);

create table if not exists public.audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  actor_id    uuid references public.users(id) on delete set null,
  actor_email text,
  action      text not null,
  entity_type text not null,
  entity_id   text,
  details     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);
create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);

alter table public.site_visits enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "Admins can view site visits" on public.site_visits;
create policy "Admins can view site visits"
  on public.site_visits for select
  using (
    exists (
      select 1 from public.users u
      where u.id::text = auth.uid()::text and 'administrator' = any(u.roles)
    )
  );

drop policy if exists "Service can insert site visits" on public.site_visits;
create policy "Service can insert site visits"
  on public.site_visits for insert
  with check (true);

drop policy if exists "Admins can view audit logs" on public.audit_logs;
create policy "Admins can view audit logs"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.users u
      where u.id::text = auth.uid()::text and 'administrator' = any(u.roles)
    )
  );

drop policy if exists "Service can insert audit logs" on public.audit_logs;
create policy "Service can insert audit logs"
  on public.audit_logs for insert
  with check (true);

-- ── STORAGE BUCKETS ───────────────────────────────────────────────
-- Run these in the Supabase Dashboard > Storage, or via API:

insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('marketplace-images', 'marketplace-images', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('event-images', 'event-images', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('news-images', 'news-images', true) on conflict do nothing;

-- Storage policies
drop policy if exists "Public media bucket read" on storage.objects;
create policy "Public media bucket read" on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "Authenticated upload to media" on storage.objects;
create policy "Authenticated upload to media" on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "Public avatars read" on storage.objects;
create policy "Public avatars read" on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users upload their own avatar" on storage.objects;
create policy "Users upload their own avatar" on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users update their own avatar" on storage.objects;
create policy "Users update their own avatar" on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Public marketplace images read" on storage.objects;
create policy "Public marketplace images read" on storage.objects for select
  using (bucket_id = 'marketplace-images');

drop policy if exists "Authenticated upload marketplace images" on storage.objects;
create policy "Authenticated upload marketplace images" on storage.objects for insert
  with check (bucket_id = 'marketplace-images' and auth.role() = 'authenticated');

drop policy if exists "Seller delete own marketplace images" on storage.objects;
create policy "Seller delete own marketplace images" on storage.objects for delete
  using (bucket_id = 'marketplace-images' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Public event images read" on storage.objects;
create policy "Public event images read" on storage.objects for select
  using (bucket_id = 'event-images');

drop policy if exists "Admins upload event images" on storage.objects;
create policy "Admins upload event images" on storage.objects for insert
  with check (bucket_id = 'event-images' and auth.role() = 'authenticated');

drop policy if exists "Public news images read" on storage.objects;
create policy "Public news images read" on storage.objects for select
  using (bucket_id = 'news-images');

drop policy if exists "Admins upload news images" on storage.objects;
create policy "Admins upload news images" on storage.objects for insert
  with check (bucket_id = 'news-images' and auth.role() = 'authenticated');

-- ── SEED DATA ─────────────────────────────────────────────────────
insert into public.platform_stats (key, value, label) values
  ('active_students', '12,400+', 'Active Students'),
  ('universities', '8', 'Universities'),
  ('events_per_year', '500+', 'Events Per Year'),
  ('daily_rides', '3,200+', 'Daily Rides')
on conflict (key) do nothing;

insert into public.breaking_news (text, is_active, order_index) values
  ('Welcome to CampusVibe — Tanzania''s #1 university super-app', true, 1),
  ('CampusVibe Awards 2026 nominations are now open — deadline April 1st', true, 2),
  ('New transport routes added for MUHAS and Ardhi campuses starting April 1st', true, 3),
  ('CampusVibe Marketplace is now live — buy, sell & trade on campus', true, 4)
on conflict do nothing;
