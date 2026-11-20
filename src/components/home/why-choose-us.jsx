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

export default function WhyChooseUs() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Repair without uncertainty"
        title="Why choose FixMate"
        description="Clear rules that protect both customers and technicians."
      />

      <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {points.map(({ title, text, Icon }) => (
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
  );
}