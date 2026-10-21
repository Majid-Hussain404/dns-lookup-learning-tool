import dotenv from 'dotenv';
// Load environment variables before initializing app
dotenv.config();

import { createApp } from './app';

const app = createApp();
const PORT = parseInt(process.env.PORT || '5001', 10);

// Only spin up the HTTP listener if not running in a serverless environment (e.g. Vercel)
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🌐 DNS Lookup Learning Tool Backend is running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔍 DNS Lookup: http://localhost:${PORT}/api/dns/lookup?domain=example.com&type=A`);
    console.log(`====================================================`);
  });

  // Graceful shutdown handling
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
}

export default app;
module.exports = app;
module.exports.default = app;

