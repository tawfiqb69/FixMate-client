"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Menu,
  Home,
  Sun,
  Moon,
  ChevronRight,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import RoleBadge from "./role-badge";

const iconBtn =
  "inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const capsuleBtn =
  "inline-flex h-8 items-center justify-center gap-2 rounded-full px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function makeCrumbs(pathname) {
  return pathname
    .split("/")
    .filter(Boolean)
    .map((part) =>
      part
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    );
}

function RingAvatar({ user, size = "size-8" }) {
  return (
    <span className="rounded-full bg-brand-gradient p-0.5">
      <span className="block rounded-full bg-background p-0.5">
        <Avatar className={size}>
          <AvatarImage src={user?.image || undefined} alt="" referrerPolicy="no-referrer" />
          <AvatarFallback>
            {(user?.name || "?").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </span>
    </span>
  );
}

export default function DashboardTopbar({ role, user, onOpenMobile }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const crumbs = makeCrumbs(pathname);

  async function handleSignOut() {
    await authClient.signOut();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
      <button
        type="button"
        onClick={onOpenMobile}
        className={iconBtn + " lg:hidden"}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex items-center gap-1 overflow-hidden text-sm text-muted-foreground">
          {crumbs.map((c, i) => (
            <li key={i} className="flex min-w-0 items-center gap-1">
              {i > 0 && (
                <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
              )}
              <span
                className={
                  i === crumbs.length - 1
                    ? "truncate font-medium text-foreground"
                    : "hidden truncate sm:inline"
                }
                aria-current={i === crumbs.length - 1 ? "page" : undefined}
              >
                {c}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* Quick actions capsule */}
      <div className="flex items-center gap-0.5 rounded-full border bg-card p-1">
        <Link href="/" className={capsuleBtn} aria-label="Back to Home">
          <Home className="size-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <span className="h-4 w-px bg-border" aria-hidden="true" />
        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className={capsuleBtn + " w-8 px-0"}
          aria-label="Toggle theme"
        >
          <Sun className="size-4 dark:hidden" />
          <Moon className="hidden size-4 dark:block" />
        </button>
      </div>

      {/* Profile chip */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="group flex items-center gap-2.5 rounded-full border bg-card p-1 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:pr-3"
              aria-label="Open user menu"
            />
          }
        >
          <RingAvatar user={user} />
          <span className="hidden min-w-0 flex-col items-start text-left md:flex">
            <span className="max-w-32 truncate text-sm font-medium leading-tight">
              {user?.name}
            </span>
            <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.14em] text-primary">
              {role}
            </span>
          </span>
          <ChevronDown
            className="hidden size-4 text-muted-foreground transition-transform group-aria-expanded:rotate-180 md:block"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64 p-1.5">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="mb-1 flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <RingAvatar user={user} size="size-10" />
              <span className="min-w-0 space-y-1">
                <span className="block truncate text-sm font-semibold">
                  {user?.name}
                </span>
                <span className="block truncate text-xs font-normal text-muted-foreground">
                  {user?.email}
                </span>
                <RoleBadge role={role} />
              </span>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            render={<Link href="/dashboard/profile" />}
            className="gap-2"
          >
            <User className="size-4" />
            Update Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSignOut}
            className="gap-2 text-destructive"
          >
            <LogOut className="size-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}