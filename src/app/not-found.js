import Link from "next/link";
import { Wrench, Hammer, Settings } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Page not found | FixMate",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <div className="relative mx-auto mb-8 size-44">
            <div className="absolute inset-0 rounded-full bg-accent" />
            <Settings className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 text-primary/30 motion-safe:animate-[spin_24s_linear_infinite]" />
            <Wrench className="absolute right-3 top-3 size-14 rotate-45 text-primary" />
            <Hammer className="absolute bottom-3 left-3 size-14 -rotate-12 text-primary" />
          </div>
          <p className="font-display text-7xl font-bold text-primary">404</p>
          <h1 className="mt-2 text-2xl font-semibold">
            This page needs a repair
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We could not find the page you are looking for. It may have been
            moved, removed, or never existed.
          </p>
          <Link
            href="/"
            className={buttonVariants({
              size: "lg",
              className:
                "mt-8 bg-brand-gradient text-white shadow-sm hover:opacity-90",
            })}
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}