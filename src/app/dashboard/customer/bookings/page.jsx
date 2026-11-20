"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StatusBadge, PaymentBadge } from "@/components/status-badge";

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toCancel, setToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/bookings/my")
      .then((res) => {
        if (!cancelled) setBookings(res.data);
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
  }, []);

  async function confirmCancel() {
    setCancelling(true);
    try {
      const res = await apiFetch(`/api/bookings/${toCancel._id}/cancel`, {
        method: "PATCH",
      });
      setBookings((list) =>
        list.map((b) => (b._id === toCancel._id ? { ...b, status: res.data.status } : b))
      );
      toast.success("Booking cancelled");
      setToCancel(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(false);
    }
  }

  function handlePayNow() {
    toast.info("Payment will be added in Phase 7");
  }

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="rounded-md border p-8 text-center space-y-3">
          <p>You have no repair requests yet.</p>
          <Link href="/services" className={buttonVariants()}>
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-3">Service</th>
                <th className="p-3">Technician</th>
                <th className="p-3">Preferred Date</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b last:border-0">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={b.serviceImage}
                        alt={b.serviceTitle}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <span className="font-medium">{b.serviceTitle}</span>
                    </div>
                  </td>
                  <td className="p-3">{b.technicianName}</td>
                  <td className="p-3">
                    {new Date(b.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div>${b.basePrice}</div>
                    {b.status === "completed" && (
                      <div className="text-xs text-muted-foreground">
                        Final: ${b.finalAmount}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="p-3">
                    <PaymentBadge status={b.paymentStatus} />
                  </td>
                  <td className="p-3">
                    {b.status === "requested" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setToCancel(b)}
                      >
                        Cancel
                      </Button>
                    )}
                    {b.status === "completed" && b.paymentStatus === "unpaid" && (
                      <Button size="sm" onClick={handlePayNow}>
                        Pay Now
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!toCancel} onOpenChange={(open) => !open && setToCancel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this request?</DialogTitle>
            <DialogDescription>
              {toCancel?.serviceTitle} will be cancelled. You cannot undo this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setToCancel(null)}>
              Keep Request
            </Button>
            <Button variant="destructive" onClick={confirmCancel} disabled={cancelling}>
              {cancelling ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}