import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

/**
 * @deprecated Prefer Firebase ID tokens and session cookies. Retained only for legacy integration compatibility.
 */
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
}
