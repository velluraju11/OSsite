
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

// This configuration is now loaded from environment variables
// to ensure it's secure and configurable.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (app) {
    return app;
  }

  // Check if all required environment variables are present.
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("Firebase config is missing. Please ensure NEXT_PUBLIC_FIREBASE_API_KEY and other variables are set in your .env.local file.");
    return null;
  }

  try {
    if (getApps().length) {
      app = getApp();
    } else {
      app = initializeApp(firebaseConfig);
    }
    return app;
  } catch (e) {
    console.error("Error initializing Firebase:", e);
    return null;
  }
}
