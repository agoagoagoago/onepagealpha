import { NextResponse } from "next/server";
import { Resend } from "resend";

// Runs in the Node.js serverless runtime (default for route handlers).
// The in-memory rate limiter below is best-effort and only shared within a warm
// instance — see note near the limiter.

// --- Server-side email validation (mirrors the client) ---------------------
function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;
  if (trimmed.length > 254) return false;
  if (/\s/.test(trimmed)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
}

// --- Best-effort in-memory rate limiting -----------------------------------
// NOTE: This is per-instance only and resets on cold starts. It deters casual
// abuse but is NOT a strong guarantee on serverless. For production-scale
// limiting use a shared store (Upstash Redis, Vercel KV, etc.).
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
  email?: string;
  newsletterOptIn?: boolean;
  companyName?: string;
  companySlug?: string;
  ticker?: string;
  exchange?: string;
  reportTitle?: string;
  downloadFile?: string;
  sourcePage?: string;
};

export async function POST(req: Request) {
  // --- Parse JSON ---
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const newsletterOptIn = Boolean(body.newsletterOptIn);
  const companyName = (body.companyName ?? "").trim();
  const companySlug = (body.companySlug ?? "").trim();
  const ticker = (body.ticker ?? "").trim();
  const exchange = (body.exchange ?? "").trim();
  const reportTitle = (body.reportTitle ?? "").trim();
  const downloadFile = (body.downloadFile ?? "").trim();
  const sourcePage = (body.sourcePage ?? "").trim();

  // --- Validate ---
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  if (!companyName || !companySlug || !reportTitle || !downloadFile) {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  // downloadFile must be a safe, local public PDF path — never an external URL.
  if (
    !downloadFile.startsWith("/downloads/") ||
    downloadFile.includes("..") ||
    !downloadFile.endsWith(".pdf")
  ) {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // --- Rate limiting (best-effort) ---
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!underLimit(ipHits, ip, IP_MAX) || !underLimit(emailHits, email, EMAIL_MAX)) {
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  // --- Build absolute download URL on the server (never trust a client URL) ---
  let base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) {
    // Fallback to the request origin if it looks safe.
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    const host = req.headers.get("host");
    if (host) base = `${proto}://${host}`;
  }
  const downloadUrl = base ? `${base.replace(/\/$/, "")}${downloadFile}` : downloadFile;

  // --- Resend configuration ---
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Email service is not configured." },
      { status: 500 },
    );
  }
  // TODO: In production set RESEND_FROM_EMAIL to a verified-domain address,
  // e.g. "OnePage Alpha <hello@onepagealpha.com>".
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "OnePage Alpha <onboarding@resend.dev>";
  const ownerEmail = process.env.RESEND_OWNER_EMAIL;

  const resend = new Resend(apiKey);

  // --- Email to the user ---
  const safeCompany = escapeHtml(companyName);
  const optInNote = newsletterOptIn
    ? `<p>You opted in to future OnePage Alpha visual briefs and updates. You can unsubscribe anytime.</p>`
    : "";
  const optInNoteText = newsletterOptIn
    ? "\nYou opted in to future OnePage Alpha visual briefs and updates. You can unsubscribe anytime.\n"
    : "";

  const html = `
    <h1>Your OnePage Alpha infographic is ready</h1>
    <p>Thanks for requesting the OnePage Alpha visual brief for <strong>${safeCompany}</strong>.</p>
    <p><a href="${downloadUrl}">Download the infographic</a></p>
    <p>This visual brief is based on public company disclosures and is provided for educational and informational purposes only. It is not financial advice, investment advice, or a recommendation to buy, sell, or hold any security.</p>
    ${optInNote}
    <p>OnePage Alpha<br/>Visual annual report intelligence for busy investors.</p>
  `.trim();

  const text = `Your OnePage Alpha infographic is ready

Thanks for requesting the OnePage Alpha visual brief for ${companyName}.

Download it here:
${downloadUrl}

This visual brief is based on public company disclosures and is provided for educational and informational purposes only. It is not financial advice, investment advice, or a recommendation to buy, sell, or hold any security.
${optInNoteText}
OnePage Alpha
Visual annual report intelligence for busy investors.`;

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Your OnePage Alpha infographic download",
      html,
      text,
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[download-request] Resend user email failed:", error);
      return NextResponse.json(
        { ok: false, message: "Unable to send download email right now. Please try again." },
        { status: 500 },
      );
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[download-request] Resend threw:", err);
    return NextResponse.json(
      { ok: false, message: "Unable to send download email right now. Please try again." },
      { status: 500 },
    );
  }

  // --- Owner notification (optional; never fails the request) ---
  if (ownerEmail) {
    try {
      const timestamp = new Date().toISOString();
      await resend.emails.send({
        from: fromEmail,
        to: ownerEmail,
        subject: `New OnePage Alpha download: ${companyName}`,
        text: `New infographic download request:

email: ${email}
newsletterOptIn: ${newsletterOptIn}
companyName: ${companyName}
ticker: ${ticker}
exchange: ${exchange}
reportTitle: ${reportTitle}
companySlug: ${companySlug}
sourcePage: ${sourcePage}
downloadUrl: ${downloadUrl}
timestamp: ${timestamp}`,
      });
    } catch (err) {
      // Owner notification is best-effort — log only, don't fail the user flow.
      // eslint-disable-next-line no-console
      console.warn("[download-request] Owner notification failed:", err);
    }
  }

  return NextResponse.json({ ok: true, message: "Download email sent.", downloadUrl });
}
