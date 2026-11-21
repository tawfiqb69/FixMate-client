"use client";

import { useEffect, useState } from "react";
import { Users, Wrench, Clock } from "lucide-react";
import { apiFetch } from "@/lib/api";
import PageHeader from "@/components/dashboard/page-header";
import StatsCard from "@/components/dashboard/stats-card";

export default function AdminOverviewPage() {
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiFetch("/api/admin/users"),
      apiFetch("/api/admin/services?approvalStatus=pending"),
    ])
      .then(([u, s]) => {
        if (cancelled) return;
        setUsers(u.data || []);
        setPending((s.data || []).length);
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
    </div>
  );
}