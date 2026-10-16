export type SupportedRecordType =
  | 'A'
  | 'AAAA'
  | 'MX'
  | 'NS'
  | 'TXT'
  | 'CNAME'
  | 'SOA'
  | 'CAA'
  | 'ALL';

export interface DnsRecordItem {
  name: string;
  type: string;
  value: string;
  ttl?: number;
  priority?: number;
  details?: Record<string, unknown>;
}

export type DnsLookupStatus =
  | 'SUCCESS'
  | 'NODATA'
  | 'NXDOMAIN'
  | 'TIMEOUT'
  | 'SERVFAIL'
  | 'REFUSED'
  | 'ERROR';

export interface DnsLookupResponse {
  domain: string;
  recordType: SupportedRecordType;
  status: DnsLookupStatus;
  records: DnsRecordItem[];
  durationMs: number;
  durationNotice: string;
  resolverNotice: string;
  message: string;
  error?: {
    code: string;
    message: string;
    category: string;
  };
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptimeSeconds: number;
  service: string;
  version: string;
}
