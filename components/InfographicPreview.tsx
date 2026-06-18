import type { Company } from "@/data/companies";
import TrackedDownloadLink from "./TrackedDownloadLink";
import ImageWithFallback from "./ImageWithFallback";

/**
 * Large infographic image inside a premium card. The whole image is a tracked
 * download link, and a missing file degrades to a graceful placeholder.
 *
 * Used on the homepage featured section and on individual company pages.
 */
export default function InfographicPreview({
  company,
  location,
}: {
  company: Company;
  /** Fathom location for the image-click download, e.g. "company_page_image". */
  location: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-card">
      <TrackedDownloadLink
        href={company.downloadFile}
        company={company.name}
        slug={company.slug}
        ticker={company.ticker}
        exchange={company.exchange}
        location={location}
        ariaLabel={`Download the ${company.name} infographic`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <ImageWithFallback
          src={company.infographicImage}
          alt={`${company.name} annual report infographic`}
          className="w-full cursor-pointer transition-opacity duration-200 hover:opacity-95"
          placeholderClassName="aspect-[4/3] w-full"
        />
      </TrackedDownloadLink>
    </div>
  );
}
