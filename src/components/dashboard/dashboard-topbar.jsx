"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Menu, Home, Sun, Moon, ChevronRight } from "lucide-react";
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

function makeCrumbs(pathname) {
  return pathname
    .split("/")
    .filter(Boolean)
    .map((part) =>
      part
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
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
                <ChevronRight
                  className="size-3.5 shrink-0"
                  aria-hidden="true"
                />
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

      <Link
        href="/"
        className={iconBtn + " sm:w-auto sm:gap-2 sm:px-3 sm:text-sm"}
        aria-label="Back to Home"
      >
        <Home className="size-5 sm:size-4" />
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      <button
        type="button"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className={iconBtn}
        aria-label="Toggle theme"
      >
        <Sun className="size-5 dark:hidden" />
        <Moon className="hidden size-5 dark:block" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:rounded-xl md:py-1 md:pl-1 md:pr-3 md:hover:bg-muted"
              aria-label="Open user menu"
            />
          }
        >


           <Avatar className="size-9">
            <AvatarImage src={user?.image || undefined} alt="" />
            <AvatarFallback>{(user?.name || "?").charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="hidden min-w-0 flex-col items-start gap-0.5 text-left md:flex">
            <span className="max-w-36 truncate text-sm font-medium leading-none">
              {user?.name}
            </span>
            <RoleBadge role={role} />
          </span>




        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="space-y-1">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <RoleBadge role={role} />
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
            Update Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
