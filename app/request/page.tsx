import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RequestCompanyForm from "@/components/RequestCompanyForm";

export const metadata: Metadata = {
  title: "Request a Company | OnePage Alpha",
  description:
    "Suggest a public company for a future OnePage Alpha visual annual report brief.",
  alternates: { canonical: "/request" },
  openGraph: {
    title: "Request a Company | OnePage Alpha",
    description:
      "Suggest a public company for a future OnePage Alpha visual annual report brief.",
    url: "/request",
  },
};

export default function RequestPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-content px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-serif text-4xl text-ink sm:text-5xl">
              Request a Company
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Suggest a public company for a future OnePage Alpha visual brief.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
              Requests help guide future coverage. They do not influence
              conclusions. OnePage Alpha separates facts from interpretation and
              keeps all content educational.
            </p>
          </div>

          {/* Form card */}
          <div className="mt-10 rounded-2xl border border-line bg-paper p-6 shadow-card sm:p-9">
            <RequestCompanyForm />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
