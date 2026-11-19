"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  "Smartphone", "Laptop & PC", "AC", "Refrigerator",
  "TV", "Washing Machine", "Electrical",
];
const SERVICE_MODES = ["Home Visit", "Shop Drop-off"];
const selectClass = "rounded-md border bg-transparent px-3 py-2 text-sm";

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
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          key={params.get("search") || ""}
          name="search"
          placeholder="Search title or category"
          defaultValue={params.get("search") || ""}
          className="w-60"
        />
        <Button type="submit">Search</Button>
      </form>

      <select
        value={params.get("category") || ""}
        onChange={(e) => update("category", e.target.value)}
        className={selectClass}
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
        className={selectClass}
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
        className={selectClass}
        aria-label="Sort"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>

      <Button variant="outline" onClick={() => router.push("/services")}>
        Clear
      </Button>
    </div>
  );
}