import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact OnePage Alpha",
  description:
    "Contact OnePage Alpha for enquiries, feedback, corrections, custom visual briefs, partnerships, or collaboration.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact OnePage Alpha",
    description:
      "Contact OnePage Alpha for enquiries, feedback, corrections, custom visual briefs, partnerships, or collaboration.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-content px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-serif text-4xl text-ink sm:text-5xl">
              Contact OnePage Alpha
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Questions, feedback, partnerships, custom reports, or corrections —
              send a note.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
              OnePage Alpha is built around clear, source-based visual financial
              education. Use this form for general enquiries, feedback,
              collaboration ideas, corrections, or custom visual brief requests.
            </p>
          </div>

          {/* Distinction block */}
          <div className="mt-8 rounded-xl border border-line bg-paper/60 px-5 py-4 text-center text-sm text-ink-soft">
            Want to suggest a company for future coverage? Use{" "}
            <Link
              href="/request"
              className="font-medium text-gold underline-offset-2 hover:underline"
            >
              Request a Company
            </Link>
            .
          </div>

          {/* Form card */}
          <div className="mt-8 rounded-2xl border border-line bg-paper p-6 shadow-card sm:p-9">
            <ContactForm />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
