/**
 * Fathom Analytics tracking helpers for OnePage Alpha.
 *
 * We use Fathom's modern event API: `window.fathom.trackEvent("event_name")`.
 * (The old `trackGoal` API is intentionally NOT used.)
 *
 * IMPORTANT TESTING NOTE:
 * Fathom custom events may not fire on `localhost` / `http://`. They are
 * designed to run on your live site over HTTPS. So: in local development the
 * helpers below fail silently (and optionally log to the console), and you
 * should do FINAL event verification AFTER deploying to Vercel over HTTPS,
 * by watching the Fathom dashboard.
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

/**
 * Generic, type-safe event tracker.
 * - Safe during server-side rendering (checks for `window`).
 * - Safe when Fathom has not loaded yet (checks for `window.fathom.trackEvent`).
 * - Never throws; fails silently so the UI is never affected.
 */
export function trackEvent(eventName: string): void {
  // Guard: no `window` during SSR.
  if (typeof window === "undefined") return;

  if (window.fathom?.trackEvent) {
    window.fathom.trackEvent(eventName);
  } else if (isDev) {
    // Fathom isn't loaded (common in local dev) — just log so you can confirm
    // the click handler is wiring up correctly. Nothing is sent.
    // eslint-disable-next-line no-console
    console.debug(`[fathom] (dev) would track event: "${eventName}"`);
  }
}

/**
 * Track an infographic download/click.
 * `location` describes WHERE on the page the click happened (e.g. "hero").
 */
export function trackInfographicDownload(location: string): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.debug(`[fathom] (dev) infographic_download_clicked @ ${location}`);
  }
  trackEvent("infographic_download_clicked");
}

/**
 * Track a Buy Me a Coffee button click.
 * `location` describes WHERE on the page the click happened (e.g. "footer").
 */
export function trackBuyMeACoffee(location: string): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.debug(`[fathom] (dev) buy_me_a_coffee_clicked @ ${location}`);
  }
  trackEvent("buy_me_a_coffee_clicked");
}
