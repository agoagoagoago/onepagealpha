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
    name: "iX Biopharma Ltd.",
    ticker: "42C",
    exchange: "SGX",
    market: "Singapore",
    sector: "Healthcare",
    reportTitle: "Corporate Analysis: iX Biopharma Ltd. (SGX: 42C)",
    summary:
      "A visual brief on iX Biopharma's FY2025–9M2026 corporate analysis — covering its proprietary sublingual WaferiX drug-delivery platform, the strategic pivot toward US government contracting, financial performance and cash flow, capital structure and dilution, accounting and disclosure observations, and key risks.",
    reportDate: "2026-06-01",
    tags: [
      "Healthcare",
      "Pharmaceuticals",
      "Turnaround",
      "Dilution",
      "Cash Flow",
      "Accounting Observations",
      "SGX",
      "Catalist",
    ],
    // Real infographic (compressed JPEG, full res) at public/infographics/ix-biopharma-june-2026.jpg
    infographicImage: "/infographics/ix-biopharma-june-2026.jpg",
    // Real downloadable PDF at public/downloads/ix-biopharma-june-2026.pdf
    downloadFile: "/downloads/ix-biopharma-june-2026.pdf",
  },
  {
    slug: "addvalue-technologies",
    name: "Addvalue Technologies Ltd.",
    ticker: "A31",
    exchange: "SGX",
    market: "Singapore",
    sector: "Satellite Communications",
    reportTitle:
      "Equity Research Snapshot: Addvalue Technologies Ltd. (SGX: A31)",
    summary:
      "A visual brief on Addvalue Technologies’ FY2026 reported turnaround, highlighting revenue growth, operating cash flow improvement, de-leveraging, order book visibility, customer concentration, capitalized development costs, and valuation/event-risk considerations.",
    reportDate: "2026-06-01",
    tags: [
      "Satellite Communications",
      "Turnaround",
      "Cash Flow",
      "De-leveraging",
      "Customer Concentration",
      "Accounting Observations",
      "SGX",
    ],
    // Real infographic (compressed JPEG, full res) at public/infographics/addvalue-technologies-june-2026.jpg
    infographicImage: "/infographics/addvalue-technologies-june-2026.jpg",
    // Real downloadable PDF at public/downloads/addvalue-technologies-june-2026.pdf
    downloadFile: "/downloads/addvalue-technologies-june-2026.pdf",
    isFeatured: true,
  },
  {
    slug: "koh-brothers-eco-engineering",
    name: "Koh Brothers Eco Engineering",
    ticker: "5HV",
    exchange: "SGX",
    market: "Singapore",
    sector: "Construction & Engineering",
    reportTitle:
      "Koh Brothers Eco Engineering: FY2025 Performance & Risk Dashboard",
    summary:
      "A visual brief on Koh Brothers Eco Engineering's FY2025 performance and risks — covering its engineering & construction and bio-refinery (Oiltek) segments, segment profitability, financial and balance-sheet health, cash flow, order book visibility, and accounting and disclosure observations.",
    reportDate: "2026-06-01",
    tags: [
      "Construction & Engineering",
      "Bio-Refinery",
      "Cash Flow",
      "Order Book",
      "Accounting Observations",
      "Key Risks",
      "SGX",
    ],
    // Real infographic (compressed JPEG, full res) at public/infographics/koh-brothers-eco-engineering-june-2026.jpg
    infographicImage: "/infographics/koh-brothers-eco-engineering-june-2026.jpg",
    // Real downloadable PDF at public/downloads/koh-brothers-eco-engineering-june-2026.pdf
    downloadFile: "/downloads/koh-brothers-eco-engineering-june-2026.pdf",
  },
  {
    slug: "mapletree-logistics-trust",
    name: "Mapletree Logistics Trust",
    ticker: "M44U",
    exchange: "SGX",
    market: "Singapore",
    sector: "Logistics REIT",
    reportTitle:
      "Mapletree Logistics Trust (SGX: M44U): FY2025/26 Performance & Valuation Analysis",
    summary:
      "A visual brief on Mapletree Logistics Trust's FY2025/26 performance and valuation — covering its Asia-Pacific logistics portfolio backed by Mapletree/Temasek, the de-rating in distribution per unit (DPU) amid currency headwinds and rising interest costs, gross revenue and aggregate leverage trends, comparative profitability and debt metrics, valuation versus NAV, geographic and concentration risks, and disciplined asset rejuvenation.",
    reportDate: "2026-06-01",
    tags: [
      "Logistics REIT",
      "Real Estate",
      "Distribution per Unit",
      "Leverage",
      "Asia-Pacific",
      "Valuation",
      "Key Risks",
      "SGX",
    ],
    // Real infographic (compressed JPEG, full res) at public/infographics/mapletree-logistics-trust-june-2026.jpg
    infographicImage: "/infographics/mapletree-logistics-trust-june-2026.jpg",
    // Real downloadable PDF at public/downloads/mapletree-logistics-trust-june-2026.pdf
    downloadFile: "/downloads/mapletree-logistics-trust-june-2026.pdf",
  },
];
