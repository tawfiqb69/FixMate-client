import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, User, Wrench } from "lucide-react";
import SectionHeading from "@/components/home/section-heading";
import HowItWorks from "@/components/home/how-it-works";

export const metadata = {
  title: "About | FixMate",
  description:
    "Learn how FixMate connects customers with verified technicians and how every repair is tracked from request to payment.",
};

const roles = [
  {
    title: "If you need something fixed",
    who: "Customers",
    text: "Browse approved services, tell the technician what is wrong, and follow the job step by step. You pay only after the work is done.",
    Icon: User,
  },
  {
    title: "If you fix things for a living",
    who: "Technicians",
    text: "List your services, accept the jobs you want, keep the customer updated, and set the final amount when you finish.",
    Icon: Wrench,
  },
  {
    title: "If you keep things running",
    who: "Admins",
    text: "Review every listing before it goes live, look after users and roles, and keep an eye on every booking and payment.",
    Icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Intro: story on the left, photo on the right, same height */}
      <section className="mx-auto grid w-full max-w-7xl items-stretch gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <SectionHeading
            as="h1"
            eyebrow="About FixMate"
            title="Repair you can follow from start to finish"
            description="FixMate is a repair booking platform for phones, laptops, home appliances and electrical work."
          />

          <div className="mt-8 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Most of us have been there: you hand over a broken phone, and then
              you wait. No update, no idea what is happening, and sometimes you
              are asked to pay before anyone has touched it.
            </p>
            <p>
              Good technicians have the opposite problem. They do careful work,
              but they have no proper place to show what they offer or to manage
              the jobs that come in.
            </p>
            <p className="font-medium text-foreground">
              We built FixMate for both sides. Every repair has a status you can
              see, and the payment comes only after the work is delivered.
            </p>
          </div>
        </div>

        <figure className="relative min-h-80 overflow-hidden rounded-2xl bg-muted lg:min-h-0">
          <Image
            src="/images/hero-main.png"
            alt="A technician carefully repairing a smartphone"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent"
          />
          <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white">
            <p className="max-w-sm font-display text-2xl font-semibold leading-snug sm:text-3xl">
              Careful work deserves a clear process.
            </p>
          </figcaption>
        </figure>
      </section>

      {/* How it works (reused section) */}
      <HowItWorks />

      {/* Who it is for */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Who it is for"
          title="One place, three kinds of people"
          description="Each person sees only what they need, so everything stays simple."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {roles.map(({ title, who, text, Icon }) => (
            <article
              key={who}
              className="flex h-full flex-col rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-5 text-sm font-medium text-primary">{who}</p>
              <h3 className="mt-1 text-xl font-semibold leading-snug">{title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid items-center gap-8 rounded-3xl bg-linear-to-br from-[#064E3B] to-[#047857] p-8 text-white sm:p-12 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Got something that needs fixing?
            </h2>
            <p className="mt-4 max-w-xl text-white/85">
              Find a technician you can trust, or join us and bring your own
              repair services to people who need them.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/services"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-[#064E3B] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#064E3B]"
            >
              Browse Services
              <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-7 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#064E3B]"
            >
              Join as a Technician
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}