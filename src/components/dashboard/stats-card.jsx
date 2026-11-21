export default function StatsCard({ icon: Icon, label, value, hint, loading = false, error = "" }) {
  return (
    <div className="flex h-full min-h-[130px] flex-col justify-between rounded-xl border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
        )}
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="space-y-2" role="status" aria-label="Loading">
            <div className="h-8 w-20 rounded bg-muted motion-safe:animate-pulse" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <>
            <p className="text-3xl font-semibold tracking-tight">{value}</p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </>
        )}
      </div>
    </div>
  );
}