# Caastor — Website v2

Production implementation of the **Caastor Website 2.0** design handoff (Claude Design bundle
`caastor-website-2-0`). A bilingual (EN/ES), light/dark marketing site built on the Caastor v2
design system — "Apple-inspired" tokens, the Citrus palette, Inter Tight + Instrument Serif.

The original handoff was an in-browser React + Babel prototype. This is a real **Vite + React**
build: dependencies are bundled (no CDN/Babel at runtime), the design-system primitives are a
proper React module, and every page is its own component.

## Stack

- **Vite 5** + **React 18**, **real-path routing** (History API, `vercel.json` SPA rewrite)
- **Motion** + **Lenis** for the animation layer (`src/motion/`)
- **Supabase** for the CMS + blog backend (optional — site falls back to bundled content)
- Design tokens (`src/styles/tokens.css`) and marketing styles (`src/styles/site.css`) carried over
  verbatim from the design system — they are the source of truth for the visuals.

## Run

```bash
npm install
npm run dev      # dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## CMS + Blog (Supabase)

Content (texts, plans, logos) and the blog are editable from a private **`/admin`** panel
(magic-link login). The site reads live content from Supabase and **falls back to bundled
`content.js`** when Supabase isn't configured or is unreachable — so it always renders.

**→ Setup is in [`SUPABASE-SETUP.md`](SUPABASE-SETUP.md)** (create project → run `supabase/schema.sql`
→ add 2 env vars). ~10 minutes, free tier.

## What's implemented

All 6 marketing pages (Home section order preserved), plus a block-based **Blog** and the **Admin** CMS:

| Page | Route | File |
| --- | --- | --- |
| Home | `/` | `src/pages/Home.jsx` |
| Services | `/services` | `src/pages/Services.jsx` |
| Pricing | `/pricing` | `src/pages/Pricing.jsx` |
| About Us | `/about-us` | `src/pages/About.jsx` |
| Contact | `/contact-us` | `src/pages/Contact.jsx` |
| FAQ | `/faq` | `src/pages/Faq.jsx` |
| Blog | `/blog`, `/blog/:slug` | `src/pages/Blog.jsx`, `src/pages/BlogPost.jsx` |
| Admin (CMS) | `/admin` | `src/admin/AdminApp.jsx` |

**Features carried over from the brief / design chat:**
- **EN / ES toggle** in the header (persisted to `localStorage`). Copy is verbatim from the
  bilingual build brief (`src/content.js`).
- **Light + Dark theme** toggle (persisted). Citrus palette (`data-palette="citrus"`).
- **Pilot CTA** — `Start a risk-free pilot` is the primary closing CTA (`FinalCTA`).
- Scroll-reveal animations, sticky glass header, hero colour blobs, animated FAQ accordion,
  pricing cards with the "Most popular" ring on Growth, working contact + newsletter forms.

## Structure

```
src/
├── main.jsx               # entry — mounts App, imports tokens + site CSS
├── App.jsx                # theme/lang state + hash routing
├── content.js             # bilingual EN/ES copy (CONTENT export)
├── ds/components.jsx       # design-system primitives (Icon, Button, Card, Badge, Avatar, …)
├── components/
│   ├── shell.jsx           # Reveal, Eyebrow, SectionHead, Header, Footer, route maps
│   ├── FinalCTA.jsx        # shared closing CTA band
│   └── Faq.jsx             # shared accordion (FAQList)
├── pages/                  # one component per route
└── styles/
    ├── tokens.css          # v2 design tokens (verbatim)
    └── site.css            # marketing-layer styles (verbatim)
public/assets/              # logos, mascots, profile photos (from the brand kit)
```

## Notes

- Fonts are the Google Fonts web alternates the design system standardises on (Inter Tight,
  Instrument Serif, Geist Mono). The paid brand face (ABC Favorit) is not shipped.
- EUR prices are the suggested values from the brief; the pilot CTA is wired as the primary
  closing action per the design decision.
- Forms are front-end only (no backend) — they validate and show a success state.
