import { config } from "dotenv";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Standalone Admin SDK init for scripts run via `tsx` outside Next's
 * bundler. Deliberately does NOT reuse lib/firebase/admin.ts — that module
 * imports the `server-only` package, which throws unconditionally unless
 * Next's webpack build swaps it for a no-op, breaking any script that
 * imports it directly with tsx/node.
 *
 * Loads .env.local explicitly: dotenv's default `dotenv/config` entrypoint
 * only reads `.env`, but this project (like Next.js itself) keeps secrets
 * in `.env.local`.
 */
config({ path: ".env.local" });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getAdminApp() {
  const existing = getApps();
  if (existing.length > 0) {
    return existing[0];
  }

  return initializeApp({
    credential: cert({
      projectId: requireEnv("FIREBASE_PROJECT_ID"),
      clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
      privateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
  });
}

export const adminFirestore = getFirestore(getAdminApp());
