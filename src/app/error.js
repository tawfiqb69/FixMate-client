"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-destructive/10">
          <Wrench className="size-9 text-destructive" />
        </div>
        <h1 className="font-display text-4xl font-bold">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          An unexpected error happened. Please try again. If the problem
          continues, come back in a few minutes.
        </p>
        {error?.digest && (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Ref: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={() => reset()}>
            Try Again
          </Button>
          <Link
            href="/"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}