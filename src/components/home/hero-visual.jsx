import Image from "next/image";

export default function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md pb-3 sm:aspect-11/10 sm:max-w-lg sm:pb-0 lg:max-w-none">
      {/* main photo + offset frame */}
      <div className="relative aspect-[10/9] w-full sm:absolute sm:left-0 sm:top-0 sm:aspect-auto sm:h-[78%] sm:w-[66%]">
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border border-primary/40 sm:translate-x-4 sm:translate-y-4 sm:rounded-2xl"
        />
        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-muted shadow-xl sm:rounded-2xl">
          <Image
            src="/images/hero-main.png"
            alt="A technician repairing a smartphone at a workbench"
            fill
            priority
            sizes="(min-width: 1024px) 34vw, (min-width: 640px) 45vw, 92vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#064E3B]/10 mix-blend-multiply"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#06241B]/45 to-transparent sm:hidden"
          />
        </div>

        {/* ticket on phones: sits on the main photo */}
        <div
          aria-hidden="true"
          className="absolute bottom-10 left-3 w-44 -rotate-2 rounded-md bg-[#F7F8F5] p-3 text-[#17231C] shadow-[0_16px_28px_-14px_rgba(0,0,0,0.6)] sm:hidden"
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

      {/* two small photos: staggered pair on phones, absolute from sm up */}
      <div className="relative z-10 -mt-7 grid grid-cols-2 gap-3 px-3 sm:contents">
        <figure className="sm:absolute sm:right-0 sm:top-[6%] sm:w-[32%]">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border-4 border-background shadow-lg sm:aspect-square sm:rounded-xl">
            <Image
              src="/images/hero-detail-1.png"
              alt="Close-up of a laptop being repaired"
              fill
              sizes="(min-width: 1024px) 18vw, (min-width: 640px) 25vw, 46vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Laptop &middot; Board repair
          </figcaption>
        </figure>

        <figure className="mt-6 sm:mt-0 sm:absolute sm:bottom-0 sm:right-[2%] sm:w-[44%]">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border-4 border-background shadow-lg sm:aspect-3/2 sm:rounded-xl">
            <Image
              src="/images/hero-detail-2.png"
              alt="A technician servicing a wall-mounted air conditioner"
              fill
              sizes="(min-width: 1024px) 24vw, (min-width: 640px) 35vw, 46vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            AC &middot; Home visit
          </figcaption>
        </figure>
      </div>

      {/* ticket from sm up */}
      <div
        aria-hidden="true"
        className="absolute bottom-[18%] left-[-1rem] hidden w-48 -rotate-2 rounded-md bg-[#F7F8F5] p-3 text-[#17231C] shadow-[0_16px_28px_-14px_rgba(0,0,0,0.55)] sm:block"
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