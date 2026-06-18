/**
 * Central data source for every company visual brief.
 *
 * ➕ TO ADD A NEW COMPANY:
 *   1. Drop the infographic image in   public/infographics/<slug>-<year>.png
 *   2. Drop the downloadable file in    public/downloads/<slug>-<year>.pdf
 *   3. Add one object to the `companies` array below.
 * That's it — the homepage, /companies, and /companies/[slug] all read from here.
 *
 * No database, no CMS. This file is the single source of truth.
 */

export type Company = {
  /** URL-safe id, used in /companies/[slug]. Keep lowercase, words separated by hyphens. */
  slug: string;
  name: string;
  ticker: string;
  exchange: string;
  market: string;
  sector: string;
  reportTitle: string;
  summary: string;
  /** ISO date (YYYY-MM-DD). Used for sorting "latest" and display. */
  reportDate: string;
  tags: string[];
  /** Public path to the preview image. TODO: place the real file in public/infographics/. */
  infographicImage: string;
  /** Public path to the downloadable file. TODO: place the real file in public/downloads/. */
  downloadFile: string;
  /** Optional per-company support link. Falls back to the global one in lib/config.ts. */
  buyMeACoffeeUrl?: string;
  /** Mark exactly one company as featured for the homepage. */
  isFeatured?: boolean;
};

export const companies: Company[] = [
  {
    slug: "ix-biopharma",
    name: "iX Biopharma",
    ticker: "42C",
    exchange: "SGX",
    market: "Singapore",
    sector: "Healthcare",
    reportTitle: "iX Biopharma — a visual brief on the FY2026 annual report",
    summary:
      "A specialty pharmaceutical company focused on sublingual drug delivery and nutraceuticals. This visual brief distils the annual report into its business model, financial highlights, cash flow quality, and the key risks worth understanding.",
    reportDate: "2026-04-12",
    tags: ["Healthcare", "Pharmaceuticals", "SGX", "Catalist"],
    // TODO: place the real image at public/infographics/ix-biopharma-2026.png
    infographicImage: "/infographics/ix-biopharma-2026.png",
    // TODO: place the real file at public/downloads/ix-biopharma-2026.pdf
    downloadFile: "/downloads/ix-biopharma-2026.pdf",
    isFeatured: true,
  },
  {
    slug: "addvalue-technologies",
    name: "Addvalue Technologies",
    ticker: "A31",
    exchange: "SGX",
    market: "Singapore",
    sector: "Technology",
    reportTitle: "Addvalue Technologies — a visual brief on the FY2026 annual report",
    summary:
      "A satellite-based communications technology company. This visual brief turns the annual report into a one-page snapshot of how the business makes money, its financial quality, accounting observations, and questions investors can ask management.",
    reportDate: "2026-03-28",
    tags: ["Technology", "Satellite", "SGX", "Communications"],
    // TODO: place the real image at public/infographics/addvalue-technologies-2026.png
    infographicImage: "/infographics/addvalue-technologies-2026.png",
    // TODO: place the real file at public/downloads/addvalue-technologies-2026.pdf
    downloadFile: "/downloads/addvalue-technologies-2026.pdf",
  },
  {
    slug: "sample-company",
    name: "Sample Company Ltd.",
    ticker: "SMPL",
    exchange: "SGX",
    market: "Singapore",
    sector: "Industrials",
    reportTitle: "Sample Company Ltd. — a visual brief on the FY2026 annual report",
    summary:
      "A placeholder entry showing how a company brief appears in the library. Duplicate this object, swap the details, and add your image and download file to publish a new visual brief.",
    reportDate: "2026-02-15",
    tags: ["Industrials", "Sample", "SGX"],
    // TODO: place the real image at public/infographics/sample-company-2026.png
    infographicImage: "/infographics/sample-company-2026.png",
    // TODO: place the real file at public/downloads/sample-company-2026.pdf
    downloadFile: "/downloads/sample-company-2026.pdf",
  },
];
