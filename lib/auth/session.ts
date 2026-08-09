import "server-only";
import { adminAuth } from "@/lib/firebase/admin";
import { serverConfig } from "@/lib/config/server";
import type { DecodedIdToken } from "firebase-admin/auth";

export const SESSION_COOKIE_NAME = serverConfig.SESSION_COOKIE_NAME;
export const SESSION_COOKIE_MAX_AGE_MS = serverConfig.SESSION_COOKIE_MAX_AGE_SECONDS * 1000;

/**
 * Exchanges a freshly-signed-in client ID token for a long-lived session
 * cookie value. Callers must verify the token belongs to an admin UID
 * BEFORE calling this — this function only mints the cookie.
 */
export async function createSessionCookie(idToken: string): Promise<string> {
  return adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_COOKIE_MAX_AGE_MS });
}

/**
 * Verifies an ID token (short-lived, from client sign-in) and confirms the
 * UID is allow-listed as an admin. Throws if invalid or not an admin.
 */
export async function verifyAdminIdToken(idToken: string): Promise<DecodedIdToken> {
  const decoded = await adminAuth.verifyIdToken(idToken);
  assertIsAdminUid(decoded.uid);
  return decoded;
}

/**
 * Verifies a session cookie value. Returns null (never throws) so callers
 * can uniformly redirect on any invalid/expired/revoked session.
 */
export async function verifySessionCookie(
  sessionCookie: string | undefined,
): Promise<DecodedIdToken | null> {
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    assertIsAdminUid(decoded.uid);
    return decoded;
  } catch {
    return null;
  }
}

function assertIsAdminUid(uid: string): void {
  if (!serverConfig.ADMIN_UIDS.includes(uid)) {
    throw new Error("UID is not an authorized admin");
  }
}
