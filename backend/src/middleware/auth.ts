import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebaseAdmin.js';
import { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
  name: string;
  department?: string;
  district?: string;
  organizationName?: string;
  emailVerified?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Extracts and verifies the Firebase auth credential (session cookie or Bearer ID token).
 * checkRevoked is enabled to enforce immediate revocation upon logout or password change.
 */
async function verifyFirebaseCredential(req: Request): Promise<DecodedIdToken | null> {
  // 1. Check httpOnly session cookie first
  const sessionCookie = req.cookies?.session;
  if (sessionCookie) {
    try {
      return await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch {
      // Cookie verification failed, fall through to check Bearer token
    }
  }

  // 2. Check Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split(' ')[1];
    if (idToken) {
      return await adminAuth.verifyIdToken(idToken, true);
    }
  }

  return null;
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const decoded = await verifyFirebaseCredential(req);
    if (!decoded) {
      res.status(401).json({ error: 'Authentication required: missing, expired, or invalid session' });
      return;
    }

    req.user = {
      userId: decoded.uid,
      email: decoded.email || '',
      role: (decoded.role as string) || 'DEPARTMENT_USER',
      name: (decoded.name as string) || (decoded.displayName as string) || decoded.email || 'Verified User',
      department: (decoded.department as string) || undefined,
      district: (decoded.district as string) || undefined,
      organizationName: (decoded.organizationName as string) || undefined,
      emailVerified: decoded.email_verified || false,
    };

    next();
  } catch (err: any) {
    res.status(401).json({
      error: 'Authentication failed',
      code: err.code || 'AUTH_TOKEN_INVALID',
      message: err.message,
    });
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const decoded = await verifyFirebaseCredential(req);
    if (decoded) {
      req.user = {
        userId: decoded.uid,
        email: decoded.email || '',
        role: (decoded.role as string) || 'DEPARTMENT_USER',
        name: (decoded.name as string) || (decoded.displayName as string) || decoded.email || 'Verified User',
        department: (decoded.department as string) || undefined,
        district: (decoded.district as string) || undefined,
        emailVerified: decoded.email_verified || false,
      };
    }
  } catch {
    // Optional auth silently continues unauthenticated
  }
  next();
}
