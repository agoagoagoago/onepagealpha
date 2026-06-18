/**
 * Fathom Analytics tracking helpers for OnePage Alpha.
 *
 * We use Fathom's modern event API: `window.fathom.trackEvent("event_name")`.
 * (The old `trackGoal` API is intentionally NOT used.)
 *
 * Because Fathom custom-event *properties* can be limited depending on plan/setup,
 * each action fires TWO events:
 *   1. a general event   (e.g. "infographic_download_clicked")
 *   2. a company-specific event (e.g. "download_ix-biopharma")
 * so you can see both the total and the per-company breakdown in the dashboard.
 *
 * IMPORTANT TESTING NOTE:
 * Fathom custom events often do NOT fire on `localhost` / `http://`. In local
 * development the helpers below fail silently (and optionally log to the console).
 * Do FINAL event verification AFTER deploying to Vercel over HTTPS, by watching
 * the Fathom dashboard.
 */

// ---------------------------------------------------------------------------
// TypeScript declaration for the global Fathom object injected by script.js.
// ---------------------------------------------------------------------------
declare global {
  interface Window {
    fathom?: {
      trackEvent: (eventName: string, options?: Record<string, unknown>) => void;
    };
  }
}

const isDev = process.env.NODE_ENV === "development";

/** Context describing which company + where the click happened. */
export type TrackContext = {
  company: string;
  slug: string;
  ticker: string;
  exchange: string;
  /** Where on the site the click happened, e.g. "homepage_featured". */
  location: string;
};

/**
 * Make an event-name fragment lowercase and safe:
 * spaces -> hyphens, drop anything that isn't [a-z0-9_-], collapse repeats.
 */
export function toSafeEventName(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");
}

/**
 * Generic, type-safe event tracker.
 * - Safe during SSR (checks for `window`).
 * - Safe when Fathom hasn't loaded (checks for `window.fathom.trackEvent`).
 * - Never throws; fails silently so the UI is never affected.
 */
export function trackEvent(eventName: string): void {
  if (typeof window === "undefined") return; // SSR guard

  if (window.fathom?.trackEvent) {
    window.fathom.trackEvent(eventName);
  } else if (isDev) {
    // Fathom isn't loaded (common in local dev) — log so you can confirm wiring.
    // eslint-disable-next-line no-console
    console.debug(`[fathom] (dev) would track event: "${eventName}"`);
  }
}

/** Track an infographic download/click for a specific company. */
export function trackInfographicDownload(ctx: TrackContext): void {
  const slug = toSafeEventName(ctx.slug);
  if (isDev) {
    // eslint-disable-next-line no-console
    console.debug(
      `[fathom] (dev) infographic_download_clicked @ ${ctx.location} — ${ctx.company} (${ctx.ticker}:${ctx.exchange})`,
    );
  }
  trackEvent("infographic_download_clicked"); // general
  if (slug) trackEvent(`download_${slug}`); // company-specific
}

/** Track a Buy Me a Coffee click for a specific company. */
export function trackBuyMeACoffee(ctx: TrackContext): void {
  const slug = toSafeEventName(ctx.slug);
  if (isDev) {
    // eslint-disable-next-line no-console
    console.debug(
      `[fathom] (dev) buy_me_a_coffee_clicked @ ${ctx.location} — ${ctx.company} (${ctx.ticker}:${ctx.exchange})`,
    );
  }
  trackEvent("buy_me_a_coffee_clicked"); // general
  if (slug) trackEvent(`coffee_${slug}`); // company-specific
}
