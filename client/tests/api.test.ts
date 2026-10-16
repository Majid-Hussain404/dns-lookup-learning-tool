import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchDnsLookup, fetchHealth, ApiError } from '../src/services/api';

describe('Frontend API Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and returns DNS lookup results from backend API', async () => {
    const mockResponse = {
      domain: 'example.com',
      recordType: 'A',
      status: 'SUCCESS',
      records: [{ name: 'example.com', type: 'A', value: '93.184.216.34', ttl: 300 }],
      durationMs: 42,
      durationNotice: 'App measured duration',
      resolverNotice: 'OS resolver used',
      message: 'Lookup successful',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchDnsLookup('example.com', 'A');

    expect(result.status).toBe('SUCCESS');
    expect(result.domain).toBe('example.com');
    expect(result.records).toHaveLength(1);
    expect(result.records[0].value).toBe('93.184.216.34');
  });

  it('handles network failure and returns ApiError', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Connection refused'));

    await expect(fetchDnsLookup('example.com', 'A')).rejects.toThrow(ApiError);
  });

  it('fetches service health status', async () => {
    const mockHealth = {
      status: 'ok',
      service: 'DNS Lookup Learning Tool API',
      version: '1.0.0',
      uptimeSeconds: 120,
      timestamp: new Date().toISOString(),
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockHealth,
    });

    const health = await fetchHealth();
    expect(health.status).toBe('ok');
    expect(health.service).toBe('DNS Lookup Learning Tool API');
  });
});
