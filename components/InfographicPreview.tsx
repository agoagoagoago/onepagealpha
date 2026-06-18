import type { Company } from "@/data/companies";
import GatedDownload from "./GatedDownload";
import ImageWithFallback from "./ImageWithFallback";

/**
 * Large infographic image inside a premium card. Clicking the image opens the
 * email-gated download flow (the image is the gate trigger). A missing file
 * degrades to a graceful placeholder.
 *
 * Used on the homepage featured section and on individual company pages.
 */
export default function InfographicPreview({
  company,
  location,
}: {
  company: Company;
  /** Fathom location for the gated download, e.g. "company_page_image". */
  location: "homepage_featured" | "company_page_image";
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-card">
      <GatedDownload company={company} location={location} triggerVariant="image">
        <ImageWithFallback
          src={company.infographicImage}
          alt={`${company.name} annual report infographic`}
          className="w-full cursor-pointer transition-opacity duration-200 hover:opacity-95"
          placeholderClassName="aspect-[4/3] w-full"
        />
      </GatedDownload>
    </div>
  );
}
