import { describe, it, expect, vi, beforeEach } from 'vitest';
import dnsPromises from 'node:dns/promises';
import { executeDnsLookup } from '../src/services/dnsService';

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

describe('dnsService - executeDnsLookup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves IPv4 A records with TTL accurately', async () => {
    vi.mocked(dnsPromises.resolve4).mockResolvedValue([
      { address: '93.184.216.34', ttl: 3600 },
    ]);

    const result = await executeDnsLookup('example.com', 'A');

    expect(result.status).toBe('SUCCESS');
    expect(result.domain).toBe('example.com');
    expect(result.recordType).toBe('A');
    expect(result.records).toHaveLength(1);
    expect(result.records[0]).toEqual({
      name: 'example.com',
      type: 'A',
      value: '93.184.216.34',
      ttl: 3600,
    });
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
    expect(result.durationNotice).toBeDefined();
    expect(result.resolverNotice).toBeDefined();
  });

  it('resolves MX records sorted by priority ascending', async () => {
    vi.mocked(dnsPromises.resolveMx).mockResolvedValue([
      { exchange: 'backup-mail.example.com', priority: 20 },
      { exchange: 'primary-mail.example.com', priority: 10 },
    ]);

    const result = await executeDnsLookup('example.com', 'MX');

    expect(result.status).toBe('SUCCESS');
    expect(result.records).toHaveLength(2);
    expect(result.records[0].priority).toBe(10);
    expect(result.records[0].value).toBe('primary-mail.example.com');
    expect(result.records[1].priority).toBe(20);
    expect(result.records[1].value).toBe('backup-mail.example.com');
  });

  it('handles NXDOMAIN when ENOTFOUND error is thrown', async () => {
    const error: any = new Error('getaddrinfo ENOTFOUND this-domain-does-not-exist.test');
    error.code = 'ENOTFOUND';
    vi.mocked(dnsPromises.resolve4).mockRejectedValue(error);

    const result = await executeDnsLookup('this-domain-does-not-exist.test', 'A');

    expect(result.status).toBe('NXDOMAIN');
    expect(result.records).toHaveLength(0);
    expect(result.error?.code).toBe('ENOTFOUND');
    expect(result.message).toContain('Non-Existent Domain');
  });

  it('handles NODATA when ENODATA error is thrown', async () => {
    const error: any = new Error('queryA ENODATA example.com');
    error.code = 'ENODATA';
    vi.mocked(dnsPromises.resolve4).mockRejectedValue(error);

    const result = await executeDnsLookup('example.com', 'A');

    expect(result.status).toBe('NODATA');
    expect(result.records).toHaveLength(0);
    expect(result.error?.code).toBe('ENODATA');
    expect(result.message).toContain('No Data (NODATA)');
  });

  it('handles DNS query timeout', async () => {
    // Simulate a hung promise that gets caught by timeout helper
    vi.mocked(dnsPromises.resolve4).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 2000))
    );

    // Call with a very short timeout of 50ms
    const result = await executeDnsLookup('slow-domain.example', 'A', 50);

    expect(result.status).toBe('TIMEOUT');
    expect(result.records).toHaveLength(0);
    expect(result.error?.code).toBe('ETIMEOUT');
  });

  it('handles ALL query type by querying multiple types concurrently', async () => {
    vi.mocked(dnsPromises.resolve4).mockResolvedValue([
      { address: '93.184.216.34', ttl: 300 },
    ]);
    vi.mocked(dnsPromises.resolve6).mockResolvedValue([
      { address: '2606:2800:220:1:248:1893:25c8:1946', ttl: 300 },
    ]);
    vi.mocked(dnsPromises.resolveMx).mockResolvedValue([
      { exchange: 'mail.example.com', priority: 10 },
    ]);
    vi.mocked(dnsPromises.resolveNs).mockResolvedValue(['ns1.example.com']);
    vi.mocked(dnsPromises.resolveTxt).mockResolvedValue([['v=spf1 -all']]);
    vi.mocked(dnsPromises.resolveCname).mockRejectedValue({ code: 'ENODATA' });
    vi.mocked(dnsPromises.resolveSoa).mockResolvedValue({
      nsname: 'ns.icann.org',
      hostmaster: 'noc.dns.icann.org',
      serial: 2024010101,
      refresh: 7200,
      retry: 3600,
      expire: 1209600,
      minttl: 3600,
    });
    vi.mocked(dnsPromises.resolveCaa).mockResolvedValue([]);

    const result = await executeDnsLookup('example.com', 'ALL');

    expect(result.status).toBe('SUCCESS');
    expect(result.recordType).toBe('ALL');
    expect(result.records.length).toBeGreaterThan(3);
    const typesFound = result.records.map((r) => r.type);
    expect(typesFound).toContain('A');
    expect(typesFound).toContain('AAAA');
    expect(typesFound).toContain('MX');
    expect(typesFound).toContain('NS');
    expect(typesFound).toContain('TXT');
    expect(typesFound).toContain('SOA');
  });
});
