"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StatusBadge, PaymentBadge } from "@/components/status-badge";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const [toReject, setToReject] = useState(null);
  const [toComplete, setToComplete] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    let cancelled = false;
    const query = filter === "all" ? "" : `?status=${filter}`;
    apiFetch(`/api/bookings/technician${query}`)
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

  // One function for every status change
  async function updateStatus(booking, status, finalAmount) {
    setBusyId(booking._id);
    try {
      const body = { status };
      if (finalAmount !== undefined) body.finalAmount = finalAmount;

      const res = await apiFetch(`/api/bookings/${booking._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const updated = res.data;
      setBookings((list) =>
        filter !== "all" && updated.status !== filter
          ? list.filter((b) => b._id !== booking._id)
          : list.map((b) => (b._id === booking._id ? updated : b))
      );
      toast.success(`Status updated to ${status}`);
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function confirmReject() {
    const ok = await updateStatus(toReject, "rejected");
    if (ok) setToReject(null);
  }

  function openComplete(booking) {
    setAmount(String(booking.basePrice));
    setToComplete(booking);
  }

  async function confirmComplete(e) {
    e.preventDefault();
    const value = Number(amount);
    if (!amount || !Number.isFinite(value) || value <= 0) {
      return toast.error("Final amount must be greater than 0");
    }
    const ok = await updateStatus(toComplete, "completed", value);
    if (ok) setToComplete(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Manage Requests</h1>
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
        <p>Loading requests...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : bookings.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <p>No requests found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Address</th>
                <th className="p-3">Date</th>
                <th className="p-3">Service</th>
                <th className="p-3">Problem</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b align-top last:border-0">
                  <td className="p-3">{b.customerName}</td>
                  <td className="p-3">{b.customerPhone}</td>
                  <td className="p-3">{b.address}</td>
                  <td className="p-3">
                    {new Date(b.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">{b.serviceTitle}</td>
                  <td className="max-w-xs p-3">{b.problemDescription}</td>
                  <td className="p-3">
                    <div className="space-y-1">
                      <StatusBadge status={b.status} />
                      {b.status === "completed" && (
                        <div>
                          <PaymentBadge status={b.paymentStatus} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {b.status === "requested" && (
                        <>
                          <Button
                            size="sm"
                            disabled={busyId === b._id}
                            onClick={() => updateStatus(b, "accepted")}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busyId === b._id}
                            onClick={() => setToReject(b)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {b.status === "accepted" && (
                        <Button
                          size="sm"
                          disabled={busyId === b._id}
                          onClick={() => updateStatus(b, "in-progress")}
                        >
                          Start Work
                        </Button>
                      )}
                      {b.status === "in-progress" && (
                        <Button
                          size="sm"
                          disabled={busyId === b._id}
                          onClick={() => openComplete(b)}
                        >
                          Mark Completed
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject confirmation */}
      <Dialog open={!!toReject} onOpenChange={(open) => !open && setToReject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject this request?</DialogTitle>
            <DialogDescription>
              The request from {toReject?.customerName} for {toReject?.serviceTitle} will
              be rejected. You cannot undo this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setToReject(null)}>
              Keep Request
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={busyId === toReject?._id}
            >
              Yes, Reject
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Final amount modal */}
      <Dialog
        open={!!toComplete}
        onOpenChange={(open) => !open && setToComplete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark job as completed</DialogTitle>
            <DialogDescription>
              Enter the final amount the customer will pay for{" "}
              {toComplete?.serviceTitle}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={confirmComplete} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="final-amount">Final Amount (USD)</Label>
              <Input
                id="final-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setToComplete(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busyId === toComplete?._id}>
                Complete Job
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}