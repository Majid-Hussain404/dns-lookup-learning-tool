import { z } from 'zod';
import { SupportedRecordType } from '../types/dns';

const SUPPORTED_RECORD_TYPES: SupportedRecordType[] = [
  'A',
  'AAAA',
  'MX',
  'NS',
  'TXT',
  'CNAME',
  'SOA',
  'CAA',
  'ALL',
];

/**
 * Normalizes user-submitted domain input:
 * - Trims whitespace
 * - Converts to lowercase
 * - Strips leading protocol (http://, https://) if a beginner pastes a web URL
 * - Strips paths, ports, or trailing slashes (e.g., example.com/test -> example.com)
 * - Removes a trailing FQDN dot (e.g., example.com. -> example.com)
 */
export function normalizeDomain(rawDomain: string): string {
  let cleaned = rawDomain.trim().toLowerCase();

  // Strip protocol if user pasted a URL
  if (cleaned.startsWith('http://')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('https://')) {
    cleaned = cleaned.slice(8);
  }

  // Remove path, query string, or hash
  cleaned = cleaned.split('/')[0].split('?')[0].split('#')[0];

  // Remove port if present (e.g. localhost:3000 -> localhost)
  cleaned = cleaned.split(':')[0];

  // Remove trailing root dot if present (FQDN syntax)
  if (cleaned.endsWith('.')) {
    cleaned = cleaned.slice(0, -1);
  }

  return cleaned;
}

/**
 * Domain regex conforming to RFC 1034 / RFC 1123:
 * - Total length <= 253 characters
 * - Each label between 1 and 63 characters
 * - Labels can contain letters, numbers, and hyphens (not starting or ending with hyphen)
 * - Must have at least two labels (e.g. example.com) or be localhost
 */
const DOMAIN_REGEX = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z0-9-]{1,63}(?<!-))*$/;

export const dnsLookupQuerySchema = z.object({
  domain: z
    .string({
      required_error: 'Domain query parameter is required',
    })
    .min(1, 'Domain name cannot be empty')
    .max(253, 'Domain name cannot exceed 253 characters')
    .transform(normalizeDomain)
    .refine((val) => val.length > 0, 'Domain name cannot be empty')
    .refine(
      (val) => {
        // Must match safe characters only, no shell meta-characters
        return DOMAIN_REGEX.test(val);
      },
      {
        message:
          'Invalid domain format. Domain names must contain only alphanumeric characters, dots, and hyphens (RFC 1123).',
      }
    )
    .refine(
      (val) => {
        // Each label must be <= 63 characters
        const labels = val.split('.');
        return labels.every((l) => l.length >= 1 && l.length <= 63);
      },
      {
        message: 'Each domain label between dots must be between 1 and 63 characters long.',
      }
    ),
  type: z
    .string()
    .optional()
    .default('A')
    .transform((val) => val.toUpperCase().trim())
    .refine(
      (val): val is SupportedRecordType => {
        return SUPPORTED_RECORD_TYPES.includes(val as SupportedRecordType);
      },
      {
        message: `Unsupported record type. Supported types are: ${SUPPORTED_RECORD_TYPES.join(', ')}`,
      }
    ),
});

export type DnsLookupQuery = z.infer<typeof dnsLookupQuerySchema>;
