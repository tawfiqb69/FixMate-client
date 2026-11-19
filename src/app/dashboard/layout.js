import { requireSession } from "@/lib/session";

const DashboardLayout = async ({ children }) => {
    await requireSession();
    return children;
};

export default DashboardLayout;