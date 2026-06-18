# OnePage Alpha

Visual annual report intelligence for busy investors. A single-page Next.js site
to validate demand with one free infographic download and a Buy Me a Coffee
support button, tracked with Fathom Analytics.

> Educational research visuals based on public company disclosures. **Not financial advice.**

---

## Information architecture

- `/` — homepage: hero + featured company brief + library teaser
- `/companies` — library of all company visual briefs (with a tag filter)
- `/companies/[slug]` — individual company brief (shareable URL)

All briefs are read from one file: **`data/companies.ts`**.

## Add a new company brief

1. Add the preview image to `public/infographics/<slug>-<year>.png`
2. Add the downloadable file to `public/downloads/<slug>-<year>.pdf`
3. Add one object to the `companies` array in `data/companies.ts`

That's it — homepage, library, the new `/companies/<slug>` page, related briefs,
and SEO metadata all update automatically. No database, no CMS.

> If an image or download file is missing, the page shows a graceful placeholder
> and the layout stays intact — nothing crashes.

## What to edit later

| What | Where |
| --- | --- |
| Companies (the whole catalog) | `data/companies.ts` |
| Featured company | set `isFeatured: true` on one company in `data/companies.ts` |
| Default Buy Me a Coffee URL | `lib/config.ts` (`BUY_ME_A_COFFEE_URL`) |
| Per-company support URL | optional `buyMeACoffeeUrl` field per company |
| Fathom Site ID | env var `NEXT_PUBLIC_FATHOM_SITE_ID` |
| Custom Fathom domain (optional) | env var `NEXT_PUBLIC_FATHOM_SCRIPT_URL` |
| Brand colors | `tailwind.config.ts` |
| "What this brief covers" copy | `components/CoverageGrid.tsx` |

## Tracked Fathom events

Each action fires **two** events — a general one and a company-specific one:

- `infographic_download_clicked` + `download_<slug>` (e.g. `download_ix-biopharma`)
- `buy_me_a_coffee_clicked` + `coffee_<slug>` (e.g. `coffee_ix-biopharma`)

Helpers live in `lib/fathom.ts` (`trackInfographicDownload` / `trackBuyMeACoffee`),
take a `{ company, slug, ticker, exchange, location }` context, use
`window.fathom.trackEvent` (never `trackGoal`), and fail silently if Fathom isn't loaded.

> ⚠️ Fathom custom events often do **not** fire on `localhost`. Do final event
> verification **after** deploying to Vercel over HTTPS, by watching the Fathom dashboard.

---

## 1. Install & run locally

```bash
# install dependencies
npm install

# copy env template and add your Fathom Site ID (optional for local dev)
cp .env.example .env.local

# run the dev server -> http://localhost:3000
npm run dev
```

Build check:

```bash
npm run build
```

## 2. Initialize git & commit

```bash
git init
git add .
git commit -m "Initial commit: OnePage Alpha single-page site"
git branch -M main
```

## 3. Create & push to GitHub (agoagoagoago/onepagealpha)

Using the GitHub CLI (recommended):

```bash
gh repo create agoagoagoago/onepagealpha --public --source=. --remote=origin --push
```

Or manually (if the repo already exists on GitHub):

```bash
git remote add origin https://github.com/agoagoagoago/onepagealpha.git
git push -u origin main
```

## 4. Deploy to Vercel

Easiest: import the GitHub repo at https://vercel.com/new (framework auto-detects Next.js).

Or via the Vercel CLI:

```bash
npm i -g vercel
vercel          # follow prompts to link the project
vercel --prod   # deploy to production
```

## 5. Set environment variables in Vercel

In **Vercel → Project → Settings → Environment Variables**, add:

| Name | Value | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_FATHOM_SITE_ID` | your Fathom Site ID | required for tracking |
| `NEXT_PUBLIC_FATHOM_SCRIPT_URL` | `https://cdn.usefathom.com/script.js` | optional — only if you use a custom Fathom domain |

Via CLI:

```bash
vercel env add NEXT_PUBLIC_FATHOM_SITE_ID production
# optional:
vercel env add NEXT_PUBLIC_FATHOM_SCRIPT_URL production
```

Redeploy after adding env vars: `vercel --prod`.

## 6. Connect onepagealpha.com

In **Vercel → Project → Settings → Domains**, add `onepagealpha.com` (and
`www.onepagealpha.com`), then point your registrar's DNS at the records Vercel
shows (typically an `A` record / `CNAME` to Vercel). Vercel issues HTTPS
automatically once DNS verifies.

Via CLI:

```bash
vercel domains add onepagealpha.com
```

---

## Tech

Next.js (App Router) · TypeScript · Tailwind CSS · Fathom Analytics · Deployed on Vercel.
