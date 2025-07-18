
import * as admin from 'firebase-admin';

const FIREBASE_ADMIN_CONFIG_ERROR = "Firebase Admin SDK credentials are not set up on the server.";

let app: admin.app.App | null = null;
let initError: Error | null = null;

// Initialize the app immediately at the module level.
// Next.js guarantees that process.env is populated at this stage on the server.
try {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (admin.apps.length === 0 && privateKey && clientEmail && projectId) {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        // Replace the literal '\n' characters with actual newlines
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } else if (admin.apps.length > 0) {
    app = admin.app();
  } else {
     throw new Error(FIREBASE_ADMIN_CONFIG_ERROR);
  }
} catch (error: any) {
  console.error('Firebase admin initialization error', error);
  initError = new Error('Could not initialize Firebase Admin SDK. Please check your credentials in .env.local.');
}


export function getFirebaseAdminApp() {
  if (initError) {
    throw initError;
  }
  if (!app) {
    // This should theoretically not be reached if credentials are set,
    // but it's a fallback.
    throw new Error("Firebase Admin SDK is not initialized. Check server logs for details.");
  }
  
  return app;
}
