import rateLimit from 'express-rate-limit';

const noopMiddleware = (_req: any, _res: any, next: any) => next();

export const problemSubmitLimiter = process.env.VERCEL
  ? noopMiddleware
  : rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10,
      message: { error: 'Too many problem submissions. Please try again later.' },
      standardHeaders: true,
      legacyHeaders: false,
      validate: { trustProxy: false },
    });

export const commentLimiter = process.env.VERCEL
  ? noopMiddleware
  : rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 30,
      message: { error: 'Too many comments. Please try again later.' },
      standardHeaders: true,
      legacyHeaders: false,
      validate: { trustProxy: false },
    });

export const authLimiter = process.env.VERCEL
  ? noopMiddleware
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 50,
      message: { error: 'Too many authentication attempts. Please try again later.' },
      standardHeaders: true,
      legacyHeaders: false,
      validate: { trustProxy: false },
    });
