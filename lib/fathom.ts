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

// ---------------------------------------------------------------------------
// "Request a Company" tracking
// ---------------------------------------------------------------------------

// Maps a CTA location to its location-specific event name.
const REQUEST_LOCATION_EVENT: Record<string, string> = {
  homepage: "request_company_homepage",
  companies_library: "request_company_library",
  company_page: "request_company_company_page",
  footer: "request_company_footer",
};

/** Track a click on a "Request a Company" CTA. */
export function trackRequestCompanyClick({
  location,
  companySlug,
  companyName,
}: {
  location: string;
  companySlug?: string;
  companyName?: string;
}): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.debug(
      `[fathom] (dev) request_company_clicked @ ${location}${
        companyName ? ` — ${companyName}` : ""
      }`,
    );
  }
  trackEvent("request_company_clicked"); // general
  // location-specific
  trackEvent(
    REQUEST_LOCATION_EVENT[location] ??
      `request_company_${toSafeEventName(location)}`,
  );
  // company-specific (only on individual company pages)
  const slug = companySlug ? toSafeEventName(companySlug) : "";
  if (slug) trackEvent(`request_company_from_${slug}`);
}

/** Track that the visitor started filling in the request form (once per page). */
export function trackRequestCompanyFormStarted(): void {
  trackEvent("request_company_form_started");
}

/** Track a successful request form submission. */
export function trackRequestCompanySubmitted(): void {
  trackEvent("request_company_submitted");
}

/** Track a failed request form submission. */
export function trackRequestCompanyFailed(): void {
  trackEvent("request_company_failed");
}

/** Track a request form submission blocked by client-side validation. */
export function trackRequestCompanyInvalid(): void {
  trackEvent("request_company_invalid");
}

// ---------------------------------------------------------------------------
// Contact form tracking
// ---------------------------------------------------------------------------

/** Track that the visitor started filling in the contact form (once per page). */
export function trackContactFormStarted(): void {
  trackEvent("contact_form_started");
}

/** Track a contact form submission blocked by client-side validation. */
export function trackContactFormInvalid(): void {
  trackEvent("contact_form_invalid");
}

/** Track a successful contact form submission. */
export function trackContactFormSubmitted(): void {
  trackEvent("contact_form_submitted");
}

/** Track a failed contact form submission. */
export function trackContactFormFailed(): void {
  trackEvent("contact_form_failed");
}

// ---------------------------------------------------------------------------
// Email-gated download tracking
// ---------------------------------------------------------------------------

/** Track that the email-capture gate opened (user clicked a download CTA). */
export function trackDownloadGateOpened(ctx: TrackContext): void {
  const slug = toSafeEventName(ctx.slug);
  if (isDev) {
    // eslint-disable-next-line no-console
    console.debug(`[fathom] (dev) download_gate_opened @ ${ctx.location} — ${ctx.company}`);
  }
  trackEvent("download_gate_opened");
  if (slug) trackEvent(`download_gate_opened_${slug}`);
}

/** Track a successful email submission in the download gate. */
export function trackDownloadEmailSubmitted(ctx: TrackContext): void {
  const slug = toSafeEventName(ctx.slug);
  if (isDev) {
    // eslint-disable-next-line no-console
    console.debug(`[fathom] (dev) download_email_submitted @ ${ctx.location} — ${ctx.company}`);
  }
  trackEvent("download_email_submitted");
  if (slug) trackEvent(`download_email_submitted_${slug}`);
}

/** Track an invalid email entered in the download gate (failed client validation). */
export function trackDownloadEmailInvalid(ctx: TrackContext): void {
  const slug = toSafeEventName(ctx.slug);
  if (isDev) {
    // eslint-disable-next-line no-console
    console.debug(`[fathom] (dev) download_email_invalid @ ${ctx.location} — ${ctx.company}`);
  }
  trackEvent("download_email_invalid");
  if (slug) trackEvent(`download_email_invalid_${slug}`);
}

/** Track a failed email submission in the download gate. */
export function trackDownloadEmailFailed(ctx: TrackContext): void {
  const slug = toSafeEventName(ctx.slug);
  if (isDev) {
    // eslint-disable-next-line no-console
    console.debug(`[fathom] (dev) download_email_failed @ ${ctx.location} — ${ctx.company}`);
  }
  trackEvent("download_email_failed");
  if (slug) trackEvent(`download_email_failed_${slug}`);
}

/**
 * Track the final, revealed download click after the email gate.
 * Fires the existing download events (so prior analytics keep working) PLUS
 * the new gated-completion events.
 */
export function trackGatedDownloadCompleted(ctx: TrackContext): void {
  // Existing events: infographic_download_clicked + download_<slug>
  trackInfographicDownload(ctx);
  // New events
  const slug = toSafeEventName(ctx.slug);
  trackEvent("gated_download_completed");
  if (slug) trackEvent(`gated_download_completed_${slug}`);
}
