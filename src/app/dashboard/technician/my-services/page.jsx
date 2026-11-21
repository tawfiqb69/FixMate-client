"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Wrench } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import EditServiceDialog from "@/components/edit-service-dialog";
import PageHeader from "@/components/dashboard/page-header";

const APPROVAL_STYLES = {
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  approved:
    "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
};

function ApprovalBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        APPROVAL_STYLES[status] || "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}

function AvailabilitySwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "inline-flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <span
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted-foreground/30",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full bg-white transition-all motion-reduce:transition-none",
            checked ? "left-4.5" : "left-0.5",
          )}
        />
      </span>
      <span className="text-xs text-muted-foreground">
        {checked ? "Available" : "Hidden"}
      </span>
    </button>
  );
}

export default function MyServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [toEdit, setToEdit] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/services/my")
      .then((res) => {
        if (!cancelled) setServices(res.data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load services");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggleAvailability(s) {
    const next = !s.isAvailable;
    try {
      await apiFetch(`/api/services/${s._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: next }),
      });
      setServices((list) =>
        list.map((x) => (x._id === s._id ? { ...x, isAvailable: next } : x)),
      );
      toast.success(next ? "Service is now visible" : "Service is now hidden");
    } catch (err) {
      toast.error(err.message || "Could not update availability");
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusy(true);
    try {
      await apiFetch(`/api/services/${toDelete._id}`, { method: "DELETE" });
      setServices((list) => list.filter((x) => x._id !== toDelete._id));
      toast.success("Service deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err.message || "Could not delete service");
    } finally {
      setBusy(false);
    }
  }

  function handleSaved(updated) {
    setServices((list) =>
      list.map((x) => (x._id === updated._id ? updated : x)),
    );
    setToEdit(null);
  }

  function Thumb({ s }) {
    return s.image ? (
      <Image
        src={s.image}
        alt=""
        width={48}
        height={48}
        className="size-12 shrink-0 rounded-lg object-cover"
      />
    ) : (
      <div className="size-12 shrink-0 rounded-lg bg-muted" />
    );
  }

  function Actions({ s }) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setToEdit(s)}>
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive"
          onClick={() => setToDelete(s)}
        >
          Delete
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Services"
        description="Edit, hide or remove the services you offer. Edited services go back to pending."
        action={
          <Link
            href="/dashboard/technician/add-service"
            className={buttonVariants()}
          >
            Add Service
          </Link>
        }
      />

      {loading && (
        <div className="space-y-3" role="status" aria-label="Loading services">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-16 rounded-xl bg-muted motion-safe:animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="rounded-xl border border-destructive/40 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!loading && !error && services.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border bg-card p-10 text-center">
          <Wrench className="size-10 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-semibold">No services yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first repair service to start getting requests.
          </p>
          <Link
            href="/dashboard/technician/add-service"
            className={buttonVariants() + " mt-4"}
          >
            Add Service
          </Link>
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <>
          {/* Table: tablet and desktop */}
          <div className="hidden overflow-x-auto rounded-xl border bg-card md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Approval</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {services.map((s) => (
                  <tr key={s._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Thumb s={s} />
                        <span className="font-medium">{s.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{s.category}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      ${s.basePrice}
                    </td>
                    <td className="px-4 py-3">
                      <ApprovalBadge status={s.approvalStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <AvailabilitySwitch
                        checked={s.isAvailable}
                        onChange={() => toggleAvailability(s)}
                        label={`Toggle availability for ${s.title}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Actions s={s} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards: mobile */}
          <div className="space-y-3 md:hidden">
            {services.map((s) => (
              <div key={s._id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center gap-3">
                  <Thumb s={s} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{s.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {s.category} · ${s.basePrice}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <ApprovalBadge status={s.approvalStatus} />
                  <AvailabilitySwitch
                    checked={s.isAvailable}
                    onChange={() => toggleAvailability(s)}
                    label={`Toggle availability for ${s.title}`}
                  />
                </div>
                <div className="mt-3">
                  <Actions s={s} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete confirm */}
      <Dialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this service?</DialogTitle>
            <DialogDescription>
              {toDelete
                ? `"${toDelete.title}" will be removed. Old bookings keep their saved details.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setToDelete(null)}
              disabled={busy}
            >
              Keep it
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={busy}
            >
              {busy ? "Deleting..." : "Yes, delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toEdit && (
        <EditServiceDialog
          key={toEdit._id}
          service={toEdit}
          onClose={() => setToEdit(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
