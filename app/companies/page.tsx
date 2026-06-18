import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CompanyExplorer from "@/components/CompanyExplorer";
import Disclaimer from "@/components/Disclaimer";
import { getAllCompanies } from "@/lib/companies";

export const metadata: Metadata = {
  title: "Company Visual Briefs | OnePage Alpha",
  description:
    "Free annual report infographics designed to help busy investors understand companies faster.",
  alternates: { canonical: "/companies" },
  openGraph: {
    title: "Company Visual Briefs | OnePage Alpha",
    description:
      "Free annual report infographics designed to help busy investors understand companies faster.",
    url: "/companies",
  },
};

export default function CompaniesPage() {
  const companies = getAllCompanies();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-content px-6 pb-12 pt-16 sm:pt-20">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl text-ink sm:text-5xl">
              Company Visual Briefs
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Free annual report infographics designed to help busy investors
              understand companies faster.
            </p>
            <p className="mt-3 text-sm text-ink-muted">
              {companies.length} {companies.length === 1 ? "brief" : "briefs"}{" "}
              available.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-content px-6 pb-20">
          {/* Client-side tag filter + responsive card grid */}
          <CompanyExplorer companies={companies} />
        </section>

        <div className="pt-4">
          <Disclaimer variant="full" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
