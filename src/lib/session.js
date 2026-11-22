import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { resetMongoClient } from "./db";

function isMongoClosed(err) {
  const text = `${err?.message || ""} ${err?.cause?.name || ""} ${err?.cause?.message || ""} ${err?.body?.code || ""}`;
  return (
    text.includes("Topology is closed") ||
    text.includes("MongoTopologyClosedError") ||
    text.includes("FAILED_TO_GET_SESSION")
  );
}

export async function getServerSession() {
  const h = await headers();
  try {
    return await auth.api.getSession({ headers: h });
  } catch (err) {
    if (!isMongoClosed(err)) throw err;
    // The Mongo connection was dead: use a fresh client and try once more
    resetMongoClient();
    return auth.api.getSession({ headers: h });
  }
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