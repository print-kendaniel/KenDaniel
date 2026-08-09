import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "__session";

/**
 * Cheap Edge-compatible pre-filter: only checks that a session cookie is
 * present. It cannot cryptographically verify the cookie (the Admin SDK
 * needs the Node.js runtime), so the authoritative check happens in
 * `requireAdmin()` (lib/auth/guard.ts) inside the /admin server layout.
 */
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
