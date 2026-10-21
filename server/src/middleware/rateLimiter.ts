import rateLimit from 'express-rate-limit';

/**
 * Standard rate limiter for DNS lookup endpoints.
 * Protects local system resources and prevents automated abuse while allowing
 * comfortable interactive usage for students and learners.
 */
export const dnsRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 60, // Limit each IP to 60 requests per windowMs
  standardHeaders: true, // Return standard RateLimit headers in the `RateLimit-*` format
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  validate: {
    xForwardedForHeader: false,
  },
  message: {
    status: 'ERROR',
    message: 'Too many DNS lookup requests from this IP address. Please slow down and wait a minute before trying again.',
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Rate limit of 60 requests per minute reached.',
      category: 'Security & Throttling',
    },
  },
});
