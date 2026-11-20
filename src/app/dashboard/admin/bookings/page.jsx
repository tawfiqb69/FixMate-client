"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { StatusBadge, PaymentBadge } from "@/components/status-badge";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const query = filter === "all" ? "" : `?status=${filter}`;
    apiFetch(`/api/admin/bookings${query}`)
      .then((res) => {
        if (!cancelled) {
          setBookings(res.data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  function handleFilterChange(value) {
    setLoading(true);
    setFilter(value);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">All Bookings</h1>
        <select
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="rounded-md border bg-transparent px-3 py-2 text-sm"
        >
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : bookings.length === 0 ? (
        <div className="rounded-md border p-8 text-center">No bookings found.</div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-3">Service</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Technician</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{b.serviceTitle}</td>
                  <td className="p-3">
                    <div>{b.customerName}</div>
                    <div className="text-xs text-muted-foreground">{b.customerEmail}</div>
                  </td>
                  <td className="p-3">
                    <div>{b.technicianName}</div>
                    <div className="text-xs text-muted-foreground">{b.technicianEmail}</div>
                  </td>
                  <td className="p-3">
                    {new Date(b.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="p-3">
                    <PaymentBadge status={b.paymentStatus} />
                  </td>
                  <td className="p-3">${b.finalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}