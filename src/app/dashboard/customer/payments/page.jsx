"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { buttonVariants } from "@/components/ui/button";
import PageHeader from "@/components/dashboard/page-header";

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/payments/my")
      .then((res) => {
        if (!cancelled) setPayments(res.data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load payments");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <PageHeader title="Payment History" description="Every job you have paid for." />

      {loading && (
        <div className="space-y-3" role="status" aria-label="Loading payments">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-14 rounded-xl bg-muted motion-safe:animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="rounded-xl border border-destructive/40 p-4 text-sm text-destructive">{error}</p>
      )}

      {!loading && !error && payments.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border bg-card p-10 text-center">
          <CreditCard className="size-10 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-semibold">No payments yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Paid jobs will appear here.</p>
          <Link href="/dashboard/customer/bookings" className={buttonVariants() + " mt-4"}>
            Go to My Bookings
          </Link>
        </div>
      )}

      {!loading && !error && payments.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Paid on</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3 font-medium">{p.serviceTitle}</td>
                  <td className="px-4 py-3">{p.technicianName}</td>
                  <td className="whitespace-nowrap px-4 py-3">${p.amount}</td>
                  <td className="px-4 py-3 font-mono text-xs">{p.transactionId}</td>
                  <td className="whitespace-nowrap px-4 py-3">{fmtDate(p.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}