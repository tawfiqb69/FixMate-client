import {
  LayoutDashboard,
  ClipboardList,
  CreditCard,
  User,
  PlusCircle,
  Wrench,
  Inbox,
  Users,
  CheckSquare,
  Receipt,
} from "lucide-react";

export const NAV_BY_ROLE = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard, exact: true },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: ClipboardList },
    { label: "Payments", href: "/dashboard/customer/payments", icon: CreditCard },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboard, exact: true },
    { label: "Add Service", href: "/dashboard/technician/add-service", icon: PlusCircle },
    { label: "My Services", href: "/dashboard/technician/my-services", icon: Wrench },
    { label: "Requests", href: "/dashboard/technician/requests", icon: Inbox },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard, exact: true },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Services", href: "/dashboard/admin/services", icon: CheckSquare },
    { label: "Bookings", href: "/dashboard/admin/bookings", icon: ClipboardList },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: Receipt },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ],
};

// Role from the URL (used before the session finishes loading).
export function roleFromPath(pathname) {
  const part = pathname.split("/")[2];
  return NAV_BY_ROLE[part] ? part : null;
}