import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://samadhansetu:samadhansetu_dev@localhost:5432/samadhansetu?schema=public',
  jwtSecret: process.env.JWT_SECRET || 'samadhansetu-dev-secret-change-in-production',
  uploadDir: process.env.UPLOAD_DIR || (process.env.VERCEL ? '/tmp/uploads' : 'uploads'),
};
