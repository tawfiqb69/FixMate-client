"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PageHeader from "@/components/dashboard/page-header";

const ROLES = ["customer", "technician", "admin"];

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";
}

export default function AdminUsersPage() {
  const { data: session } = authClient.useSession();
  const myEmail = session?.user?.email;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/admin/users")
      .then((res) => {
        if (!cancelled) setUsers(res.data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load users");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function changeRole(user, role) {
    setUpdatingId(user._id);
    try {
      await apiFetch(`/api/admin/users/${user._id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      setUsers((list) => list.map((u) => (u._id === user._id ? { ...u, role } : u)));
      toast.success(`Role changed to ${role}`);
    } catch (err) {
      toast.error(err.message || "Could not change role");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <div>
      <PageHeader title="Manage Users" description="View all accounts and change their roles." />

      {loading && (
        <div className="space-y-3" role="status" aria-label="Loading users">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-14 rounded-xl bg-muted motion-safe:animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="rounded-xl border border-destructive/40 p-4 text-sm text-destructive">{error}</p>
      )}

      {!loading && !error && users.length === 0 && (
        <p className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">No users found.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => {
                const isMe = u.email === myEmail;
                return (
                  <tr key={u._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarImage src={u.image || undefined} alt="" />
                          <AvatarFallback>{(u.name || "?").charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {u.name}
                          {isMe && <span className="ml-1 text-xs text-muted-foreground">(you)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        disabled={isMe || updatingId === u._id}
                        onChange={(e) => changeRole(u, e.target.value)}
                        aria-label={`Role for ${u.name}`}
                        className="h-9 rounded-lg border border-input bg-transparent px-2 text-sm capitalize outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{fmtDate(u.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}