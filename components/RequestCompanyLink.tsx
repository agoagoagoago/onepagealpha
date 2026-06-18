"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackRequestCompanyClick } from "@/lib/fathom";

type RequestLocation =
  | "homepage"
  | "companies_library"
  | "company_page"
  | "footer";

/**
 * A link to /request that tracks the click (general + location-specific +
 * optional company-specific). Used by RequestCompanyCTA and the footer link.
 */
export default function RequestCompanyLink({
  location,
  companySlug,
  companyName,
  className,
  children,
}: {
  location: RequestLocation;
  companySlug?: string;
  companyName?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href="/request"
      onClick={() =>
        trackRequestCompanyClick({ location, companySlug, companyName })
      }
      className={className}
    >
      {children}
    </Link>
  );
}
