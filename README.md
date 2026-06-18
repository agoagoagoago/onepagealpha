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
- `/request` — "Request a Company" form (emails via Resend)
- `/contact` — general "Contact Us" form (emails via Resend)

All briefs are read from one file: **`data/companies.ts`**.

## Email providers at a glance

**Resend** powers all transactional email; **Formspree is no longer used.**

- **Gated infographic downloads** → `/api/download-request` (emails the visitor
  the download link, optional owner notification).
- **Request a Company form** (`/request`) → `/api/request-company` (emails the
  owner the request, plus a confirmation to the requester if they gave an email).
- **Contact form** (`/contact`) → `/api/contact` (emails the owner the message,
  plus a confirmation to the sender).
- `RESEND_API_KEY` is **server-only** — it must **not** be prefixed with
  `NEXT_PUBLIC_` and is never sent to the browser.

## Resend email setup

The download gate and the request form both POST to a Next.js API route that
validates server-side and sends email via Resend. Buy Me a Coffee is not gated.

1. Create a [Resend](https://resend.com) account.
2. Verify the sending domain (ideally `onepagealpha.com`).
3. Create a Resend API key.
4. Add env vars in Vercel (Project → Settings → Environment Variables):
   - `RESEND_API_KEY` — server-only secret (no `NEXT_PUBLIC_` prefix)
   - `RESEND_FROM_EMAIL` — e.g. `OnePage Alpha <hello@onepagealpha.com>`
     (must be on the verified domain; falls back to `onboarding@resend.dev` for testing)
   - `RESEND_OWNER_EMAIL` — owner/notification address. **Required** for the
     Request a Company form; also the download notification recipient.
   - `NEXT_PUBLIC_SITE_URL` — e.g. `https://onepagealpha.com` (used to build the absolute download link)
5. **Redeploy** after setting env vars, then send one real download and one real
   request on production and confirm both in the Resend dashboard logs.

If `RESEND_API_KEY` (or, for requests/contact, `RESEND_OWNER_EMAIL`) is missing,
the API routes return a safe error and the UI shows a friendly retry message —
they never crash or leak the key. All routes apply a best-effort in-memory rate
limit (5/IP and 3/email per 10 min); for production-scale limiting use a shared
store (Upstash Redis / Vercel KV).

### Contact form

`/contact` is a general enquiry form (feedback, corrections, custom briefs,
partnerships, IR/agency, media, technical issues). It POSTs to `/api/contact`,
which validates server-side and uses **Resend** to email the owner the message
plus a confirmation to the sender. No Formspree is used. Required env vars:
`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_OWNER_EMAIL` (required for
contact), `NEXT_PUBLIC_SITE_URL`. `/request` stays dedicated to company-coverage
suggestions; `/contact` is for everything else.
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
