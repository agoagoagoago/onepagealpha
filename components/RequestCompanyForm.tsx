"use client";

import { useRef, useState } from "react";
import {
  trackRequestCompanyFormStarted,
  trackRequestCompanySubmitted,
  trackRequestCompanyFailed,
  trackRequestCompanyInvalid,
} from "@/lib/fathom";

// Request submissions are sent to a Resend-backed API route (NOT Formspree).
const REQUEST_API = "/api/request-company";

// Basic email shape check (the server validates again).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
type FieldErrors = {
  name?: string;
  company?: string;
  email?: string;
  link?: string;
};

const labelClass = "block text-sm font-medium text-ink";
const inputClass =
  "mt-1.5 w-full rounded-lg border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";
const errorTextClass = "mt-1 text-sm text-red-700";

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);

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
    markStarted();

    // --- Client-side validation ---
    const errors: FieldErrors = {};
    if (!name.trim()) {
      errors.name = "Please enter your name.";
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = "Please enter your email address.";
    } else if (!EMAIL_REGEX.test(trimmedEmail.toLowerCase())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!company.trim()) {
      errors.company = "Please enter a company name.";
    }
    const trimmedLink = link.trim();
    if (trimmedLink && !/^https?:\/\//i.test(trimmedLink)) {
      errors.link = "Enter a valid URL starting with http:// or https://.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      trackRequestCompanyInvalid();
      // Focus the first field with an error (DOM order).
      if (errors.name) nameRef.current?.focus();
      else if (errors.email) emailRef.current?.focus();
      else if (errors.company) companyRef.current?.focus();
      else if (errors.link) linkRef.current?.focus();
      return; // do NOT call the API
    }
    setFieldErrors({});
    setErrorMessage("");
    setStatus("submitting");

    try {
      const sourcePage =
        typeof window !== "undefined" ? window.location.pathname : "/request";

      const res = await fetch(REQUEST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: trimmedEmail,
          companyName: company.trim(),
          ticker: ticker.trim(),
          exchange: exchange.trim(),
          annualReportLink: trimmedLink,
          focusAreas: focus,
          message: message.trim(),
          sourcePage,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;

      if (res.ok && data?.ok) {
        setStatus("success");
        resetForm();
        trackRequestCompanySubmitted();
      } else {
        setErrorMessage(data?.message || "Something went wrong. Please try again.");
        setStatus("error");
        trackRequestCompanyFailed();
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
      trackRequestCompanyFailed();
    }
  }

  const submitting = status === "submitting";

  return (
    <div>
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
          {errorMessage || "Something went wrong. Please try again."}
        </p>
      )}

      <form onSubmit={handleSubmit} onFocus={markStarted} noValidate>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Name (required) */}
          <div>
            <label htmlFor="name" className={labelClass}>
              Name <span className="text-gold">*</span>
            </label>
            <input
              id="name"
              ref={nameRef}
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined }));
              }}
              aria-invalid={fieldErrors.name ? true : undefined}
              className={inputClass}
            />
            {fieldErrors.name && <p className={errorTextClass}>{fieldErrors.name}</p>}
          </div>

          {/* Email (required) */}
          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-gold">*</span>
            </label>
            <input
              id="email"
              ref={emailRef}
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
              }}
              aria-invalid={fieldErrors.email ? true : undefined}
              className={inputClass}
            />
            {fieldErrors.email && <p className={errorTextClass}>{fieldErrors.email}</p>}
          </div>

          {/* Company (required) */}
          <div>
            <label htmlFor="company" className={labelClass}>
              Company name <span className="text-gold">*</span>
            </label>
            <input
              id="company"
              ref={companyRef}
              type="text"
              required
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                if (fieldErrors.company) setFieldErrors((p) => ({ ...p, company: undefined }));
              }}
              aria-invalid={fieldErrors.company ? true : undefined}
              className={inputClass}
            />
            {fieldErrors.company && <p className={errorTextClass}>{fieldErrors.company}</p>}
          </div>

          {/* Ticker (optional) */}
          <div>
            <label htmlFor="ticker" className={labelClass}>
              Ticker <span className="text-ink-muted">(optional)</span>
            </label>
            <input
              id="ticker"
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
              ref={linkRef}
              type="url"
              placeholder="https://"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                if (fieldErrors.link) setFieldErrors((p) => ({ ...p, link: undefined }));
              }}
              aria-invalid={fieldErrors.link ? true : undefined}
              className={inputClass}
            />
            {fieldErrors.link && <p className={errorTextClass}>{fieldErrors.link}</p>}
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
            disabled={submitting}
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
