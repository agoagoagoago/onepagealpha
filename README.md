# OnePage Alpha

Visual annual report intelligence for busy investors. A single-page Next.js site
to validate demand with one free infographic download and a Buy Me a Coffee
support button, tracked with Fathom Analytics.

> Educational research visuals based on public company disclosures. **Not financial advice.**

---

## What to edit later

| What | Where |
| --- | --- |
| Infographic file | Replace `public/onepagealpha-sample-infographic.png` |
| Infographic path / download name | `lib/config.ts` |
| Buy Me a Coffee URL | `lib/config.ts` (`BUY_ME_A_COFFEE_URL`) |
| Fathom Site ID | env var `NEXT_PUBLIC_FATHOM_SITE_ID` |
| Custom Fathom domain (optional) | env var `NEXT_PUBLIC_FATHOM_SCRIPT_URL` |
| Brand colors | `tailwind.config.ts` |
| Page copy / sections | `app/page.tsx` |

## Tracked Fathom events

- `infographic_download_clicked`
- `buy_me_a_coffee_clicked`

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
