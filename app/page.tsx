import TrackedDownloadLink from "@/components/TrackedDownloadLink";
import TrackedExternalLink from "@/components/TrackedExternalLink";
import InfographicPreview from "@/components/InfographicPreview";
import Disclaimer from "@/components/Disclaimer";

// --- "What this visual brief covers" cards ---------------------------------
// Edit the copy here to change the grid.
const COVERAGE = [
  {
    title: "Business model",
    body: "What the company does and how it makes money.",
  },
  {
    title: "Financial highlights",
    body: "Revenue, profit, margins, and key operating numbers.",
  },
  {
    title: "Cash flow quality",
    body: "Whether accounting profit is supported by cash generation.",
  },
  {
    title: "Accounting observations",
    body: "Important notes, adjustments, and disclosure items.",
  },
  {
    title: "Key risks",
    body: "Business, funding, operational, and execution risks to monitor.",
  },
  {
    title: "Questions for management",
    body: "Practical questions investors can ask before going deeper.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ===================================================================
          1. HEADER
      =================================================================== */}
      <header className="sticky top-0 z-40 border-b border-line bg-ivory/85 backdrop-blur">
        <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
          <a
            href="#top"
            className="font-serif text-lg font-medium tracking-tight text-ink"
          >
            OnePage Alpha
          </a>
          {/* Smooth-scrolls to the #support section (see globals.css). */}
          <a
            href="#support"
            className="text-sm text-ink-soft transition-colors hover:text-gold"
          >
            Support the work
          </a>
        </div>
      </header>

      <main id="top">
        {/* =================================================================
            2. HERO
        ================================================================= */}
        <section className="mx-auto max-w-content px-6 pb-16 pt-20 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif text-4xl leading-[1.1] text-ink sm:text-5xl md:text-[3.4rem]">
              Annual reports are 150 pages. This is the one page that matters.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              OnePage Alpha turns dense annual reports into visual intelligence
              for busy investors — financial highlights, business drivers,
              accounting red flags, key risks, and questions to ask management.
            </p>
            <p className="mt-5 text-sm text-ink-muted">
              Educational research visuals based on public company disclosures.
              Not financial advice.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {/* Primary CTA: tracked download (location = hero) */}
              <TrackedDownloadLink
                location="hero"
                className="inline-flex w-full items-center justify-center rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:w-auto"
              >
                Download Free Infographic
              </TrackedDownloadLink>
              {/* Secondary CTA: tracked Buy Me a Coffee (location = hero) */}
              <TrackedExternalLink
                location="hero"
                className="inline-flex w-full items-center justify-center rounded-full border border-line bg-paper px-8 py-3.5 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:w-auto"
              >
                Buy Me a Coffee
              </TrackedExternalLink>
            </div>
          </div>
        </section>

        {/* Subtle divider */}
        <div className="mx-auto max-w-content px-6">
          <hr className="border-line" />
        </div>

        {/* =================================================================
            3. INFOGRAPHIC PREVIEW (own component, with graceful fallback)
        ================================================================= */}
        <InfographicPreview />

        {/* =================================================================
            4. WHAT THIS VISUAL BRIEF COVERS — 2x3 grid
        ================================================================= */}
        <section className="border-y border-line bg-paper/50">
          <div className="mx-auto max-w-content px-6 py-20 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                Inside the brief
              </p>
              <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
                What this visual brief covers
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {COVERAGE.map((item) => (
                <div
                  key={item.title}
                  className="bg-ivory p-7 transition-colors hover:bg-paper"
                >
                  <h3 className="font-serif text-xl text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            5. SUPPORT SECTION (anchor target for "Support the work")
        ================================================================= */}
        <section
          id="support"
          className="mx-auto max-w-content px-6 py-20 sm:py-24"
          aria-labelledby="support-title"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="support-title"
              className="font-serif text-3xl text-ink sm:text-4xl"
            >
              Support independent annual report breakdowns
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              If this infographic helped you understand a company faster, you
              can support future OnePage Alpha visual briefs.
            </p>
            <div className="mt-8">
              {/* Buy Me a Coffee (location = support_section) */}
              <TrackedExternalLink
                location="support_section"
                className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
              >
                Buy Me a Coffee
              </TrackedExternalLink>
            </div>
          </div>
        </section>

        {/* =================================================================
            6. SIMPLE VALIDATION NOTE (understated)
        ================================================================= */}
        <section className="mx-auto max-w-content px-6 pb-20">
          <p className="mx-auto max-w-2xl border-l-2 border-gold/60 pl-5 text-sm leading-relaxed text-ink-muted">
            Current experiment: free infographic downloads + voluntary support.
            If readers find this useful, OnePage Alpha will publish more visual
            annual report breakdowns.
          </p>
        </section>

        {/* =================================================================
            7. DISCLAIMER
        ================================================================= */}
        <Disclaimer variant="full" />
      </main>

      {/* ===================================================================
          8. FOOTER
      =================================================================== */}
      <footer className="border-t border-line bg-paper/60">
        <div className="mx-auto max-w-content px-6 py-14">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-sm">
              <p className="font-serif text-lg text-ink">OnePage Alpha</p>
              <p className="mt-2 text-sm text-ink-soft">
                Visual annual report intelligence for busy investors.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              {/* Footer download link (location = footer) */}
              <TrackedDownloadLink
                location="footer"
                className="text-sm text-ink-soft transition-colors hover:text-gold"
              >
                Download Infographic
              </TrackedDownloadLink>
              {/* Footer Buy Me a Coffee link (location = footer) */}
              <TrackedExternalLink
                location="footer"
                className="text-sm text-ink-soft transition-colors hover:text-gold"
              >
                Buy Me a Coffee
              </TrackedExternalLink>
            </div>
          </div>

          {/* Condensed disclaimer in the footer */}
          <div className="mt-10 border-t border-line pt-8">
            <Disclaimer variant="condensed" />
            <p className="mt-6 text-xs text-ink-muted">
              © {new Date().getFullYear()} OnePage Alpha. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
