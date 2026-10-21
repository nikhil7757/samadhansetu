import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { PLATFORM_CONFIG } from './config/platform.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import problemRoutes from './routes/problem.routes.js';
import interestRoutes from './routes/interest.routes.js';
import commentRoutes from './routes/comment.routes.js';
import teamRoutes from './routes/team.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import adminRoutes from './routes/admin.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import uploadRoutes from './routes/upload.routes.js';

// SamadhanSetu / NavSetu Innovation Procurement Routes
import challengeRoutes from './routes/challenge.routes.js';
import proposalRoutes from './routes/proposal.routes.js';
import pilotRoutes from './routes/pilot.routes.js';
import templateRoutes from './routes/template.routes.js';
import integrationRoutes from './routes/integration.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.set('trust proxy', 1);

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'https://*.firebaseapp.com', 'https://*.googleapis.com', 'https://*.gstatic.com'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://*.googleapis.com', 'https://*.gstatic.com', 'https://apis.google.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'https://*.googleusercontent.com'],
        connectSrc: [
          "'self'",
          'https://*.googleapis.com',
          'https://identitytoolkit.googleapis.com',
          'https://securetoken.googleapis.com',
          'https://*.firebaseio.com',
        ],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    xContentTypeOptions: true,
    xFrameOptions: { action: 'deny' },
    strictTransportSecurity: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// 2. Cookie Parser for secure httpOnly sessions & anti-CSRF verification
app.use(cookieParser());

// 3. Hardened CORS Configuration
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.APP_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      const isAllowed =
        ALLOWED_ORIGINS.includes(origin) ||
        (process.env.VERCEL && origin.endsWith('.vercel.app'));

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not permitted by CORS policy`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// 4. Authenticated File Serving Route (protected against unauthenticated direct hotlinking)
app.use(['/api/uploads', '/uploads'], uploadRoutes);

// 5. Innovation Procurement API Routes
app.use(['/api/challenges', '/challenges'], challengeRoutes);
app.use(['/api/proposals', '/proposals'], proposalRoutes);
app.use(['/api/pilots', '/pilots'], pilotRoutes);
app.use(['/api/templates', '/templates'], templateRoutes);
app.use(['/api/integrations', '/integrations'], integrationRoutes);

// 6. Core Platform Routes
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/problems', '/problems'], problemRoutes);
app.use(['/api/problems', '/problems'], interestRoutes);
app.use(['/api/problems', '/problems'], commentRoutes);
app.use(['/api/teams', '/teams'], teamRoutes);
app.use(['/api/notifications', '/notifications'], notificationRoutes);
app.use(['/api/dashboard', '/dashboard'], dashboardRoutes);
app.use(['/api/admin', '/admin'], adminRoutes);
app.use(['/api/complaints', '/complaints'], complaintRoutes);

// Health check
app.get(['/api/health', '/health'], (_req, res) => {
  res.json({
    status: 'ok',
    platform: PLATFORM_CONFIG.fullName,
    problemStatement: PLATFORM_CONFIG.problemStatementId,
    timestamp: new Date().toISOString(),
    security: {
      auth: 'FIREBASE_SESSION_COOKIE',
      csrfProtection: 'ACTIVE',
      fileValidation: 'MAGIC_BYTES',
      headers: 'HELMET_HARDENED',
    },
  });
});

// Error handler
app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log(`🚀 ${PLATFORM_CONFIG.fullName} API running on http://localhost:${config.port}`);
  });
}

export default app;
