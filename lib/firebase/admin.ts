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
      privateKey: serverConfig.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminApp: App = getAdminApp();
export const adminAuth: Auth = getAuth(adminApp);
export const adminFirestore: Firestore = getFirestore(adminApp);
export const adminStorage: Storage = getStorage(adminApp);
