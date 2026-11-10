import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '../config.js';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  department?: string;
  district?: string;
  organizationName?: string;
  emailVerified?: boolean;
}

/**
 * Signs a platform token using configured JWT secret.
 */
export function signToken(payload: TokenPayload, expiresIn: SignOptions['expiresIn'] = '7d'): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, config.jwtSecret, options);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
}
