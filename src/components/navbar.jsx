"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Wrench,
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  UserCog,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
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

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

const iconBtn =
  "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function RingAvatar({ user, size = "size-8" }) {
  return (
    <span className="rounded-full bg-brand-gradient p-0.5">
      <span className="block rounded-full bg-background p-0.5">
        <Avatar className={size}>
          <AvatarImage
            src={user?.image || undefined}
            alt=""
            referrerPolicy="no-referrer"
          />
          <AvatarFallback>
            {(user?.name || "U").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </span>
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session, isPending } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const user = session?.user;
  const role = user?.role || "customer";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSignOut() {
    await authClient.signOut();
    toast.success("Signed out successfully");
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 w-full px-3 pt-3 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Floating capsule */}
        <div
          className={`relative flex h-14 items-center justify-between rounded-full border bg-background/75 pl-2 pr-2 backdrop-blur-md transition-shadow duration-300 sm:pl-3 ${
            scrolled
              ? "shadow-[0_12px_32px_-14px_rgba(6,78,59,0.35)]"
              : "shadow-sm"
          }`}
        >
          {/* thin brand light along the bottom edge */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 -bottom-px h-px bg-linear-to-r from-transparent via-primary/60 to-transparent"
          />

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 rounded-full pr-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-gradient text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
              <Wrench className="size-[18px]" />
            </span>
            <span className="font-display text-2xl font-bold tracking-tight">
              FixMate
            </span>
          </Link>

          {/* Desktop links */}
          <nav
            aria-label="Main"
            className="hidden items-center gap-1 md:flex"
          >
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                    active
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full bg-primary"
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className={iconBtn}
            >
              <Sun className="size-[18px] dark:hidden" />
              <Moon className="hidden size-[18px] dark:block" />
            </button>

            {isPending ? (
              <div className="size-10 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      aria-label="Open user menu"
                      className="rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring motion-safe:hover:scale-105"
                    />
                  }
                >
                  <RingAvatar user={user} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-1.5">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="mb-1 flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                      <RingAvatar user={user} size="size-10" />
                      <span className="min-w-0 space-y-1">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {user.name}
                        </span>
                        <span className="block truncate text-xs font-normal text-muted-foreground">
                          {user.email}
                        </span>
                        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                          {role}
                        </span>
                      </span>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      render={<Link href={`/dashboard/${role}`} />}
                    >
                      <LayoutDashboard />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      render={<Link href="/dashboard/profile" />}
                    >
                      <UserCog />
                      Update Profile
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive"
                    >
                      <LogOut />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-1 md:flex">
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    variant: "ghost",
                    className: "rounded-full",
                  })}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    className:
                      "group rounded-full bg-brand-gradient px-5 text-white shadow-[0_8px_20px_-10px_#047857] hover:opacity-90",
                  })}
                >
                  Sign Up
                  <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}

            {/* Hamburger (mobile) */}
            <button
              type="button"
              className={iconBtn + " md:hidden"}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="mt-2 rounded-2xl border bg-background/95 p-2 shadow-lg backdrop-blur-md md:hidden">
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${
                      active
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-primary"
                      />
                    )}
                    {link.label}
                  </Link>
                );
              })}
              {!isPending && !user && (
                <div className="mt-1 flex gap-2 border-t pt-2">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className={buttonVariants({
                      variant: "outline",
                      className: "flex-1 rounded-full",
                    })}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className={buttonVariants({
                      className:
                        "flex-1 rounded-full bg-brand-gradient text-white hover:opacity-90",
                    })}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}