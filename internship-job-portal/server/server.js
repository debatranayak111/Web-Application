import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { connectDB, getDbStatus } from './storage/db.js';
import jobsRouter from './routes/jobs.js';
import studentsRouter from './routes/students.js';
import applicationsRouter from './routes/applications.js';
import statsRouter from './routes/stats.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// API Routes
app.use('/api/jobs', jobsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api', statsRouter);

// Database initialization
connectDB().catch(err => {
  console.warn('[Server] DB initialization notice:', err.message);
});

// Production Static Assets (Vite build output)
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // If dist not yet generated, friendly API welcome message
  app.get('/', (req, res) => {
    res.json({
      name: 'CareerConnect - Internship & Job Portal API',
      version: '1.0.0',
      status: 'active',
      endpoints: [
        '/api/jobs',
        '/api/students/profile',
        '/api/applications',
        '/api/stats',
        '/api/health'
      ],
      database: getDbStatus()
    });
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start local listener if run directly
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`  CareerConnect Server running on port ${PORT}`);
    console.log(`  Local API: http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });
}

export default app;
