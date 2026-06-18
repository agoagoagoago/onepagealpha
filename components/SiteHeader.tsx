import Link from "next/link";
import { getFeaturedCompany } from "@/lib/companies";
import BrandLogo from "./BrandLogo";
import TrackedExternalLink from "./TrackedExternalLink";

/** Minimal shared header used on every page. */
export default function SiteHeader() {
  const featured = getFeaturedCompany();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/85 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label="OnePage Alpha home"
          className="inline-flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {/* Logo above the fold -> priority. Responsive width, height auto, no distortion. */}
          <BrandLogo priority className="h-auto w-[150px] sm:w-[190px]" />
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link href="/companies" className="text-ink-soft transition-colors hover:text-gold">
            Companies
          </Link>
          {/* Support link tracks against the featured company. */}
          <TrackedExternalLink
            href={featured.buyMeACoffeeUrl}
            company={featured.name}
            slug={featured.slug}
            ticker={featured.ticker}
            exchange={featured.exchange}
            location="header"
            className="text-ink-soft transition-colors hover:text-gold"
          >
            Support the work
          </TrackedExternalLink>
        </nav>
      </div>
    </header>
  );
}
