const STATUS = {
  requested: { label: "Requested", cls: "bg-blue-100 text-blue-800" },
  accepted: { label: "Accepted", cls: "bg-indigo-100 text-indigo-800" },
  "in-progress": { label: "In Progress", cls: "bg-amber-100 text-amber-800" },
  completed: { label: "Completed", cls: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-800" },
  cancelled: { label: "Cancelled", cls: "bg-gray-200 text-gray-700" },
};

const PAYMENT = {
  unpaid: { label: "Unpaid", cls: "bg-orange-100 text-orange-800" },
  paid: { label: "Paid", cls: "bg-green-100 text-green-800" },
};

function Badge({ item, fallback }) {
  const { label, cls } = item || { label: fallback, cls: "bg-gray-200 text-gray-700" };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

export function StatusBadge({ status }) {
  return <Badge item={STATUS[status]} fallback={status} />;
}

export function PaymentBadge({ status }) {
  return <Badge item={PAYMENT[status]} fallback={status} />;
}