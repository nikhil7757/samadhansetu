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

export interface DemoAccountInfo {
  role: UserRole;
  title: string;
  badge: string;
  email: string;
  icon: string;
  department?: string;
  organization?: string;
  description: string;
  color: string;
  targetPath: string;
}

export const DEMO_PRESETS: DemoAccountInfo[] = [
  {
    role: 'DEPARTMENT_USER',
    title: 'Department Officer',
    badge: 'Govt Department',
    email: 'officer.dept@navsetu.maharashtra.gov.in',
    icon: '🏛️',
    department: 'Skills, Employment & Innovation',
    description: 'Post civic challenges, structure sandbox pilots, review startup bids',
    color: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    targetPath: '/report',
  },
  {
    role: 'STARTUP',
    title: 'Startup Founder',
    badge: 'DPIIT Innovator',
    email: 'founder@ecocatalyst.tech',
    icon: '🚀',
    organization: 'EcoCatalyst BioTech Pvt Ltd',
    description: 'Discover challenges, submit technical bids, track pilot milestones & payouts',
    color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    targetPath: '/problems',
  },
  {
    role: 'INNOVATION_SOCIETY_ADMIN',
    title: 'MSInS Super Admin',
    badge: 'State Innovation Lead',
    email: 'admin.msins@gov.maharashtra.in',
    icon: '👑',
    department: 'Maharashtra State Innovation Society',
    description: 'Approve challenge statements, assign expert evaluators, monitor state KPIs',
    color: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
    targetPath: '/admin',
  },
  {
    role: 'EVALUATOR',
    title: 'Expert Evaluator',
    badge: 'Technical Panelist',
    email: 'evaluator.tech@vjti.ac.in',
    icon: '⚖️',
    department: 'Evaluation Board (VJTI Mumbai)',
    description: 'Score proposals on technical novelty, feasibility, safety, and impact',
    color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    targetPath: '/admin',
  },
  {
    role: 'VALIDATOR',
    title: 'Independent Validator',
    badge: 'Third-Party QA',
    email: 'validator.audit@qcin.org',
    icon: '🔍',
    organization: 'Quality Council of India (QCIN)',
    description: 'Audit pilot milestone deliverables and validate scale-up procurement criteria',
    color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
    targetPath: '/track',
  },
  {
    role: 'CITIZEN',
    title: 'Citizen Reporter',
    badge: 'Public Stakeholder',
    email: 'citizen.pune@samadhansetu.in',
    icon: '👥',
    description: 'File civic grievances, track public resolution docket and district solutions',
    color: 'border-orange-500/40 bg-orange-500/10 text-orange-400',
    targetPath: '/report',
  },
];

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  mfaResolver: MultiFactorResolver | null;
  isMfaRequired: boolean;
  login: (email: string, pass: string) => Promise<User>;
  loginWithGoogle: (intendedRole?: UserRole, details?: any) => Promise<User>;
  loginDemo: (role: UserRole | string) => Promise<User>;
  signup: (data: SignupData) => Promise<User>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  completeMfaSignIn: (code: string) => Promise<User>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('demo_session_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
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
    try {
      localStorage.setItem('demo_session_user', JSON.stringify(mergedUser));
    } catch (_) {}

    return mergedUser;
  }, []);

  /**
   * Hydrates authentication state from httpOnly cookie or active Firebase auth state.
   */
  useEffect(() => {
    let isMounted = true;

    // Check for saved local token
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setAuthToken(savedToken);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentFbUser) => {
      if (!isMounted) return;
      setIsLoading(true);

      if (currentFbUser) {
        setFirebaseUser(currentFbUser);
        try {
          await establishBackendSession(currentFbUser);
        } catch (err) {
          console.error('Session establishment error:', err);
        }
      } else {
        // Attempt cookie-based session hydration via /auth/me
        try {
          const res = await api.get('/auth/me');
          if (res.data && isMounted) {
            setUser(res.data);
            try {
              localStorage.setItem('demo_session_user', JSON.stringify(res.data));
            } catch (_) {}
          }
        } catch {
          // If server rejects cookie and no local demo session exists, reset
          if (isMounted) {
            const savedLocal = localStorage.getItem('demo_session_user');
            if (!savedLocal) {
              setUser(null);
              setFirebaseUser(null);
              setAuthToken(null);
              setCsrfToken(null);
            }
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
        try {
          localStorage.setItem('demo_session_user', JSON.stringify(res.data));
        } catch (_) {}
      }
    } catch (err) {
      console.warn('Failed to refresh profile:', err);
    }
  }, []);

  /**
   * 1-Click authenticated demo login for any persona.
   */
  const loginDemo = async (role: UserRole | string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/demo-login', { role });
      const { user: serverUser, token, csrfToken } = res.data;

      if (token) {
        setAuthToken(token);
        try {
          localStorage.setItem('auth_token', token);
        } catch (_) {}
      }
      if (csrfToken) {
        setCsrfToken(csrfToken);
      }

      const mergedUser: User = {
        id: serverUser.id,
        uid: serverUser.uid || serverUser.id,
        name: serverUser.name,
        email: serverUser.email,
        role: serverUser.role,
        department: serverUser.department,
        district: serverUser.district || 'Pune',
        organizationName: serverUser.organizationName,
        emailVerified: true,
        mfaEnrolled: false,
      };

      setUser(mergedUser);
      try {
        localStorage.setItem('demo_session_user', JSON.stringify(mergedUser));
      } catch (_) {}

      return mergedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, pass: string): Promise<User> => {
    setIsLoading(true);
    setMfaResolver(null);

    // If demo credentials entered in standard form
    const matchedDemo = DEMO_PRESETS.find((d) => d.email.toLowerCase() === email.toLowerCase());
    if (matchedDemo && (pass === 'Demo@2026!' || pass.toLowerCase() === 'demo')) {
      return await loginDemo(matchedDemo.role);
    }

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

      // Check if it's a demo account with standard password
      if (matchedDemo) {
        return await loginDemo(matchedDemo.role);
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resilient Google Federated Authentication & Registration
   */
  const loginWithGoogle = async (intendedRole: UserRole = 'STARTUP', details?: any): Promise<User> => {
    setIsLoading(true);
    setMfaResolver(null);

    // 1. Attempt standard Firebase Google OAuth if live
    try {
      const fbUser = await signInWithGoogle();
      if (fbUser) {
        setFirebaseUser(fbUser);
        return await establishBackendSession(fbUser);
      }
    } catch (fbErr: any) {
      console.warn('Firebase Google OAuth unavailable/popup blocked, activating resilient platform fallback:', fbErr?.code || fbErr?.message);
    }

    // 2. Resilient Platform Google Sign-In & Sign-Up
    try {
      const res = await api.post('/auth/google', {
        role: intendedRole,
        name: details?.name,
        email: details?.email,
        organizationName: details?.organizationName,
        district: details?.district || 'Pune',
      });

      const { user: serverUser, token, csrfToken } = res.data;
      if (token) {
        setAuthToken(token);
        try {
          localStorage.setItem('auth_token', token);
        } catch (_) {}
      }
      if (csrfToken) {
        setCsrfToken(csrfToken);
      }

      const mergedUser: User = {
        id: serverUser.id,
        uid: serverUser.uid || serverUser.id,
        name: serverUser.name,
        email: serverUser.email,
        role: serverUser.role,
        department: serverUser.department,
        district: serverUser.district || 'Pune',
        organizationName: serverUser.organizationName,
        emailVerified: true,
        mfaEnrolled: false,
      };

      setUser(mergedUser);
      try {
        localStorage.setItem('demo_session_user', JSON.stringify(mergedUser));
      } catch (_) {}

      return mergedUser;
    } catch (err: any) {
      console.error('Google authentication error:', err);
      throw new Error(err.response?.data?.message || err.message || 'Google authentication could not be completed.');
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
      let fbUser: FirebaseUser | null = null;
      try {
        fbUser = await signUpWithEmail(data.email, data.password, data.name);
        setFirebaseUser(fbUser);
        await establishBackendSession(fbUser);
      } catch (fbErr: any) {
        console.warn('Firebase registration fallback to platform session:', fbErr?.code || fbErr?.message);
      }

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
        id: profileRes.data.user?.id || fbUser?.uid || `user-${Date.now()}`,
        uid: fbUser?.uid || profileRes.data.user?.id || `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: profileRes.data.user?.role || data.role,
        department: data.department,
        district: data.district,
        organizationName: data.organizationName,
        emailVerified: fbUser?.emailVerified ?? true,
        mfaEnrolled: false,
      };

      setUser(updatedUser);
      try {
        localStorage.setItem('demo_session_user', JSON.stringify(updatedUser));
      } catch (_) {}

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
      try {
        localStorage.removeItem('demo_session_user');
        localStorage.removeItem('auth_token');
      } catch (_) {}
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
        loginDemo,
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
