export default function RoleBadge({ role }) {
  if (!role) return null;
  return (
    <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold capitalize text-primary">
      {role}
    </span>
  );
}