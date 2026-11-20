import Link from "next/link";
import { Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import HeroVisual from "@/components/home/hero-visual";

const words = [
  "Broken",
  "device?",
  "Get",
  "it",
  "fixed",
  "by",
  "verified",
  "technicians",
];
const highlightFrom = 6;

export default function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          Repair · Track · Pay after service
        </p>

        <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          {words.map((word, i) => (
            <span
              key={i}
              className={`mr-[0.25em] inline-block motion-safe:animate-word-in ${
                i >= highlightFrom ? "text-primary" : ""
              }`}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              {word}
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Tell us what is wrong, choose a technician, and follow every step of
          the repair. You pay only after the job is done.
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

        <div className="mt-6">
          <Link
            href="/services"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Browse Services
          </Link>
        </div>
      </div>

      <HeroVisual />
    </section>
  );
}