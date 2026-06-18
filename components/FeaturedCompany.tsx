import Link from "next/link";
import type { Company } from "@/data/companies";
import { formatReportDate } from "@/lib/companies";
import InfographicPreview from "./InfographicPreview";
import Tag from "./Tag";

/**
 * Homepage featured brief: company metadata + a single "View Full Brief" CTA on
 * one side, the infographic preview on the other. Download and support live on
 * the full brief page this links to.
 */
export default function FeaturedCompany({ company }: { company: Company }) {
  return (
    <section
      className="mx-auto max-w-content px-6 py-16 sm:py-20"
      aria-labelledby="featured-title"
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
        Featured visual brief
      </p>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        {/* Details + CTAs */}
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
            <span className="font-medium text-ink-soft">
              {company.ticker} · {company.exchange}
            </span>
            <span aria-hidden="true">•</span>
            <span>{company.market}</span>
            <span aria-hidden="true">•</span>
            <span>{company.sector}</span>
          </div>

          <h2 id="featured-title" className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
            {company.name}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {formatReportDate(company.reportDate)}
          </p>

          <p className="mt-5 text-base leading-relaxed text-ink-soft">
            {company.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {company.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href={`/companies/${company.slug}`}
              className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-medium text-ivory transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              View Full Brief
            </Link>
          </div>
        </div>

        {/* Preview (clickable = tracked download) */}
        <InfographicPreview company={company} location="homepage_featured" />
      </div>
    </section>
  );
}
