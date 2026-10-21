import { Request, Response, NextFunction } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * CSRF Protection Middleware
 * Defends against Cross-Site Request Forgery on cookie-authenticated requests.
 * Uses combination of SameSite cookies, Origin/Referer verification, and custom anti-CSRF header.
 */
export function csrfGuard(req: Request, res: Response, next: NextFunction): void {
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  // If request uses cookie-based authentication, enforce anti-CSRF controls
  const hasSessionCookie = Boolean(req.cookies?.session);
  if (!hasSessionCookie) {
    // Bearer token authentication in Authorization header is inherently CSRF-immune
    return next();
  }

  // 1. Check custom anti-CSRF header
  const csrfHeader = req.headers['x-csrf-token'] || req.headers['x-requested-with'];
  const expectedCsrfToken = req.cookies?.['csrf-token'];

  if (expectedCsrfToken) {
    if (!csrfHeader || csrfHeader !== expectedCsrfToken) {
      res.status(403).json({ error: 'CSRF token validation failed' });
      return;
    }
  } else if (!csrfHeader) {
    res.status(403).json({ error: 'Missing required anti-CSRF header (X-Requested-With or X-CSRF-Token)' });
    return;
  }

  // 2. Verify Origin or Referer header against trusted origins
  const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : null);
  if (origin) {
    const allowedHosts = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://localhost:3001',
    ];
    if (process.env.APP_URL) {
      allowedHosts.push(process.env.APP_URL);
    }

    const isAllowed = allowedHosts.some((allowed) => origin === allowed || (process.env.VERCEL && origin.endsWith('.vercel.app')));
    if (!isAllowed) {
      res.status(403).json({ error: 'CSRF Origin mismatch' });
      return;
    }
  }

  next();
}
