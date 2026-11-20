import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Wrench } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import RequestRepair from "@/components/request-repair";

async function getService(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`,
      { cache: "no-store" },
    );
    if (res.status === 404) return undefined;
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function ServiceDetailsPage({ params }) {
  const { id } = await params;
  const service = await getService(id);

  if (service === undefined) notFound();
  if (service === null) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6">
        <div className="rounded-2xl border p-10">
          <p className="font-medium">We could not load this service.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please check your connection and try again.
          </p>
          <Link
            href={`/services/${id}`}
            className={buttonVariants({ className: "mt-5" })}
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  const tech = service.technician;

  const facts = [
    { label: "Estimated duration", value: service.estimatedDuration, Icon: Clock },
    { label: "Service mode", value: service.serviceMode, Icon: Wrench },
    { label: "Service area", value: service.serviceArea, Icon: MapPin },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href="/services"
        className={buttonVariants({ variant: "ghost", className: "-ml-3" })}
      >
        <ArrowLeft className="size-4" />
        Back to services
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
        {/* Left: image + content */}
        <div>
          <Image
            src={service.image}
            alt={service.title}
            width={900}
            height={560}
            priority
            className="aspect-16/10 w-full rounded-2xl object-cover"
          />

          <div className="mt-8">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              {service.category}
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {service.title}
            </h1>

            <h2 className="mt-8 text-lg font-semibold">About this service</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          </div>
        </div>

        {/* Right: booking card + technician */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Starting price
            </p>
            <p className="mt-1 text-4xl font-semibold">${service.basePrice}</p>

            <dl className="mt-6 space-y-4 border-t pt-6 text-sm">
              {facts.map(({ label, value, Icon }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-6">
              <RequestRepair serviceId={String(service._id)} />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Your technician
            </p>
            <div className="mt-4 flex items-start gap-4">
              {tech.image ? (
                <Image
                  src={tech.image}
                  alt={tech.name}
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-foreground">
                  {tech.name?.[0]}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold">{tech.name}</p>
                {tech.area && (
                  <p className="text-sm text-muted-foreground">{tech.area}</p>
                )}
                {tech.bio && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {tech.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}