import { Wrench, Check } from "lucide-react";

const points = [
  "Track every repair step by step",
  "Pay only after the job is completed",
  "Verified, admin-approved services",
];

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="mx-auto grid w-full max-w-5xl px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-16">
      <aside className="hidden flex-col justify-between rounded-l-3xl bg-linear-to-br from-[#064E3B] to-[#047857] p-12 text-white lg:flex">
        <span className="flex size-11 items-center justify-center rounded-xl bg-white/15">
          <Wrench className="size-6" />
        </span>
        <div>
          <h2 className="font-display text-5xl font-semibold leading-tight">
            Repair, tracked from request to payment.
          </h2>
          <ul className="mt-8 space-y-3 text-white/85">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <Check className="size-5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
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