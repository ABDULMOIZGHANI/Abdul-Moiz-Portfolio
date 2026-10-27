# abdulmoiz. — portfolio

Abdul Moiz Ghani's portfolio, designed as a **live design file**: a dotted canvas of frames, a Layers panel for navigation, an Inspect panel that previews projects on hover, selection handles with live dimensions, and an "Abdul" collaborator cursor.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · MongoDB (Mongoose) · plain CSS (no UI library) · Resend for email · deploys to cPanel or Vercel.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in values (all optional for a first look)
npm run dev                  # http://localhost:3000
```

Everything works with an empty `.env.local`: content comes from `/data`. Add `MONGODB_URI` to enable the admin panel and the contact inbox.

## What's inside

| Path | What it is |
|---|---|
| `app/page.tsx` | Landing page funnel: hero → brands → why → services → work & video highlights → process → experience → about → FAQ → contact |
| `app/work/page.tsx` | All UI/UX & web development projects, with filters |
| `app/work/[slug]/page.tsx` | One SEO case-study page per project |
| `app/video/page.tsx` | Full video portfolio (AI video, ad films, reels) with VideoObject structured data |
| `app/contact/page.tsx` | Dedicated contact page (good for ads and direct links) |
| `app/api/thumb/[id]/route.ts` | Serves Google Drive video thumbnails from your own domain, cached |
| `components/sections.tsx`, `lib/copy.ts` | Reusable page sections and their text (services, process, FAQ, brands) |
| `app/admin/…` | Password-protected admin: messages inbox, projects & videos editor |
| `app/api/contact/route.ts` | Contact form endpoint (validation, honeypot, rate limit, saves to MongoDB, emails via Resend) |
| `app/sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `icon.tsx` | SEO: sitemap, robots, social preview image, favicon |
| `components/` | Toolbar, Layers & Inspect panels, frames, intro, work grid, video, contact form… |
| `data/*.json` | Built-in content (site info, projects, videos, experience) — edit these to change text |
| `lib/content.ts` | Reads MongoDB when available, falls back to `/data` |
| `models/index.ts` | Mongoose models: Project, Video, Message |
| `scripts/seed.mjs` | Copies `/data` content into MongoDB (`npm run seed`) |
| `scripts/package-cpanel.mjs` | Builds the cPanel upload zip (`npm run package`) |

## Editing content

- **With MongoDB:** go to `/admin`, sign in with `ADMIN_PASSWORD`, and edit projects/videos. Changes go live on save.
- **Without MongoDB:** edit the files in `/data` and redeploy.
- **Experience, skills, bio, contact details:** `data/site.json` and `data/experience.json`.
- **Images:** currently loaded from the old site (`abdulmoizghani.vercel.app`). To self-host, put files in `public/images/` and change the URLs to `/images/…`.

## SEO built in

Server-rendered HTML for every page · per-page titles, descriptions and canonical URLs · Open Graph + Twitter cards · generated social image · `sitemap.xml` and `robots.txt` · JSON-LD (`Person` on the home page, `CreativeWork` on case studies) · case-study pages per project · admin and API excluded from indexing.

## Deploy

See **[DEPLOY.md](DEPLOY.md)** for step-by-step cPanel instructions.
