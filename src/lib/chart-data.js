// Same colors as the status badges
export const STATUS_META = [
  { key: "requested", label: "Requested", color: "#3b82f6" },
  { key: "accepted", label: "Accepted", color: "#6366f1" },
  { key: "in-progress", label: "In Progress", color: "#f59e0b" },
  { key: "completed", label: "Completed", color: "#22c55e" },
  { key: "rejected", label: "Rejected", color: "#ef4444" },
  { key: "cancelled", label: "Cancelled", color: "#6b7280" },
];

// Neutral emerald shades for roles
export const ROLE_META = [
  { key: "customer", label: "Customers", color: "#6ee7b7" },
  { key: "technician", label: "Technicians", color: "#10b981" },
  { key: "admin", label: "Admins", color: "#047857" },
];

function countBy(items, field, meta) {
  return meta.map((m) => ({
    label: m.label,
    color: m.color,
    value: items.filter((i) => i[field] === m.key).length,
  }));
}

export const buildStatusData = (bookings) => countBy(bookings, "status", STATUS_META);
export const buildRoleData = (users) => countBy(users, "role", ROLE_META);