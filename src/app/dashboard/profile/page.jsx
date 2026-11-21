"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PageHeader from "@/components/dashboard/page-header";
import RoleBadge from "@/components/dashboard/role-badge";

function ProfileForm({ user, refetch }) {
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [area, setArea] = useState(user.area || "");
  const [bio, setBio] = useState(user.bio || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

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
    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    if (bio.length > 500) {
      toast.error("Bio must be 500 characters or less");
      return;
    }

    setSaving(true);
    try {
      let image = user.image || "";
      if (file) {
        const fd = new FormData();
        fd.append("image", file);
        const up = await apiFetch("/api/upload", { method: "POST", body: fd });
        image = up.data.url;
      }

      await apiFetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone, area, bio, image }),
      });

      await refetch();
      setFile(null);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  }

  const shownImage = preview || user.image || undefined;

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      {/* Photo card */}
      <div className="flex flex-col items-center rounded-xl border bg-card p-6 text-center lg:col-span-1">
        <Avatar className="size-28">
          <AvatarImage src={shownImage} alt="" />
          <AvatarFallback className="text-3xl">
            {(user.name || "?").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p className="mt-4 text-lg font-semibold">{user.name}</p>
        <div className="mt-1">
          <RoleBadge role={user.role} />
        </div>
        <p className="mt-2 break-all text-sm text-muted-foreground">{user.email}</p>

        <label
          htmlFor="photo"
          className="mt-5 inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
        >
          <Camera className="size-4" />
          Change photo
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="sr-only"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {file ? file.name : "JPG or PNG, up to 5 MB"}
        </p>
      </div>

      {/* Details card */}
      <div className="space-y-5 rounded-xl border bg-card p-6 lg:col-span-2">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email || ""} readOnly disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={user.role || ""} readOnly disabled className="capitalize" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">Area</Label>
          <Input
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g. Mirpur, Dhaka"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            maxLength={500}
            placeholder="Short bio: skills and experience"
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <p className="text-right text-xs text-muted-foreground">{bio.length}/500</p>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-brand-gradient text-white">
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const { data: session, refetch } = authClient.useSession();
  const user = session?.user;

  return (
    <div>
      <PageHeader
        title="Update Profile"
        description="Keep your contact details and photo up to date."
      />
      {user ? (
        <ProfileForm user={user} refetch={refetch} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3" role="status" aria-label="Loading profile">
          <div className="h-72 rounded-xl bg-muted motion-safe:animate-pulse" />
          <div className="h-72 rounded-xl bg-muted motion-safe:animate-pulse lg:col-span-2" />
        </div>
      )}
    </div>
  );
}