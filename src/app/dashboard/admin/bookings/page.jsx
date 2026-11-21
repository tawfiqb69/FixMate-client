"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { StatusBadge, PaymentBadge } from "@/components/status-badge";
import PageHeader from "@/components/dashboard/page-header";

const FILTERS = [
  { label: "All", value: "" },
  { label: "Requested", value: "requested" },
  { label: "Accepted", value: "accepted" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
];

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const query = filter ? `?status=${filter}` : "";
    apiFetch(`/api/admin/bookings${query}`)
      .then((res) => {
        if (!cancelled) {
          setBookings(res.data || []);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load bookings");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  function changeFilter(value) {
    if (value === filter) return;
    setLoading(true);
    setFilter(value);
  }

  return (
    <div>
      <PageHeader title="All Bookings" description="Every repair job on the platform (read-only)." />

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => changeFilter(f.value)}
            className={cn(
              "h-9 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              filter === f.value
                ? "border-primary bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-3" role="status" aria-label="Loading bookings">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-14 rounded-xl bg-muted motion-safe:animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="rounded-xl border border-destructive/40 p-4 text-sm text-destructive">{error}</p>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border bg-card p-10 text-center">
          <ClipboardList className="size-10 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-semibold">No bookings found</h2>
          <p className="mt-1 text-sm text-muted-foreground">No jobs match this filter.</p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td className="px-4 py-3 font-medium">{b.serviceTitle}</td>
                  <td className="px-4 py-3">
                    <p>{b.customerName}</p>
                    <p className="text-xs text-muted-foreground">{b.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{b.technicianName}</p>
                    <p className="text-xs text-muted-foreground">{b.technicianEmail}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{fmtDate(b.preferredDate)}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3"><PaymentBadge status={b.paymentStatus} /></td>
                  <td className="whitespace-nowrap px-4 py-3">${b.finalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}