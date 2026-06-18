import type { ReactNode } from "react";

/** Small, subtle pill used for company tags. */
export default function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-ivory px-2.5 py-0.5 text-xs font-medium text-ink-soft">
      {children}
    </span>
  );
}
