"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

// TEMPORARY header. It will be replaced by the real Navbar in Step 5.1.
export default function TempHeader() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut();
    toast.success("Signed out");
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b p-4">
      <Link href="/" className="font-bold">FixMate (temp header)</Link>

      <div className="flex items-center gap-3 text-sm">
        {isPending ? (
          <span>Loading...</span>
        ) : session ? (
          <>
            <span>{session.user.name} ({session.user.role})</span>
            <Link href={`/dashboard/${session.user.role}`} className="underline">Dashboard</Link>
            <Button size="sm" variant="outline" onClick={handleSignOut}>Sign Out</Button>
          </>
        ) : (
          <>
            <Link href="/sign-in" className="underline">Sign In</Link>
            <Link href="/sign-up" className="underline">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}