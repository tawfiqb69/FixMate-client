import Link from "next/link";
import { Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import HeroVisual from "@/components/home/hero-visual";

const lines = [
  { words: ["Fixed", "first."], highlight: false },
  { words: ["Paid", "after."], highlight: true },
];

const assurances = [
  { n: "01", text: "Verified technicians" },
  { n: "02", text: "Every step tracked" },
  { n: "03", text: "Pay after the job" },
];

export default function Hero() {
  let index = 0;

  return (
    <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          Repair &middot; Track &middot; Pay after service
        </p>

        <h1 className="mt-5 font-display text-[3.25rem] font-semibold leading-[0.98] tracking-tight sm:text-7xl lg:text-[5.5rem]">
          {lines.map((line, li) => (
            <span key={li} className="block">
              {line.words.map((word) => {
                const delay = index++ * 120;
                return (
                  <span key={word}>
                    <span
                      className={`inline-block motion-safe:animate-word-in ${
                        line.highlight ? "text-primary" : ""
                      }`}
                      style={{ animationDelay: `${delay}ms` }}
                    >
                      {word}
                    </span>{" "}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Book a verified technician for your phone, laptop or home appliance,
          follow every step of the repair, and pay only when the job is done.
        </p>

        <form
          action="/services"
          method="get"
          role="search"
          className="mt-8 flex max-w-xl items-center gap-2 rounded-full border bg-card p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-ring/40"
        >
          <Search className="ml-3 size-5 shrink-0 text-muted-foreground" />
          <input
            type="search"
            name="search"
            aria-label="Search repair services"
            placeholder='Try "iPhone screen" or "AC servicing"'
            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="rounded-full bg-brand-gradient px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:opacity-90 active:translate-y-px active:shadow-sm"
          >
            Search
          </button>
        </form>

        <div className="mt-5">
          <Link
            href="/services"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Browse Services
          </Link>
        </div>

        <ul className="mt-9 grid max-w-xl grid-cols-3 gap-4 border-t pt-5">
          {assurances.map((a) => (
            <li key={a.n}>
              <span className="font-mono text-[11px] text-primary">{a.n}</span>
              <p className="mt-1 text-sm font-medium leading-snug">{a.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <HeroVisual />
    </section>
  );
}