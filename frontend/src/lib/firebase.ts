import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  inMemoryPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  multiFactor,
  TotpMultiFactorGenerator,
  type Auth,
  type User as FirebaseUser,
  type MultiFactorResolver,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoDummyKeyForNavSetuEvaluationOnly',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'navsetu-innovation.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'navsetu-innovation',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'navsetu-innovation.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1029384756',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1029384756:web:abcdef123456',
};

function initFirebase(): FirebaseApp {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }
  return initializeApp(firebaseConfig);
}

export const app: FirebaseApp = initFirebase();
export const auth: Auth = getAuth(app);

// Strict security: enforce in-memory persistence. Never store tokens in localStorage/sessionStorage.
// Authentication state is persisted server-side via httpOnly, Secure, SameSite session cookies.
setPersistence(auth, inMemoryPersistence).catch((err) => {
  console.warn('Could not set in-memory auth persistence:', err);
});

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

/**
 * Sign up with email, password, and display name
 */
export async function signUpWithEmail(email: string, pass: string, displayName: string): Promise<FirebaseUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  // Immediately dispatch email verification
  try {
    await sendEmailVerification(cred.user);
  } catch (err) {
    console.warn('Failed to send verification email automatically:', err);
  }
  return cred.user;
}

/**
 * Federated Google Sign-In
 */
export async function signInWithGoogle(): Promise<FirebaseUser> {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

/**
 * Send email verification link to current user
 */
export async function sendVerificationEmail(user?: FirebaseUser): Promise<void> {
  const target = user || auth.currentUser;
  if (!target) throw new Error('No user is currently authenticated.');
  await sendEmailVerification(target);
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Sign out from Firebase client
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Multi-Factor Authentication: Generates a TOTP secret for authenticator apps.
 */
export async function generateTotpSecret(user: FirebaseUser) {
  const session = await multiFactor(user).getSession();
  return await TotpMultiFactorGenerator.generateSecret(session);
}

/**
 * Multi-Factor Authentication: Enrolls TOTP with verification code.
 */
export async function enrollTotpFactor(user: FirebaseUser, secret: any, verificationCode: string) {
  const assertion = TotpMultiFactorGenerator.assertionForEnrollment(secret, verificationCode);
  await multiFactor(user).enroll(assertion, 'Authenticator App');
}

/**
 * Resolves MFA challenge during sign-in
 */
export async function resolveMfaTotp(resolver: MultiFactorResolver, verificationCode: string) {
  const hints = resolver.hints;
  const totpHint = hints.find((hint) => hint.factorId === TotpMultiFactorGenerator.FACTOR_ID);
  if (!totpHint) throw new Error('TOTP multi-factor challenge not available.');

  const assertion = TotpMultiFactorGenerator.assertionForSignIn(totpHint.uid, verificationCode);
  return await resolver.resolveSignIn(assertion);
}
