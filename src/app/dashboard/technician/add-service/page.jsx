"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/dashboard/page-header";

const CATEGORIES = ["Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine", "Electrical"];
const MODES = ["Home Visit", "Shop Drop-off"];

const fieldClass =
  "w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50";

const emptyForm = {
  title: "",
  category: "",
  description: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "",
  serviceArea: "",
};

export default function AddServicePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [fileKey, setFileKey] = useState(0);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
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

  function validate() {
    if (form.title.trim().length < 3) return "Title must be at least 3 characters";
    if (!form.category) return "Please choose a category";
    if (form.description.trim().length < 10) return "Description must be at least 10 characters";
    if (!(Number(form.basePrice) > 0)) return "Base price must be a positive number";
    if (!form.estimatedDuration.trim()) return "Estimated duration is required";
    if (!form.serviceMode) return "Please choose a service mode";
    if (!form.serviceArea.trim()) return "Service area is required";
    if (!file) return "Please upload a service image";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      toast.error(problem);
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const up = await apiFetch("/api/upload", { method: "POST", body: fd });

      await apiFetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category,
          description: form.description.trim(),
          basePrice: Number(form.basePrice),
          estimatedDuration: form.estimatedDuration.trim(),
          serviceMode: form.serviceMode,
          serviceArea: form.serviceArea.trim(),
          image: up.data.url,
        }),
      });

      toast.success("Service submitted. It is waiting for admin approval.");
      setForm(emptyForm);
      setFile(null);
      setPreview("");
      setFileKey((k) => k + 1);
    } catch (err) {
      toast.error(err.message || "Could not add service");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Add a Service"
        description="New services stay pending until an admin approves them."
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Main details */}
        <div className="space-y-5 rounded-xl border bg-card p-6 lg:col-span-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="e.g. iPhone Screen Replacement" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select id="category" value={form.category} onChange={(e) => setField("category", e.target.value)} className={fieldClass + " h-10"}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceMode">Service mode</Label>
              <select id="serviceMode" value={form.serviceMode} onChange={(e) => setField("serviceMode", e.target.value)} className={fieldClass + " h-10"}>
                <option value="">Select mode</option>
                {MODES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea id="description" rows={5} value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="What does this service include?" className={fieldClass + " py-2"} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base price (USD)</Label>
              <Input id="basePrice" type="number" min="0" step="0.01" value={form.basePrice} onChange={(e) => setField("basePrice", e.target.value)} placeholder="e.g. 40" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Estimated duration</Label>
              <Input id="estimatedDuration" value={form.estimatedDuration} onChange={(e) => setField("estimatedDuration", e.target.value)} placeholder="e.g. 2-3 hours" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceArea">Service area</Label>
            <Input id="serviceArea" value={form.serviceArea} onChange={(e) => setField("serviceArea", e.target.value)} placeholder="e.g. Dhanmondi, Dhaka" />
          </div>
        </div>

        {/* Side column */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border bg-card p-6">
            <Label htmlFor="image">Service image</Label>
            <div className="relative mt-3 aspect-16/10 overflow-hidden rounded-lg border border-dashed bg-muted/40">
              {preview ? (
                <Image src={preview} alt="Selected service preview" fill unoptimized className="object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImagePlus className="size-8" />
                  <span className="text-xs">No image selected</span>
                </div>
              )}
            </div>
            <input key={fileKey} id="image" type="file" accept="image/*" onChange={handleFile} className="mt-3 block w-full text-sm file:mr-3 file:h-9 file:cursor-pointer file:rounded-lg file:border file:bg-background file:px-3 file:text-sm file:font-medium hover:file:bg-muted" />
            <p className="mt-2 text-xs text-muted-foreground">JPG or PNG, up to 5 MB.</p>
          </div>

          <div className="space-y-4 rounded-xl border bg-card p-6">
            <div className="space-y-2">
              <Label htmlFor="techName">Technician name</Label>
              <Input id="techName" value={user?.name || ""} readOnly disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="techEmail">Technician email</Label>
              <Input id="techEmail" value={user?.email || ""} readOnly disabled />
            </div>
          </div>

          <Button type="submit" disabled={saving} className="h-11 w-full bg-brand-gradient text-white">
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            {saving ? "Submitting..." : "Submit for approval"}
          </Button>
        </div>
      </form>
    </div>
  );
}