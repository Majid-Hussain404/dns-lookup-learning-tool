import dnsPromises from 'node:dns/promises';
import {
  DnsLookupResponse,
  DnsLookupStatus,
  DnsRecordItem,
  SupportedRecordType,
} from '../types/dns';

const DEFAULT_TIMEOUT_MS = 5000;

interface DnsError extends Error {
  code?: string;
  syscall?: string;
  hostname?: string;
}

/**
 * Wraps a promise with a configurable timeout.
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, operationName: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const err = new Error(`DNS query for ${operationName} timed out after ${timeoutMs}ms`) as DnsError;
      err.code = 'ETIMEOUT';
      reject(err);
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Maps Node.js DNS error codes to standard educational DNS status codes and descriptions.
 */
function mapDnsError(err: unknown): {
  status: DnsLookupStatus;
  code: string;
  message: string;
  category: string;
} {
  const dnsErr = err as DnsError;
  const code = dnsErr.code || 'UNKNOWN_ERROR';

  switch (code) {
    case 'ENOTFOUND':
      return {
        status: 'NXDOMAIN',
        code: 'ENOTFOUND',
        message: 'Non-Existent Domain (NXDOMAIN): The domain name could not be found by the resolver. Verify domain spelling or registration status.',
        category: 'Resolution Failure',
      };
    case 'ENODATA':
    case 'ENORECORD':
      return {
        status: 'NODATA',
        code,
        message: 'No Data (NODATA): The domain name exists, but has no records for the requested record type.',
        category: 'Empty Record Set',
      };
    case 'ETIMEOUT':
      return {
        status: 'TIMEOUT',
        code: 'ETIMEOUT',
        message: 'Query Timeout: The DNS server or resolver did not respond within the allotted time window. This may indicate network latency or blocked UDP port 53.',
        category: 'Network Latency',
      };
    case 'ESERVFAIL':
      return {
        status: 'SERVFAIL',
        code: 'ESERVFAIL',
        message: 'Server Failure (SERVFAIL): The authoritative or recursive server encountered a failure (such as DNSSEC validation error or zone misconfiguration).',
        category: 'Server Misconfiguration',
      };
    case 'EREFUSED':
      return {
        status: 'REFUSED',
        code: 'EREFUSED',
        message: 'Query Refused: The queried DNS server refused to answer this request due to policy, rate limiting, or zone transfer restrictions.',
        category: 'Access Policy',
      };
    default:
      return {
        status: 'ERROR',
        code,
        message: dnsErr.message || 'An unexpected DNS error occurred.',
        category: 'General DNS Error',
      };
  }
}

/**
 * Resolves a single DNS record type for a given domain using node:dns/promises.
 */
async function resolveSingleType(
  domain: string,
  type: Exclude<SupportedRecordType, 'ALL'>,
  timeoutMs: number
): Promise<DnsRecordItem[]> {
  const items: DnsRecordItem[] = [];

  switch (type) {
    case 'A': {
      const records = await withTimeout(
        dnsPromises.resolve4(domain, { ttl: true }),
        timeoutMs,
        `A record for ${domain}`
      );
      for (const rec of records) {
        items.push({
          name: domain,
          type: 'A',
          value: rec.address,
          ttl: rec.ttl,
        });
      }
      break;
    }

    case 'AAAA': {
      const records = await withTimeout(
        dnsPromises.resolve6(domain, { ttl: true }),
        timeoutMs,
        `AAAA record for ${domain}`
      );
      for (const rec of records) {
        items.push({
          name: domain,
          type: 'AAAA',
          value: rec.address,
          ttl: rec.ttl,
        });
      }
      break;
    }

    case 'MX': {
      const records = await withTimeout(
        dnsPromises.resolveMx(domain),
        timeoutMs,
        `MX record for ${domain}`
      );
      // Sort by priority ascending (lower number = higher preference in RFC 5321)
      records.sort((a, b) => a.priority - b.priority);
      for (const rec of records) {
        items.push({
          name: domain,
          type: 'MX',
          value: rec.exchange,
          priority: rec.priority,
          details: {
            exchange: rec.exchange,
            priority: rec.priority,
          },
        });
      }
      break;
    }

    case 'NS': {
      const records = await withTimeout(
        dnsPromises.resolveNs(domain),
        timeoutMs,
        `NS record for ${domain}`
      );
      for (const host of records) {
        items.push({
          name: domain,
          type: 'NS',
          value: host,
        });
      }
      break;
    }

    case 'TXT': {
      const records = await withTimeout(
        dnsPromises.resolveTxt(domain),
        timeoutMs,
        `TXT record for ${domain}`
      );
      for (const chunks of records) {
        const fullString = chunks.join('');
        items.push({
          name: domain,
          type: 'TXT',
          value: fullString,
          details: {
            chunks,
            chunkCount: chunks.length,
          },
        });
      }
      break;
    }

    case 'CNAME': {
      const records = await withTimeout(
        dnsPromises.resolveCname(domain),
        timeoutMs,
        `CNAME record for ${domain}`
      );
      for (const target of records) {
        items.push({
          name: domain,
          type: 'CNAME',
          value: target,
        });
      }
      break;
    }

    case 'SOA': {
      const soa = await withTimeout(
        dnsPromises.resolveSoa(domain),
        timeoutMs,
        `SOA record for ${domain}`
      );
      items.push({
        name: domain,
        type: 'SOA',
        value: `${soa.nsname} ${soa.hostmaster} (serial: ${soa.serial})`,
        ttl: soa.minttl,
        details: {
          primaryMaster: soa.nsname,
          responsiblePerson: soa.hostmaster,
          serial: soa.serial,
          refresh: soa.refresh,
          retry: soa.retry,
          expire: soa.expire,
          minimumTtl: soa.minttl,
        },
      });
      break;
    }

    case 'CAA': {
      const records = await withTimeout(
        dnsPromises.resolveCaa(domain),
        timeoutMs,
        `CAA record for ${domain}`
      );
      for (const rec of records) {
        const tag = rec.issue ? 'issue' : rec.issuewild ? 'issuewild' : rec.iodef ? 'iodef' : 'tag';
        const val = rec.issue || rec.issuewild || rec.iodef || JSON.stringify(rec);
        items.push({
          name: domain,
          type: 'CAA',
          value: `${rec.critical} ${tag} "${val}"`,
          details: {
            flags: rec.critical,
            tag,
            value: val,
            ...rec,
          },
        });
      }
      break;
    }
  }

  return items;
}

/**
 * Executes a full DNS lookup for a domain and record type, measuring duration
 * and returning educational context and warnings.
 */
export async function executeDnsLookup(
  domain: string,
  recordType: SupportedRecordType,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<DnsLookupResponse> {
  const startTime = Date.now();
  const durationNotice =
    'Duration is the application-measured round-trip time through Node.js and the local resolver. It is not authoritative DNS server latency.';
  const resolverNotice =
    'Node.js uses the host operating system DNS resolver configuration. Results may be influenced by local DNS caching and recursive resolver policies.';

  if (recordType === 'ALL') {
    const singleTypes: Exclude<SupportedRecordType, 'ALL'>[] = [
      'A',
      'AAAA',
      'MX',
      'NS',
      'TXT',
      'CNAME',
      'SOA',
      'CAA',
    ];

    const results = await Promise.allSettled(
      singleTypes.map((t) => resolveSingleType(domain, t, timeoutMs))
    );

    const allRecords: DnsRecordItem[] = [];
    let hasSuccessfulType = false;
    let notFoundCount = 0;

    results.forEach((res, index) => {
      const type = singleTypes[index];
      if (res.status === 'fulfilled') {
        if (res.value.length > 0) {
          hasSuccessfulType = true;
          allRecords.push(...res.value);
        }
      } else {
        const err = res.reason as DnsError;
        if (err.code === 'ENOTFOUND') {
          notFoundCount++;
        }
      }
    });

    const durationMs = Date.now() - startTime;

    if (hasSuccessfulType) {
      return {
        domain,
        recordType: 'ALL',
        status: 'SUCCESS',
        records: allRecords,
        durationMs,
        durationNotice,
        resolverNotice,
        message: `Discovered ${allRecords.length} record(s) across all queried types for ${domain}. Note that individual queries were dispatched concurrently because modern DNS resolvers restrict broad ANY queries (RFC 8482).`,
      };
    }

    if (notFoundCount === singleTypes.length) {
      return {
        domain,
        recordType: 'ALL',
        status: 'NXDOMAIN',
        records: [],
        durationMs,
        durationNotice,
        resolverNotice,
        message: `Non-Existent Domain (NXDOMAIN): Could not resolve any records for ${domain}. The domain likely does not exist.`,
        error: {
          code: 'ENOTFOUND',
          message: 'The requested domain could not be resolved in the DNS namespace.',
          category: 'Resolution Failure',
        },
      };
    }

    return {
      domain,
      recordType: 'ALL',
      status: 'NODATA',
      records: [],
      durationMs,
      durationNotice,
      resolverNotice,
      message: `No records were found for ${domain} across the standard queried record types (A, AAAA, MX, NS, TXT, CNAME, SOA, CAA).`,
      error: {
        code: 'ENODATA',
        message: 'No records exist for the queried types.',
        category: 'Empty Record Set',
      },
    };
  }

  // Single record type lookup
  try {
    const records = await resolveSingleType(domain, recordType, timeoutMs);
    const durationMs = Date.now() - startTime;

    if (records.length === 0) {
      return {
        domain,
        recordType,
        status: 'NODATA',
        records: [],
        durationMs,
        durationNotice,
        resolverNotice,
        message: `The domain ${domain} exists, but no ${recordType} records were found.`,
      };
    }

    return {
      domain,
      recordType,
      status: 'SUCCESS',
      records,
      durationMs,
      durationNotice,
      resolverNotice,
      message: `Successfully retrieved ${records.length} ${recordType} record(s) for ${domain}.`,
    };
  } catch (err: unknown) {
    const durationMs = Date.now() - startTime;
    const errorDetails = mapDnsError(err);

    return {
      domain,
      recordType,
      status: errorDetails.status,
      records: [],
      durationMs,
      durationNotice,
      resolverNotice,
      message: errorDetails.message,
      error: {
        code: errorDetails.code,
        message: errorDetails.message,
        category: errorDetails.category,
      },
    };
  }
}
