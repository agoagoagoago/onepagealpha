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

// Allowed values for the focus-areas checkbox group.
const ALLOWED_FOCUS = [
  "Business model",
  "Financial highlights",
  "Cash flow quality",
  "Accounting observations",
  "Dilution",
  "Key risks",
  "Questions for management",
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
  companyName?: string;
  ticker?: string;
  exchange?: string;
  annualReportLink?: string;
  focusAreas?: unknown;
  message?: string;
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
  const companyName = (body.companyName ?? "").trim();
  const ticker = (body.ticker ?? "").trim();
  const exchange = (body.exchange ?? "").trim();
  const annualReportLink = (body.annualReportLink ?? "").trim();
  const message = (body.message ?? "").trim();
  const sourcePage = (body.sourcePage ?? "").trim();

  // --- Validate ---
  if (!companyName || companyName.length > 160) return NextResponse.json(INVALID, { status: 400 });
  if (name.length > 120) return NextResponse.json(INVALID, { status: 400 });
  if (ticker.length > 40) return NextResponse.json(INVALID, { status: 400 });
  if (exchange.length > 80) return NextResponse.json(INVALID, { status: 400 });
  if (message.length > 2000) return NextResponse.json(INVALID, { status: 400 });

  // Email optional; if present it must be valid.
  if (emailRaw && !isValidEmail(emailRaw)) {
    return NextResponse.json(INVALID, { status: 400 });
  }

  // Annual report link optional; if present must be a safe http(s) URL.
  if (annualReportLink) {
    if (
      annualReportLink.length > 500 ||
      !/^https?:\/\//i.test(annualReportLink)
    ) {
      return NextResponse.json(INVALID, { status: 400 });
    }
  }

  // focusAreas must be an array of strings; keep only allowed values.
  if (body.focusAreas !== undefined && !Array.isArray(body.focusAreas)) {
    return NextResponse.json(INVALID, { status: 400 });
  }
  const focusAreas: string[] = Array.isArray(body.focusAreas)
    ? (body.focusAreas as unknown[])
        .filter((f): f is string => typeof f === "string")
        .filter((f) => ALLOWED_FOCUS.includes(f))
    : [];

  // --- Rate limiting (best-effort) ---
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!underLimit(ipHits, ip, IP_MAX)) {
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }
  if (email && !underLimit(emailHits, email, EMAIL_MAX)) {
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  // --- Resend configuration ---
  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.RESEND_OWNER_EMAIL;
  // Owner email is required to deliver the request.
  if (!apiKey || !ownerEmail) {
    return NextResponse.json(
      { ok: false, message: "Request email service is not configured." },
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
    ["Email", email || "—"],
    ["Company", companyName],
    ["Ticker", ticker || "—"],
    ["Exchange", exchange || "—"],
    ["Annual report link", annualReportLink || "—"],
    ["Focus areas", focusAreas.length ? focusAreas.join(", ") : "—"],
    ["Message", message || "—"],
    ["Source page", sourcePage || "—"],
    ["Timestamp", timestamp],
  ];

  const ownerText =
    `New OnePage Alpha company request\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const ownerHtml =
    `<h1>New OnePage Alpha company request</h1><table cellpadding="6" style="border-collapse:collapse">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="vertical-align:top"><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`,
      )
      .join("") +
    `</table>`;

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: ownerEmail,
      subject: `New OnePage Alpha company request: ${companyName}`,
      html: ownerHtml,
      text: ownerText,
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[request-company] Resend owner email failed:", error);
      return NextResponse.json(
        { ok: false, message: "Unable to send request right now. Please try again." },
        { status: 500 },
      );
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[request-company] Resend threw:", err);
    return NextResponse.json(
      { ok: false, message: "Unable to send request right now. Please try again." },
      { status: 500 },
    );
  }

  // --- Confirmation email to the requester (optional; never fails request) ---
  if (email) {
    const safeCompany = escapeHtml(companyName);
    const confirmHtml = `
      <p>Thanks for suggesting <strong>${safeCompany}</strong> for a future OnePage Alpha visual brief.</p>
      <p>Requests help guide future coverage, but they do not influence conclusions. OnePage Alpha separates facts from interpretation and keeps all content educational.</p>
      <p>This is not financial advice, investment advice, or a recommendation to buy, sell, or hold any security.</p>
      <p>OnePage Alpha<br/>Visual annual report intelligence for busy investors.</p>
    `.trim();
    const confirmText = `Thanks for suggesting ${companyName} for a future OnePage Alpha visual brief.

Requests help guide future coverage, but they do not influence conclusions. OnePage Alpha separates facts from interpretation and keeps all content educational.

This is not financial advice, investment advice, or a recommendation to buy, sell, or hold any security.

OnePage Alpha
Visual annual report intelligence for busy investors.`;
    try {
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Your OnePage Alpha company request was received",
        html: confirmHtml,
        text: confirmText,
      });
    } catch (err) {
      // Best-effort — log only, don't fail the user flow.
      // eslint-disable-next-line no-console
      console.warn("[request-company] Confirmation email failed:", err);
    }
  }

  return NextResponse.json({ ok: true, message: "Company request received." });
}
