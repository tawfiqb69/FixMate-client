"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

export default function CountChart({
  title,
  description,
  data,
  loading = false,
  error = "",
  emptyText = "No data yet.",
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const summary = data.map((d) => `${d.label}: ${d.value}`).join(", ");

  return (
    <section className="min-w-0 rounded-xl border bg-card p-5">
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}

      <div className="mt-4">
        {loading ? (
          <div className="h-56 rounded-lg bg-muted motion-safe:animate-pulse" role="status" aria-label="Loading chart" />
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : total === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          <>
            <div role="img" aria-label={`${title}. ${summary}`} className="text-muted-foreground">
              <BarChart
                responsive
                data={data}
                style={{ width: "100%", aspectRatio: 1.8, maxHeight: 280 }}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.15} />
                <XAxis dataKey="label" interval={0} tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                <Tooltip
                  isAnimationActive={false}
                  cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "var(--foreground)",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                />
                <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  {data.map((d) => (
                    <Cell key={d.label} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </div>

            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
              {data.map((d) => (
                <li key={d.label} className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} aria-hidden="true" />
                  <span className="truncate text-muted-foreground">{d.label}</span>
                  <span className="ml-auto font-semibold">{d.value}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}