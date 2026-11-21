"use client";

import { useEffect, useState } from "react";
import { Users, Wrench, Clock } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { buildStatusData, buildRoleData } from "@/lib/chart-data";
import PageHeader from "@/components/dashboard/page-header";
import StatsCard from "@/components/dashboard/stats-card";
import CountChart from "@/components/dashboard/count-chart";

export default function AdminOverviewPage() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiFetch("/api/admin/users"),
      apiFetch("/api/admin/services?approvalStatus=pending"),
      apiFetch("/api/admin/bookings"),
    ])
      .then(([u, s, b]) => {
        if (cancelled) return;
        setUsers(u.data || []);
        setPending((s.data || []).length);
        setBookings(b.data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const technicians = users.filter((u) => u.role === "technician").length;

  return (
    <div>
      <PageHeader title="Overview" description="Platform summary at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard icon={Users} label="Total Users" value={users.length} hint="All registered accounts" loading={loading} error={error} />
        <StatsCard icon={Wrench} label="Total Technicians" value={technicians} hint="Accounts with the technician role" loading={loading} error={error} />
        <StatsCard icon={Clock} label="Pending Services" value={pending} hint="Waiting for your approval" loading={loading} error={error} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <CountChart
          title="Bookings by status"
          description="All repair jobs on the platform."
          data={buildStatusData(bookings)}
          loading={loading}
          error={error}
          emptyText="No bookings yet."
        />
        <CountChart
          title="Users by role"
          description="Who is on the platform."
          data={buildRoleData(users)}
          loading={loading}
          error={error}
          emptyText="No users yet."
        />
      </div>
    </div>
  );
}