import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

async function getService(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`,
      { cache: "no-store" }
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
      <p className="mx-auto max-w-3xl p-6">
        Could not load this service. Please try again.
      </p>
    );
  }

  const tech = service.technician;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link href="/services" className={buttonVariants({ variant: "outline" })}>
        Back to services
      </Link>

      <Image
        src={service.image}
        alt={service.title}
        width={900}
        height={500}
        className="mt-4 h-72 w-full rounded-lg object-cover"
      />

      <h1 className="mt-4 text-2xl font-bold">{service.title}</h1>
      <p className="text-muted-foreground">{service.category}</p>
      <p className="mt-3">{service.description}</p>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div><dt className="font-semibold">Starting price</dt><dd>${service.basePrice}</dd></div>
        <div><dt className="font-semibold">Estimated duration</dt><dd>{service.estimatedDuration}</dd></div>
        <div><dt className="font-semibold">Service mode</dt><dd>{service.serviceMode}</dd></div>
        <div><dt className="font-semibold">Service area</dt><dd>{service.serviceArea}</dd></div>
      </dl>

      <div className="mt-6 flex items-center gap-3 rounded-lg border p-4">
        {tech.image ? (
          <Image
            src={tech.image}
            alt={tech.name}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted font-bold">
            {tech.name?.[0]}
          </div>
        )}
        <div>
          <p className="font-semibold">{tech.name}</p>
          {tech.area && <p className="text-sm text-muted-foreground">{tech.area}</p>}
          {tech.bio && <p className="text-sm">{tech.bio}</p>}
        </div>
      </div>

      <p className="mt-6 rounded border p-4 text-sm text-muted-foreground">
        The Request Repair form comes in the next phase (Step 4.1).
      </p>
    </div>
  );
}