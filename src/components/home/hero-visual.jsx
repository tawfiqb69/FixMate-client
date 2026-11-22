import Image from "next/image";

export default function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-5/6 w-full max-w-md sm:aspect-11/10 sm:max-w-lg lg:max-w-none">
      {/* offset frame behind the main photo */}
      <div
        aria-hidden="true"
        className="absolute left-4 top-4 h-[78%] w-[88%] rounded-2xl border border-primary/40 sm:w-[66%]"
      />

      {/* main photo */}
      <div className="absolute left-0 top-0 h-[78%] w-[88%] overflow-hidden rounded-2xl bg-muted shadow-xl sm:w-[66%]">
        <Image
          src="/images/hero-main.png"
          alt="A technician repairing a smartphone at a workbench"
          fill
          priority
          sizes="(min-width: 1024px) 34vw, (min-width: 640px) 45vw, 80vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#064E3B]/10 mix-blend-multiply"
        />
      </div>

      {/* small photo 1 */}
      <figure className="absolute right-0 top-[6%] hidden w-[32%] sm:block">
        <div className="relative aspect-square overflow-hidden rounded-xl border-4 border-background shadow-lg">
          <Image
            src="/images/hero-detail-1.png"
            alt="Close-up of a laptop being repaired"
            fill
            sizes="(min-width: 1024px) 18vw, 25vw"
            className="object-cover"
          />
        </div>
        <figcaption className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Laptop &middot; Board repair
        </figcaption>
      </figure>

      {/* small photo 2 */}
      <figure className="absolute bottom-0 right-[2%] hidden w-[44%] sm:block">
        <div className="relative aspect-3/2 overflow-hidden rounded-xl border-4 border-background shadow-lg">
          <Image
            src="/images/hero-detail-2.png"
            alt="A technician servicing a wall-mounted air conditioner"
            fill
            sizes="(min-width: 1024px) 24vw, 35vw"
            className="object-cover"
          />
        </div>
        <figcaption className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          AC &middot; Home visit
        </figcaption>
      </figure>

      {/* service ticket */}
      <div
        aria-hidden="true"
        className="absolute bottom-[18%] left-3 w-44 rounded-md bg-[#F7F8F5] p-3 text-[#17231C] shadow-[0_16px_28px_-14px_rgba(0,0,0,0.55)] sm:left-[-1rem] sm:w-48 motion-safe:-rotate-2"
      >
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#647067]">
            Sample ticket
          </span>
          <span className="font-mono text-[10px] font-medium">FM-2048</span>
        </div>
        <p className="mt-2 text-sm font-medium leading-tight">
          Screen replacement
        </p>
        <div className="mt-2 flex gap-1">
          <span className="h-1 flex-1 rounded-full bg-[#047857]" />
          <span className="h-1 flex-1 rounded-full bg-[#047857]" />
          <span className="h-1 flex-1 rounded-full bg-[#047857]" />
          <span className="h-1 flex-1 rounded-full bg-[#D5DDD6]" />
          <span className="h-1 flex-1 rounded-full bg-[#D5DDD6]" />
        </div>
        <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#647067]">
          Step 3 / 5 &middot; In progress
        </p>
      </div>
    </div>
  );
}