"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Send, Wrench, CreditCard } from "lucide-react";
import SectionHeading from "@/components/home/section-heading";

const steps = [
  {
    title: "Find a Service",
    text: "Search or browse approved repair services by category, service mode and price.",
    Icon: Search,
  },
  {
    title: "Send a Request",
    text: "Describe the problem and add your phone, address and preferred date.",
    Icon: Send,
  },
  {
    title: "Technician Fixes It",
    text: "Follow your job as it moves from Accepted to In Progress to Completed.",
    Icon: Wrench,
  },
  {
    title: "Pay After Completion",
    text: "When the job is completed, pay securely online. Never before the work is done.",
    Icon: CreditCard,
  },
];

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

  return (
    <section className="border-y bg-card/50">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-8 lg:py-24">
        {/* Left: heading + current step number */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="From problem to fixed"
            title="How FixMate works"
            description="Four clear steps, and you can see where your repair stands at every moment."
          />
          <div className="mt-10 hidden items-end lg:flex" aria-hidden="true">
            <span className="font-display text-9xl font-semibold leading-none text-primary">
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="mb-3 ml-3 font-mono text-sm text-muted-foreground">
              / {String(steps.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Right: steps */}
        <ol>
          {steps.map(({ title, text, Icon }, i) => {
            const reached = i <= active;
            return (
              <li
                key={title}
                data-index={i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={`relative pb-14 pl-16 last:pb-0 lg:pb-32 motion-safe:transition-opacity motion-safe:duration-500 motion-reduce:opacity-100 ${
                  reached ? "opacity-100" : "opacity-45"
                }`}
              >
                {/* line to the next step */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-6 top-12 w-px motion-safe:transition-colors motion-safe:duration-500 ${
                      i < active ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}

                {/* node */}
                <span
                  className={`absolute left-0 top-0 flex size-12 items-center justify-center rounded-full border-2 motion-safe:transition-colors motion-safe:duration-500 ${
                    reached
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  <Icon className="size-5" />
                </span>

                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{title}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}