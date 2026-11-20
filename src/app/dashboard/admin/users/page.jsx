"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { StatusBadge } from "@/components/status-badge";

const ROLES = ["customer", "technician", "admin"];

export default function AdminUsersPage() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/admin/users")
      .then((res) => {
        if (!cancelled) setUsers(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function changeRole(user, role) {
    if (role === user.role) return;
    setBusyId(user._id);
    try {
      await apiFetch(`/api/admin/users/${user._id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      setUsers((list) =>
        list.map((u) => (u._id === user._id ? { ...u, role } : u))
      );
      toast.success(`${user.name} is now ${role}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      {users.length === 0 ? (
        <div className="rounded-md border p-8 text-center">No users found.</div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-3">Photo</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isMe = session?.user?.email === u.email;
                return (
                  <tr key={u._id} className="border-b last:border-0">
                    <td className="p-3">
                      {u.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={u.image}
                          alt={u.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-semibold">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-medium">
                      {u.name} {isMe && <span className="text-xs text-muted-foreground">(you)</span>}
                    </td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        disabled={isMe || busyId === u._id}
                        onChange={(e) => changeRole(u, e.target.value)}
                        className="rounded-md border bg-transparent px-2 py-1 text-sm disabled:opacity-50"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                    </td>
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