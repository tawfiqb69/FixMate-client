"use client";

import { useEffect, useState } from "react";
import { DollarSign, Receipt } from "lucide-react";
import { apiFetch } from "@/lib/api";
import PageHeader from "@/components/dashboard/page-header";
import StatsCard from "@/components/dashboard/stats-card";

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";
}

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/admin/payments")
      .then((res) => {
        if (cancelled) return;
        setPayments(res.data || []);
        setTotal(res.totalRevenue || 0);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load transactions");
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
      <PageHeader title="Transactions" description="Every payment made on the platform." />

      <div className="mb-6 max-w-sm">
        <StatsCard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${Number(total).toFixed(2)}`}
          hint={`From ${payments.length} payment${payments.length === 1 ? "" : "s"}`}
          loading={loading}
          error={error}
        />
      </div>

      {loading && (
        <div className="space-y-3" role="status" aria-label="Loading transactions">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-14 rounded-xl bg-muted motion-safe:animate-pulse" />
          ))}
        </div>
      )}

      {!loading && !error && payments.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border bg-card p-10 text-center">
          <Receipt className="size-10 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-semibold">No transactions yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Payments will appear here after customers pay.</p>
        </div>
      )}

      {!loading && !error && payments.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Paid on</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3">
                    <p>{p.customerName}</p>
                    <p className="text-xs text-muted-foreground">{p.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3">{p.technicianName}</td>
                  <td className="px-4 py-3 font-medium">{p.serviceTitle}</td>
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