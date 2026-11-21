"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { buttonVariants } from "@/components/ui/button";

function SuccessContent() {
  const sessionId = useSearchParams().get("session_id");
  const [state, setState] = useState({
    status: sessionId ? "loading" : "error",
    payment: null,
    message: sessionId ? "" : "Missing payment session.",
  });

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    apiFetch(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => {
        if (cancelled) return;
        setState({ status: "success", payment: res.data, message: "" });
        toast.success("Payment successful");
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          status: "error",
          payment: null,
          message: err.message || "Could not verify payment",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const { status, payment, message } = state;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border bg-card p-8 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="size-10 text-primary motion-safe:animate-spin" />
          <h1 className="mt-4 text-xl font-semibold">Verifying your payment...</h1>
          <p className="mt-1 text-sm text-muted-foreground">Please do not close this page.</p>
        </>
      )}

      {status === "success" && payment && (
        <>
          <CheckCircle2 className="size-12 text-green-600" />
          <h1 className="mt-4 text-2xl font-semibold">Payment successful</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Thank you. Your repair job is now paid.
          </p>
          <dl className="mt-6 w-full space-y-3 rounded-xl bg-muted/50 p-4 text-left text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Service</dt>
              <dd className="font-medium">{payment.serviceTitle}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Amount paid</dt>
              <dd className="font-semibold">${payment.amount}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Transaction ID</dt>
              <dd className="break-all text-right font-mono text-xs">{payment.transactionId}</dd>
            </div>
          </dl>
          <Link href="/dashboard/customer/bookings" className={buttonVariants() + " mt-6"}>
            Back to My Bookings
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="size-12 text-destructive" />
          <h1 className="mt-4 text-xl font-semibold">Could not verify payment</h1>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          <Link href="/dashboard/customer/bookings" className={buttonVariants() + " mt-6"}>
            Back to My Bookings
          </Link>
        </>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Suspense fallback={null}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}