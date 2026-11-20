"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ProfileForm({ user, refetch }) {
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [area, setArea] = useState(user.area || "");
  const [bio, setBio] = useState(user.bio || "");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleFile(e) {
    const picked = e.target.files?.[0];
    if (!picked) return setFile(null);
    if (!picked.type.startsWith("image/")) {
      e.target.value = "";
      return toast.error("Please choose an image file");
    }
    if (picked.size > 5 * 1024 * 1024) {
      e.target.value = "";
      return toast.error("Image must be 5 MB or smaller");
    }
    setFile(picked);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Name must be at least 2 characters");
    if (bio.length > 500) return toast.error("Bio must be 500 characters or less");

    setSaving(true);
    try {
      const body = { name, phone, area, bio };

      if (file) {
        const fd = new FormData();
        fd.append("image", file);
        const upload = await apiFetch("/api/upload", { method: "POST", body: fd });
        body.image = upload.data.url;
      }

      await apiFetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      await refetch(); // updates navbar and top bar without logging out
      setFile(null);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div className="flex items-center gap-4">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl font-semibold">
            {user.name?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="space-y-1">
          <Label htmlFor="photo">Profile Photo</Label>
          <Input id="photo" type="file" accept="image/*" onChange={handleFile} />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="pf-email">Email</Label>
        <Input id="pf-email" value={user.email} readOnly />
      </div>
      <div className="space-y-1">
        <Label htmlFor="pf-role">Role</Label>
        <Input id="pf-role" value={user.role} readOnly className="capitalize" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="pf-name">Name</Label>
        <Input id="pf-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="pf-phone">Phone</Label>
        <Input id="pf-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="pf-area">Area</Label>
        <Input
          id="pf-area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Mirpur, Dhaka"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="pf-bio">Bio</Label>
        <textarea
          id="pf-bio"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();

  if (isPending) return <p>Loading profile...</p>;
  if (!session) return <p>Please sign in.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Update Profile</h1>
      <ProfileForm user={session.user} refetch={refetch} />
    </div>
  );
}