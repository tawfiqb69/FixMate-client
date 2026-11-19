import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Calls Express with a fresh JWT. Returns the JSON or throws an Error.
export async function apiFetch(path, options = {}) {
  const { data } = await authClient.token();
  const token = data?.token;
  if (!token) throw new Error("Please sign in again");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.message || "Something went wrong");
  }
  return json;
}