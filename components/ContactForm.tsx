"use client";

import { useRef, useState } from "react";
import {
  trackContactFormStarted,
  trackContactFormInvalid,
  trackContactFormSubmitted,
  trackContactFormFailed,
} from "@/lib/fathom";

// Contact submissions are sent to a Resend-backed API route.
const CONTACT_API = "/api/contact";

// Basic email shape check (the server validates again).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ENQUIRY_TYPES = [
  "General enquiry",
  "Feedback",
  "Correction",
  "Custom visual brief",
  "Partnership / collaboration",
  "Investor relations / agency enquiry",
  "Media / speaking",
  "Technical issue",
  "Other",
];

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = {
  email?: string;
  enquiryType?: string;
  subject?: string;
  message?: string;
};

const labelClass = "block text-sm font-medium text-ink";
const inputClass =
  "mt-1.5 w-full rounded-lg border border-line bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";
const helpClass = "mt-1 text-xs text-ink-muted";
const errorTextClass = "mt-1 text-sm text-red-700";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enquiryType, setEnquiryType] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [optIn, setOptIn] = useState(false); // default unchecked
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Ensures contact_form_started fires at most once per page session.
  const startedRef = useRef(false);
  function markStarted() {
    if (!startedRef.current) {
      startedRef.current = true;
      trackContactFormStarted();
    }
  }

  function clearError(key: keyof FieldErrors) {
    setFieldErrors((p) => (p[key] ? { ...p, [key]: undefined } : p));
  }

  function resetForm() {
    setName("");
    setEmail("");
    setEnquiryType("");
    setSubject("");
    setMessage("");
    setOptIn(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    markStarted();

    // --- Client-side validation ---
    const errors: FieldErrors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = "Please enter your email address.";
    } else if (
      trimmedEmail.length > 254 ||
      /\s/.test(trimmedEmail) ||
      !EMAIL_REGEX.test(trimmedEmail.toLowerCase())
    ) {
      errors.email = "Please enter a valid email address.";
    }
    if (!enquiryType) errors.enquiryType = "Please choose an enquiry type.";
    if (!subject.trim()) errors.subject = "Please enter a subject.";
    else if (subject.trim().length > 160) errors.subject = "Subject is too long (max 160).";
    if (!message.trim()) errors.message = "Please enter a message.";
    else if (message.trim().length > 3000) errors.message = "Message is too long (max 3000).";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      trackContactFormInvalid();
      if (errors.email) emailRef.current?.focus();
      else if (errors.enquiryType) typeRef.current?.focus();
      else if (errors.subject) subjectRef.current?.focus();
      else if (errors.message) messageRef.current?.focus();
      return; // do NOT call the API
    }
    setFieldErrors({});
    setErrorMessage("");
    setStatus("submitting");

    try {
      const sourcePage =
        typeof window !== "undefined" ? window.location.pathname : "/contact";

      const res = await fetch(CONTACT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: trimmedEmail,
          enquiryType,
          subject: subject.trim(),
          message: message.trim(),
          newsletterOptIn: optIn,
          sourcePage,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;

      if (res.ok && data?.ok) {
        setStatus("success");
        resetForm();
        trackContactFormSubmitted();
      } else {
        setErrorMessage(
          data?.message || "Unable to send your message right now. Please try again.",
        );
        setStatus("error");
        trackContactFormFailed();
      }
    } catch {
      setErrorMessage("Unable to send your message right now. Please try again.");
      setStatus("error");
      trackContactFormFailed();
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
          Thanks — your message has been sent. We’ll review it and reply if a
          response is needed.
        </p>
      )}

      {/* Error message */}
      {status === "error" && (
        <p
          role="alert"
          className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errorMessage || "Unable to send your message right now. Please try again."}
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
              type="text"
              autoComplete="name"
              maxLength={120}
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
              ref={emailRef}
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
              }}
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby="email-help"
              className={inputClass}
            />
            {fieldErrors.email ? (
              <p className={errorTextClass}>{fieldErrors.email}</p>
            ) : (
              <p id="email-help" className={helpClass}>
                Used only to reply to your message.
              </p>
            )}
          </div>

          {/* Enquiry type (required) */}
          <div>
            <label htmlFor="enquiryType" className={labelClass}>
              Enquiry type <span className="text-gold">*</span>
            </label>
            <select
              id="enquiryType"
              ref={typeRef}
              required
              value={enquiryType}
              onChange={(e) => {
                setEnquiryType(e.target.value);
                clearError("enquiryType");
              }}
              aria-invalid={fieldErrors.enquiryType ? true : undefined}
              className={`${inputClass} appearance-none bg-ivory`}
            >
              <option value="" disabled>
                Select an option…
              </option>
              {ENQUIRY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {fieldErrors.enquiryType && (
              <p className={errorTextClass}>{fieldErrors.enquiryType}</p>
            )}
          </div>

          {/* Subject (required) */}
          <div>
            <label htmlFor="subject" className={labelClass}>
              Subject <span className="text-gold">*</span>
            </label>
            <input
              id="subject"
              ref={subjectRef}
              type="text"
              required
              maxLength={160}
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                clearError("subject");
              }}
              aria-invalid={fieldErrors.subject ? true : undefined}
              className={inputClass}
            />
            {fieldErrors.subject && <p className={errorTextClass}>{fieldErrors.subject}</p>}
          </div>
        </div>

        {/* Message (required) */}
        <div className="mt-5">
          <label htmlFor="message" className={labelClass}>
            Message <span className="text-gold">*</span>
          </label>
          <textarea
            id="message"
            ref={messageRef}
            required
            rows={5}
            maxLength={3000}
            placeholder="How can I help?"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              clearError("message");
            }}
            aria-invalid={fieldErrors.message ? true : undefined}
            className={`${inputClass} resize-y`}
          />
          {fieldErrors.message && <p className={errorTextClass}>{fieldErrors.message}</p>}
        </div>

        {/* Newsletter opt-in (default unchecked) */}
        <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={optIn}
            onChange={(e) => setOptIn(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-line text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
          Send me occasional OnePage Alpha updates.
        </label>

        {/* Privacy note */}
        <p className="mt-4 text-xs leading-relaxed text-ink-muted">
          No spam. Your email is used to respond to your message. Educational
          content only — not financial advice.
        </p>

        {/* Submit */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {status === "success" ? "Message sent" : submitting ? "Sending..." : "Send Message"}
          </button>
        </div>

        {/* Compliance note */}
        <p className="mt-6 text-xs leading-relaxed text-ink-muted">
          OnePage Alpha does not provide personalized investment advice,
          buy/sell/hold recommendations, or price targets.
        </p>
      </form>
    </div>
  );
}
