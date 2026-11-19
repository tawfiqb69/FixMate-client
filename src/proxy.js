import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Quick check only: is there a session cookie? The real check is in the layouts.
export function proxy(request) {
  const cookie = getSessionCookie(request);
  if (!cookie) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};