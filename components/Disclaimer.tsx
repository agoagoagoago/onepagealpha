/**
 * Reusable legal/compliance disclaimer.
 *
 * `variant="full"` renders the complete paragraph (used near the bottom of
 * the page). `variant="condensed"` renders smaller muted text (used in the
 * footer). The text is identical so the compliance message stays consistent.
 */
export default function Disclaimer({
  variant = "full",
}: {
  variant?: "full" | "condensed";
}) {
  const text =
    "OnePage Alpha is an educational research project. Content is based on public company disclosures and is provided for informational purposes only. Nothing on this site is financial advice, investment advice, or a recommendation to buy, sell, or hold any security. Readers should verify figures from original source documents and consult a licensed financial adviser where appropriate.";

  if (variant === "condensed") {
    return (
      <p className="text-xs leading-relaxed text-ink-muted">{text}</p>
    );
  }

  return (
    <section
      className="mx-auto max-w-content px-6 pb-20"
      aria-label="Legal disclaimer"
    >
      <div className="mx-auto max-w-3xl rounded-xl border border-line bg-paper/60 px-6 py-6">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-ink-muted">
          Important disclaimer
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{text}</p>
      </div>
    </section>
  );
}
