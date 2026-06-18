/**
 * Read-only helpers over the company data in data/companies.ts.
 * Pure functions, no side effects — safe to call from server components.
 */
import { companies, type Company } from "@/data/companies";

/** All companies, sorted newest report first. */
export function getAllCompanies(): Company[] {
  return [...companies].sort((a, b) => b.reportDate.localeCompare(a.reportDate));
}

/**
 * The featured company for the homepage.
 * Uses the one flagged `isFeatured`, otherwise the most recent by reportDate.
 * Always returns a company (the data file is never empty).
 */
export function getFeaturedCompany(): Company {
  return companies.find((c) => c.isFeatured) ?? getAllCompanies()[0];
}

/** Find a single company by its slug (undefined if not found). */
export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

/**
 * Up to `limit` other companies in the same sector or market.
 * Falls back to the latest other companies if nothing matches.
 */
export function getRelatedCompanies(company: Company, limit = 3): Company[] {
  const others = getAllCompanies().filter((c) => c.slug !== company.slug);
  const matches = others.filter(
    (c) => c.sector === company.sector || c.market === company.market,
  );
  const pool = matches.length > 0 ? matches : others;
  return pool.slice(0, limit);
}

/** The latest companies (all of them if no limit is given). */
export function getLatestCompanies(limit?: number): Company[] {
  const all = getAllCompanies();
  return typeof limit === "number" ? all.slice(0, limit) : all;
}

/** Human-friendly report date, e.g. "12 Apr 2026". Falls back to raw value. */
export function formatReportDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
