import app from './app.js';
import { connectDB } from './config/database.js';
import { config } from './config/env.js';
import https from 'https';
import http from 'http';

const startServer = async () => {
  await connectDB();

  app.listen(config.port as number, '0.0.0.0', () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port} at 0.0.0.0`);
    
    // Cron job to prevent Render from sleeping (runs every 10 minutes)
    setInterval(() => {
      const url = process.env.SERVER_URL || `http://localhost:${config.port}`;
      const pingUrl = `${url.replace(/\/$/, '')}/api/health`;
      const client = pingUrl.startsWith('https') ? https : http;
      
      client.get(pingUrl, (res) => {
        console.log(`[Cron] Pinged ${pingUrl} - Status: ${res.statusCode}`);
      }).on('error', (err) => {
        console.error(`[Cron] Ping failed:`, err.message);
      });
    }, 10 * 60 * 1000); // 10 minutes in milliseconds
  });
};

startServer();
