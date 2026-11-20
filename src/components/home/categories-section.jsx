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

const categories = [
  {
    name: "Smartphone",
    blurb: "Screens, batteries and charging ports",
    Icon: Smartphone,
    featured: true,
  },
  { name: "Laptop & PC", blurb: "Servicing, upgrades and repairs", Icon: Laptop },
  { name: "AC", blurb: "Servicing, gas refill and cooling", Icon: Wind },
  {
    name: "Refrigerator",
    blurb: "Cooling faults and compressor care",
    Icon: Snowflake,
  },
  { name: "TV", blurb: "Display, power and sound issues", Icon: Tv },
  {
    name: "Washing Machine",
    blurb: "Drum, drain and motor repairs",
    Icon: Waves,
  },
  {
    name: "Electrical",
    blurb: "Wiring, switches and fittings",
    Icon: Zap,
    wide: true,
  },
];

export default function CategoriesSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading
        eyebrow="Find your fix"
        title="What needs repairing?"
        description="Pick a category to see approved technicians and their services."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map(({ name, blurb, Icon, featured, wide }) => (
          <Link
            key={name}
            href={`/services?category=${encodeURIComponent(name)}`}
            className={`group flex h-full flex-col justify-between gap-8 rounded-2xl border bg-card p-5 outline-none transition-all hover:border-primary/40 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0 active:shadow-sm motion-safe:hover:-translate-y-1 ${
              featured ? "lg:col-span-2 lg:p-8" : ""
            } ${wide ? "sm:col-span-2 lg:col-span-1" : ""}`}
          >
            <span
              className={`flex items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground ${
                featured ? "size-14" : "size-12"
              }`}
            >
              <Icon className={featured ? "size-7" : "size-6"} />
            </span>

            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className={`font-semibold ${featured ? "text-xl" : ""}`}>
                  {name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>
              </div>
              <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:text-primary motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}