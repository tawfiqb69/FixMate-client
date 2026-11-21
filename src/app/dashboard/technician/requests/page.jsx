"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Inbox } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const FILTERS = [
  { label: "All", value: "" },
  { label: "Requested", value: "requested" },
  { label: "Accepted", value: "accepted" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function TechnicianRequestsPage() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState(null); // { type: "reject" | "complete", job }
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const query = filter ? `?status=${filter}` : "";
    apiFetch(`/api/bookings/technician${query}`)
      .then((res) => {
        if (!cancelled) {
          setJobs(res.data || []);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load requests");
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

  async function updateStatus(job, status, extra = {}) {
    setBusy(true);
    try {
      await apiFetch(`/api/bookings/${job._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...extra }),
      });
      const updated = { ...job, status, ...extra };
      setJobs((list) =>
        filter && status !== filter
          ? list.filter((j) => j._id !== job._id)
          : list.map((j) => (j._id === job._id ? updated : j))
      );
      toast.success("Job updated");
      setDialog(null);
    } catch (err) {
      toast.error(err.message || "Could not update job");
    } finally {
      setBusy(false);
    }
  }

  function openComplete(job) {
    setAmount(String(job.basePrice));
    setDialog({ type: "complete", job });
  }

  function submitComplete() {
    const value = Number(amount);
    if (!(value > 0)) {
      toast.error("Final amount must be greater than 0");
      return;
    }
    updateStatus(dialog.job, "completed", { finalAmount: value });
  }

  function Actions({ job }) {
    if (job.status === "requested") {
      return (
        <div className="flex gap-2">
          <Button size="sm" disabled={busy} onClick={() => updateStatus(job, "accepted")}>
            Accept
          </Button>
          <Button size="sm" variant="outline" className="text-destructive" onClick={() => setDialog({ type: "reject", job })}>
            Reject
          </Button>
        </div>
      );
    }
    if (job.status === "accepted") {
      return (
        <Button size="sm" disabled={busy} onClick={() => updateStatus(job, "in-progress")}>
          Start Work
        </Button>
      );
    }
    if (job.status === "in-progress") {
      return (
        <Button size="sm" className="bg-brand-gradient text-white" onClick={() => openComplete(job)}>
          Mark Completed
        </Button>
      );
    }
    if (job.status === "completed") {
      return <PaymentBadge status={job.paymentStatus} />;
    }
    return <span className="text-xs text-muted-foreground">-</span>;
  }

  return (
    <div>
      <PageHeader title="Manage Requests" description="Accept jobs, update their progress and set the final amount." />

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
        <div className="space-y-3" role="status" aria-label="Loading requests">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 rounded-xl bg-muted motion-safe:animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="rounded-xl border border-destructive/40 p-4 text-sm text-destructive">{error}</p>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border bg-card p-10 text-center">
          <Inbox className="size-10 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-semibold">No requests here</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {filter ? "No jobs match this filter." : "New repair requests will appear here."}
          </p>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <>
          {/* Table: desktop */}
          <div className="hidden overflow-x-auto rounded-xl border bg-card lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Problem</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {jobs.map((j) => (
                  <tr key={j._id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium">{j.customerName}</p>
                      <p className="text-xs text-muted-foreground">{j.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3">{j.serviceTitle}</td>
                    <td className="max-w-45 px-4 py-3">{j.address}</td>
                    <td className="whitespace-nowrap px-4 py-3">{fmtDate(j.preferredDate)}</td>
                    <td className="max-w-60 px-4 py-3">
                      <p className="line-clamp-3" title={j.problemDescription}>{j.problemDescription}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={j.status} /></td>
                    <td className="px-4 py-3"><Actions job={j} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards: mobile and tablet */}
          <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {jobs.map((j) => (
              <div key={j._id} className="rounded-xl border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{j.serviceTitle}</p>
                    <p className="text-sm text-muted-foreground">{j.customerName} · {j.customerPhone}</p>
                  </div>
                  <StatusBadge status={j.status} />
                </div>
                <p className="mt-3 text-sm">{j.address}</p>
                <p className="mt-1 text-xs text-muted-foreground">Preferred: {fmtDate(j.preferredDate)}</p>
                <p className="mt-3 text-sm text-muted-foreground">{j.problemDescription}</p>
                <div className="mt-4">
                  <Actions job={j} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Reject confirm */}
      <Dialog open={dialog?.type === "reject"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject this request?</DialogTitle>
            <DialogDescription>
              {dialog?.job ? `The request from ${dialog.job.customerName} will be rejected. This cannot be undone.` : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)} disabled={busy}>
              Keep it
            </Button>
            <Button variant="destructive" disabled={busy} onClick={() => updateStatus(dialog.job, "rejected")}>
              {busy ? "Rejecting..." : "Yes, reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark completed */}
      <Dialog open={dialog?.type === "complete"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark job as completed</DialogTitle>
            <DialogDescription>
              Enter the final amount the customer will pay (USD).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="finalAmount">Final amount</Label>
            <Input
              id="finalAmount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)} disabled={busy}>
              Cancel
            </Button>
            <Button disabled={busy} onClick={submitComplete}>
              {busy ? "Saving..." : "Mark Completed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}