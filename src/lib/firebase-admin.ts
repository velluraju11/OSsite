
import * as admin from 'firebase-admin';

const FIREBASE_ADMIN_CONFIG_ERROR = "Firebase Admin SDK credentials are not set up on the server.";

let app: admin.app.App | null = null;
let initError: Error | null = null;

// Initialize the app immediately at the module level.
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
     // Don't throw here, let getFirebaseAdminApp handle it
  }
} catch (error: any) {
  console.error('Firebase admin initialization error:', error);
  initError = new Error('Could not initialize Firebase Admin SDK. Please check your credentials in .env.local.');
}


export function getFirebaseAdminApp() {
  // If there was an error during the initial attempt, throw it.
  if (initError) {
    throw initError;
  }
  
  // If the app is not initialized after the initial attempt, throw a clear error.
  if (!app) {
    throw new Error(FIREBASE_ADMIN_CONFIG_ERROR);
  }
  
  return app;
}
