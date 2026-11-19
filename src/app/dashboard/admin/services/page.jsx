"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

const STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function AdminServicesPage() {
  const [filter, setFilter] = useState("pending");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const query = filter === "all" ? "" : `?approvalStatus=${filter}`;

    apiFetch(`/api/admin/services${query}`)
      .then((json) => {
        if (!cancelled) setServices(json.data);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filter]);

  function handleFilterChange(e) {
    setLoading(true);
    setFilter(e.target.value);
  }

  async function handleDecision(service, approvalStatus) {
    setBusyId(service._id);
    try {
      const json = await apiFetch(`/api/admin/services/${service._id}/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus }),
      });
      toast.success(json.message);

      setServices((list) =>
        filter === "all"
          ? list.map((s) => (s._id === service._id ? { ...s, approvalStatus } : s))
          : list.filter((s) => s._id !== service._id)
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Service Approval</h1>
        <select
          value={filter}
          onChange={handleFilterChange}
          className="rounded-md border bg-transparent px-3 py-2 text-sm"
          aria-label="Filter by approval status"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : services.length === 0 ? (
        <div className="rounded border p-8 text-center">
          <p>No {filter === "all" ? "" : filter} services found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Image</th>
                <th className="p-2">Title</th>
                <th className="p-2">Category</th>
                <th className="p-2">Technician</th>
                <th className="p-2">Price</th>
                <th className="p-2">Available</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id} className="border-b">
                  <td className="p-2">
                    <Image
                      src={s.image}
                      alt={s.title}
                      width={64}
                      height={48}
                      className="h-12 w-16 rounded object-cover"
                    />
                  </td>
                  <td className="p-2">{s.title}</td>
                  <td className="p-2">{s.category}</td>
                  <td className="p-2">
                    <div>{s.technicianName}</div>
                    <div className="text-xs text-muted-foreground">
                      {s.technicianEmail}
                    </div>
                  </td>
                  <td className="p-2">${s.basePrice}</td>
                  <td className="p-2">{s.isAvailable ? "Yes" : "No"}</td>
                  <td className="p-2">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium capitalize ${STATUS_STYLE[s.approvalStatus]}`}
                    >
                      {s.approvalStatus}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={busyId === s._id || s.approvalStatus === "approved"}
                        onClick={() => handleDecision(s, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={busyId === s._id || s.approvalStatus === "rejected"}
                        onClick={() => handleDecision(s, "rejected")}
                      >
                        Reject
                      </Button>
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