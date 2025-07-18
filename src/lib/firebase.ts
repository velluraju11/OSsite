
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

// Public config from environment variables (preferred method)
const publicFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  // If the app is already initialized, return it.
  if (app) {
    return app;
  }
  
  // Check if all necessary public environment variables are present.
  const hasPublicConfig = 
    publicFirebaseConfig.apiKey &&
    publicFirebaseConfig.authDomain &&
    publicFirebaseConfig.projectId;

  if (hasPublicConfig) {
    try {
      if (getApps().length) {
        app = getApp();
      } else {
        app = initializeApp(publicFirebaseConfig);
      }
      return app;
    } catch (e) {
      console.error("Error initializing Firebase from public env vars", e);
      return null;
    }
  }
  
  // Fallback for environments where .env.local might not be loading correctly.
  // This is a last resort to prevent the app from crashing.
  console.warn("Firebase public credentials are not configured in .env.local. App functionality will be limited.");
  return null;
}
