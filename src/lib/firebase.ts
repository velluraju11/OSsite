
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

// Hardcoded public Firebase configuration for project 'ryha-os'
// This is used to ensure the client-side application can always connect to Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyB-bY2F_E5j6V8p9T3q7L1wRzK4oI0a_sC",
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
