"use client";

import { useState } from "react";

/**
 * Renders an <img>, but if the file is missing/broken it swaps to a graceful
 * placeholder card instead of collapsing the layout.
 *
 * Kept as a small client primitive so server components (cards, previews) can
 * reuse the missing-file handling without each becoming a client component.
 */
export default function ImageWithFallback({
  src,
  alt,
  className = "",
  placeholderClassName,
  label = "Infographic preview coming soon",
}: {
  src?: string;
  alt: string;
  /** Classes applied to the <img>. */
  className?: string;
  /** Classes applied to the placeholder box (defaults to `className`). */
  placeholderClassName?: string;
  label?: string;
}) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        role="img"
        aria-label={`${alt} (preview unavailable)`}
        className={`flex flex-col items-center justify-center gap-3 bg-ivory px-6 py-12 text-center ${
          placeholderClassName ?? className
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-gold">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M7 3h7l5 5v13H7z" />
            <path d="M14 3v5h5" />
          </svg>
        </span>
        <p className="max-w-xs text-sm text-ink-muted">{label}</p>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      // Mobile/perf: defer offscreen images and decode off the main thread.
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
    />
  );
}
