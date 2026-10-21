import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  type User as FirebaseUser,
  type MultiFactorResolver,
  getMultiFactorResolver,
} from 'firebase/auth';
import {
  auth,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOutUser,
  resetPassword,
  sendVerificationEmail,
  resolveMfaTotp,
} from './firebase';
import api, { setAuthToken, setCsrfToken } from './api';

export type UserRole =
  | 'DEPARTMENT_USER'
  | 'STARTUP'
  | 'INNOVATION_SOCIETY_ADMIN'
  | 'EVALUATOR'
  | 'VALIDATOR'
  | 'CITIZEN'
  | 'ADMIN';

export interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  organizationName?: string;
  department?: string;
  district: string;
  preferredLanguage?: string;
  emailVerified: boolean;
  mfaEnrolled: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organizationName?: string;
  department?: string;
  district: string;
  preferredLanguage?: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  mfaResolver: MultiFactorResolver | null;
  isMfaRequired: boolean;
  login: (email: string, pass: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  signup: (data: SignupData) => Promise<User>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  completeMfaSignIn: (code: string) => Promise<User>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);

  /**
   * Exchanges Firebase token with backend to set httpOnly session cookie and retrieve verified claims.
   */
  const establishBackendSession = useCallback(async (fbUser: FirebaseUser): Promise<User> => {
    const idToken = await fbUser.getIdToken(true);
    setAuthToken(idToken);

    const res = await api.post('/auth/session', { idToken });
    const { user: serverUser, csrfToken } = res.data;

    if (csrfToken) {
      setCsrfToken(csrfToken);
    }

    const mergedUser: User = {
      id: serverUser.id || fbUser.uid,
      uid: fbUser.uid,
      name: serverUser.name || fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
      email: fbUser.email || '',
      role: serverUser.role || 'DEPARTMENT_USER',
      department: serverUser.department,
      district: serverUser.district || 'Pune',
      organizationName: serverUser.organizationName,
      emailVerified: fbUser.emailVerified || Boolean(serverUser.emailVerified),
      mfaEnrolled: Boolean(serverUser.mfaEnrolled),
    };

    setUser(mergedUser);
    return mergedUser;
  }, []);

  /**
   * Hydrates authentication state from httpOnly cookie or active Firebase auth state.
   */
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentFbUser) => {
      if (!isMounted) return;
      setIsLoading(true);

      if (currentFbUser) {
        setFirebaseUser(currentFbUser);
        try {
          await establishBackendSession(currentFbUser);
        } catch (err) {
          console.error('Session establishment error:', err);
          setUser(null);
        }
      } else {
        // Attempt cookie-based session hydration via /auth/me
        try {
          const res = await api.get('/auth/me');
          if (res.data && isMounted) {
            setUser(res.data);
          }
        } catch {
          if (isMounted) {
            setUser(null);
            setFirebaseUser(null);
            setAuthToken(null);
            setCsrfToken(null);
          }
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [establishBackendSession]);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data) {
        setUser((prev) => (prev ? { ...prev, ...res.data } : res.data));
      }
    } catch (err) {
      console.warn('Failed to refresh profile:', err);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    setIsLoading(true);
    setMfaResolver(null);
    try {
      const fbUser = await signInWithEmail(email, pass);
      setFirebaseUser(fbUser);
      return await establishBackendSession(fbUser);
    } catch (err: any) {
      // Check for Firebase Multi-Factor challenge
      if (err.code === 'auth/multi-factor-auth-required') {
        const resolver = getMultiFactorResolver(auth, err);
        setMfaResolver(resolver);
        throw new Error('MFA_REQUIRED');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<User> => {
    setIsLoading(true);
    setMfaResolver(null);
    try {
      const fbUser = await signInWithGoogle();
      setFirebaseUser(fbUser);
      return await establishBackendSession(fbUser);
    } catch (err: any) {
      if (err.code === 'auth/multi-factor-auth-required') {
        const resolver = getMultiFactorResolver(auth, err);
        setMfaResolver(resolver);
        throw new Error('MFA_REQUIRED');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const completeMfaSignIn = async (code: string): Promise<User> => {
    if (!mfaResolver) throw new Error('No active MFA session to resolve.');
    setIsLoading(true);
    try {
      const cred = await resolveMfaTotp(mfaResolver, code);
      setFirebaseUser(cred.user);
      setMfaResolver(null);
      return await establishBackendSession(cred.user);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData): Promise<User> => {
    setIsLoading(true);
    try {
      const fbUser = await signUpWithEmail(data.email, data.password, data.name);
      setFirebaseUser(fbUser);

      // Establish session
      await establishBackendSession(fbUser);

      // Persist profile attributes on backend and set server-side role claims
      const profileRes = await api.post('/auth/profile', {
        name: data.name,
        role: data.role,
        department: data.department,
        district: data.district,
        organizationName: data.organizationName,
        preferredLanguage: data.preferredLanguage || 'en',
      });

      const updatedUser: User = {
        id: profileRes.data.user?.id || fbUser.uid,
        uid: fbUser.uid,
        name: data.name,
        email: data.email,
        role: profileRes.data.user?.role || data.role,
        department: data.department,
        district: data.district,
        organizationName: data.organizationName,
        emailVerified: fbUser.emailVerified,
        mfaEnrolled: false,
      };

      setUser(updatedUser);
      return updatedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Backend logout warning:', e);
    } finally {
      await signOutUser();
      setAuthToken(null);
      setCsrfToken(null);
      setUser(null);
      setFirebaseUser(null);
      setMfaResolver(null);
      setIsLoading(false);
    }
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    await resetPassword(email);
  };

  const resendVerification = async (): Promise<void> => {
    if (!firebaseUser) throw new Error('User not signed in.');
    await sendVerificationEmail(firebaseUser);
  };

  // Enforce mandatory MFA for administrators
  const isMfaRequired = Boolean(
    user && user.role === 'INNOVATION_SOCIETY_ADMIN' && !user.mfaEnrolled
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        mfaResolver,
        isMfaRequired,
        login,
        loginWithGoogle,
        signup,
        logout,
        sendPasswordReset,
        resendVerification,
        completeMfaSignIn,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
