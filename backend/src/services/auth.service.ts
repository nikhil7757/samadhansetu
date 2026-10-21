import { adminAuth } from '../lib/firebaseAdmin.js';
import { prisma } from '../lib/prisma.js';
import { Role } from '@prisma/client';

export const ALLOWED_ROLES = [
  'DEPARTMENT_USER',
  'STARTUP',
  'INNOVATION_SOCIETY_ADMIN',
  'EVALUATOR',
  'VALIDATOR',
] as const;

export type AppRole = typeof ALLOWED_ROLES[number];

export interface SessionResult {
  sessionCookie: string;
  expiresIn: number;
  user: {
    id: string;
    uid: string;
    email: string;
    name: string;
    role: AppRole;
    department?: string;
    district?: string;
    organizationName?: string;
    emailVerified: boolean;
    mfaEnrolled: boolean;
  };
}

export class AuthService {
  /**
   * Exchanges a client Firebase ID token for an httpOnly, Secure, SameSite session cookie.
   * Verifies the token cryptographically and checks for revocation.
   */
  static async createSession(idToken: string): Promise<SessionResult> {
    // 1. Verify ID token with revocation check
    const decoded = await adminAuth.verifyIdToken(idToken, true);
    const uid = decoded.uid;
    const email = decoded.email || '';
    const emailVerified = decoded.email_verified || false;

    // 2. Fetch or initialize user in database
    let dbUser = await prisma.user.findFirst({
      where: { email },
    });

    // Determine role from custom claims or existing record; default to DEPARTMENT_USER for new accounts
    let role: AppRole = (decoded.role as AppRole) || (dbUser?.role as AppRole) || 'DEPARTMENT_USER';
    const mfaEnrolled = Boolean(decoded.mfaEnrolled);

    if (!decoded.role) {
      // Set custom claim on Firebase user
      await adminAuth.setCustomUserClaims(uid, {
        role,
        department: dbUser?.department || undefined,
        district: dbUser?.district || 'Pune',
        mfaEnrolled,
      });
    }

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email,
          name: decoded.name || email.split('@')[0] || 'User',
          passwordHash: 'FIREBASE_AUTH_MANAGED',
          role: role as Role,
          district: (decoded.district as string) || 'Pune',
          department: (decoded.department as string) || undefined,
          preferredLanguage: 'en',
        },
      });
    }

    // 3. Create Firebase session cookie (5 days expiry)
    const expiresIn = 1000 * 60 * 60 * 24 * 5;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    return {
      sessionCookie,
      expiresIn,
      user: {
        id: dbUser.id,
        uid,
        email,
        name: dbUser.name,
        role,
        department: dbUser.department || undefined,
        district: dbUser.district || undefined,
        organizationName: dbUser.organizationName || undefined,
        emailVerified,
        mfaEnrolled,
      },
    };
  }

  /**
   * Assigns role custom claim. Enforces that only administrators can assign privileged roles.
   */
  static async assignRole(targetUid: string, role: AppRole, actorRole: string): Promise<void> {
    if (!ALLOWED_ROLES.includes(role)) {
      throw new Error(`Invalid role requested: ${role}`);
    }

    // Only INNOVATION_SOCIETY_ADMIN can assign EVALUATOR, VALIDATOR, or ADMIN roles
    const privilegedRoles: AppRole[] = ['INNOVATION_SOCIETY_ADMIN', 'EVALUATOR', 'VALIDATOR'];
    if (privilegedRoles.includes(role) && actorRole !== 'INNOVATION_SOCIETY_ADMIN') {
      throw new Error('Only State Innovation Society Administrators can grant privileged roles.');
    }

    // Update Firebase Custom Claims
    const currentClaims = (await adminAuth.getUser(targetUid)).customClaims || {};
    await adminAuth.setCustomUserClaims(targetUid, {
      ...currentClaims,
      role,
    });

    // Update local database record if matched by email
    const firebaseUser = await adminAuth.getUser(targetUid);
    if (firebaseUser.email) {
      await prisma.user.updateMany({
        where: { email: firebaseUser.email },
        data: { role: role as Role },
      });
    }
  }

  /**
   * Registers/updates profile data during signup
   */
  static async registerProfile(uid: string, profile: {
    name: string;
    role: AppRole;
    department?: string;
    district: string;
    organizationName?: string;
    preferredLanguage?: string;
  }) {
    const firebaseUser = await adminAuth.getUser(uid);
    const email = firebaseUser.email;
    if (!email) throw new Error('Firebase user has no verified email address');

    // Restrict self-registration: non-admins cannot self-assign ADMIN, EVALUATOR, or VALIDATOR
    const restrictedRoles: AppRole[] = ['INNOVATION_SOCIETY_ADMIN', 'EVALUATOR', 'VALIDATOR'];
    const safeRole: AppRole = restrictedRoles.includes(profile.role) ? 'STARTUP' : profile.role;

    // Set claims in Firebase
    await adminAuth.setCustomUserClaims(uid, {
      role: safeRole,
      department: profile.department,
      district: profile.district,
      mfaEnrolled: false,
    });

    // Upsert database profile
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) {
      return await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: profile.name,
          role: safeRole as Role,
          department: profile.department,
          district: profile.district,
          organizationName: profile.organizationName,
          preferredLanguage: profile.preferredLanguage || 'en',
        },
      });
    } else {
      return await prisma.user.create({
        data: {
          email,
          name: profile.name,
          passwordHash: 'FIREBASE_AUTH_MANAGED',
          role: safeRole as Role,
          department: profile.department,
          district: profile.district,
          organizationName: profile.organizationName,
          preferredLanguage: profile.preferredLanguage || 'en',
        },
      });
    }
  }

  /**
   * Enrolls MFA TOTP flag on user
   */
  static async recordMfaEnrollment(uid: string): Promise<void> {
    const user = await adminAuth.getUser(uid);
    const currentClaims = user.customClaims || {};
    await adminAuth.setCustomUserClaims(uid, {
      ...currentClaims,
      mfaEnrolled: true,
    });
  }

  /**
   * Revokes all refresh tokens and active sessions for a user.
   */
  static async revokeUserSessions(uid: string): Promise<void> {
    await adminAuth.revokeRefreshTokens(uid);
  }

  /**
   * Retrieves authenticated profile for the current user.
   */
  static async getMe(uid: string, email: string) {
    const userRecord = await adminAuth.getUser(uid);
    const dbUser = await prisma.user.findFirst({ where: { email } });

    const role = (userRecord.customClaims?.role as AppRole) || (dbUser?.role as AppRole) || 'DEPARTMENT_USER';

    return {
      id: dbUser?.id || uid,
      uid,
      email: userRecord.email || email,
      name: dbUser?.name || userRecord.displayName || email.split('@')[0],
      role,
      department: dbUser?.department || undefined,
      district: dbUser?.district || 'Pune',
      organizationName: dbUser?.organizationName || undefined,
      emailVerified: userRecord.emailVerified,
      mfaEnrolled: Boolean(userRecord.customClaims?.mfaEnrolled),
      disabled: userRecord.disabled,
    };
  }
}
