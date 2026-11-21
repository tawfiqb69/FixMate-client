"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { ClipboardList } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { StatusBadge, PaymentBadge } from "@/components/status-badge";
import PageHeader from "@/components/dashboard/page-header";

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function amountOf(b) {
  return b.status === "completed" ? b.finalAmount : b.basePrice;
}

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toCancel, setToCancel] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/bookings/my")
      .then((res) => {
        if (!cancelled) setBookings(res.data || []);
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
  }, []);

  async function confirmCancel() {
    if (!toCancel) return;
    setBusy(true);
    try {
      await apiFetch(`/api/bookings/${toCancel._id}/cancel`, { method: "PATCH" });
      setBookings((list) =>
        list.map((b) => (b._id === toCancel._id ? { ...b, status: "cancelled" } : b))
      );
      toast.success("Booking cancelled");
      setToCancel(null);
    } catch (err) {
      toast.error(err.message || "Could not cancel");
    } finally {
      setBusy(false);
    }
  }

  function payNow() {
    toast.info("Payment will be available soon");
  }

  function Actions({ b }) {
    if (b.status === "requested") {
      return (
        <Button variant="outline" size="sm" onClick={() => setToCancel(b)}>
          Cancel
        </Button>
      );
    }
    if (b.status === "completed" && b.paymentStatus === "unpaid") {
      return (
        <Button size="sm" className="bg-brand-gradient text-white" onClick={payNow}>
          Pay Now
        </Button>
      );
    }
    return <span className="text-xs text-muted-foreground">-</span>;
  }

  function Thumb({ b }) {
    return b.serviceImage ? (
      <Image src={b.serviceImage} alt="" width={48} height={48} className="size-12 shrink-0 rounded-lg object-cover" />
    ) : (
      <div className="size-12 shrink-0 rounded-lg bg-muted" />
    );
  }

  return (
    <div>
      <PageHeader title="My Bookings" description="Track your repair requests and pay for completed jobs." />

      {loading && (
        <div className="space-y-3" role="status" aria-label="Loading bookings">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 rounded-xl bg-muted motion-safe:animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="rounded-xl border border-destructive/40 p-4 text-sm text-destructive">{error}</p>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border bg-card p-10 text-center">
          <ClipboardList className="size-10 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-semibold">No bookings yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Find a service and send your first repair request.</p>
          <Link href="/services" className={buttonVariants() + " mt-4"}>
            Browse Services
          </Link>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <>
          {/* Table: tablet and desktop */}
          <div className="hidden overflow-x-auto rounded-xl border bg-card md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Technician</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Thumb b={b} />
                        <span className="font-medium">{b.serviceTitle}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{b.technicianName}</td>
                    <td className="whitespace-nowrap px-4 py-3">{fmtDate(b.preferredDate)}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      ${amountOf(b)}
                      <span className="block text-xs text-muted-foreground">
                        {b.status === "completed" ? "Final" : "Base"}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3"><PaymentBadge status={b.paymentStatus} /></td>
                    <td className="px-4 py-3"><Actions b={b} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards: mobile */}
          <div className="space-y-3 md:hidden">
            {bookings.map((b) => (
              <div key={b._id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center gap-3">
                  <Thumb b={b} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{b.serviceTitle}</p>
                    <p className="truncate text-sm text-muted-foreground">{b.technicianName}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={b.status} />
                  <PaymentBadge status={b.paymentStatus} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{fmtDate(b.preferredDate)}</span>
                  <span className="font-semibold">${amountOf(b)}</span>
                </div>
                <div className="mt-3">
                  <Actions b={b} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={!!toCancel} onOpenChange={(open) => !open && setToCancel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this request?</DialogTitle>
            <DialogDescription>
              {toCancel ? `"${toCancel.serviceTitle}" will be cancelled. This cannot be undone.` : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToCancel(null)} disabled={busy}>
              Keep it
            </Button>
            <Button variant="destructive" onClick={confirmCancel} disabled={busy}>
              {busy ? "Cancelling..." : "Yes, cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}