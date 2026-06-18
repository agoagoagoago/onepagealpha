"use client";

import type { ReactNode } from "react";
import {
  INFOGRAPHIC_PATH,
  INFOGRAPHIC_DOWNLOAD_NAME,
} from "@/lib/config";
import { trackInfographicDownload } from "@/lib/fathom";

/**
 * An anchor that downloads the infographic from /public AND tracks the click.
 *
 * Tracking fires FIRST (synchronously) on click, then the browser proceeds
 * with the normal `download` behavior.
 */
export default function TrackedDownloadLink({
  location,
  className,
  children,
  ariaLabel,
}: {
  /** Where the click happened, e.g. "hero" — sent to Fathom context/dev logs. */
  location: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={INFOGRAPHIC_PATH}
      // The `download` attribute makes the browser save the file instead of
      // navigating to it. The value is the suggested filename.
      download={INFOGRAPHIC_DOWNLOAD_NAME}
      onClick={() => trackInfographicDownload(location)}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
