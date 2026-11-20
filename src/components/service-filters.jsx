"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "Smartphone", "Laptop & PC", "AC", "Refrigerator",
  "TV", "Washing Machine", "Electrical",
];
const SERVICE_MODES = ["Home Visit", "Shop Drop-off"];
const controlClass =
  "h-10 rounded-lg border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

export default function ServiceFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function update(name, value) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(name, value);
    else next.delete(name);
    const query = next.toString();
    router.push(query ? `/services?${query}` : "/services");
  }

  function handleSearch(e) {
    e.preventDefault();
    update("search", new FormData(e.currentTarget).get("search").trim());
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 lg:flex-row lg:items-center">
      <form onSubmit={handleSearch} role="search" className="flex flex-1 gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            key={params.get("search") || ""}
            name="search"
            aria-label="Search services"
            placeholder="Search title or category"
            defaultValue={params.get("search") || ""}
            className={`${controlClass} w-full pl-9`}
          />
        </div>
        <Button
          type="submit"
          className="h-10 bg-brand-gradient px-5 text-white hover:opacity-90"
        >
          Search
        </Button>
      </form>

      <div className="grid gap-3 sm:grid-cols-3 lg:flex">
        <select
          value={params.get("category") || ""}
          onChange={(e) => update("category", e.target.value)}
          className={controlClass}
          aria-label="Category"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={params.get("serviceMode") || ""}
          onChange={(e) => update("serviceMode", e.target.value)}
          className={controlClass}
          aria-label="Service mode"
        >
          <option value="">All modes</option>
          {SERVICE_MODES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={params.get("sort") || "newest"}
          onChange={(e) => update("sort", e.target.value)}
          className={controlClass}
          aria-label="Sort"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <Button
        variant="outline"
        className="h-10"
        onClick={() => router.push("/services")}
      >
        Clear
      </Button>
    </div>
  );
}