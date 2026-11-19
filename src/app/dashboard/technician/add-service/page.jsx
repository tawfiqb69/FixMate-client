"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CATEGORIES = [
  "Smartphone", "Laptop & PC", "AC", "Refrigerator",
  "TV", "Washing Machine", "Electrical",
];
const SERVICE_MODES = ["Home Visit", "Shop Drop-off"];

const emptyForm = {
  title: "",
  category: "",
  description: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "",
  serviceArea: "",
};

const fieldClass = "w-full rounded-md border bg-background px-3 py-2 text-sm";

export default function AddServicePage() {
  const { data: session } = authClient.useSession();
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [fileKey, setFileKey] = useState(0); // used to clear the file input
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Returns an error message, or "" if everything is fine
  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.category) return "Please choose a category";
    if (!form.description.trim()) return "Description is required";
    if (!(Number(form.basePrice) > 0)) return "Base price must be greater than 0";
    if (!form.estimatedDuration.trim()) return "Estimated duration is required";
    if (!form.serviceMode) return "Please choose a service mode";
    if (!form.serviceArea.trim()) return "Service area is required";
    if (!imageFile) return "Please choose a service image";
    if (!imageFile.type.startsWith("image/")) return "The file must be an image";
    if (imageFile.size > 5 * 1024 * 1024) return "Image must be 5MB or smaller";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return toast.error(error);

    setLoading(true);
    try {
      // 1. Upload the image (through Express -> ImgBB)
      const uploadData = new FormData();
      uploadData.append("image", imageFile);
      const upload = await apiFetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      // 2. Create the service
      await apiFetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          basePrice: Number(form.basePrice),
          image: upload.data.url,
        }),
      });

      toast.success("Service submitted. It is waiting for admin approval.");
      setForm(emptyForm);
      setImageFile(null);
      setFileKey((k) => k + 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Add a Service</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="techName">Technician name</Label>
            <Input id="techName" value={session?.user?.name || ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="techEmail">Technician email</Label>
            <Input id="techEmail" value={session?.user?.email || ""} readOnly />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={form.title} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select id="category" name="category" value={form.category}
            onChange={handleChange} className={fieldClass}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea id="description" name="description" rows={4}
            value={form.description} onChange={handleChange} className={fieldClass} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="basePrice">Base price (USD)</Label>
            <Input id="basePrice" name="basePrice" type="number" min="0"
              step="0.01" value={form.basePrice} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedDuration">Estimated duration</Label>
            <Input id="estimatedDuration" name="estimatedDuration"
              placeholder="e.g. 2-3 hours" value={form.estimatedDuration}
              onChange={handleChange} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="serviceMode">Service mode</Label>
            <select id="serviceMode" name="serviceMode" value={form.serviceMode}
              onChange={handleChange} className={fieldClass}>
              <option value="">Select a mode</option>
              {SERVICE_MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="serviceArea">Service area</Label>
            <Input id="serviceArea" name="serviceArea"
              placeholder="e.g. Dhanmondi, Dhaka" value={form.serviceArea}
              onChange={handleChange} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Service image</Label>
          <input key={fileKey} id="image" type="file" accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
            className={fieldClass} />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Add Service"}
        </Button>
      </form>
    </div>
  );
}