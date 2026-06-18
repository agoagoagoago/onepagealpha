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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "OnePage Alpha",
  description: "Visual annual report intelligence for busy investors.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "OnePage Alpha",
    title: "OnePage Alpha",
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
    title: "OnePage Alpha",
    description:
      "Download a free annual report infographic and support independent visual financial research.",
    images: [featuredOgImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#FBFAF7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- Fathom Analytics configuration --------------------------------------
  // Site ID comes from an env var so the repo stays free of secrets.
  // (See .env.example — set this in Vercel for production.)
  const fathomSiteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID;
  // Optional custom script domain; defaults to the official Fathom CDN.
  const fathomScriptUrl =
    process.env.NEXT_PUBLIC_FATHOM_SCRIPT_URL ||
    "https://cdn.usefathom.com/script.js";

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
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
