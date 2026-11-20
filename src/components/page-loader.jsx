export default function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mb-8 space-y-3">
        <div className="h-8 w-56 rounded-lg bg-muted motion-safe:animate-pulse" />
        <div className="h-4 w-80 max-w-full rounded bg-muted motion-safe:animate-pulse" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border bg-card">
            <div className="h-40 bg-muted motion-safe:animate-pulse" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-3/4 rounded bg-muted motion-safe:animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-muted motion-safe:animate-pulse" />
              <div className="h-9 w-full rounded-lg bg-muted motion-safe:animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}