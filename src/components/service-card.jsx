import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, House, MapPin, Store } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function ServiceCard({ service }) {
  const isHome = service.serviceMode === "Home Visit";
  const ModeIcon = isHome ? House : Store;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_18px_40px_-24px_rgba(6,78,59,0.45)] motion-safe:hover:-translate-y-1">
      {/* line that draws across the top on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-brand-gradient transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none"
      />

      {/* image */}
      <div className="relative aspect-16/10 overflow-hidden bg-muted">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
        />
        {/* soft shade so the chips stay readable */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/10"
        />
        <span className="absolute left-3 top-3 rounded-md bg-background/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur-sm">
          {service.category}
        </span>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-xs font-medium text-white">
          <ModeIcon className="size-3.5" aria-hidden="true" />
          {service.serviceMode}
        </span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-semibold leading-tight">
          {service.title}
        </h3>

        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="line-clamp-1">{service.serviceArea}</span>
          </li>
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex size-4 shrink-0 items-center justify-center rounded-full bg-accent text-[9px] font-semibold text-accent-foreground"
            >
              {(service.technicianName || "T").charAt(0).toUpperCase()}
            </span>
            <span className="line-clamp-1">{service.technicianName}</span>
          </li>
        </ul>

        {/* footer pinned to the bottom, so all cards line up */}
        <div className="mt-auto flex items-end justify-between gap-3 border-t pt-4 [margin-top:1.25rem]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Starting from
            </p>
            <p className="font-display text-3xl font-semibold leading-none">
              ${service.basePrice}
            </p>
          </div>
          <Link
            href={`/services/${service._id}`}
            className={buttonVariants({
              size: "sm",
              className:
                "group/btn rounded-full bg-brand-gradient pl-4 pr-3 text-white hover:opacity-90",
            })}
          >
            View Details
            <ArrowUpRight className="size-4 transition-transform motion-safe:group-hover/btn:-translate-y-0.5 motion-safe:group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}