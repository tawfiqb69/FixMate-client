import {
  ShieldCheck,
  Activity,
  Wallet,
  Lock,
  Tag,
  RotateCcw,
} from "lucide-react";
import SectionHeading from "@/components/home/section-heading";

const points = [
  {
    title: "Admin-approved services",
    text: "Every service listing is reviewed by an admin before it appears on FixMate.",
    Icon: ShieldCheck,
  },
  {
    title: "Track every step",
    text: "See your job move from Requested to Accepted, In Progress and Completed.",
    Icon: Activity,
  },
  {
    title: "Pay after the work",
    text: "Online payment opens only after the technician marks your job as completed.",
    Icon: Wallet,
  },
  {
    title: "Secure card payments",
    text: "Payments run through Stripe Checkout, so your card details never touch FixMate.",
    Icon: Lock,
  },
  {
    title: "Clear pricing",
    text: "See the starting price up front. The final amount is confirmed when the job is done.",
    Icon: Tag,
  },
  {
    title: "Cancel while requested",
    text: "Changed your mind? You can cancel any time before the technician accepts.",
    Icon: RotateCcw,
  },
];

const pipeline = ["Requested", "Accepted", "In progress", "Completed", "Paid"];

export default function WhyChooseUs() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        {/* Left: heading + the main rule */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Repair without uncertainty"
            title="Why choose FixMate"
            description="Clear rules that protect both customers and technicians."
          />

          <div className="mt-10 rounded-2xl bg-linear-to-br from-[#064E3B] to-[#047857] p-6 text-white shadow-[0_24px_40px_-28px_rgba(6,78,59,0.8)] sm:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/65">
              The FixMate rule
            </p>
            <p className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              No finished job, no payment.
            </p>

            <ol
              className="mt-6 grid grid-cols-5 gap-1"
              aria-label="Job stages. Payment opens at the Completed stage."
            >
              {pipeline.map((stage, i) => {
                const unlocked = i >= 3;
                return (
                  <li key={stage} className="min-w-0">
                    <span
                      aria-hidden="true"
                      className={`block h-1 rounded-full ${
                        unlocked ? "bg-white" : "bg-white/25"
                      }`}
                    />
                    <span
                      className={`mt-2 block truncate font-mono text-[9px] uppercase tracking-[0.1em] ${
                        unlocked ? "text-white" : "text-white/55"
                      }`}
                    >
                      {stage}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-sm text-white/80">
              Payment opens only when the job reaches Completed.
            </p>
          </div>
        </div>

        {/* Right: numbered rules */}
        <ol className="border-t">
          {points.map(({ title, text, Icon }, i) => (
            <li
              key={title}
              className="group grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 border-b py-6 transition-colors hover:bg-accent/40 sm:grid-cols-[auto_auto_minmax(0,1fr)] sm:gap-x-6 sm:px-3"
            >
              <span className="pt-1 font-mono text-xs text-muted-foreground transition-colors group-hover:text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="hidden size-11 items-center justify-center rounded-lg border bg-card text-primary transition-colors group-hover:border-primary/50 sm:flex">
                <Icon className="size-5" aria-hidden="true" />
              </span>

              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold leading-tight">
                  <Icon
                    className="size-4 shrink-0 text-primary sm:hidden"
                    aria-hidden="true"
                  />
                  {title}
                </h3>
                <p className="mt-1.5 leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}