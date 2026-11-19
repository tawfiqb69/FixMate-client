import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function ServiceCard({ service }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border">
      <Image
        src={service.image}
        alt={service.title}
        width={400}
        height={240}
        className="h-44 w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-1 font-semibold">{service.title}</h3>
        <p className="text-sm text-muted-foreground">
          {service.category} · {service.serviceMode}
        </p>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {service.serviceArea}
        </p>
        <p className="text-sm">By {service.technicianName}</p>
        <p className="mt-1 font-bold">From ${service.basePrice}</p>
        <Link
          href={`/services/${service._id}`}
          className={`${buttonVariants()} mt-auto`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}