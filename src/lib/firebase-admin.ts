
import * as admin from 'firebase-admin';
import serviceAccount from '../../firebase-adminsdk.json';

const FIREBASE_ADMIN_CONFIG_ERROR = "Firebase Admin SDK is not set up. The 'firebase-adminsdk.json' file is likely missing or corrupt.";

let app: admin.app.App | null = null;
let initError: Error | null = null;

try {
  if (admin.apps.length === 0) {
    const credential = admin.credential.cert(serviceAccount as admin.ServiceAccount);
    app = admin.initializeApp({ credential });
  } else {
    app = admin.app();
  }
} catch (error: any) {
  console.error('Firebase admin initialization error:', error);
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
