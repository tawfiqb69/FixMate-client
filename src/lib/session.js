import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}

// Logged-in users only. Others go to /sign-in.
export async function requireSession() {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");
  return session;
}

// Only this role. Other roles go to their own dashboard.
export async function requireRole(role) {
  const session = await requireSession();
  if (session.user.role !== role) redirect(`/dashboard/${session.user.role}`);
  return session;
}

// For /sign-in and /sign-up: logged-in users go to their dashboard.
export async function redirectIfLoggedIn() {
  const session = await getServerSession();
  if (session) redirect(`/dashboard/${session.user.role}`);
}