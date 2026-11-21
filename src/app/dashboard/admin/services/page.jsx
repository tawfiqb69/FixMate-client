"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ClipboardCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ApprovalBadge from "@/components/approval-badge";
import PageHeader from "@/components/dashboard/page-header";

const FILTERS = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "All", value: "all" },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let cancelled = false;
    const query = filter === "all" ? "" : `?approvalStatus=${filter}`;
    apiFetch(`/api/admin/services${query}`)
      .then((res) => {
        if (!cancelled) {
          setServices(res.data || []);
          setError("");
        }
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
  }, [filter]);

  function changeFilter(value) {
    if (value === filter) return;
    setLoading(true);
    setFilter(value);
  }

  async function setApproval(service, approvalStatus) {
    setBusyId(service._id);
    try {
      await apiFetch(`/api/admin/services/${service._id}/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus }),
      });
      setServices((list) =>
        filter !== "all" && approvalStatus !== filter
          ? list.filter((s) => s._id !== service._id)
          : list.map((s) => (s._id === service._id ? { ...s, approvalStatus } : s))
      );
      toast.success(approvalStatus === "approved" ? "Service approved" : "Service rejected");
    } catch (err) {
      toast.error(err.message || "Could not update service");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div>
      <PageHeader title="Service Approval" description="Approve or reject services from all technicians." />

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by approval status">
        {FILTERS.map((f) => (
          <button
            key={f.value}
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
        <div className="space-y-3" role="status" aria-label="Loading services">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 rounded-xl bg-muted motion-safe:animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="rounded-xl border border-destructive/40 p-4 text-sm text-destructive">{error}</p>
      )}

      {!loading && !error && services.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border bg-card p-10 text-center">
          <ClipboardCheck className="size-10 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-semibold">Nothing here</h2>
          <p className="mt-1 text-sm text-muted-foreground">No services match this filter.</p>
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Availability</th>
                <th className="px-4 py-3">Approval</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {services.map((s) => (
                <tr key={s._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {s.image ? (
                        <Image src={s.image} alt="" width={48} height={48} className="size-12 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <div className="size-12 shrink-0 rounded-lg bg-muted" />
                      )}
                      <div>
                        <p className="font-medium">{s.title}</p>
                        <p className="text-xs text-muted-foreground">{s.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p>{s.technicianName}</p>
                    <p className="text-xs text-muted-foreground">{s.technicianEmail}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">${s.basePrice}</td>
                  <td className="px-4 py-3">{s.isAvailable ? "Available" : "Hidden"}</td>
                  <td className="px-4 py-3"><ApprovalBadge status={s.approvalStatus} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {s.approvalStatus !== "approved" && (
                        <Button size="sm" disabled={busyId === s._id} onClick={() => setApproval(s, "approved")}>
                          Approve
                        </Button>
                      )}
                      {s.approvalStatus !== "rejected" && (
                        <Button size="sm" variant="outline" className="text-destructive" disabled={busyId === s._id} onClick={() => setApproval(s, "rejected")}>
                          Reject
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
    </div>
  );
}