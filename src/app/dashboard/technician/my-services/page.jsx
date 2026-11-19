"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import EditServiceDialog from "@/components/edit-service-dialog";

const STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function MyServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null); // service waiting for confirm
  const [deleting, setDeleting] = useState(false);
  const [toEdit, setToEdit] = useState(null);

  useEffect(() => {
    apiFetch("/api/services/my")
      .then((json) => setServices(json.data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(service) {
    const next = !service.isAvailable;
    try {
      await apiFetch(`/api/services/${service._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: next }),
      });
      setServices((list) =>
        list.map((s) =>
          s._id === service._id ? { ...s, isAvailable: next } : s,
        ),
      );
      toast.success(
        next ? "Service is now available" : "Service is now hidden",
      );
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await apiFetch(`/api/services/${toDelete._id}`, { method: "DELETE" });
      setServices((list) => list.filter((s) => s._id !== toDelete._id));
      toast.success("Service deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Services</h1>
        <Button
          nativeButton={false}
          render={<Link href="/dashboard/technician/add-service" />}
        >
          Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="rounded border p-8 text-center">
          <p className="mb-3">You have not added any service yet.</p>
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/technician/add-service" />}
          >
            Add your first service
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Image</th>
                <th className="p-2">Title</th>
                <th className="p-2">Category</th>
                <th className="p-2">Price</th>
                <th className="p-2">Approval</th>
                <th className="p-2">Available</th>
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
                  <td className="p-2">${s.basePrice}</td>
                  <td className="p-2">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium capitalize ${STATUS_STYLE[s.approvalStatus]}`}
                    >
                      {s.approvalStatus}
                    </span>
                  </td>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={s.isAvailable}
                      onChange={() => handleToggle(s)}
                      aria-label="Toggle availability"
                    />
                  </td>

                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setToEdit(s)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setToDelete(s)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this service?</DialogTitle>
            <DialogDescription>
              &quot;{toDelete?.title}&quot; will be removed permanently. This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {toEdit && (
        <EditServiceDialog
          key={toEdit._id}
          service={toEdit}
          onClose={() => setToEdit(null)}
          onSaved={(updated) => {
            setServices((list) =>
              list.map((s) =>
                s._id === updated._id ? { ...s, ...updated } : s,
              ),
            );
            setToEdit(null);
          }}
        />
      )}
    </div>
  );
}
