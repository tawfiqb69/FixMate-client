import Link from "next/link";
import { XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Payment cancelled | FixMate" };

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border bg-card p-8 text-center">
        <XCircle className="size-12 text-amber-600" />
        <h1 className="mt-4 text-2xl font-semibold">Payment cancelled</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          No money was taken. Your job is still unpaid, and you can pay any time.
        </p>
        <Link href="/dashboard/customer/bookings" className={buttonVariants() + " mt-6"}>
          Try Again
        </Link>
      </div>
    </div>
  );
}