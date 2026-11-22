import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Wind,
  Snowflake,
  Tv,
  Waves,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import SectionHeading from "@/components/home/section-heading";

const featured = {
  name: "Smartphone",
  blurb: "Screens, batteries and charging ports",
  Icon: Smartphone,
};

const categories = [
  { name: "Laptop & PC", blurb: "Servicing, upgrades and repairs", Icon: Laptop },
  { name: "AC", blurb: "Servicing, gas refill and cooling", Icon: Wind },
  { name: "Refrigerator", blurb: "Cooling faults and compressor care", Icon: Snowflake },
  { name: "TV", blurb: "Display, power and sound issues", Icon: Tv },
  { name: "Washing Machine", blurb: "Drum, drain and motor repairs", Icon: Waves },
  { name: "Electrical", blurb: "Wiring, switches and fittings", Icon: Zap },
];

function href(name) {
  return `/services?category=${encodeURIComponent(name)}`;
}

export default function CategoriesSection() {
  const FeaturedIcon = featured.Icon;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading
        eyebrow="Find your fix"
        title="What needs repairing?"
        description="Pick a category to see approved technicians and their services."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Featured: tall card, one clear focus */}
        <Link
          href={href(featured.name)}
          className="group relative flex min-h-64 flex-col justify-between overflow-hidden rounded-2xl bg-linear-to-br from-[#064E3B] to-[#047857] p-6 text-white outline-none transition-shadow hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:col-span-2 sm:p-8 lg:col-span-1 lg:row-span-3"
        >
          {/* large faint icon as texture */}
          <FeaturedIcon
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-6 -right-6 size-44 text-white/10 transition-transform duration-500 motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-105"
            strokeWidth={1.25}
          />

          <div className="relative flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">
              01 / Category
            </span>
            <span className="flex size-10 items-center justify-center rounded-lg border border-white/30">
              <FeaturedIcon className="size-5" />
            </span>
          </div>

          <div className="relative mt-10">
            <h3 className="font-display text-4xl font-semibold leading-tight">
              {featured.name}
            </h3>
            <p className="mt-2 max-w-xs text-sm text-white/80">
              {featured.blurb}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 border-b border-white/40 pb-0.5 text-sm font-medium transition-colors group-hover:border-white">
              Browse smartphone repairs
              <ArrowUpRight className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>

        {/* The other six: even 2 x 3 block next to it */}
        <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2 lg:col-span-2 lg:row-span-3 lg:grid-rows-3">
          {categories.map(({ name, blurb, Icon }, i) => (
            <Link
              key={name}
              href={href(name)}
              className="group relative flex h-full items-center gap-4 overflow-hidden rounded-xl border bg-card p-4 outline-none transition-all hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring motion-safe:hover:-translate-y-0.5"
            >
              {/* accent line that draws in on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-gradient transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none"
              />

              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-accent text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </span>

              <div className="min-w-0 flex-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {String(i + 2).padStart(2, "0")}
                </span>
                <h3 className="truncate font-semibold leading-tight">{name}</h3>
                <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                  {blurb}
                </p>
              </div>

              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:text-primary motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}