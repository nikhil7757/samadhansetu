import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://navsetu:navsetu_dev@localhost:5432/navsetu?schema=public',
  jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
  uploadDir: process.env.UPLOAD_DIR || (process.env.VERCEL ? '/tmp/uploads' : 'secure_uploads'),
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'navsetu-innovation',
};
