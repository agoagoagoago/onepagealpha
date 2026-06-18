import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import InfographicPreview from "@/components/InfographicPreview";
import CoverageGrid from "@/components/CoverageGrid";
import CompanyGrid from "@/components/CompanyGrid";
import RequestCompanyCTA from "@/components/RequestCompanyCTA";
import Disclaimer from "@/components/Disclaimer";
import GatedDownload from "@/components/GatedDownload";
import TrackedExternalLink from "@/components/TrackedExternalLink";
import Tag from "@/components/Tag";
import {
  getAllCompanies,
  getCompanyBySlug,
  getRelatedCompanies,
  formatReportDate,
} from "@/lib/companies";

// Pre-render every company page at build time.
export function generateStaticParams() {
  return getAllCompanies().map((c) => ({ slug: c.slug }));
}

// Per-page SEO + Open Graph metadata.
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const company = getCompanyBySlug(params.slug);
  if (!company) {
    return { title: "Brief not found | OnePage Alpha" };
  }

  const title = `${company.name} Visual Brief | OnePage Alpha`;
  const description = `Free OnePage Alpha annual report infographic for ${company.name}, covering financial highlights, business drivers, key risks, and questions for management.`;

  return {
    title,
    description,
    alternates: { canonical: `/companies/${company.slug}` },
    openGraph: {
      title,
      description,
      url: `/companies/${company.slug}`,
      // Uses the company infographic as the share image when available.
      images: [{ url: company.infographicImage, alt: `${company.name} infographic` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [company.infographicImage],
    },
  };
}

export default function CompanyBriefPage({
  params,
}: {
  params: { slug: string };
}) {
  const company = getCompanyBySlug(params.slug);
  if (!company) notFound();

  const related = getRelatedCompanies(company, 3);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <article className="mx-auto max-w-content px-6 pt-12 sm:pt-16">
          {/* Back link */}
          <Link
            href="/companies"
            className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-gold"
          >
            <span aria-hidden="true">←</span> Back to Library
          </Link>

          {/* Header metadata */}
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
            <span className="font-medium text-ink-soft">
              {company.ticker} · {company.exchange}
            </span>
            <span aria-hidden="true">•</span>
            <span>{company.market}</span>
            <span aria-hidden="true">•</span>
            <span>{company.sector}</span>
            <span aria-hidden="true">•</span>
            <span>{formatReportDate(company.reportDate)}</span>
          </div>

          <p className="mt-4 font-serif text-2xl text-ink">{company.name}</p>

          {/* Headline = reportTitle */}
          <h1 className="mt-1 font-serif text-3xl leading-tight text-ink sm:text-4xl">
            {company.reportTitle}
          </h1>

          {/* Tags */}
          <div className="mt-5 flex flex-wrap gap-1.5">
            {company.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          {/* Summary */}
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink-soft">
            {company.summary}
          </p>

          {/* Infographic preview (clickable = tracked download) */}
          <div className="mt-10 max-w-3xl">
            <InfographicPreview company={company} location="company_page_image" />
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <GatedDownload
              company={company}
              location="company_page_button"
              triggerLabel="Download Infographic"
            />
            <TrackedExternalLink
              href={company.buyMeACoffeeUrl}
              company={company.name}
              slug={company.slug}
              ticker={company.ticker}
              exchange={company.exchange}
              location="company_page_button"
              className="inline-flex items-center justify-center rounded-full border border-line bg-paper px-7 py-3 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              Buy Me a Coffee
            </TrackedExternalLink>
            <Link
              href="/companies"
              className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium text-ink-soft transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              Back to Library
            </Link>
          </div>

          {/* Request a company for a future brief */}
          <div className="mt-16">
            <RequestCompanyCTA
              location="company_page"
              companySlug={company.slug}
              companyName={company.name}
            />
          </div>
        </article>

        {/* What this brief covers */}
        <section className="mt-20 border-y border-line bg-paper/50 px-6 py-20 sm:py-24">
          <CoverageGrid />
        </section>

        {/* Related briefs */}
        {related.length > 0 && (
          <section className="mx-auto max-w-content px-6 py-20">
            <h2 className="font-serif text-2xl text-ink sm:text-3xl">
              Related briefs
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              More from {company.sector} and {company.market}.
            </p>
            <div className="mt-8">
              <CompanyGrid companies={related} downloadLocation="companies_library_card" />
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <Disclaimer variant="full" />
      </main>

      <SiteFooter />
    </div>
  );
}
