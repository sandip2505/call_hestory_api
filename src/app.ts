import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import callRoutes from './routes/call.routes.js';
import recordingRoutes from './routes/recording.routes.js';
import deviceRoutes from './routes/device.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import locationRoutes from './routes/location.routes.js';

import { errorHandler, notFound } from './middleware/error.middleware.js';
import { sendSuccess } from './utils/response.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Serve static dashboard files
app.use(express.static(path.join(__dirname, '../dashboard/dist')));

// Fallback to React router for all other non-API routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dashboard/dist/index.html'));
});

import mongoose from 'mongoose';

// Health API
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return sendSuccess(res, {
    status: 'ok',
    database: dbStatusMap[dbState] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/calls', callRoutes);
app.use('/api/recordings', recordingRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/location', locationRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
