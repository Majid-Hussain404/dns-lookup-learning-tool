import { Request, Response, NextFunction } from 'express';
import { dnsLookupQuerySchema } from '../validators/dnsValidator';
import { executeDnsLookup } from '../services/dnsService';
import { ZodError } from 'zod';

export async function handleDnsLookup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request query parameters using Zod
    const validationResult = dnsLookupQuerySchema.safeParse(req.query);

    if (!validationResult.success) {
      const formattedErrors = (validationResult.error as ZodError).errors
        .map((e) => e.message)
        .join('. ');

      res.status(400).json({
        domain: typeof req.query.domain === 'string' ? req.query.domain : '',
        recordType: typeof req.query.type === 'string' ? req.query.type : 'A',
        status: 'ERROR',
        records: [],
        durationMs: 0,
        durationNotice: 'Validation failed before DNS lookup was dispatched.',
        resolverNotice: 'No query was sent to resolver.',
        message: formattedErrors,
        error: {
          code: 'INVALID_INPUT',
          message: formattedErrors,
          category: 'Input Validation',
        },
      });
      return;
    }

    const { domain, type } = validationResult.data;

    // Timeout configurable from environment variable or default 5000ms
    const timeoutMs = parseInt(process.env.DNS_TIMEOUT_MS || '5000', 10);

    const lookupResult = await executeDnsLookup(domain, type, timeoutMs);

    // Map DNS status to appropriate HTTP status codes
    let statusCode = 200;
    if (lookupResult.status === 'NXDOMAIN') {
      statusCode = 404; // Non-existent domain
    } else if (lookupResult.status === 'TIMEOUT') {
      statusCode = 504; // Gateway timeout / resolver timeout
    } else if (lookupResult.status === 'SERVFAIL' || lookupResult.status === 'REFUSED') {
      statusCode = 502; // Bad gateway / upstream DNS failure
    } else if (lookupResult.status === 'ERROR') {
      statusCode = 500;
    }

    res.status(statusCode).json(lookupResult);
  } catch (error) {
    next(error);
  }
}
