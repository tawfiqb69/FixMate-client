"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function RequestRepair({ serviceId }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [problem, setProblem] = useState("");

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  // 1. Session still loading
  if (isPending) {
    return <Button disabled>Request Repair</Button>;
  }

  // 2. Logged out
  if (!session) {
    return (
      <Link
        href={`/sign-in?redirect=/services/${serviceId}`}
        className={buttonVariants()}
      >
        Request Repair
      </Link>
    );
  }

  // 3. Technician or admin
  if (session.user.role !== "customer") {
    return (
      <div className="space-y-2">
        <Button disabled>Request Repair</Button>
        <p className="text-sm text-muted-foreground">
          Only customers can request a repair.
        </p>
      </div>
    );
  }

  // 4. Customer
  async function handleSubmit(e) {
    e.preventDefault();

    if (phone.trim().length < 6) return toast.error("Enter a valid phone number");
    if (address.trim().length < 5) return toast.error("Enter your address");
    if (!preferredDate) return toast.error("Choose a preferred date");
    if (preferredDate < today) return toast.error("Date must be today or later");
    if (problem.trim().length < 20)
      return toast.error("Problem description must be at least 20 characters");

    setSaving(true);
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          customerPhone: phone,
          address,
          preferredDate,
          problemDescription: problem,
        }),
      });
      toast.success("Repair request sent", {
        action: {
          label: "My Bookings",
          onClick: () => router.push("/dashboard/customer/bookings"),
        },
      });
      setOpen(false);
      setPhone("");
      setAddress("");
      setPreferredDate("");
      setProblem("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Request Repair</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a Repair</DialogTitle>
            <DialogDescription>
              Tell the technician what is wrong. You pay only after the job is
              completed.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="rr-name">Name</Label>
              <Input id="rr-name" value={session.user.name} readOnly />
            </div>
            <div className="space-y-1">
              <Label htmlFor="rr-email">Email</Label>
              <Input id="rr-email" value={session.user.email} readOnly />
            </div>
            <div className="space-y-1">
              <Label htmlFor="rr-phone">Phone</Label>
              <Input
                id="rr-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01700000000"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="rr-address">Address</Label>
              <Input
                id="rr-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, road, area"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="rr-date">Preferred Date</Label>
              <Input
                id="rr-date"
                type="date"
                min={today}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="rr-problem">Problem Description</Label>
              <textarea
                id="rr-problem"
                rows={4}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe the problem (at least 20 characters)"
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Sending..." : "Send Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}