"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NAV_BY_ROLE } from "./dashboard-nav";
import RoleBadge from "./role-badge";

export default function DashboardSidebar({
  role,
  user,
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role] || [];
  const hideText = collapsed ? "lg:hidden" : "";

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card",
        "transition-transform duration-200 motion-reduce:transition-none",
        "lg:static lg:translate-x-0 lg:transition-[width]",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        collapsed ? "lg:w-[72px]" : "lg:w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="FixMate home"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-white">
            <Wrench className="size-5" />
          </span>
          <span className={cn("font-display text-2xl font-semibold", hideText)}>
            FixMate
          </span>
        </Link>
        <button
          type="button"
          onClick={onCloseMobile}
          className="rounded-md p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          aria-label="Close menu"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Dashboard menu">
        {items.length === 0 && (
          <div className="space-y-2" aria-hidden="true">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-10 rounded-lg bg-muted motion-safe:animate-pulse" />
            ))}
          </div>
        )}
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                collapsed && "lg:justify-center lg:px-0",
                active
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {active && (
                <span className="absolute left-0 top-2 h-6 w-1 rounded-r-full bg-primary" aria-hidden="true" />
              )}
              <Icon className="size-5 shrink-0" />
              <span className={hideText}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Collapse button (desktop only) */}
      <div className="hidden border-t p-3 lg:block">
        <button
          type="button"
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? <ChevronsRight className="size-5" /> : <ChevronsLeft className="size-5" />}
          <span className={hideText}>Collapse</span>
        </button>
      </div>

      {/* Profile summary */}
      <div className={cn("flex items-center gap-3 border-t p-3", collapsed && "lg:justify-center")}>
        <Avatar className="size-9 shrink-0">
          <AvatarImage src={user?.image || undefined} alt="" />
          <AvatarFallback>{(user?.name || "?").charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className={cn("min-w-0", hideText)}>
          <p className="truncate text-sm font-medium">{user?.name || "Loading..."}</p>
          <RoleBadge role={role} />
        </div>
      </div>
    </aside>
  );
}