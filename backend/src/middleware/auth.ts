import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebaseAdmin.js';
import { verifyToken, type TokenPayload } from '../lib/jwt.js';
import type { DecodedIdToken } from 'firebase-admin/auth';

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
 * Extracts and verifies the auth credential.
 * Priority:
 * 1. Firebase Admin verifySessionCookie
 * 2. Signed Platform JWT from session cookie
 * 3. Firebase Admin verifyIdToken (Bearer)
 * 4. Signed Platform JWT from Authorization header
 */
async function verifyCredential(req: Request): Promise<AuthenticatedUser | null> {
  // 1. Check httpOnly session cookie first
  const sessionCookie = req.cookies?.session;
  if (sessionCookie) {
    // Attempt Firebase session cookie verification
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
      if (decoded) {
        return {
          userId: decoded.uid,
          email: decoded.email || '',
          role: (decoded.role as string) || 'DEPARTMENT_USER',
          name: (decoded.name as string) || (decoded.displayName as string) || decoded.email || 'Verified User',
          department: (decoded.department as string) || undefined,
          district: (decoded.district as string) || undefined,
          organizationName: (decoded.organizationName as string) || undefined,
          emailVerified: decoded.email_verified || false,
        };
      }
    } catch {
      // Fallback: Check if session cookie is a signed platform JWT
      try {
        const payload: TokenPayload = verifyToken(sessionCookie);
        if (payload?.userId) {
          return {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
            name: payload.name,
            department: payload.department,
            district: payload.district,
            organizationName: payload.organizationName,
            emailVerified: payload.emailVerified ?? true,
          };
        }
      } catch {
        // Not a valid JWT either
      }
    }
  }

  // 2. Check Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = await adminAuth.verifyIdToken(token, true);
        if (decoded) {
          return {
            userId: decoded.uid,
            email: decoded.email || '',
            role: (decoded.role as string) || 'DEPARTMENT_USER',
            name: (decoded.name as string) || (decoded.displayName as string) || decoded.email || 'Verified User',
            department: (decoded.department as string) || undefined,
            district: (decoded.district as string) || undefined,
            organizationName: (decoded.organizationName as string) || undefined,
            emailVerified: decoded.email_verified || false,
          };
        }
      } catch {
        try {
          const payload: TokenPayload = verifyToken(token);
          if (payload?.userId) {
            return {
              userId: payload.userId,
              email: payload.email,
              role: payload.role,
              name: payload.name,
              department: payload.department,
              district: payload.district,
              organizationName: payload.organizationName,
              emailVerified: payload.emailVerified ?? true,
            };
          }
        } catch {
          // Token verification failed
        }
      }
    }
  }

  return null;
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await verifyCredential(req);
    if (!user) {
      res.status(401).json({ error: 'Authentication required: missing, expired, or invalid session' });
      return;
    }

    req.user = user;
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
    const user = await verifyCredential(req);
    if (user) {
      req.user = user;
    }
  } catch {
    // Optional auth silently continues unauthenticated
  }
  next();
}
