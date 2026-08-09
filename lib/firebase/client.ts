import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";
import { type FirebaseStorage, getStorage } from "firebase/storage";
import { publicConfig } from "@/lib/config/public";

const firebaseOptions = {
  apiKey: publicConfig.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: publicConfig.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: publicConfig.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: publicConfig.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: publicConfig.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: publicConfig.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp(): FirebaseApp {
  const existing = getApps();
  return existing.length > 0 ? existing[0] : initializeApp(firebaseOptions);
}

export const firebaseApp: FirebaseApp = getFirebaseApp();
export const firebaseAuth: Auth = getAuth(firebaseApp);
export const firestore: Firestore = getFirestore(firebaseApp);
export const firebaseStorage: FirebaseStorage = getStorage(firebaseApp);
