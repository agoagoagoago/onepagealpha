import Link from "next/link";
import { getFeaturedCompany } from "@/lib/companies";
import Disclaimer from "./Disclaimer";
import TrackedDownloadLink from "./TrackedDownloadLink";
import TrackedExternalLink from "./TrackedExternalLink";
import RequestCompanyLink from "./RequestCompanyLink";

/** Shared footer used on every page. Download/support track the featured company. */
export default function SiteFooter() {
  const featured = getFeaturedCompany();

  return (
    <footer className="border-t border-line bg-paper/60">
      <div className="mx-auto max-w-content px-6 py-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-lg text-ink">OnePage Alpha</p>
            <p className="mt-2 text-sm text-ink-soft">
              Visual annual report intelligence for busy investors.
            </p>
          </div>

          <nav className="flex flex-col gap-3 text-sm sm:items-end">
            <Link href="/" className="text-ink-soft transition-colors hover:text-gold">
              Home
            </Link>
            <Link href="/companies" className="text-ink-soft transition-colors hover:text-gold">
              Companies
            </Link>
            <RequestCompanyLink
              location="footer"
              className="text-ink-soft transition-colors hover:text-gold"
            >
              Request a Company
            </RequestCompanyLink>
            {/* Footer download points to the featured company and tracks its slug. */}
            <TrackedDownloadLink
              href={featured.downloadFile}
              company={featured.name}
              slug={featured.slug}
              ticker={featured.ticker}
              exchange={featured.exchange}
              location="footer"
              className="text-ink-soft transition-colors hover:text-gold"
            >
              Download Featured Infographic
            </TrackedDownloadLink>
            <TrackedExternalLink
              href={featured.buyMeACoffeeUrl}
              company={featured.name}
              slug={featured.slug}
              ticker={featured.ticker}
              exchange={featured.exchange}
              location="footer"
              className="text-ink-soft transition-colors hover:text-gold"
            >
              Buy Me a Coffee
            </TrackedExternalLink>
          </nav>
        </div>

        <div className="mt-10 border-t border-line pt-8">
          <Disclaimer variant="condensed" />
          <p className="mt-6 text-xs text-ink-muted">
            © {new Date().getFullYear()} OnePage Alpha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
