import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import crypto from 'crypto';

export class AuthController {
  /**
   * Creates an authenticated session from a verified Firebase ID token.
   * Sets httpOnly, Secure, SameSite session cookie and anti-CSRF cookie.
   */
  static async session(req: Request, res: Response) {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        res.status(400).json({ error: 'Missing required idToken' });
        return;
      }

      const result = await AuthService.createSession(idToken);

      // Generate a secure double-submit anti-CSRF token
      const csrfToken = crypto.randomBytes(32).toString('hex');

      // Set httpOnly session cookie
      res.cookie('session', result.sessionCookie, {
        maxAge: result.expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      // Set readable CSRF cookie for client header submission
      res.cookie('csrf-token', csrfToken, {
        maxAge: result.expiresIn,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      res.json({
        user: result.user,
        csrfToken,
      });
    } catch (err: any) {
      console.error('Session creation error:', err);
      res.status(401).json({
        error: 'Failed to establish secure session',
        message: err.message,
      });
    }
  }

  /**
   * Registers/updates profile during registration.
   */
  static async registerProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { name, role, department, district, organizationName, preferredLanguage } = req.body;
      const updated = await AuthService.registerProfile(req.user.userId, {
        name,
        role,
        department,
        district,
        organizationName,
        preferredLanguage,
      });

      res.status(200).json({ user: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * Retrieves profile of current authenticated user.
   */
  static async me(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const user = await AuthService.getMe(req.user.userId, req.user.email);
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve profile', message: err.message });
    }
  }

  /**
   * Logs out the user, clears session cookies, and revokes Firebase refresh tokens.
   */
  static async logout(req: Request, res: Response) {
    try {
      if (req.user?.userId) {
        await AuthService.revokeUserSessions(req.user.userId);
      }
    } catch (err) {
      console.warn('Revoke tokens error during logout:', err);
    }

    res.clearCookie('session', { path: '/' });
    res.clearCookie('csrf-token', { path: '/' });
    res.json({ success: true, message: 'Logged out successfully' });
  }

  /**
   * Records MFA enrollment status for the user.
   */
  static async recordMfa(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      await AuthService.recordMfaEnrollment(req.user.userId);
      res.json({ success: true, message: 'MFA enrolled successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to record MFA status', message: err.message });
    }
  }

  /**
   * Assigns role to a user. Restricted to INNOVATION_SOCIETY_ADMIN.
   */
  static async assignRole(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { targetUid, role } = req.body;
      if (!targetUid || !role) {
        res.status(400).json({ error: 'targetUid and role are required' });
        return;
      }

      await AuthService.assignRole(targetUid, role, req.user.role);
      res.json({ success: true, message: `Role ${role} assigned to ${targetUid}` });
    } catch (err: any) {
      res.status(403).json({ error: err.message });
    }
  }
}
