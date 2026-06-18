import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import { getFeaturedCompany } from "@/lib/companies";
import "./globals.css";

// Default social-share image = the current featured company's infographic.
const featuredOgImage = getFeaturedCompany().infographicImage;

// --- Fonts (self-hosted by next/font, no runtime network cost) -------------
const serif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// --- SEO + social sharing metadata -----------------------------------------
// Change the production URL here if your domain ever changes.
const SITE_URL = "https://onepagealpha.com";

// Favicon + Apple touch icon: square versions of the logo's icon mark live at
// app/icon.png and app/apple-icon.png, which Next.js App Router auto-detects —
// no `icons` metadata needed here. (The wide ~3:1 brand logo itself is not used
// as a favicon.) OG images stay as the company infographic below, which is more
// suitable for social sharing.

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Child pages set just their page name; the template appends the brand.
  title: {
    default:
      "OnePage Alpha — Visual annual report intelligence for busy investors",
    template: "%s | OnePage Alpha",
  },
  description: "Visual annual report intelligence for busy investors.",
  applicationName: "OnePage Alpha",
  authors: [{ name: "OnePage Alpha" }],
  creator: "OnePage Alpha",
  publisher: "OnePage Alpha",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "OnePage Alpha",
    locale: "en_US",
    title: "OnePage Alpha — Visual annual report intelligence for busy investors",
    description:
      "Download a free annual report infographic and support independent visual financial research.",
    images: [
      {
        url: featuredOgImage,
        alt: "OnePage Alpha visual brief.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OnePage Alpha — Visual annual report intelligence for busy investors",
    description:
      "Download a free annual report infographic and support independent visual financial research.",
    images: [featuredOgImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBFAF7",
};

// Organization + WebSite structured data (JSON-LD) for richer search results.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "OnePage Alpha",
      url: SITE_URL,
      logo: `${SITE_URL}/brand/Logo_OnePage_Alpha.png`,
      description: "Visual annual report intelligence for busy investors.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "OnePage Alpha",
      url: SITE_URL,
      description: "Visual annual report intelligence for busy investors.",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- Fathom Analytics configuration --------------------------------------
  // Site ID: defaults to the live OnePage Alpha site ("RAWISURF"), but can be
  // overridden via the NEXT_PUBLIC_FATHOM_SITE_ID env var (e.g. for staging).
  const fathomSiteId =
    process.env.NEXT_PUBLIC_FATHOM_SITE_ID || "RAWISURF";
  // Optional custom script domain; defaults to the official Fathom CDN.
  const fathomScriptUrl =
    process.env.NEXT_PUBLIC_FATHOM_SCRIPT_URL ||
    "https://cdn.usefathom.com/script.js";

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {/* Organization + WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}

        {/*
          Fathom script is ONLY rendered when a Site ID is present, so the
          site never breaks in local development when the env var is missing.
          Custom events (download / coffee) are best verified AFTER deploying
          over HTTPS — they often don't fire on localhost.
        */}
        {fathomSiteId && (
          <Script
            src={fathomScriptUrl}
            data-site={fathomSiteId}
            strategy="afterInteractive"
            defer
          />
        )}
      </body>
    </html>
  );
}
