# Caastor CMS — Supabase setup (~10 minutes)

The site runs fine with **no** Supabase (it falls back to bundled content, and `/admin`
shows a setup notice). Do this when you want live editing + the blog.

## What you're hosting
| Piece | Where | Cost |
|---|---|---|
| Frontend (site + `/admin`) | **Vercel** — already deployed | Free hobby tier |
| Database + Auth + Storage + API | **Supabase** — one project | **Free tier** (500 MB DB, 1 GB files, 50k monthly users) — plenty |

No separate server. Supabase *is* the backend; the frontend talks to it directly and
Row Level Security keeps writes admin-only.

## Steps

### 1. Create a Supabase project
[supabase.com](https://supabase.com) → **New project**. Pick a region near your users. Wait for it to provision.

### 2. Create the schema
Supabase dashboard → **SQL Editor** → **New query** → paste all of
[`supabase/schema.sql`](supabase/schema.sql) → **Run**. This creates the tables, security
policies, and the `media` storage bucket.

### 3. Make yourself an admin
Still in the SQL Editor, run (with your email):
```sql
insert into public.admins (email) values ('you@caastor.co')
  on conflict (email) do nothing;
```

### 4. Allow the magic-link redirect
Dashboard → **Authentication → URL Configuration**:
- **Site URL:** `https://caastor-website-v2.vercel.app` (or your domain)
- **Redirect URLs — add both:**
  - `https://caastor-website-v2.vercel.app/admin`
  - `http://localhost:5173/admin`

(Email auth is on by default. The free built-in mailer is fine to start; for volume,
plug in an SMTP provider under Authentication → Emails.)

### 5. Grab your keys
Dashboard → **Settings → API**:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public key** → `VITE_SUPABASE_ANON_KEY`

(The anon key is meant to be public — RLS does the protecting. Never put the **service_role** key in the frontend.)

### 6. Add the keys to Vercel (and locally)
- **Vercel** → Project → **Settings → Environment Variables** → add both → **Redeploy**.
- **Local dev:** copy `.env.example` to `.env`, paste the same two values, `npm run dev`.

### 7. First sign-in + seed content
Visit `/admin` → enter your email → click the magic link in your inbox.
On the **Content** tab, hit **Save changes** once — that writes the current site copy into
the database so you can start editing. Done.

## Using the CMS
- **Content** — every text on the site, EN/ES tabs. Edit a field, **Save changes**.
- **Plans** — prices, features, CTA labels, the “Most popular” flag.
- **Logos** — add brand names or upload logo images; reorder/remove.
- **Blog** — create posts with the block editor (heading, text, image, gallery, quote,
  callout, code, CTA, embed, divider), set draft/published, EN/ES. Published posts appear
  at `/blog` and `/blog/<slug>`.

Edits are **live** — the site reads the latest content on load (no redeploy needed).

## Notes
- **Images** (logos, covers, blog) upload to the public `media` bucket and are served from Supabase's CDN.
- **SEO:** the site renders client-side. Google executes JS so posts get indexed, and each
  post sets its own `<title>`/description. If the blog becomes a major traffic channel, the
  next step up is server rendering (a Next.js migration) — not needed to launch.
