"use client";

import { useRef, useState } from "react";
import {
  trackRequestCompanyFormStarted,
  trackRequestCompanySubmitted,
  trackRequestCompanyFailed,
} from "@/lib/fathom";

// Formspree endpoint, read from the public env var. Missing => graceful notice.
// Set NEXT_PUBLIC_FORMSPREE_ENDPOINT in .env.local (see .env.example).
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

// Options for the "What should the brief focus on?" checkbox group.
const FOCUS_OPTIONS = [
  "Business model",
  "Financial highlights",
  "Cash flow quality",
  "Accounting observations",
  "Dilution",
  "Key risks",
  "Questions for management",
  "Other",
];

type Status = "idle" | "submitting" | "success" | "error";

const labelClass = "block text-sm font-medium text-ink";
const inputClass =
  "mt-1.5 w-full rounded-lg border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";
const helpClass = "mt-1 text-xs text-ink-muted";

export default function RequestCompanyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [ticker, setTicker] = useState("");
  const [exchange, setExchange] = useState("");
  const [link, setLink] = useState("");
  const [focus, setFocus] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // Ensures request_company_form_started fires at most once per page session.
  const startedRef = useRef(false);
  function markStarted() {
    if (!startedRef.current) {
      startedRef.current = true;
      trackRequestCompanyFormStarted();
    }
  }

  function toggleFocus(option: string) {
    markStarted();
    setFocus((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    );
  }

  function resetForm() {
    setName("");
    setEmail("");
    setCompany("");
    setTicker("");
    setExchange("");
    setLink("");
    setFocus([]);
    setMessage("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // No endpoint configured — fail gracefully (button is already disabled,
    // this is just a safety net).
    if (!FORMSPREE_ENDPOINT) return;

    // Required fields (also enforced by the browser via `required`).
    if (!email.trim() || !company.trim()) return;

    // Track "started" once if it hasn't been already (e.g. via focus/change).
    markStarted();

    setStatus("submitting");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("company", company);
      formData.append("ticker", ticker);
      formData.append("exchange", exchange);
      formData.append("report_link", link);
      focus.forEach((f) => formData.append("focus", f));
      formData.append("message", message);
      // Hidden metadata fields.
      formData.append("_subject", "New OnePage Alpha company request");
      formData.append("source", "onepagealpha.com/request");

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        resetForm();
        trackRequestCompanySubmitted();
      } else {
        setStatus("error");
        trackRequestCompanyFailed();
      }
    } catch {
      setStatus("error");
      trackRequestCompanyFailed();
    }
  }

  const submitting = status === "submitting";

  return (
    <div>
      {/* Missing-endpoint developer notice */}
      {!FORMSPREE_ENDPOINT && (
        <p
          role="status"
          className="mb-6 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink-soft"
        >
          Form endpoint is not configured yet. Add{" "}
          <code className="font-mono text-ink">
            NEXT_PUBLIC_FORMSPREE_ENDPOINT
          </code>{" "}
          to your environment variables.
        </p>
      )}

      {/* Success message */}
      {status === "success" && (
        <p
          role="status"
          className="mb-6 rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink"
        >
          Thanks — your company request has been received. If there is enough
          reader interest, it may be considered for a future OnePage Alpha
          visual brief.
        </p>
      )}

      {/* Error message */}
      {status === "error" && (
        <p
          role="alert"
          className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          Something went wrong. Please try again, or email the request manually
          later.
        </p>
      )}

      <form onSubmit={handleSubmit} onFocus={markStarted} noValidate>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Name (optional) */}
          <div>
            <label htmlFor="name" className={labelClass}>
              Name <span className="text-ink-muted">(optional)</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Email (required) */}
          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-gold">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              aria-describedby="email-help"
            />
            <p id="email-help" className={helpClass}>
              Used only if I need to clarify your request.
            </p>
          </div>

          {/* Company (required) */}
          <div>
            <label htmlFor="company" className={labelClass}>
              Company name <span className="text-gold">*</span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Ticker (optional) */}
          <div>
            <label htmlFor="ticker" className={labelClass}>
              Ticker <span className="text-ink-muted">(optional)</span>
            </label>
            <input
              id="ticker"
              name="ticker"
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Exchange / Market (optional) */}
          <div>
            <label htmlFor="exchange" className={labelClass}>
              Exchange / Market{" "}
              <span className="text-ink-muted">(optional)</span>
            </label>
            <input
              id="exchange"
              name="exchange"
              type="text"
              placeholder="SGX, Bursa, ASX, HKEX, Nasdaq"
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Report / announcement link (optional) */}
          <div>
            <label htmlFor="report_link" className={labelClass}>
              Annual report or announcement link{" "}
              <span className="text-ink-muted">(optional)</span>
            </label>
            <input
              id="report_link"
              name="report_link"
              type="url"
              placeholder="https://"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Focus checkbox group */}
        <fieldset className="mt-6">
          <legend className={labelClass}>What should the brief focus on?</legend>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {FOCUS_OPTIONS.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft"
              >
                <input
                  type="checkbox"
                  name="focus"
                  value={option}
                  checked={focus.includes(option)}
                  onChange={() => toggleFocus(option)}
                  className="h-4 w-4 rounded border-line text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Message (optional) */}
        <div className="mt-6">
          <label htmlFor="message" className={labelClass}>
            Message <span className="text-ink-muted">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Tell me why this company is interesting or what you want the brief to examine."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Submit */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={submitting || !FORMSPREE_ENDPOINT}
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>

        {/* Compliance note */}
        <p className="mt-6 text-xs leading-relaxed text-ink-muted">
          Suggested or paid requests do not influence conclusions. OnePage Alpha
          is educational only and not financial advice.
        </p>
      </form>
    </div>
  );
}
