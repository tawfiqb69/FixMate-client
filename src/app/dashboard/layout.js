import { requireSession } from "@/lib/session";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({ children }) {
  await requireSession();
  return <DashboardShell>{children}</DashboardShell>;
}