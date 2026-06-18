"use client";

import { useMemo, useState } from "react";
import type { Company } from "@/data/companies";
import CompanyGrid from "./CompanyGrid";

/**
 * Client-side tag filter over the company library.
 * Simple and dependency-free: collects all tags, lets the visitor pick one,
 * and filters the grid. "All" clears the filter.
 */
export default function CompanyExplorer({ companies }: { companies: Company[] }) {
  const allTags = useMemo(
    () => Array.from(new Set(companies.flatMap((c) => c.tags))).sort(),
    [companies],
  );
  const [active, setActive] = useState<string | null>(null);

  const filtered = active
    ? companies.filter((c) => c.tags.includes(active))
    : companies;

  const pill = (selected: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
      selected
        ? "border-gold bg-gold text-ivory"
        : "border-line bg-paper text-ink-soft hover:border-gold hover:text-gold"
    }`;

  return (
    <div>
      {/* Tag filter */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter briefs by tag">
        <button
          type="button"
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          className={pill(active === null)}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActive(tag)}
            aria-pressed={active === tag}
            className={pill(active === tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-ink-muted" aria-live="polite">
        Showing {filtered.length} of {companies.length}{" "}
        {companies.length === 1 ? "brief" : "briefs"}
        {active ? ` tagged “${active}”` : ""}.
      </p>

      <div className="mt-8">
        <CompanyGrid
          companies={filtered}
          downloadLocation="companies_library_card"
          emptyLabel="No briefs match this tag yet."
        />
      </div>
    </div>
  );
}
