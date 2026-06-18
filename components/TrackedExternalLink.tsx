"use client";

import type { ReactNode } from "react";
import { BUY_ME_A_COFFEE_URL } from "@/lib/config";
import { trackBuyMeACoffee, type TrackContext } from "@/lib/fathom";

/**
 * Anchor that opens the Buy Me a Coffee page in a new tab AND tracks the click.
 *
 * Tracking fires FIRST on click. `href` defaults to the global support URL in
 * lib/config.ts but accepts a per-company override.
 */
export default function TrackedExternalLink({
  href = BUY_ME_A_COFFEE_URL,
  company,
  slug,
  ticker,
  exchange,
  location,
  className,
  children,
  ariaLabel,
}: TrackContext & {
  /** Support URL; defaults to BUY_ME_A_COFFEE_URL. */
  href?: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackBuyMeACoffee({ company, slug, ticker, exchange, location })
      }
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
