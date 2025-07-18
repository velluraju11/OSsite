
import * as admin from 'firebase-admin';

const FIREBASE_ADMIN_CONFIG_ERROR = "Firebase Admin SDK not configured. Please add FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL to your .env.local file.";

let app: admin.app.App;

export function getFirebaseAdminApp() {
  if (app) {
    return app;
  }
  
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    console.error(FIREBASE_ADMIN_CONFIG_ERROR);
    throw new Error(FIREBASE_ADMIN_CONFIG_ERROR);
  }

  try {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
    return app;
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    throw new Error('Could not initialize Firebase Admin SDK.');
  }
}
