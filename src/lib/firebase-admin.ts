
import * as admin from 'firebase-admin';

const FIREBASE_ADMIN_CONFIG_ERROR = "Firebase Admin SDK is not set up. Ensure the FIREBASE_ADMIN_SDK_JSON environment variable is set correctly.";

let app: admin.app.App | null = null;
let initError: Error | null = null;

try {
  if (admin.apps.length === 0) {
    const serviceAccountString = process.env.FIREBASE_ADMIN_SDK_JSON;

    if (!serviceAccountString) {
      throw new Error("The FIREBASE_ADMIN_SDK_JSON environment variable is not set.");
    }

    const serviceAccount = JSON.parse(serviceAccountString);

    const credential = admin.credential.cert(serviceAccount);
    app = admin.initializeApp({ credential });
  } else {
    app = admin.app();
  }
} catch (error: any) {
  console.error('Firebase admin initialization error:', error.message);
  initError = new Error(FIREBASE_ADMIN_CONFIG_ERROR);
}

export function getFirebaseAdminApp() {
  if (initError) {
    throw initError;
  }
  
  if (!app) {
    throw new Error(FIREBASE_ADMIN_CONFIG_ERROR);
  }
  
  return app;
}
