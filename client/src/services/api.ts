import { DnsLookupResponse, HealthResponse, SupportedRecordType } from '../types/dns';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  response?: DnsLookupResponse;
  statusCode?: number;

  constructor(message: string, response?: DnsLookupResponse, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.response = response;
    this.statusCode = statusCode;
  }
}

/**
 * Executes a DNS lookup against the backend API.
 */
export async function fetchDnsLookup(
  domain: string,
  type: SupportedRecordType = 'A'
): Promise<DnsLookupResponse> {
  const url = `${BASE_URL}/dns/lookup?domain=${encodeURIComponent(domain)}&type=${encodeURIComponent(type)}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const data = (await res.json()) as DnsLookupResponse;

    // Notice: our API returns structured JSON with full context even on 404 (NXDOMAIN) or 504 (TIMEOUT).
    // We only throw an ApiError if the server didn't respond with our standard DNS JSON payload.
    if (!res.ok && !data.status) {
      throw new ApiError(
        data.message || `Request failed with HTTP status ${res.status}`,
        data,
        res.status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network connectivity issue or server unreachable
    throw new ApiError(
      'Unable to connect to the DNS backend service. Ensure the backend server is running on port 5000.',
      {
        domain,
        recordType: type,
        status: 'ERROR',
        records: [],
        durationMs: 0,
        durationNotice: 'Failed to communicate with backend server.',
        resolverNotice: 'Query could not be dispatched.',
        message:
          'Network Connection Error: Could not reach the backend API. Please verify that the backend process is running.',
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown network failure',
          category: 'Client-Server Communication',
        },
      }
    );
  }
}

/**
 * Checks backend health status.
 */
export async function fetchHealth(): Promise<HealthResponse> {
  const url = `${BASE_URL}/health`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Health check failed with status ${res.status}`);
  }

  return (await res.json()) as HealthResponse;
}
