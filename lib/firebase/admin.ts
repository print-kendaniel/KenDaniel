import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";
import { serverConfig } from "@/lib/config/server";

function getAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) {
    return existing[0];
  }

  return initializeApp({
    credential: cert({
      projectId: serverConfig.FIREBASE_PROJECT_ID,
      clientEmail: serverConfig.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(serverConfig.FIREBASE_PRIVATE_KEY),
    }),
  });
}

/**
 * Env var UIs (Vercel's included) are inconsistent about how they store a
 * pasted multi-line PEM key — some keep the literal `\n` escape sequences,
 * some convert them to real newlines, and a value copied with its
 * surrounding quotes intact breaks `cert()` entirely. Handle all of these
 * instead of assuming one specific paste behavior.
 */
function normalizePrivateKey(raw: string): string {
  let key = raw.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  if (key.includes("\\n") && !key.includes("\n")) {
    key = key.replace(/\\n/g, "\n");
  }
  return key;
}

export const adminApp: App = getAdminApp();
export const adminAuth: Auth = getAuth(adminApp);
export const adminFirestore: Firestore = getFirestore(adminApp);
export const adminStorage: Storage = getStorage(adminApp);
