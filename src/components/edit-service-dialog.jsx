"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImagePlus, Info, Loader2 } from "lucide-react";
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

const CATEGORIES = [
  "Smartphone", "Laptop & PC", "AC", "Refrigerator",
  "TV", "Washing Machine", "Electrical",
];
const SERVICE_MODES = ["Home Visit", "Shop Drop-off"];

const fieldClass =
  "w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50";

function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      {children}
    </section>
  );
}

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
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
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
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle className="font-display text-2xl font-semibold">
            Edit service
          </DialogTitle>
          <DialogDescription>
            Update the details of &ldquo;{service.title}&rdquo;.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-300">
              <Info className="mt-0.5 size-4 shrink-0" />
              <p>
                After saving, this service goes back to <strong>pending</strong>{" "}
                and is hidden from public pages until an admin approves it again.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              {/* Left column */}
              <div className="space-y-8">
                <Section title="Basics">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Category</Label>
                      <select
                        id="edit-category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={fieldClass + " h-10"}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-serviceMode">Service mode</Label>
                      <select
                        id="edit-serviceMode"
                        name="serviceMode"
                        value={form.serviceMode}
                        onChange={handleChange}
                        className={fieldClass + " h-10"}
                      >
                        {SERVICE_MODES.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Section>

                <Section title="Pricing and time">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="edit-basePrice">Base price (USD)</Label>
                      <Input
                        id="edit-basePrice"
                        name="basePrice"
                        type="number"
                        min="0"
                        step="any"
                        value={form.basePrice}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-estimatedDuration">
                        Estimated duration
                      </Label>
                      <Input
                        id="edit-estimatedDuration"
                        name="estimatedDuration"
                        value={form.estimatedDuration}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </Section>

                <Section title="Details">
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <textarea
                      id="edit-description"
                      name="description"
                      rows={5}
                      value={form.description}
                      onChange={handleChange}
                      className={fieldClass + " py-2"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-serviceArea">Service area</Label>
                    <Input
                      id="edit-serviceArea"
                      name="serviceArea"
                      value={form.serviceArea}
                      onChange={handleChange}
                    />
                  </div>
                </Section>
              </div>

              {/* Right column: image */}
              <div>
                <Section title="Service image">
                  <div className="relative aspect-16/10 overflow-hidden rounded-xl border bg-muted/40">
                    {preview || service.image ? (
                      <Image
                        src={preview || service.image}
                        alt={preview ? "New image preview" : service.title}
                        fill
                        unoptimized={Boolean(preview)}
                        sizes="(min-width: 768px) 300px, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                        <ImagePlus className="size-8" />
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                    <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider">
                      {preview ? "New" : "Current"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-image">Replace image (optional)</Label>
                    <input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      className="block w-full text-sm file:mr-3 file:h-9 file:cursor-pointer file:rounded-lg file:border file:bg-background file:px-3 file:text-sm file:font-medium hover:file:bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      JPG or PNG, up to 5 MB. Leave empty to keep the current image.
                    </p>
                  </div>
                </Section>
              </div>
            </div>
          </div>

          {/* Footer always visible */}
          <div className="flex flex-col-reverse gap-2 border-t bg-card px-6 py-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-brand-gradient text-white hover:opacity-90"
            >
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}