"use client";

import Image from "next/image";
import { useState } from "react";
import { LOGO_PATH } from "@/lib/config";

/**
 * The OnePage Alpha logo, rendered with next/image.
 * - Control the displayed size with `className` (e.g. "w-[190px] h-auto").
 * - Falls back to the brand text "OnePage Alpha" if the image fails to load.
 *
 * Intrinsic dimensions match the asset's 3:1 ratio (900x300) so the aspect
 * ratio is preserved; CSS width + h-auto handle responsive sizing.
 */
export default function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <span className="font-serif text-lg font-medium tracking-tight text-ink">
        OnePage Alpha
      </span>
    );
  }

  return (
    <Image
      src={LOGO_PATH}
      alt="OnePage Alpha"
      width={900}
      height={300}
      priority={priority}
      onError={() => setErrored(true)}
      className={className}
    />
  );
}
