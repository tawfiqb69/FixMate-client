import { Wrench } from "lucide-react";

const points = [
  "Every repair step tracked",
  "Pay only after the job is done",
  "Services approved by an admin",
];

const fields = [
  { label: "Service", value: "AC Servicing" },
  { label: "Mode", value: "Home Visit" },
  { label: "Payment", value: "After completion" },
  { label: "Quote", value: "From $45" },
];

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="mx-auto grid w-full max-w-5xl px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-16">
      <aside className="hidden flex-col justify-between gap-8 rounded-l-3xl bg-linear-to-br from-[#064E3B] to-[#047857] p-8 text-white lg:flex xl:p-10">
        {/* wordmark */}
        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <span className="flex items-center gap-2">
            <Wrench className="size-4" aria-hidden="true" />
            <span className="font-display text-2xl font-semibold tracking-tight">
              FixMate
            </span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
            Repair, booked
          </span>
        </div>

        {/* headline + ticket */}
        <div className="space-y-6">
          <h2 className="font-display text-4xl font-semibold leading-[1.05] xl:text-[2.75rem]">
            From broken to fixed,{" "}
            <span className="text-white/70">in plain sight.</span>
          </h2>

          {/* service ticket */}
          <div className="rounded-md bg-[#F7F8F5] p-4 text-[#17231C] shadow-[0_18px_30px_-20px_rgba(0,0,0,0.6)] motion-safe:lg:-rotate-1">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#647067]">
                Sample service ticket
              </p>
              <p className="font-mono text-xs font-medium">No. FM-2048</p>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-dashed border-[#C9D3CB] pt-3">
              {fields.map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#647067]">
                    {f.label}
                  </dt>
                  <dd className="text-sm font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-3 border-t border-dashed border-[#C9D3CB] pt-3">
              <div
                role="img"
                aria-label="Step 3 of 5: In progress"
                className="flex gap-1"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={
                      "h-1.5 flex-1 rounded-full " +
                      (i < 3 ? "bg-[#047857]" : "bg-[#D5DDD6]") +
                      (i === 2 ? " motion-safe:animate-pulse" : "")
                    }
                  />
                ))}
              </div>
              <p className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em]">
                <span>Step 3 / 5 &middot; In progress</span>
                <span className="text-[#647067]">Next: Completed</span>
              </p>
            </div>
          </div>
        </div>

        {/* numbered points */}
        <ol className="border-t border-white/20">
          {points.map((text, i) => (
            <li
              key={text}
              className="flex items-baseline gap-4 border-b border-white/15 py-2.5 text-sm text-white/90"
            >
              <span className="font-mono text-[11px] text-white/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              {text}
            </li>
          ))}
        </ol>
      </aside>

      <section className="rounded-3xl border bg-card p-8 sm:p-10 lg:rounded-l-none lg:border-l-0">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        )}
        <div className="mt-8">{children}</div>
        {footer && <p className="mt-6 text-sm text-muted-foreground">{footer}</p>}
      </section>
    </main>
  );
}