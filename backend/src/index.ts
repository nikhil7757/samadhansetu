import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import problemRoutes from './routes/problem.routes.js';
import interestRoutes from './routes/interest.routes.js';
import commentRoutes from './routes/comment.routes.js';
import teamRoutes from './routes/team.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import adminRoutes from './routes/admin.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.set('trust proxy', 1);

// Middleware
app.use(
  cors({
    origin: process.env.VERCEL
      ? true
      : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.resolve(__dirname, '..', config.uploadDir)));

// Routes (support both /api/ prefix and stripped prefix)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/problems', '/problems'], problemRoutes);
app.use(['/api/problems', '/problems'], interestRoutes);
app.use(['/api/problems', '/problems'], commentRoutes);
app.use(['/api/teams', '/teams'], teamRoutes);
app.use(['/api/notifications', '/notifications'], notificationRoutes);
app.use(['/api/dashboard', '/dashboard'], dashboardRoutes);
app.use(['/api/admin', '/admin'], adminRoutes);

// Health check
app.get(['/api/health', '/health'], (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log(`🚀 SamadhanSetu API running on http://localhost:${config.port}`);
  });
}

export default app;
