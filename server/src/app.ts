import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dnsRoutes from './routes/dnsRoutes';
import healthRoutes from './routes/healthRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  // Security Headers via Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS configuration
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:5173', 'http://127.0.0.1:5173'];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, serverless internal)
        if (!origin) return callback(null, true);
        if (
          allowedOrigins.includes('*') ||
          allowedOrigins.includes(origin) ||
          origin.endsWith('.vercel.app')
        ) {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS policy`));
      },
      methods: ['GET'],
      allowedHeaders: ['Content-Type', 'Accept'],
    })
  );

  // Body parsing (strictly limited payload size)
  app.use(express.json({ limit: '10kb' }));

  // Privacy-friendly request logging (logs HTTP method and route without logging user queries)
  app.use((req, _res, next) => {
    const timestamp = new Date().toISOString();
    // Intentionally strip query parameters to avoid logging users' domain lookups
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
  });

  // Mount API routes (support both /api/* and direct prefix for Vercel serverless)
  app.use(['/api/health', '/health'], healthRoutes);
  app.use(['/api/dns', '/dns'], dnsRoutes);

  // 404 Handler
  app.use(notFoundHandler);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
