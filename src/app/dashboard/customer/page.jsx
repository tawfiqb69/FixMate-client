"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, Hammer, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { buildStatusData } from "@/lib/chart-data";
import { buttonVariants } from "@/components/ui/button";
import PageHeader from "@/components/dashboard/page-header";
import StatsCard from "@/components/dashboard/stats-card";
import CountChart from "@/components/dashboard/count-chart";

const ACTIVE = ["requested", "accepted", "in-progress"];

export default function CustomerOverviewPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/bookings/my")
      .then((res) => {
        if (!cancelled) setBookings(res.data || []);
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

  const total = bookings.length;
  const active = bookings.filter((b) => ACTIVE.includes(b.status)).length;
  const completed = bookings.filter((b) => b.status === "completed").length;

  return (
    <div>
      <PageHeader
        title="Overview"
        description="A quick look at your repair requests."
        action={
          <Link href="/services" className={buttonVariants()}>
            Browse Services
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard icon={ClipboardList} label="Total Requests" value={total} hint="All your repair requests" loading={loading} error={error} />
        <StatsCard icon={Hammer} label="Active Jobs" value={active} hint="Requested, accepted or in progress" loading={loading} error={error} />
        <StatsCard icon={CheckCircle2} label="Completed Jobs" value={completed} hint="Finished by technicians" loading={loading} error={error} />
      </div>
      <div className="mt-6">
        <CountChart
          title="My requests by status"
          description="How your repair requests are moving."
          data={buildStatusData(bookings)}
          loading={loading}
          error={error}
          emptyText="No requests yet. Send your first repair request to see your chart."
        />
      </div>
    </div>
  );
}