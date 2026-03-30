# CampusVibe — Production Build
**Tanzania's #1 University Super-App** · [campusvibe.co.tz](https://campusvibe.co.tz)

---

## 🚀 Quick Start

### 1. Fix dynamic route directories (run once)
```bash
chmod +x setup.sh && ./setup.sh
```
This renames `slug/` → `[slug]/` and `role/` → `[role]/` for Next.js routing.

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials from the [Supabase Dashboard](https://supabase.com/dashboard).

### 4. Set up Supabase database
1. Go to your Supabase project → **SQL Editor**
2. Paste and run the contents of `supabase-schema.sql`
3. This creates all tables, RLS policies, storage buckets, and seed data

### 5. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Supabase Setup

### Required environment variables
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://campusvibe.co.tz
```

### Storage buckets (auto-created by SQL schema)
- `media` — Videos, podcasts, news images (public)
- `avatars` — User profile photos (public)
- `marketplace-images` — Listing photos (public)
- `event-images` — Event cover images (public)
- `news-images` — News article images (public)

### How to upload files to storage
In your Supabase dashboard → Storage, upload files to the appropriate bucket.
The public URL format is:
```
https://your-project.supabase.co/storage/v1/object/public/[bucket]/[filename]
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (custom) |
| Storage | Supabase Storage |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Hosting | Vercel |
| Validation | Zod |

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Root layout + SEO metadata
│   ├── sitemap.ts                  # Dynamic XML sitemap
│   ├── robots.ts                   # robots.txt
│   ├── not-found.tsx               # 404 page
│   ├── login/page.tsx              # Login (Supabase auth)
│   ├── register/page.tsx           # Registration
│   ├── auth/callback/route.ts      # Email verification callback
│   ├── news/
│   │   ├── page.tsx                # News listing
│   │   └── [slug]/page.tsx         # News article detail
│   ├── events/
│   │   ├── page.tsx                # Events listing
│   │   └── [slug]/page.tsx         # Event detail + RSVP
│   ├── marketplace/
│   │   ├── page.tsx                # Marketplace listing
│   │   └── [slug]/page.tsx         # Product detail
│   ├── media/page.tsx              # Media hub (TV + Podcasts)
│   ├── about/page.tsx              # About page
│   ├── get-involved/page.tsx       # Get Involved + contact form
│   ├── dashboard/
│   │   ├── page.tsx                # Role selector dashboard
│   │   └── [role]/page.tsx         # Role-specific dashboard
│   └── api/
│       ├── contact/route.ts        # Contact form API
│       └── auth/callback/          # Auth callback
├── components/
│   ├── home/
│   │   ├── Hero.tsx                # Animated hero (dark theme)
│   │   ├── BreakingNewsTicker.tsx  # Live news ticker
│   │   ├── NewsFeed.tsx            # Latest articles
│   │   ├── FeaturedEvents.tsx      # Upcoming events
│   │   ├── MediaHighlights.tsx     # Videos + Podcasts
│   │   ├── MarketplacePreview.tsx  # Latest listings
│   │   └── GetInvolvedCTA.tsx      # CTA section
│   ├── layout/
│   │   ├── Navbar.tsx              # Server component (auth-aware)
│   │   ├── NavbarClient.tsx        # Interactive navbar
│   │   ├── Footer.tsx              # Footer with links
│   │   └── LayoutProvider.tsx      # Conditional layout wrapper
│   └── ui/
│       └── AnimatedSection.tsx     # Scroll-triggered animations
├── lib/
│   ├── auth/actions.ts             # Login/register/logout server actions
│   └── supabase/
│       ├── client.ts               # Browser Supabase client
│       └── server.ts               # Server + admin Supabase clients
├── middleware.ts                   # Auth guard + session refresh
└── types/
    └── database.ts                 # Full TypeScript types for all tables
```

---

## 🔐 Authentication Flow

1. User visits `/login` or `/register`
2. Supabase Auth handles credentials (email + password)
3. On register: email verification sent → user clicks link → `/auth/callback`
4. Session stored in cookies via `@supabase/ssr`
5. `middleware.ts` protects `/dashboard/*` routes
6. Server Components read user via `createClient().auth.getUser()`

---

## 🎯 Role System

Roles are stored as a `text[]` array on the `profiles` table.
Supported roles: `administrator`, `ambassador`, `student`, `driver`, `restaurant-owner`, `delivery`

To assign roles to a user (admin action in Supabase):
```sql
UPDATE profiles SET roles = array_append(roles, 'administrator') WHERE email = 'admin@campusvibe.co.tz';
```

---

## 🌐 Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Required environment variables in Vercel dashboard:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` → `https://campusvibe.co.tz`

**Custom domain:** In Vercel → Project Settings → Domains → Add `campusvibe.co.tz`

---

## 📊 SEO

- Dynamic `sitemap.xml` at `/sitemap.xml` — auto-generated from Supabase data
- `robots.txt` at `/robots.txt`
- Full OpenGraph + Twitter Card metadata on every page
- JSON-LD structured data on news articles, events, and marketplace listings
- `canonical` URLs set for all pages
- ISR (Incremental Static Regeneration) on all content pages

---

## 📝 Content Management

All content is managed through Supabase:

| Content | Table | Admin action |
|---------|-------|-------------|
| News articles | `news_articles` | Insert row with `is_published = true` |
| Events | `events` | Insert row with `is_published = true` |
| Media | `media_items` | Insert row with `is_published = true` |
| Marketplace | `marketplace_listings` | Sellers post via app |
| Breaking news | `breaking_news` | Insert row with `is_active = true` |
| Platform stats | `platform_stats` | Update `value` column |

---

## 📧 Contact

- **General:** info@campusvibe.co.tz
- **Advertising:** ads@campusvibe.co.tz
- **Editorial:** editor@campusvibe.co.tz
- **Director:** director@campusvibe.co.tz
- **Support:** support@campusvibe.co.tz
