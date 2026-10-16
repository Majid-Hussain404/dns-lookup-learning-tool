import { Request, Response, NextFunction } from 'express';

/**
 * Centralized error handling middleware.
 * Ensures internal implementation details, raw stack traces, and environment
 * variables are never leaked to clients.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Safe logging on the server without leaking sensitive request data
  console.error('[SERVER ERROR]:', err.message);

  res.status(500).json({
    status: 'ERROR',
    message: 'An internal server error occurred while processing your request.',
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Please try again later or contact support.',
      category: 'Server Exception',
    },
  });
}

/**
 * 404 handler for undefined API routes.
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    status: 'ERROR',
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource does not exist.',
      category: 'Routing',
    },
  });
}
