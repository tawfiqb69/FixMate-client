import { Wrench, ShieldCheck } from "lucide-react";

export default function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-sm sm:max-w-md lg:max-w-none"
    >
      {/* Background panel */}
      <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-brand-gradient">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      {/* Phone */}
      <div className="absolute left-1/2 top-1/2 h-[68%] w-[40%] min-w-36 -translate-x-1/2 -translate-y-1/2 lg:[transform:perspective(1200px)_rotateY(-14deg)_rotateX(6deg)]">
        <div className="flex h-full flex-col rounded-[1.75rem] border bg-card p-3 shadow-2xl">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted" />
          <div className="flex flex-1 flex-col items-center justify-center gap-5 rounded-2xl bg-accent px-3">
            <span className="flex size-14 items-center justify-center rounded-full bg-brand-gradient text-white">
              <Wrench className="size-7" />
            </span>
            <div className="w-full space-y-2">
              <div className="mx-auto h-2 w-3/4 rounded-full bg-primary/30" />
              <div className="mx-auto h-2 w-1/2 rounded-full bg-primary/20" />
            </div>
            <div className="flex w-full gap-1.5">
              <span className="h-1.5 flex-1 rounded-full bg-primary" />
              <span className="h-1.5 flex-1 rounded-full bg-primary" />
              <span className="h-1.5 flex-1 rounded-full bg-primary" />
              <span className="h-1.5 flex-1 rounded-full bg-primary/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Chip: job status */}
      <div className="absolute left-2 top-[14%] hidden items-center gap-2.5 rounded-2xl border bg-card px-4 py-3 shadow-lg sm:flex motion-safe:animate-float lg:-left-6">
        <span className="size-2.5 rounded-full bg-amber-500" />
        <div>
          <p className="text-sm font-medium leading-none">Screen replacement</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            In progress
          </p>
        </div>
      </div>

      {/* Chip: pay after service */}
      <div
        className="absolute bottom-[12%] right-2 hidden items-center gap-2.5 rounded-2xl border bg-card px-4 py-3 shadow-lg sm:flex motion-safe:animate-float lg:-right-6"
        style={{ animationDelay: "-3s" }}
      >
        <ShieldCheck className="size-5 text-primary" />
        <div>
          <p className="text-sm font-medium leading-none">Pay after service</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Only when the job is done
          </p>
        </div>
      </div>
    </div>
  );
}