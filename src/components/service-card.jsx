import Image from "next/image";
import Link from "next/link";
import { MapPin, User } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function ServiceCard({ service }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:border-primary/40 hover:shadow-lg motion-safe:hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          width={400}
          height={240}
          className="h-48 w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-semibold">{service.title}</h3>
        <span className="mt-2 w-fit rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">
          {service.serviceMode}
        </span>

        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span className="line-clamp-1">{service.serviceArea}</span>
          </li>
          <li className="flex items-center gap-2">
            <User className="size-4 shrink-0 text-primary" />
            <span className="line-clamp-1">{service.technicianName}</span>
          </li>
        </ul>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                From
              </p>
              <p className="text-xl font-semibold">${service.basePrice}</p>
            </div>
            <Link
              href={`/services/${service._id}`}
              className={buttonVariants({
                size: "sm",
                className: "bg-brand-gradient text-white hover:opacity-90",
              })}
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}