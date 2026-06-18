import type { Company } from "@/data/companies";
import CompanyCard from "./CompanyCard";
import type { GateLocation } from "./GatedDownload";

/** Responsive grid of company brief cards. */
export default function CompanyGrid({
  companies,
  downloadLocation,
  emptyLabel = "No briefs to show yet.",
}: {
  companies: Company[];
  downloadLocation?: GateLocation;
  emptyLabel?: string;
}) {
  if (companies.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line bg-paper p-10 text-center text-sm text-ink-muted">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <CompanyCard
          key={company.slug}
          company={company}
          downloadLocation={downloadLocation}
        />
      ))}
    </div>
  );
}
