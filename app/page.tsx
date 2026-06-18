import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FeaturedCompany from "@/components/FeaturedCompany";
import RequestCompanyCTA from "@/components/RequestCompanyCTA";
import Disclaimer from "@/components/Disclaimer";
import TrackedDownloadLink from "@/components/TrackedDownloadLink";
import TrackedExternalLink from "@/components/TrackedExternalLink";
import { getFeaturedCompany } from "@/lib/companies";

export default function Home() {
  // The hero CTAs feature the same company as the section below.
  const featured = getFeaturedCompany();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* ===============================================================
            HERO
        =============================================================== */}
        <section className="mx-auto max-w-content px-6 pb-12 pt-20 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif text-4xl leading-[1.1] text-ink sm:text-5xl md:text-[3.4rem]">
              Annual reports are 150 pages. OnePage Alpha gives you the one page
              that matters.
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
              <TrackedDownloadLink
                href={featured.downloadFile}
                company={featured.name}
                slug={featured.slug}
                ticker={featured.ticker}
                exchange={featured.exchange}
                location="homepage_featured"
                className="inline-flex w-full items-center justify-center rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:w-auto"
              >
                Download Free Infographic
              </TrackedDownloadLink>
              <TrackedExternalLink
                href={featured.buyMeACoffeeUrl}
                company={featured.name}
                slug={featured.slug}
                ticker={featured.ticker}
                exchange={featured.exchange}
                location="homepage_featured"
                className="inline-flex w-full items-center justify-center rounded-full border border-line bg-paper px-8 py-3.5 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:w-auto"
              >
                Buy Me a Coffee
              </TrackedExternalLink>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-content px-6">
          <hr className="border-line" />
        </div>

        {/* ===============================================================
            FEATURED COMPANY
        =============================================================== */}
        <FeaturedCompany company={featured} />

        {/* ===============================================================
            LIBRARY TEASER
        =============================================================== */}
        <section className="border-y border-line bg-paper/50">
          <div className="mx-auto max-w-content px-6 py-20 text-center sm:py-24">
            <h2 className="font-serif text-3xl text-ink sm:text-4xl">
              Browse visual briefs
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
              Explore free annual report infographics by company, sector, market,
              and theme.
            </p>
            <div className="mt-8">
              <Link
                href="/companies"
                className="inline-flex items-center justify-center rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
              >
                View All Companies
              </Link>
            </div>
          </div>
        </section>

        {/* ===============================================================
            REQUEST A COMPANY (understated)
        =============================================================== */}
        <section className="mx-auto max-w-content px-6 pt-16">
          <RequestCompanyCTA location="homepage" />
        </section>

        {/* ===============================================================
            DISCLAIMER
        =============================================================== */}
        <div className="pt-16">
          <Disclaimer variant="full" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
