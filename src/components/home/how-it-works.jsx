"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/home/section-heading";

const steps = [
  {
    title: "Find a service",
    text: "Search or browse approved repair services. Filter by category, how the technician works and price.",
    ticket: "Service chosen",
  },
  {
    title: "Send a request",
    text: "Tell the technician what is wrong. Add your phone, address and the day that suits you.",
    ticket: "Request sent",
  },
  {
    title: "The technician fixes it",
    text: "Follow the job from accepted to in progress to completed. You always know where it stands.",
    ticket: "Repair in progress",
  },
  {
    title: "Pay when it is done",
    text: "Only after the job is marked completed do you pay, securely online. Never before the work.",
    ticket: "Paid after completion",
  },
];

// A check mark that is drawn with a pen stroke when `drawn` becomes true
function PenCheck({ drawn }) {
  return (
    <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
      <path
        d="M2.5 6.5 5 9l4.5-5.5"
        pathLength="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none"
        style={{ strokeDasharray: 1, strokeDashoffset: drawn ? 0 : 1 }}
      />
    </svg>
  );
}

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef([]);

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.dataset.index));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const last = steps.length - 1;
  const stamped = active === last;

  return (
    <section className="border-y ">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 lg:px-8 lg:py-24">
        {/* Left: heading + green panel with the ticket */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="From problem to fixed"
            title="How FixMate works"
            description="Four plain steps. At every moment you can see where your repair stands."
          />

          <div
            className="mt-10 hidden rounded-2xl bg-linear-to-br from-[#064E3B] to-[#047857] p-6 shadow-[0_24px_40px_-28px_rgba(6,78,59,0.8)] lg:block"
            aria-hidden="true"
          >
            <div className="rounded-md bg-[#F7F8F5] p-5 text-[#17231C] shadow-[0_16px_28px_-16px_rgba(0,0,0,0.6)] motion-safe:-rotate-1">
              <div className="flex items-baseline justify-between border-b border-dashed border-[#C9D3CB] pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#647067]">
                  Sample service ticket
                </span>
                <span className="font-mono text-[11px] text-[#647067]">
                  No. FM-2048
                </span>
              </div>

              <p className="mt-3 font-display text-2xl font-semibold">
                Phone screen replacement
              </p>

              <ul className="mt-4 space-y-2.5">
                {steps.map((s, i) => {
                  const done = i < active || (i === last && stamped);
                  const now = i === active && !done;
                  return (
                    <li
                      key={s.ticket}
                      className={`flex items-center gap-3 text-sm transition-opacity duration-300 motion-reduce:transition-none ${
                        i > active ? "opacity-40" : "opacity-100"
                      }`}
                    >
                      <span
                        className={`flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors duration-300 motion-reduce:transition-none ${
                          done
                            ? "border-[#047857] bg-[#047857] text-white"
                            : now
                              ? "border-[#047857]"
                              : "border-[#C9D3CB]"
                        }`}
                      >
                        <PenCheck drawn={done} />
                      </span>
                      <span className={now || done ? "font-medium" : ""}>
                        {s.ticket}
                      </span>
                      <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-[#647067]">
                        {done ? "Done" : now ? "Now" : "Next"}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* payment line with the stamp */}
              <div className="relative mt-5 flex h-16 items-center justify-between border-t border-dashed border-[#C9D3CB] pt-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#647067]">
                  Payment
                </span>
                <span className="text-sm text-[#647067]">
                  {stamped ? "Received" : "After completion"}
                </span>

                <span
                  className={`absolute -top-1 right-8 flex flex-col items-center rounded-md border-2 border-[#047857] px-3 py-0.5 text-[#047857] transition-all duration-500 ease-[cubic-bezier(0.2,1.6,0.4,1)] motion-reduce:transition-none ${
                    stamped
                      ? "-rotate-12 scale-100 opacity-100"
                      : "rotate-6 scale-[1.9] opacity-0"
                  }`}
                >
                  <span className="font-display text-2xl font-bold leading-none">
                    PAID
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.14em]">
                    after the job
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: steps on a rail that fills with green */}
        <ol className="pl-4 sm:pl-6">
          {steps.map(({ title, text }, i) => {
            const reached = i <= active;
            const lineFilled = i < active;
            return (
              <li
                key={title}
                data-index={i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={`relative grid grid-cols-[3.5rem_1fr] gap-4 border-l-2 py-10 pl-6 transition-colors duration-500 sm:grid-cols-[5rem_1fr] sm:gap-6 sm:pl-8 lg:py-16 motion-reduce:transition-none ${
                  lineFilled ? "border-primary" : "border-border"
                } ${i === last ? "border-l-transparent" : ""}`}
              >
                {/* node on the rail */}
                <span
                  aria-hidden="true"
                  className={`absolute -left-[9px] top-11 size-4 rounded-full border-2 bg-background transition-colors duration-500 motion-reduce:transition-none lg:top-[4.25rem] ${
                    reached
                      ? "border-primary bg-primary ring-4 ring-primary/15"
                      : "border-border"
                  }`}
                />

                <span
                  className={`font-display text-5xl font-semibold leading-none transition-colors duration-500 motion-reduce:transition-none sm:text-6xl ${
                    reached ? "text-primary" : "text-muted-foreground/60"
                  }`}
                >
                  {i + 1}
                </span>
                <div
                  className={`transition-opacity duration-500 motion-reduce:transition-none ${
                    reached ? "opacity-100" : "opacity-50"
                  }`}
                >
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}