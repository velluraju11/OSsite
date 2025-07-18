
import * as admin from 'firebase-admin';

const FIREBASE_ADMIN_CONFIG_ERROR = "Firebase Admin SDK credentials are not set up on the server.";

let app: admin.app.App | null = null;
let initError: Error | null = null;

function initializeAdminApp() {
  if (app) return;

  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (admin.apps.length > 0) {
    app = admin.app();
    return;
  }
  
  if (!privateKey || !clientEmail || !projectId) {
    console.error(FIREBASE_ADMIN_CONFIG_ERROR);
    initError = new Error(FIREBASE_ADMIN_CONFIG_ERROR);
    return;
  }

  try {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error);
    initError = new Error('Could not initialize Firebase Admin SDK. Please check your credentials.');
  }
}

export function getFirebaseAdminApp() {
  if (!app && !initError) {
    initializeAdminApp();
  }

  if (initError) {
    throw initError;
  }
  
  return app;
}
