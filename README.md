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
- `/request` — "Request a Company" form (submits to Formspree)

All briefs are read from one file: **`data/companies.ts`**.

## Request a Company form (Formspree)

The `/request` page lets visitors suggest a company for a future brief. It posts
to Formspree via `fetch` (client-side, with loading/success/error states) — no
backend, no database.

1. Create a form at https://formspree.io and copy its endpoint
   (looks like `https://formspree.io/f/abcdwxyz`).
2. Set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` to that endpoint (locally in `.env.local`,
   in production via Vercel env vars).
3. Without the endpoint set, the form shows a helpful notice and the submit
   button is disabled — it never crashes.

Request CTAs link to `/request` from the homepage, the library, every company
page (with the company prefilled into tracking), and the footer.

## Email providers at a glance

- **Resend** powers the **email-gated infographic downloads** (via the
  `/api/download-request` API route).
- **Formspree** powers **only** the "Request a Company" form (`/request`).
- `RESEND_API_KEY` is **server-only** — it must **not** be prefixed with
  `NEXT_PUBLIC_` and is never sent to the browser.

## Resend download email setup

Infographic downloads are **email-gated**: clicking any "Download" CTA (or the
infographic image) opens a modal that captures the visitor's email. The client
POSTs to `/api/download-request`, which validates server-side, emails the
visitor the download link via Resend (and optionally notifies the owner), then
the modal reveals the immediate download button. Buy Me a Coffee and Request a
Company are NOT gated.

1. Create a [Resend](https://resend.com) account.
2. Verify the sending domain (ideally `onepagealpha.com`).
3. Create a Resend API key.
4. Add env vars in Vercel (Project → Settings → Environment Variables):
   - `RESEND_API_KEY` — server-only secret (no `NEXT_PUBLIC_` prefix)
   - `RESEND_FROM_EMAIL` — e.g. `OnePage Alpha <hello@onepagealpha.com>`
     (must be on the verified domain; falls back to `onboarding@resend.dev` for testing)
   - `RESEND_OWNER_EMAIL` — optional; receives an internal notification per download
   - `NEXT_PUBLIC_SITE_URL` — e.g. `https://onepagealpha.com` (used to build the absolute download link)
5. Keep the Formspree env var only for the request form:
   `NEXT_PUBLIC_FORMSPREE_ENDPOINT`.
6. **Redeploy** after setting env vars.
7. Test one real download on production.
8. Check the Resend dashboard logs to confirm the user email (and owner notification) were sent.
9. Check Fathom for the download events (see below).

If `RESEND_API_KEY` is missing, the API route returns a safe error
("Email service is not configured.") and the modal shows a friendly retry
message — it never crashes or leaks the key. The API route also applies a
best-effort in-memory rate limit (5/IP and 3/email per 10 min); for
production-scale limiting use a shared store (Upstash Redis / Vercel KV).

### Privacy / compliance (not legal advice)

- Ensure compliance with applicable email-marketing and privacy laws (e.g.
  GDPR/PDPA/CAN-SPAM) for your audience.
- Only email users who consented to updates (the opt-in checkbox).
- Keep your Resend logs and recipient data secure.
- Add a privacy policy before scaling email collection.
  (`TODO: Add a privacy policy page before scaling email collection.`)

## Add a new company brief

1. Add the preview image to `public/infographics/<slug>-<year>.png`
2. Add the downloadable file to `public/downloads/<slug>-<year>.pdf`
3. Add one object to the `companies` array in `data/companies.ts`

That's it — homepage, library, the new `/companies/<slug>` page, related briefs,
and SEO metadata all update automatically. No database, no CMS.

> The Addvalue Technologies example uses real files:
> `public/infographics/addvalue-technologies-june-2026.jpg` (preview) and
> `public/downloads/addvalue-technologies-june-2026.pdf` (download). The other entries are placeholders.

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

Request-form events (general + location-specific + optional company-specific):

- `request_company_clicked` + one of `request_company_homepage` /
  `request_company_library` / `request_company_company_page` /
  `request_company_footer` (+ `request_company_from_<slug>` on company pages)
- `request_company_form_started`
- `request_company_submitted`
- `request_company_failed`

Helpers live in `lib/fathom.ts` (`trackInfographicDownload` / `trackBuyMeACoffee` /
`trackRequestCompanyClick` / `trackRequestCompanyFormStarted` /
`trackRequestCompanySubmitted` / `trackRequestCompanyFailed`), use
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
