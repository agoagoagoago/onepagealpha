import RequestCompanyLink from "./RequestCompanyLink";

type RequestLocation =
  | "homepage"
  | "companies_library"
  | "company_page"
  | "footer";

/**
 * Reusable "Request a Company" call-to-action card.
 * Links to /request and tracks the click (general + location-specific +
 * optional company-specific event).
 */
export default function RequestCompanyCTA({
  location,
  companySlug,
  companyName,
}: {
  location: RequestLocation;
  companySlug?: string;
  companyName?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper/70 px-6 py-8 text-center sm:px-10">
      <h2 className="font-serif text-2xl text-ink">
        Want a company covered next?
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Suggest a public company for a future OnePage Alpha visual brief.
        Requests help guide coverage, but do not influence conclusions.
      </p>
      <div className="mt-6">
        <RequestCompanyLink
          location={location}
          companySlug={companySlug}
          companyName={companyName}
          className="inline-flex items-center justify-center rounded-full border border-line bg-paper px-7 py-3 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          Request a Company
        </RequestCompanyLink>
      </div>
    </div>
  );
}
