"use client";

import { useState } from "react";
import { INFOGRAPHIC_PATH } from "@/lib/config";
import TrackedDownloadLink from "./TrackedDownloadLink";
import TrackedExternalLink from "./TrackedExternalLink";

/**
 * The infographic preview section.
 *
 * - Shows the infographic in a premium card.
 * - The image itself is clickable and triggers a tracked download.
 * - If the image file is missing, it gracefully degrades to a placeholder
 *   card that STILL offers the download CTA (so the app never looks broken).
 *
 * TODO: Replace `/public/onepagealpha-sample-infographic.png` with the actual
 * infographic. (The path is defined once in lib/config.ts.)
 */
export default function InfographicPreview() {
  // Flips to `true` if the <img> fails to load (e.g. file not added yet).
  const [imageMissing, setImageMissing] = useState(false);

  return (
    <section
      id="infographic"
      className="mx-auto max-w-content px-6 py-20 sm:py-24"
      aria-labelledby="infographic-title"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
          Free visual brief
        </p>
        <h2
          id="infographic-title"
          className="mt-3 font-serif text-3xl text-ink sm:text-4xl"
        >
          Download the one page that matters
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">
          Download the full infographic and use it as a quick educational
          snapshot before reading the annual report in detail.
        </p>
      </div>

      {/* Premium card holding the infographic */}
      <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-paper shadow-card">
        {!imageMissing ? (
          // Clicking the image triggers the tracked download.
          <TrackedDownloadLink
            location="infographic_preview_image"
            ariaLabel="Download the OnePage Alpha infographic"
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {/* Using a plain <img> so we can gracefully fall back via onError. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={INFOGRAPHIC_PATH}
              alt="OnePage Alpha sample infographic: a one-page visual breakdown of an annual report."
              className="w-full cursor-pointer transition-opacity duration-200 hover:opacity-95"
              onError={() => setImageMissing(true)}
            />
          </TrackedDownloadLink>
        ) : (
          // Graceful placeholder shown when the file is missing.
          <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-4 bg-ivory px-6 text-center sm:aspect-[16/9]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line text-gold">
              {/* simple document icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M7 3h7l5 5v13H7z" />
                <path d="M14 3v5h5" />
              </svg>
            </div>
            <p className="font-serif text-lg text-ink">
              Infographic preview coming soon
            </p>
            <p className="max-w-md text-sm text-ink-muted">
              The sample infographic image hasn&rsquo;t been added yet. You can
              still use the download button below once the file is in place.
            </p>
          </div>
        )}
      </div>

      {/* Buttons below the image */}
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <TrackedDownloadLink
          location="infographic_section"
          className="inline-flex w-full items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-medium text-ivory transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:w-auto"
        >
          Download Infographic
        </TrackedDownloadLink>
        <TrackedExternalLink
          location="infographic_section"
          className="inline-flex w-full items-center justify-center rounded-full border border-line bg-paper px-7 py-3 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:w-auto"
        >
          Support this research
        </TrackedExternalLink>
      </div>
    </section>
  );
}
