import { requireSession } from "@/lib/session";
import Navbar from "@/components/navbar";

// TEMPORARY: navbar only (no footer). Replaced by the real Dashboard Layout in Step 6.1.
const DashboardLayout = async ({ children }) => {
  await requireSession();
  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
    </>
  );
};

export default DashboardLayout;