import { Suspense } from "react";
import ServiceCard from "@/components/service-card";
import ServiceFilters from "@/components/service-filters";

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
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Browse Services</h1>

      <Suspense fallback={null}>
        <ServiceFilters />
      </Suspense>

      {services === null ? (
        <p className="rounded border p-8 text-center">
          Could not load services. Please try again.
        </p>
      ) : services.length === 0 ? (
        <p className="rounded border p-8 text-center">
          No services match your search. Try changing the filters.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((s) => (
            <ServiceCard key={s._id} service={s} />
          ))}
        </div>
      )}
    </div>
  );
}