import Link from "next/link";
import type { Company } from "@/data/companies";
import { formatReportDate } from "@/lib/companies";
import ImageWithFallback from "./ImageWithFallback";
import TrackedDownloadLink from "./TrackedDownloadLink";
import Tag from "./Tag";

/**
 * A single company brief card, used in the library grid and "related briefs".
 * The whole card links to the company page; the Download button tracks its own
 * Fathom event (location is configurable so the same card works everywhere).
 */
export default function CompanyCard({
  company,
  downloadLocation = "companies_library_card",
}: {
  company: Company;
  downloadLocation?: string;
}) {
  const href = `/companies/${company.slug}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-shadow hover:shadow-card">
      {/* Thumbnail (links to the brief) */}
      <Link
        href={href}
        aria-label={`View the ${company.name} visual brief`}
        className="block overflow-hidden border-b border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <div className="aspect-[16/10] w-full overflow-hidden bg-ivory">
          <ImageWithFallback
            src={company.infographicImage}
            alt={`${company.name} infographic preview`}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        {/* Identity line */}
        <div className="flex items-center justify-between gap-3 text-xs text-ink-muted">
          <span className="font-medium text-ink-soft">
            {company.ticker} · {company.exchange}
          </span>
          <span>{formatReportDate(company.reportDate)}</span>
        </div>

        <h3 className="mt-2 font-serif text-xl text-ink">
          <Link
            href={href}
            className="transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {company.name}
          </Link>
        </h3>

        <p className="mt-1 text-xs text-ink-muted">
          {company.market} · {company.sector}
        </p>

        <p className="mt-3 text-sm font-medium text-ink-soft">{company.reportTitle}</p>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
          {company.summary}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {company.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        {/* CTAs (pinned to the bottom of the card) */}
        <div className="mt-6 flex items-center gap-3 pt-2">
          <Link
            href={href}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            View Brief
          </Link>
          <TrackedDownloadLink
            href={company.downloadFile}
            company={company.name}
            slug={company.slug}
            ticker={company.ticker}
            exchange={company.exchange}
            location={downloadLocation}
            className="inline-flex items-center justify-center rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            Download
          </TrackedDownloadLink>
        </div>
      </div>
    </article>
  );
}
