import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import dnsPromises from 'node:dns/promises';
import { createApp } from '../src/app';

vi.mock('node:dns/promises', () => {
  return {
    default: {
      resolve4: vi.fn(),
      resolve6: vi.fn(),
      resolveMx: vi.fn(),
      resolveNs: vi.fn(),
      resolveTxt: vi.fn(),
      resolveCname: vi.fn(),
      resolveSoa: vi.fn(),
      resolveCaa: vi.fn(),
    },
  };
});

describe('Backend API Routes', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('returns 200 OK and health statistics', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('DNS Lookup Learning Tool API');
      expect(res.body.uptimeSeconds).toBeGreaterThanOrEqual(0);
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('GET /api/dns/lookup', () => {
    it('handles valid domain lookup with status 200', async () => {
      vi.mocked(dnsPromises.resolve4).mockResolvedValue([
        { address: '93.184.216.34', ttl: 300 },
      ]);

      const res = await request(app).get('/api/dns/lookup?domain=example.com&type=A');

      expect(res.status).toBe(200);
      expect(res.body.domain).toBe('example.com');
      expect(res.body.recordType).toBe('A');
      expect(res.body.status).toBe('SUCCESS');
      expect(res.body.records).toHaveLength(1);
      expect(res.body.records[0].value).toBe('93.184.216.34');
    });

    it('normalizes domains starting with http:// and trailing slashes', async () => {
      vi.mocked(dnsPromises.resolve4).mockResolvedValue([
        { address: '93.184.216.34', ttl: 300 },
      ]);

      const res = await request(app).get('/api/dns/lookup?domain=https://example.com/test&type=A');

      expect(res.status).toBe(200);
      expect(res.body.domain).toBe('example.com');
      expect(res.body.records).toHaveLength(1);
    });

    it('rejects missing domain query parameter with 400 Bad Request', async () => {
      const res = await request(app).get('/api/dns/lookup');

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('ERROR');
      expect(res.body.error.code).toBe('INVALID_INPUT');
      expect(res.body.message).toContain('Domain query parameter is required');
    });

    it('rejects invalid domain format containing illegal characters with 400 Bad Request', async () => {
      const res = await request(app).get('/api/dns/lookup?domain=invalid;rm -rf /;example.com&type=A');

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('ERROR');
      expect(res.body.error.code).toBe('INVALID_INPUT');
      expect(res.body.message).toContain('Invalid domain format');
    });

    it('rejects unsupported record type with 400 Bad Request', async () => {
      const res = await request(app).get('/api/dns/lookup?domain=example.com&type=INVALID_TYPE');

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('ERROR');
      expect(res.body.error.code).toBe('INVALID_INPUT');
      expect(res.body.message).toContain('Unsupported record type');
    });

    it('returns 404 for NXDOMAIN queries', async () => {
      const error: any = new Error('getaddrinfo ENOTFOUND non-existent-xyz123.com');
      error.code = 'ENOTFOUND';
      vi.mocked(dnsPromises.resolve4).mockRejectedValue(error);

      const res = await request(app).get('/api/dns/lookup?domain=non-existent-xyz123.com&type=A');

      expect(res.status).toBe(404);
      expect(res.body.status).toBe('NXDOMAIN');
      expect(res.body.error.code).toBe('ENOTFOUND');
    });

    it('returns 404 for undefined routes', async () => {
      const res = await request(app).get('/api/unknown-endpoint');

      expect(res.status).toBe(404);
      expect(res.body.status).toBe('ERROR');
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
