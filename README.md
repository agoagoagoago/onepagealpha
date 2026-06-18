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

## Download email capture setup

Infographic downloads are **email-gated**: clicking any "Download" CTA (or the
infographic image) opens a modal that captures the visitor's email via Formspree
before revealing the download link. Buy Me a Coffee and Request a Company are NOT
gated. Uses a **separate** Formspree form from `/request` so it can have its own
Autoresponse.

1. Create a **separate** Formspree form for infographic downloads (not the
   request form).
2. Set `NEXT_PUBLIC_FORMSPREE_DOWNLOAD_ENDPOINT` to that form's endpoint
   (locally in `.env.local`, in production via Vercel env vars). Also set
   `NEXT_PUBLIC_SITE_URL` so the emailed link is absolute.
3. Ensure the submitted field is named exactly `email` (the gate already sends it
   that way) so Formspree can reply to the submitter.
4. In the Formspree form settings, enable **Autoresponse**.
5. Suggested autoresponse **subject**:
   `Your OnePage Alpha infographic download`
6. Suggested autoresponse **body** (Formspree supports submitted fields in the
   template on supported plans):
   `Thanks for requesting the OnePage Alpha visual brief for {{ company_name }}. You can download it here: {{ download_url }}. This content is educational only and not financial advice.`
7. **Redeploy** after setting the environment variables in Vercel.

Without `NEXT_PUBLIC_FORMSPREE_DOWNLOAD_ENDPOINT`, the gate shows a helpful
developer notice and the submit button is disabled — it never crashes. The
download is only revealed after a successful submission.

Fields submitted to the download form: `email`, `newsletter_opt_in`,
`company_name`, `company_slug`, `ticker`, `exchange`, `report_title`,
`download_url`, `source_page`, `_subject`.

### Privacy / compliance (not legal advice)

- Ensure compliance with applicable email-marketing and privacy laws (e.g.
  GDPR/PDPA/CAN-SPAM) for your audience.
- Only email users who consented to updates (the opt-in checkbox).
- Keep your Formspree submission records secure.
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
