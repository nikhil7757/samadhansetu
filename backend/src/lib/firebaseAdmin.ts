import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

let adminApp: App;

function initFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'navsetu-innovation';

  // Support service account via JSON string or individual env vars
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || projectId,
      });
    } catch (err) {
      console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY, falling back to project ID:', err);
    }
  }

  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      projectId,
    });
  }

  // Fallback to project ID (works with Google Application Default Credentials or emulator)
  return initializeApp({ projectId });
}

adminApp = initFirebaseAdmin();
export const adminAuth: Auth = getAuth(adminApp);
export default adminApp;
