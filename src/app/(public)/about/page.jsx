import Link from "next/link";
import { User, Wrench, ShieldCheck } from "lucide-react";
import SectionHeading from "@/components/home/section-heading";
import HowItWorks from "@/components/home/how-it-works";

export const metadata = {
  title: "About | FixMate",
  description:
    "Learn how FixMate connects customers with verified technicians and how every repair is tracked from request to payment.",
};

const roles = [
  {
    title: "Customers",
    text: "Browse approved services, send a repair request, track your job step by step, and pay only after it is completed.",
    Icon: User,
  },
  {
    title: "Technicians",
    text: "List your repair services, accept or reject requests, update the job status, and set the final amount when the work is done.",
    Icon: Wrench,
  },
  {
    title: "Admins",
    text: "Approve service listings, manage users and roles, and monitor every booking and payment on the platform.",
    Icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Intro */}
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <SectionHeading
          as="h1"
          eyebrow="About FixMate"
          title="Repair you can follow from start to finish"
          description="FixMate is an on-demand repair platform for smartphones, laptops, home appliances and electrical work."
        />
        <div className="space-y-5 leading-relaxed text-muted-foreground lg:pt-8">
          <p>
            Finding a trustworthy repair technician is hard. After handing over a
            device, people often have no idea what is happening with the job, and
            many pay before any work is done.
          </p>
          <p>
            Skilled technicians face the opposite problem: they have no
            structured place to show their services and manage incoming jobs.
          </p>
          <p className="font-medium text-foreground">
            FixMate solves both. Every job has a clear, trackable status, and
            payment happens only after the work is delivered.
          </p>
        </div>
      </section>

      {/* How it works (reused scrollytelling section) */}
      <HowItWorks />

      {/* Roles */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="One platform, three roles"
          title="Built for everyone in a repair"
          description="Each role sees only what it needs, so the process stays simple and safe."
        />
        <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {roles.map(({ title, text, Icon }) => (
            <div key={title} className="border-t pt-6">
              <Icon className="size-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="rounded-3xl bg-linear-to-br from-[#064E3B] to-[#047857] px-6 py-12 text-center text-white sm:px-12">
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">
            Ready to get it fixed?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Find a verified technician today, or list your own repair services.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/services"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 text-sm font-medium text-[#064E3B] transition-colors hover:bg-white/90"
            >
              Browse Services
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/40 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Join as a Technician
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}