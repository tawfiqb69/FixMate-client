import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ServiceCard from "@/components/service-card";
import SectionHeading from "@/components/home/section-heading";
import { buttonVariants } from "@/components/ui/button";

async function getLatestServices() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/services?limit=6`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function FeaturedServices() {
  const services = await getLatestServices();
  const count = Array.isArray(services) ? services.length : 0;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Selected services"
          title="Latest from our technicians"
          description="Freshly approved repair services you can request today."
        />
        <Link
          href="/services"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "group shrink-0 rounded-full",
          })}
        >
          View all services
          <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* index line */}
      {count > 0 && (
        <div className="mt-10 flex items-center gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Newest {String(count).padStart(2, "0")}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">
            Admin approved
          </span>
        </div>
      )}

      <div className={count > 0 ? "mt-6" : "mt-12"}>
        {services === null ? (
          <p className="rounded-2xl border p-10 text-center text-muted-foreground">
            We could not load services right now. Please try again in a moment.
          </p>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border p-10 text-center">
            <p className="font-medium">No services are available yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              New technician services will appear here after admin approval.
            </p>
            <Link
              href="/services"
              className={buttonVariants({ className: "mt-5" })}
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}