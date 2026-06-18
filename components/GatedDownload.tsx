"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  trackDownloadGateOpened,
  trackDownloadEmailSubmitted,
  trackDownloadEmailInvalid,
  trackDownloadEmailFailed,
  trackGatedDownloadCompleted,
  type TrackContext,
} from "@/lib/fathom";

// Basic email shape check (intentionally simple — Formspree validates further).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Separate Formspree endpoint for gated downloads (NOT the /request endpoint).
// See README "Download email capture setup". Missing => graceful notice.
//
// FORMSPREE AUTORESPONSE: In Formspree, enable Autoresponse for THIS download
// form and make sure the form includes a field named `email` (it does — see the
// submit below). Use the submitted `download_url`, `company_name`, and
// `report_title` fields in the autoresponse template if supported by your
// Formspree plan/settings.
//
// TODO: Add a privacy policy page before scaling email collection.
const DOWNLOAD_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_DOWNLOAD_ENDPOINT;
// Absolute site URL so the autoresponse can link to a downloadable file.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

type GateCompany = {
  slug: string;
  name: string;
  ticker: string;
  exchange: string;
  reportTitle: string;
  downloadFile: string;
};

export type GateLocation =
  | "homepage_featured"
  | "companies_library_card"
  | "company_page_image"
  | "company_page_button"
  | "footer";

type Status = "idle" | "submitting" | "success" | "error";

const labelClass = "block text-sm font-medium text-ink";
const inputClass =
  "mt-1.5 w-full rounded-lg border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

// Trigger button styles by variant. A `className` prop overrides these.
const VARIANT_CLASS: Record<NonNullable<GatedDownloadProps["triggerVariant"]>, string> = {
  primary:
    "inline-flex items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-medium text-ivory transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
  secondary:
    "inline-flex items-center justify-center rounded-full border border-line bg-paper px-7 py-3 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
  text: "text-sm text-ink-soft transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
  image:
    "block w-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
};

type GatedDownloadProps = {
  company: GateCompany;
  triggerLabel?: string;
  triggerVariant?: "primary" | "secondary" | "image" | "text";
  location: GateLocation;
  /** Override the trigger's classes (e.g. compact card buttons). */
  className?: string;
  /** Used for the "image" variant: the clickable image becomes the trigger. */
  children?: ReactNode;
};

export default function GatedDownload({
  company,
  triggerLabel = "Download Infographic",
  triggerVariant = "primary",
  location,
  className,
  children,
}: GatedDownloadProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(true); // default checked
  const [status, setStatus] = useState<Status>("idle");
  const [validationError, setValidationError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  // Shared tracking context for this company + location.
  const ctx: TrackContext = {
    company: company.name,
    slug: company.slug,
    ticker: company.ticker,
    exchange: company.exchange,
    location,
  };

  function openGate() {
    setStatus("idle");
    setOpen(true);
    trackDownloadGateOpened(ctx);
  }

  function closeGate() {
    setOpen(false);
  }

  // Escape to close + focus the email field + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus the input once the dialog is mounted.
    const t = window.setTimeout(() => emailRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!DOWNLOAD_ENDPOINT) return; // safety net; submit is disabled anyway

    // Normalize, then validate before doing anything else.
    const normalizedEmail = email.trim().toLowerCase();
    const isValid =
      normalizedEmail.length > 0 &&
      normalizedEmail.length <= 254 &&
      !/\s/.test(normalizedEmail) &&
      EMAIL_REGEX.test(normalizedEmail);

    if (!isValid) {
      setValidationError("Please enter a valid email address.");
      trackDownloadEmailInvalid(ctx);
      emailRef.current?.focus();
      return; // do NOT submit to Formspree
    }
    setValidationError("");

    setStatus("submitting");
    try {
      const downloadUrl = SITE_URL
        ? `${SITE_URL}${company.downloadFile}`
        : company.downloadFile; // fallback to relative path
      const sourcePage =
        typeof window !== "undefined" ? window.location.pathname : location;

      const fd = new FormData();
      // IMPORTANT: the field MUST be named exactly `email` so Formspree
      // Autoresponse can reply to the submitter. We send the normalized value.
      fd.append("email", normalizedEmail);
      fd.append("newsletter_opt_in", optIn ? "yes" : "no");
      fd.append("company_name", company.name);
      fd.append("company_slug", company.slug);
      fd.append("ticker", company.ticker);
      fd.append("exchange", company.exchange);
      fd.append("report_title", company.reportTitle);
      fd.append("download_url", downloadUrl);
      fd.append("source_page", sourcePage);
      fd.append("_subject", "New OnePage Alpha infographic download");

      const res = await fetch(DOWNLOAD_ENDPOINT, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        trackDownloadEmailSubmitted(ctx);
      } else {
        setStatus("error");
        trackDownloadEmailFailed(ctx);
      }
    } catch {
      setStatus("error");
      trackDownloadEmailFailed(ctx);
    }
  }

  const triggerClass = className ?? VARIANT_CLASS[triggerVariant];
  const submitting = status === "submitting";

  return (
    <>
      {/* Trigger */}
      <button type="button" onClick={openGate} className={triggerClass}>
        {triggerVariant === "image" ? children : triggerLabel}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
          onClick={closeGate}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gate-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-line bg-paper p-6 shadow-card sm:p-8"
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeGate}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ivory hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {status === "success" ? (
              // ---- Success state: reveal the download ----
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                  {company.ticker} · {company.exchange}
                </p>
                <h2 id="gate-title" className="mt-2 font-serif text-2xl text-ink">
                  Your download is ready
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  Thanks — you can download the infographic now. A copy of the
                  link may also be sent to your email.
                </p>
                <div className="mt-6">
                  <a
                    href={company.downloadFile}
                    download
                    onClick={() => trackGatedDownloadCompleted(ctx)}
                    className="inline-flex w-full items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-medium text-ivory transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:w-auto"
                  >
                    Download Infographic
                  </a>
                </div>
              </div>
            ) : (
              // ---- Email capture form ----
              <div>
                <h2 id="gate-title" className="font-serif text-2xl text-ink">
                  Get the free infographic
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Enter your email to download this OnePage Alpha visual brief. I
                  may also send occasional updates when new company briefs are
                  published.
                </p>

                {/* Missing-endpoint developer notice */}
                {!DOWNLOAD_ENDPOINT && (
                  <p
                    role="status"
                    className="mt-4 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink-soft"
                  >
                    Download email capture endpoint is not configured yet. Add{" "}
                    <code className="font-mono text-ink">
                      NEXT_PUBLIC_FORMSPREE_DOWNLOAD_ENDPOINT
                    </code>{" "}
                    to your environment variables.
                  </p>
                )}

                {status === "error" && (
                  <p
                    role="alert"
                    className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
                  >
                    Something went wrong. Please try again.
                  </p>
                )}

                <form onSubmit={handleSubmit} noValidate className="mt-5">
                  <label htmlFor="gate-email" className={labelClass}>
                    Email address
                  </label>
                  <input
                    id="gate-email"
                    ref={emailRef}
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      // Clear the validation error as soon as the user edits.
                      if (validationError) setValidationError("");
                    }}
                    aria-invalid={validationError ? true : undefined}
                    aria-describedby={validationError ? "gate-email-error" : undefined}
                    className={inputClass}
                  />
                  {validationError && (
                    <p
                      id="gate-email-error"
                      role="alert"
                      className="mt-2 text-sm text-red-700"
                    >
                      {validationError}
                    </p>
                  )}

                  <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm text-ink-soft">
                    <input
                      type="checkbox"
                      checked={optIn}
                      onChange={(e) => setOptIn(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-line text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    />
                    Send me future OnePage Alpha visual briefs and updates.
                  </label>

                  <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                    No spam. Unsubscribe anytime. Educational content only — not
                    financial advice.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting || !DOWNLOAD_ENDPOINT}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-medium text-ivory transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Continue to Download"}
                  </button>

                  <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                    By submitting your email, you agree to receive the requested
                    download and occasional OnePage Alpha updates. You can
                    unsubscribe anytime.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
