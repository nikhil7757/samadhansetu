import type { App } from 'firebase-admin/app';
import type { Auth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

let _cachedAuth: any = null;
let _cachedApp: any = null;

async function getLiveAuth() {
  if (!_cachedAuth) {
    try {
      const { initializeApp, getApps, cert } = await import('firebase-admin/app');
      const { getAuth } = await import('firebase-admin/auth');

      if (getApps().length > 0) {
        _cachedApp = getApps()[0];
      } else {
        const projectId = process.env.FIREBASE_PROJECT_ID || 'navsetu-innovation';
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
          try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            _cachedApp = initializeApp({
              credential: cert(serviceAccount),
              projectId: serviceAccount.project_id || projectId,
            });
          } catch (err) {
            console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', err);
          }
        } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
          _cachedApp = initializeApp({
            credential: cert({
              projectId,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
            projectId,
          });
        }

        if (!_cachedApp) {
          _cachedApp = initializeApp({ projectId });
        }
      }

      _cachedAuth = getAuth(_cachedApp);
    } catch (err) {
      console.warn('Firebase Admin dynamic initialization fallback:', err);
      _cachedAuth = {
        verifySessionCookie: async () => { throw new Error('Firebase Auth unavailable'); },
        verifyIdToken: async () => { throw new Error('Firebase Auth unavailable'); },
        setCustomUserClaims: async () => {},
        createSessionCookie: async () => 'mock-session-cookie',
        getUser: async () => ({ customClaims: {} }),
        revokeRefreshTokens: async () => {},
      };
    }
  }
  return _cachedAuth;
}

export const adminAuth: Auth = new Proxy({} as Auth, {
  get(_target, prop) {
    return async (...args: any[]) => {
      const liveAuth = await getLiveAuth();
      const fn = liveAuth[prop];
      if (typeof fn === 'function') {
        return fn.apply(liveAuth, args);
      }
      return fn;
    };
  },
});

export default function getAdminApp(): Promise<App> {
  return getLiveAuth().then(() => _cachedApp);
}
