// The six things every OnePage Alpha visual brief covers.
// Edit the copy here to change the grid everywhere it's used.
const COVERAGE = [
  { title: "Business model", body: "What the company does and how it makes money." },
  { title: "Financial highlights", body: "Revenue, profit, margins, and key operating numbers." },
  { title: "Cash flow quality", body: "Whether accounting profit is supported by cash generation." },
  { title: "Accounting observations", body: "Important notes, adjustments, and disclosure items." },
  { title: "Key risks", body: "Business, funding, operational, and execution risks to monitor." },
  { title: "Questions for management", body: "Practical questions investors can ask before going deeper." },
];

/** Reusable "What this brief covers" 2x3 grid. */
export default function CoverageGrid() {
  return (
    <div className="mx-auto max-w-content">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
          Inside the brief
        </p>
        <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
          What this brief covers
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {COVERAGE.map((item) => (
          <div key={item.title} className="bg-ivory p-7 transition-colors hover:bg-paper">
            <h3 className="font-serif text-xl text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
