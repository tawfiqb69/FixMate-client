import { Suspense } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import ServiceCard from "@/components/service-card";
import ServiceFilters from "@/components/service-filters";
import SectionHeading from "@/components/home/section-heading";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Browse Services | FixMate",
  description:
    "Search approved repair services for smartphones, laptops, AC, refrigerators, TVs, washing machines and electrical work.",
};

async function getServices(searchParams) {
  const query = new URLSearchParams();
  for (const key of ["search", "category", "serviceMode", "sort"]) {
    const value = searchParams[key];
    if (typeof value === "string" && value) query.set(key, value);
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/services?${query.toString()}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function ServicesPage({ searchParams }) {
  const services = await getServices(await searchParams);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <SectionHeading
        as="h1"
        eyebrow="Browse services"
        title="Find the right technician"
        description="Search approved repair services, filter by category or service mode, and sort by price."
      />

      <div className="mt-10">
        <Suspense fallback={null}>
          <ServiceFilters />
        </Suspense>
      </div>

      <div className="mt-8">
        {services === null ? (
          <div className="rounded-2xl border p-10 text-center">
            <p className="font-medium">We could not load services.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please check your connection and try again.
            </p>
            <Link
              href="/services"
              className={buttonVariants({ className: "mt-5" })}
            >
              Try Again
            </Link>
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border p-10 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-primary">
              <Search className="size-6" />
            </span>
            <p className="mt-4 font-medium">No services match your search.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different word or change the filters.
            </p>
            <Link
              href="/services"
              className={buttonVariants({
                className:
                  "mt-5 bg-brand-gradient text-white hover:opacity-90",
              })}
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {services.length} {services.length === 1 ? "service" : "services"} found
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
              {services.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}