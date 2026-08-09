import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionCookie } from "@/lib/auth/session";
import type { DecodedIdToken } from "firebase-admin/auth";

/**
 * Authoritative admin check for server components/layouts. Redirects to
 * /login when the session cookie is missing, expired, revoked, or not
 * tied to an allow-listed admin UID.
 */
export async function requireAdmin(): Promise<DecodedIdToken> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  if (!decoded) {
    redirect("/login");
  }

  return decoded;
}

/**
 * Same check for Route Handlers, where redirect() isn't appropriate —
 * returns null instead of throwing/redirecting so callers can return a
 * proper 401 JSON response.
 */
export async function getAdminSession(): Promise<DecodedIdToken | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionCookie(sessionCookie);
}
