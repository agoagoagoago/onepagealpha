import { NextResponse } from "next/server";
import { Resend } from "resend";

// Runs in the Node.js serverless runtime (default for route handlers).

// --- Server-side email validation (mirrors the client) ---------------------
function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;
  if (trimmed.length > 254) return false;
  if (/\s/.test(trimmed)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
}

// Allowed enquiry types (must match the client select).
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

// --- Best-effort in-memory rate limiting -----------------------------------
// NOTE: Per-instance only; resets on cold starts. Deters casual abuse but is
// NOT a strong guarantee on serverless. For production-scale limiting use a
// shared store (Upstash Redis, Vercel KV, etc.).
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const IP_MAX = 5; // max requests per IP per window
const EMAIL_MAX = 3; // max requests per email per window
const ipHits = new Map<string, number[]>();
const emailHits = new Map<string, number[]>();

function underLimit(map: Map<string, number[]>, key: string, max: number): boolean {
  const now = Date.now();
  const recent = (map.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= max) {
    map.set(key, recent);
    return false;
  }
  recent.push(now);
  map.set(key, recent);
  return true;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Body = {
  name?: string;
  email?: string;
  enquiryType?: string;
  subject?: string;
  message?: string;
  newsletterOptIn?: boolean;
  sourcePage?: string;
};

const INVALID = { ok: false, message: "Invalid request." } as const;

export async function POST(req: Request) {
  // --- Parse JSON ---
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json(INVALID, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const emailRaw = (body.email ?? "").trim();
  const email = emailRaw.toLowerCase();
  const enquiryType = (body.enquiryType ?? "").trim();
  const subject = (body.subject ?? "").trim();
  const message = (body.message ?? "").trim();
  const newsletterOptIn = Boolean(body.newsletterOptIn);
  const sourcePage = (body.sourcePage ?? "").trim();

  // --- Validate ---
  if (!isValidEmail(emailRaw)) return NextResponse.json(INVALID, { status: 400 });
  if (name.length > 120) return NextResponse.json(INVALID, { status: 400 });
  if (!ENQUIRY_TYPES.includes(enquiryType)) return NextResponse.json(INVALID, { status: 400 });
  if (!subject || subject.length > 160) return NextResponse.json(INVALID, { status: 400 });
  if (!message || message.length > 3000) return NextResponse.json(INVALID, { status: 400 });

  // --- Rate limiting (best-effort) ---
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!underLimit(ipHits, ip, IP_MAX) || !underLimit(emailHits, email, EMAIL_MAX)) {
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  // --- Resend configuration ---
  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.RESEND_OWNER_EMAIL;
  // Owner email is required to deliver the contact message.
  if (!apiKey || !ownerEmail) {
    return NextResponse.json(
      { ok: false, message: "Contact email service is not configured." },
      { status: 500 },
    );
  }
  // TODO: In production set RESEND_FROM_EMAIL to a verified-domain address,
  // e.g. "OnePage Alpha <hello@onepagealpha.com>".
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "OnePage Alpha <onboarding@resend.dev>";

  const resend = new Resend(apiKey);

  // --- Owner notification email ---
  const timestamp = new Date().toISOString();
  const rows: [string, string][] = [
    ["Name", name || "—"],
    ["Email", email],
    ["Enquiry type", enquiryType],
    ["Subject", subject],
    ["Message", message],
    ["Newsletter opt-in", newsletterOptIn ? "yes" : "no"],
    ["Source page", sourcePage || "—"],
    ["Timestamp", timestamp],
  ];

  const ownerText =
    `New OnePage Alpha contact message\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const ownerHtml =
    `<h1>New OnePage Alpha contact message</h1><table cellpadding="6" style="border-collapse:collapse">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="vertical-align:top"><strong>${escapeHtml(k)}</strong></td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
      )
      .join("") +
    `</table>`;

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: ownerEmail,
      subject: `OnePage Alpha contact: ${enquiryType} — ${subject}`,
      html: ownerHtml,
      text: ownerText,
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[contact] Resend owner email failed:", error);
      return NextResponse.json(
        { ok: false, message: "Unable to send your message right now. Please try again." },
        { status: 500 },
      );
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[contact] Resend threw:", err);
    return NextResponse.json(
      { ok: false, message: "Unable to send your message right now. Please try again." },
      { status: 500 },
    );
  }

  // --- Confirmation email to the requester (best-effort; never fails request) ---
  const confirmHtml = `
    <p>Thanks for contacting OnePage Alpha.</p>
    <p>Your message has been received. I’ll review it and reply if a response is needed.</p>
    <p>This is a copy of your enquiry:<br/>Type: ${escapeHtml(enquiryType)}<br/>Subject: ${escapeHtml(subject)}</p>
    <p>OnePage Alpha is an educational project. Nothing here is financial advice, investment advice, or a recommendation to buy, sell, or hold any security.</p>
    <p>OnePage Alpha<br/>Visual annual report intelligence for busy investors.</p>
  `.trim();
  const confirmText = `Thanks for contacting OnePage Alpha.

Your message has been received. I’ll review it and reply if a response is needed.

This is a copy of your enquiry:
Type: ${enquiryType}
Subject: ${subject}

OnePage Alpha is an educational project. Nothing here is financial advice, investment advice, or a recommendation to buy, sell, or hold any security.

OnePage Alpha
Visual annual report intelligence for busy investors.`;
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Your message to OnePage Alpha was received",
      html: confirmHtml,
      text: confirmText,
    });
  } catch (err) {
    // Best-effort — log only, don't fail the user flow.
    // eslint-disable-next-line no-console
    console.warn("[contact] Confirmation email failed:", err);
  }

  return NextResponse.json({ ok: true, message: "Message sent." });
}
