"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wrench, CheckCircle2, Inbox } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { buildStatusData } from "@/lib/chart-data";
import { buttonVariants } from "@/components/ui/button";
import PageHeader from "@/components/dashboard/page-header";
import StatsCard from "@/components/dashboard/stats-card";
import CountChart from "@/components/dashboard/count-chart";

export default function TechnicianOverviewPage() {
  const [services, setServices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([apiFetch("/api/services/my"), apiFetch("/api/bookings/technician")])
      .then(([s, b]) => {
        if (cancelled) return;
        setServices(s.data || []);
        setJobs(b.data || []);
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

  const approved = services.filter((s) => s.approvalStatus === "approved").length;
  const pending = jobs.filter((j) => j.status === "requested").length;

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Your services and incoming repair requests."
        action={
          <Link href="/dashboard/technician/add-service" className={buttonVariants()}>
            Add Service
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard icon={Wrench} label="Total Services" value={services.length} hint="All services you created" loading={loading} error={error} />
        <StatsCard icon={CheckCircle2} label="Approved Services" value={approved} hint="Visible to customers" loading={loading} error={error} />
        <StatsCard icon={Inbox} label="Pending Requests" value={pending} hint="Waiting for your reply" loading={loading} error={error} />
      </div>
      <div className="mt-6">
        <CountChart
          title="My jobs by status"
          description="Jobs sent to you by customers."
          data={buildStatusData(jobs)}
          loading={loading}
          error={error}
          emptyText="No jobs yet. Requests for your services will show here."
        />
      </div>
    </div>
  );
}