"use client";

import { useState } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";

const CATEGORIES = [
  "Smartphone", "Laptop & PC", "AC", "Refrigerator",
  "TV", "Washing Machine", "Electrical",
];
const SERVICE_MODES = ["Home Visit", "Shop Drop-off"];
const fieldClass = "w-full rounded-md border bg-transparent px-3 py-2 text-sm";

export default function EditServiceDialog({ service, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: service.title,
    category: service.category,
    description: service.description,
    basePrice: String(service.basePrice),
    estimatedDuration: service.estimatedDuration,
    serviceMode: service.serviceMode,
    serviceArea: service.serviceArea,
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.title.trim() || !form.description.trim() ||
      !form.estimatedDuration.trim() || !form.serviceArea.trim()
    ) {
      return toast.error("All fields are required");
    }
    if (!(Number(form.basePrice) > 0)) {
      return toast.error("Base price must be greater than 0");
    }
    if (file && !file.type.startsWith("image/")) {
      return toast.error("Please choose an image file");
    }

    setSaving(true);
    try {
      let image = service.image;

      if (file) {
        const data = new FormData();
        data.append("image", file);
        const uploaded = await apiFetch("/api/upload", {
          method: "POST",
          body: data,
        });
        image = uploaded.data.url;
      }

      const json = await apiFetch(`/api/services/${service._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image }),
      });

      toast.success(json.message);
      onSaved(json.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit service</DialogTitle>
          <DialogDescription>
            After saving, the service goes back to pending until an admin approves it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={fieldClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>

          <div>
            <Label htmlFor="basePrice">Base price (USD)</Label>
            <Input
              id="basePrice"
              name="basePrice"
              type="number"
              min="0"
              step="any"
              value={form.basePrice}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="estimatedDuration">Estimated duration</Label>
            <Input
              id="estimatedDuration"
              name="estimatedDuration"
              value={form.estimatedDuration}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="serviceMode">Service mode</Label>
            <select
              id="serviceMode"
              name="serviceMode"
              value={form.serviceMode}
              onChange={handleChange}
              className={fieldClass}
            >
              {SERVICE_MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="serviceArea">Service area</Label>
            <Input
              id="serviceArea"
              name="serviceArea"
              value={form.serviceArea}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="image">New image (optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}