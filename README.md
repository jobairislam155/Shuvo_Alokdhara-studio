# Shuvo Alokdhara — Photography & Videography Studio

A cinematic, production-ready portfolio website for a photographer/videographer, built with
Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Supabase and Cloudinary.

The brand name **Shuvo Alokdhara** is a placeholder — see [Rebranding](#rebranding) to change it in one place.

## Table of Contents

1. [Quick Start (demo mode)](#quick-start-demo-mode)
2. [Installation](#installation)
3. [Environment Variables](#environment-variables)
4. [Supabase Setup](#supabase-setup)
5. [Database Schema](#database-schema)
6. [Cloudinary Setup](#cloudinary-setup)
7. [Adding Your Own Photos and Videos](#adding-your-own-photos-and-videos)
8. [Light / Dark Theme](#light--dark-theme)
9. [Mobile Responsiveness](#mobile-responsiveness)
10. [Local Development](#local-development)
11. [Production Build](#production-build)
12. [Vercel Deployment](#vercel-deployment)
13. [Admin Dashboard](#admin-dashboard)
14. [Rebranding](#rebranding)
15. [Project Structure](#project-structure)

---

## Quick Start (demo mode)

This project runs **out of the box with no configuration**. Every page falls back to bundled
demo content (`lib/data/*`) and generated placeholder artwork whenever Supabase or Cloudinary
aren't configured, so you can explore the full design and layout immediately:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The placeholder "photos" are generated duotone SVG plates, not stock photography — the site is
built so it never pretends to show real client work before you've connected real media.

## Installation

Requirements: Node.js 18.18+ (20+ recommended), npm.

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in what you have. Everything is optional in
development — the site works with none of it set (see Quick Start above).

```bash
cp .env.example .env.local
```

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Live content, admin dashboard | Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Live content, admin dashboard | Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin registration | Server-only. **Never** expose to the client |
| `ADMIN_SETUP_CODE` | Admin registration | A long secret you invent (20+ characters). Server-only |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Optimized image/video delivery | Cloudinary dashboard home |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Uploading photos/videos from the admin dashboard | Cloudinary dashboard. Server-only |
| `NEXT_PUBLIC_SITE_URL` | Correct SEO/OG URLs in production | e.g. `https://kaiasher.com` |

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the Project URL and `anon` public key into `.env.local`.
3. Run the schema (see below) against your project.
4. Add `SUPABASE_SERVICE_ROLE_KEY` (same page) and invent an `ADMIN_SETUP_CODE`, then open
   `/admin/register` to create the admin account (see [Admin Dashboard](#admin-dashboard)).
5. In Supabase, go to **Authentication → Sign In / Providers** and turn **off** "Allow new users to
   sign up". The admin is created by the server, so public sign-ups are not needed.
6. Restart `npm run dev` — the site and admin dashboard will now read/write live data.

## Database Schema

The full schema — tables, indexes, an `updated_at` trigger, and Row Level Security policies — is
in [`supabase/schema.sql`](./supabase/schema.sql). Run it in the **SQL Editor** in your Supabase
dashboard, or via the CLI:

```bash
supabase db push
```

Tables: `projects`, `project_media`, `reels` (videos), `services`, `testimonials`, `inquiries`, `admins`.

RLS policies (already in the schema):
- Public (anonymous) visitors can only **read published** projects/services/testimonials, and can
  **insert** inquiries (the booking form).
- Only the **admin** — the one account listed in the `admins` table — can read inquiries or write to
  any table. A signed-in user who is not in `admins` can do nothing.

If you ran an earlier version of this schema, run the file again: it is safe to re-run and it
replaces the old "any signed-in user" policies with the admin-only ones.

## Cloudinary Setup

**Already configured** in this project's `.env.local` with cloud name `ak6gupc4`. If you ever move
to a different Cloudinary account:

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Copy your **Cloud name** into `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in `.env.local`.
3. Upload photos/videos through the Cloudinary Media Library (or build an upload flow using your
   API key/secret — kept server-only, never sent to the browser).
4. Paste the resulting public ID or full URL into a project's cover/media fields (see the next
   section). `lib/cloudinary/index.ts` automatically applies `f_auto,q_auto` and responsive
   sizing — you don't need to hand-write transformation strings.

`.env.local` is in `.gitignore` — your API key and secret are never committed to git. Only the
cloud name (which is meant to be public, since it appears in every image URL) is exposed to the
browser via the `NEXT_PUBLIC_` prefix.

## Adding Your Own Photos and Videos

Your uploaded photo (public ID **`images_1`**) is already wired into three places as a working
example: the **homepage hero**, the **About page portrait**, and the first project's cover image
+ first gallery photo (`/projects/wedding-dhaka`) — open those pages to see it live.

There are two ways to add more:

### A. Without Supabase (edit the demo data directly)

This is the fastest path and works right now, with zero extra setup.

**For photos** — each project in `lib/data/projects.ts` has an `images` array. List your
Cloudinary public IDs there, in the order you want them to appear; the first one becomes the
cover photo automatically:

```ts
{
  title: 'Wedding — Sylhet Garden',
  slug: 'wedding-sylhet-garden',
  // ...
  images: ['sylhet-ceremony-01', 'sylhet-ceremony-02', 'sylhet-reception-01'],
},
```

Leave `images` out (or empty) to keep that project on placeholder art. To find a public ID:
open [Cloudinary Media Library](https://console.cloudinary.com/console/media_library), click an
uploaded asset, and copy the **Public ID** field (no file extension needed).

**For videos** — open `lib/data/reels.ts` and set a reel's `video_url`:

```ts
video_url: cldVideo('my-wedding-film'),
```

Save either file — the dev server hot-reloads automatically.

### B. With Supabase connected (recommended for production)

Once Supabase is set up (see above) and you're signed in at `/admin`:

1. Go to **Projects** → add a project, pasting a Cloudinary public ID or full URL into **Cover
   Image URL**.
2. Go to **Media** → pick the project, paste more image/video URLs to build out its gallery.
3. Everything publishes immediately — no code changes, no redeploy.

## Light / Dark Theme

The site ships with two themes, toggled by the sun/moon icon in the navbar (and in the mobile
menu): a **dark cinematic** theme (the original design, and the default for new visitors) and a
**light editorial** theme (warm ivory background, deepened brass accent for contrast).

The whole site is theme-aware from one place — every color in `tailwind.config.ts` reads a CSS
variable defined in `app/globals.css` (`:root` for dark, `:root[data-theme="light"]` for light) —
so no component needs theme-specific code. A visitor's choice is saved to `localStorage` and
restored instantly on their next visit (a small inline script in `app/layout.tsx` applies it
before the page paints, so there's no flash of the wrong theme).

Photos and videos never change with the theme — real photography sits fine on either background,
the same way it would in print.

## Mobile Responsiveness

Every layout was already built mobile-first (stacking grids, a full-screen mobile nav, a
touch-friendly before/after slider, swipeable lightbox), and this pass added a few polish fixes
specifically for smoothness on phones:

- Form inputs use 16px text on mobile — anything smaller triggers iOS Safari's
  auto-zoom-on-focus, which feels janky.
- Tap targets (menu button, etc.) meet the ~44px minimum recommended touch size.
- Removed the grey flash-on-tap highlight and the ~300ms double-tap delay on links/buttons
  (`touch-action: manipulation`), so taps feel instant.
- `overflow-x: hidden` on `<html>` as a safety net against any full-bleed section ever causing a
  horizontal scrollbar.
- The About page's sticky portrait image is now explicitly desktop-only, avoiding any odd
  scroll-jacking feel on mobile.

## Local Development

```bash
npm run dev      # start the dev server
npm run lint     # ESLint
npm run build    # production build (see below)
npm run start    # serve the production build locally
```

## Production Build

```bash
npm run build
npm run start
```

The build requires network access to `fonts.googleapis.com` the first time (for `next/font/google`
to fetch Fraunces and Inter at build time) — this is normal on Vercel and any machine with regular
internet access.

## Vercel Deployment

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the environment variables from the table above in **Project Settings → Environment
   Variables** (set `NEXT_PUBLIC_SITE_URL` to your production domain).
4. Deploy. No further configuration is required — `next.config.mjs` is already set up for
   Cloudinary's image domain, and the admin routes are dynamically rendered so they always read
   live session/data.

## Admin Dashboard

**Who can use it:** only the studio owner. There is exactly one admin account, and everything the
dashboard can change — photos, videos, services, testimonials, inquiries — is locked to it in
three places: the route guard (`middleware.ts` + the dashboard layout), every server action, and
the database itself (Row Level Security via `is_admin()`).

### First-time setup (once, after deploying)

1. Run `supabase/schema.sql` in the Supabase SQL Editor.
2. Set these environment variables on your host (e.g. Vercel → Project Settings → Environment
   Variables) and redeploy: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SETUP_CODE`, and the three `CLOUDINARY_*` values.
3. Open `https://your-site/admin/register`, enter your email, a password (10+ characters) and the
   `ADMIN_SETUP_CODE`. You are signed in straight away.
4. **Registration then closes itself** — the page refuses everyone once an admin exists. After that
   you can remove `ADMIN_SETUP_CODE` from the environment if you like.
5. Sign in later at `/admin` (also linked as "Studio Admin" in the footer).

Forgot the password? Reset it in Supabase → Authentication → Users. To move the admin to a
different account, delete the row in the `admins` table and the old user, then register again.

### What the admin can change

- **Overview** — key stats (projects, published count, inquiries, pending inquiries, testimonials).
- **Projects** — add, edit, change the cover photo, publish/unpublish, feature, delete.
- **Media** — upload photos or videos to a project, or delete them.
- **Videos** — add, edit, replace or delete the films on the Videography page, and pick which one
  is the Showreel. Until the first video is added, the site shows its built-in sample films.
- **Services** — add, edit (price, label, included items, photo, order), publish/unpublish, delete.
  On first use, press **Import the current packages** to copy the built-in wedding packages in.
- **Testimonials** — manage client quotes shown on the homepage.
- **Inquiries** — view booking-form submissions, change status, delete.

Every "photo" or "video" field has an **Upload file** button. The file goes straight to Cloudinary
(signed by the server, admin-only) and the field is filled with its public ID. Cloudinary's free
plan accepts videos up to about 100 MB per file.

If Supabase isn't configured, `/admin/login` explains what to set up instead of showing a broken form.

## Rebranding

Everything brand-specific lives in one file: [`lib/config/site.ts`](./lib/config/site.ts) —
studio name, tagline, description, location, contact details and social links. Update it once and
it propagates through metadata, the navbar, footer, hero and SEO tags.

## Project Structure

```
app/                    Routes (App Router)
  page.tsx              Homepage
  photography/          Photography portfolio + lightbox
  videography/          Videography portfolio
  projects/[slug]/      Dynamic project detail pages
  about/ services/ contact/
  admin/                Login + protected dashboard
  api/inquiries/        Booking form endpoint
components/
  navigation/ hero/ sections/ gallery/ project/ video/
  animations/ ui/ footer/ contact/ admin/
lib/
  config/site.ts        Brand config — single source of truth
  data/                 Demo/fallback content + placeholder art generator
  supabase/             Client, server, query, and admin-action helpers
  cloudinary/           URL-building utilities
  utils/                cn, validation, gallery helpers
types/                  Shared TypeScript types
supabase/schema.sql     Full Postgres schema + RLS policies
```

---

## Latest changes (Shuvo Photography)

**Photo slideshow.** Every photo in the Photography section plays one by one, full-bleed, in the
home hero — and behind the titles of the Photography, Videography and Services pages. The list is
built by `lib/utils/slideshow.ts` from the same projects the Photography page shows, so adding a
photo there adds it to every slideshow. Generated placeholder art is skipped once at least one real
photo exists. Change the timing with the `interval` prop (default 6000 ms) on `SlideshowBackdrop`
(`components/slideshow/`). Visitors can pause, go back/forward, or swipe on touch screens; with
"reduce motion" enabled it never auto-advances.

**Logo.** `components/brand/BrandLogo.tsx` renders the logo from `public/brand/` and switches
automatically between the white (dark theme) and dark (light theme) artwork. It is used in the
navbar, hero, intro loader, footer, admin sidebar and admin login. Favicon: `app/icon.png`,
`app/apple-icon.png`. Social preview image: `public/og-image.png`.

**Spacing.** All page sections share one vertical rhythm through the `.section-y` class in
`app/globals.css` — change it once to loosen or tighten the whole site.

**Developer credit.** The footer's bottom-left corner reads "Developed by: Jobair Islam" (also listed
at `/humans.txt`). Add your portfolio link and contact details in `lib/config/developer.ts` — with a
portfolio URL the name links to it; empty fields are hidden.

**Before / After.** `components/sections/BeforeAfterSlider.tsx` uses the Cloudinary photo
`pexels-upenderphotography-37602134`: the "before" side is a flat, muted version and the "after"
side a graded one, both generated by Cloudinary from the single upload.
