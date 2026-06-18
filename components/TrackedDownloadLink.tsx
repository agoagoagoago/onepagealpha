"use client";

import type { ReactNode } from "react";
import { trackInfographicDownload, type TrackContext } from "@/lib/fathom";

/**
 * Anchor that downloads a company's infographic file AND tracks the click.
 *
 * Tracking fires FIRST on click, then the browser proceeds with the normal
 * `download` behavior. If the file is missing the browser simply 404s — the
 * surrounding layout is never affected.
 */
export default function TrackedDownloadLink({
  href,
  company,
  slug,
  ticker,
  exchange,
  location,
  className,
  children,
  ariaLabel,
}: TrackContext & {
  /** Path to the downloadable file, e.g. "/downloads/ix-biopharma-2026.pdf". */
  href: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      // `download` makes the browser save the file instead of navigating to it.
      download
      onClick={() =>
        trackInfographicDownload({ company, slug, ticker, exchange, location })
      }
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
