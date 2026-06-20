-- ════════════════════════════════════════════════════════════════════
-- Caastor v2 — CMS schema (run once in Supabase → SQL Editor)
-- Tables: site_content (singleton JSON), blog_posts, admins
-- Security: Row Level Security. Public can READ published content;
-- only emails in `admins` can WRITE. The anon key is therefore safe
-- to expose in the frontend.
-- ════════════════════════════════════════════════════════════════════

-- ── Tables ──────────────────────────────────────────────────────────
create table if not exists public.site_content (
  id          int primary key default 1,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  constraint site_content_singleton check (id = 1)
);

create table if not exists public.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null,
  lang            text not null default 'en',
  status          text not null default 'draft',         -- draft | published
  title           text not null default 'Untitled',
  excerpt         text default '',
  cover_url       text default '',
  tags            text[] not null default '{}',
  author          text default '',
  blocks          jsonb not null default '[]'::jsonb,
  seo_title       text default '',
  seo_description text default '',
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (slug, lang)
);
create index if not exists blog_posts_pub_idx on public.blog_posts (status, lang, published_at desc);

create table if not exists public.admins (
  email text primary key
);

-- ── Admin check (SECURITY DEFINER so it can read `admins` past RLS) ──
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(auth.jwt() ->> 'email')
  );
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- ── Row Level Security ──────────────────────────────────────────────
alter table public.site_content enable row level security;
alter table public.blog_posts   enable row level security;
alter table public.admins       enable row level security;

-- site_content: anyone reads, admins write
drop policy if exists site_content_read  on public.site_content;
drop policy if exists site_content_write on public.site_content;
create policy site_content_read  on public.site_content for select using (true);
create policy site_content_write on public.site_content for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- blog_posts: public reads published, admins read/write everything
drop policy if exists posts_public_read on public.blog_posts;
drop policy if exists posts_admin_all   on public.blog_posts;
create policy posts_public_read on public.blog_posts for select using (status = 'published');
create policy posts_admin_all   on public.blog_posts for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- admins: a signed-in user may read only their own row (powers the gate)
drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins for select to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

-- ── Table-level grants (RLS still filters rows; grants unblock the role)
grant usage on schema public to anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant select on public.blog_posts  to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
grant insert, update, delete on public.blog_posts  to authenticated;
grant select on public.admins to authenticated;   -- anon must NOT read admins

-- ── Storage bucket for uploads (logos, covers, blog images) ─────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_public_read on storage.objects;
drop policy if exists media_admin_write on storage.objects;
drop policy if exists media_admin_update on storage.objects;
drop policy if exists media_admin_delete on storage.objects;
create policy media_public_read  on storage.objects for select using (bucket_id = 'media');
create policy media_admin_write  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());
create policy media_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());
create policy media_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ── Make yourself an admin (EDIT THIS EMAIL, then it's done) ────────
-- insert into public.admins (email) values ('you@caastor.co')
--   on conflict (email) do nothing;
