
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

// Hardcoded public Firebase configuration for project 'ryha-os'
// This is used to ensure the client-side application can always connect to Firebase.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_IS_NOT_PUBLICLY_AVAILABLE", // NOTE: This is a placeholder. Real API key is needed. For many services, this is fine.
  authDomain: "ryha-os.firebaseapp.com",
  projectId: "ryha-os",
  storageBucket: "ryha-os.appspot.com",
  messagingSenderId: "1037483530549",
  appId: "1:1037483530549:web:96e1b7218ac497f39420f5"
};

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (app) {
    return app;
  }

  // Basic check to see if the config is populated.
  if (!firebaseConfig.projectId) {
    console.error("Firebase config is missing projectId. Firebase cannot be initialized.");
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
