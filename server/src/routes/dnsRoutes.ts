import { Router } from 'express';
import { handleDnsLookup } from '../controllers/dnsController';
import { dnsRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply rate limiter specifically to DNS lookup endpoints to prevent abuse
router.get('/lookup', dnsRateLimiter, handleDnsLookup);

export default router;
