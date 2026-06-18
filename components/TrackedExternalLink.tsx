"use client";

import type { ReactNode } from "react";
import { BUY_ME_A_COFFEE_URL } from "@/lib/config";
import { trackBuyMeACoffee } from "@/lib/fathom";

/**
 * An anchor that opens the Buy Me a Coffee page in a new tab AND tracks the click.
 *
 * Tracking fires FIRST on click, then the link opens in a new tab.
 */
export default function TrackedExternalLink({
  location,
  className,
  children,
  ariaLabel,
}: {
  /** Where the click happened, e.g. "footer" — sent to Fathom context/dev logs. */
  location: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={BUY_ME_A_COFFEE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackBuyMeACoffee(location)}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
