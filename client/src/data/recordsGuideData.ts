import { RecordGuideItem } from '../types/dns';

export const RECORDS_GUIDE_DATA: RecordGuideItem[] = [
  {
    type: 'A',
    fullForm: 'Address Record (IPv4)',
    simpleDefinition: 'Maps a human-readable domain name to a 32-bit IPv4 address.',
    purpose:
      'Allows web browsers and network clients to locate the physical server hosting the domain using standard IPv4 networking.',
    example: 'example.com → 192.0.2.10',
    typicalUseCase:
      'Pointing a website domain or subdomain (e.g., www.example.com) to the public IPv4 address of a web server or cloud load balancer.',
    whatReturnedValueMeans:
      'The returned value is a 4-octet dotted decimal number (0-255 per octet). Your computer uses this IP address as the destination in TCP/IP packet headers. (Note: The example IP 192.0.2.10 belongs to the RFC 5737 documentation prefix and is purely illustrative).',
    commonTroubleshootingIssues: [
      'Missing A record resulting in NODATA or connection failures for IPv4-only users.',
      'Outdated IP address cached after server migration (wait for TTL expiry or flush DNS).',
      'Pointing to a private/internal IP (e.g., 192.168.x.x, 10.x.x.x) making the site inaccessible from the public internet.',
    ],
    interviewQuestion: {
      question: 'Can a single domain name possess multiple A records, and what is this technique called?',
      answer:
        'Yes. Having multiple A records for a single domain is called DNS Round-Robin. The DNS server rotates the order of returned IP addresses across queries, providing basic load distribution across multiple web servers without requiring dedicated hardware.',
    },
  },
  {
    type: 'AAAA',
    fullForm: 'IPv6 Address Record (Quad-A)',
    simpleDefinition: 'Maps a human-readable domain name to a 128-bit IPv6 address.',
    purpose:
      'Enables communication over the next-generation Internet Protocol version 6 (IPv6), resolving IPv4 address exhaustion.',
    example: 'example.com → 2001:db8:85a3::8a2e:370:7334',
    typicalUseCase:
      'Dual-stack hosting where a domain offers both IPv4 (via A) and IPv6 (via AAAA) so modern cellular and broadband networks can connect natively over IPv6.',
    whatReturnedValueMeans:
      'The returned value is an eight-group hexadecimal IPv6 address. (Note: 2001:db8::/32 is reserved for documentation per RFC 3849).',
    commonTroubleshootingIssues: [
      'Client attempts IPv6 connection first (Happy Eyeballs algorithm), but the server firewall blocks port 80/443 on IPv6, causing a brief connection stall before falling back to IPv4.',
      'AAAA record points to an outdated or misconfigured IPv6 address.',
    ],
    interviewQuestion: {
      question: 'What is the "Happy Eyeballs" algorithm (RFC 8305) in relation to A and AAAA records?',
      answer:
        'Happy Eyeballs specifies that modern browsers and operating systems query both A (IPv4) and AAAA (IPv6) records concurrently and attempt connection over IPv6 with a slight head start (usually 250ms). If IPv6 responds swiftly, it is used; otherwise, it seamlessly falls back to IPv4 without user-perceptible delay.',
    },
  },
  {
    type: 'MX',
    fullForm: 'Mail Exchange Record',
    simpleDefinition: 'Directs incoming emails for a domain to the designated mail servers.',
    purpose:
      'Specifies which Simple Mail Transfer Protocol (SMTP) mail servers accept incoming emails for the domain, along with priority preferences.',
    example: 'example.com → Priority 10: mail1.example.com, Priority 20: mail2.example.com',
    typicalUseCase:
      'Configuring Google Workspace, Microsoft 365, or self-hosted mail servers to receive emails sent to user@example.com.',
    whatReturnedValueMeans:
      'Contains two fields: a priority number and a hostname. Sending mail servers try the server with the lowest priority number first. If it is unreachable, they try higher numbers as fallback.',
    commonTroubleshootingIssues: [
      'MX record pointing to an IP address instead of a valid hostname (violates RFC 5321).',
      'MX record pointing to a CNAME alias instead of a direct A/AAAA record (forbidden by RFC 2181).',
      'Incorrect priority levels causing backup mail servers to receive mail out of order.',
    ],
    interviewQuestion: {
      question: 'Why does RFC 5321 prohibit an MX record from pointing directly to an IP address?',
      answer:
        'An MX record MUST point to a fully qualified domain name (FQDN) that resolves to an A or AAAA record. Pointing to an IP address violates SMTP specifications, causing many enterprise mail transfer agents (MTAs) to reject incoming mail as misconfigured or spam.',
    },
  },
  {
    type: 'NS',
    fullForm: 'Name Server Record',
    simpleDefinition: 'Delegates a DNS zone to authoritative name servers.',
    purpose:
      'Tells the global DNS system which specific servers hold the authoritative records (the official truth) for a domain or subdomain.',
    example: 'example.com → ns1.example-dns.com, ns2.example-dns.com',
    typicalUseCase:
      'Configured at your domain registrar (e.g., Cloudflare, Route 53, GoDaddy) to point queries to your active DNS hosting provider.',
    whatReturnedValueMeans:
      'Returns a list of hostnames belonging to the authoritative nameservers responsible for publishing records for that zone.',
    commonTroubleshootingIssues: [
      'Mismatched NS records between the parent zone (TLD registry) and the child zone (authoritative nameserver).',
      'Lame delegation: One of the listed nameservers is offline or does not have zone data loaded.',
      'Missing glue records when nameservers reside inside the same domain they manage (e.g., ns1.example.com for example.com).',
    ],
    interviewQuestion: {
      question: 'What is a "Glue Record" and when is it strictly necessary?',
      answer:
        'A glue record is an A or AAAA record provided by the parent zone (e.g. the .com TLD) that supplies the IP address of an authoritative nameserver whose name ends with the domain itself (e.g., ns1.example.com for example.com). Without a glue record, a circular dependency occurs: to find the IP of ns1.example.com, you need to query ns1.example.com!',
    },
  },
  {
    type: 'TXT',
    fullForm: 'Text Record',
    simpleDefinition: 'Holds human or machine-readable arbitrary text data attached to a domain.',
    purpose:
      'Widely used for domain ownership verification and email security authentication protocols including SPF, DKIM, and DMARC.',
    example: 'example.com → "v=spf1 include:_spf.google.com ~all"',
    typicalUseCase:
      'Preventing email spoofing through Sender Policy Framework (SPF) and proving domain ownership for SSL certificates or search consoles.',
    whatReturnedValueMeans:
      'Returns raw string chunks (up to 255 characters per chunk, concatenated). Often parsed as key-value tags.',
    commonTroubleshootingIssues: [
      'Multiple SPF TXT records on a single domain (violates RFC 7208; causes SPF validation to permanently fail).',
      'Exceeding the DNS 10-lookup limit in SPF strings with nested include statements.',
      'Accidental trailing quotes or character escapes ruining DKIM public keys.',
    ],
    interviewQuestion: {
      question: 'Why must a domain NEVER have more than one SPF TXT record?',
      answer:
        'RFC 7208 Section 3.2 explicitly dictates that if a domain publishes multiple TXT records starting with "v=spf1", receiving mail servers must treat the result as "PermError" (Permanent Error). All authorized mail servers must be merged into a single consolidated SPF TXT string.',
    },
  },
  {
    type: 'CNAME',
    fullForm: 'Canonical Name Record',
    simpleDefinition: 'Aliases one domain name to another domain name.',
    purpose:
      'Allows a subdomain to point to another hostname rather than managing duplicate IP addresses.',
    example: 'blog.example.com → webhost.cdn-provider.net',
    typicalUseCase:
      'Pointing subdomains (like docs.example.com, cdn.example.com) to third-party SaaS platforms, cloud CDNs, or GitHub Pages.',
    whatReturnedValueMeans:
      'Returns the canonical (target) hostname. The client resolver must then perform a second lookup for that target hostname to discover its actual A or AAAA IP address.',
    commonTroubleshootingIssues: [
      'Attempting to place a CNAME record at the zone apex/root (@ or example.com). RFC 1034 forbids CNAME from coexisting with other records like SOA and NS.',
      'CNAME loops (e.g., a.example.com points to b.example.com which points back to a.example.com).',
      'Dangling CNAMEs pointing to deleted cloud resources, exposing the domain to subdomain takeover attacks.',
    ],
    interviewQuestion: {
      question: 'Why cannot a standard CNAME record be placed at the zone apex (root domain)?',
      answer:
        'Per RFC 1034, if a CNAME record exists at a node, no other data records of any type may exist at that node. Because a zone apex MUST contain an SOA record and NS records, placing a standard CNAME at the apex violates DNS specifications. Modern DNS providers overcome this using proprietary "CNAME flattening" or ANAME/ALIAS virtual records.',
    },
  },
  {
    type: 'SOA',
    fullForm: 'Start of Authority Record',
    simpleDefinition: 'Contains administrative and zone-transfer metadata for a DNS zone.',
    purpose:
      'Identifies the primary authoritative nameserver, zone administrator contact email, serial revision number, and secondary server refresh timers.',
    example: 'example.com → ns1.example.com hostmaster.example.com (Serial: 2024031501)',
    typicalUseCase:
      'Every properly configured DNS zone requires exactly one SOA record at its apex to coordinate zone replication and negative caching.',
    whatReturnedValueMeans:
      'Provides 7 core parameters: Primary Master (MNAME), Responsible Email (RNAME where the first dot replaces @), Serial Number, Refresh interval, Retry interval, Expire limit, and Minimum TTL (used for negative caching of NXDOMAIN/NODATA responses per RFC 2308).',
    commonTroubleshootingIssues: [
      'Secondary DNS nameservers failing to sync updates because the administrator forgot to increment the Serial number after making zone changes.',
      'Unrealistically high negative cache TTL (Minimum TTL), causing deleted or typo queries to remain cached as NXDOMAIN for days.',
    ],
    interviewQuestion: {
      question: 'What is the role of the SOA Minimum TTL field according to RFC 2308?',
      answer:
        'In early DNS standards, Minimum TTL set the default TTL for records without an explicit TTL. However, RFC 2308 redefined it strictly as the Negative Caching TTL: it dictates how long resolvers may cache negative responses (NXDOMAIN or NODATA) to prevent repeated flooding of nonexistent queries.',
    },
  },
  {
    type: 'CAA',
    fullForm: 'Certificate Authority Authorization Record',
    simpleDefinition: 'Restricts which Certificate Authorities (CAs) are permitted to issue SSL/TLS certificates for a domain.',
    purpose:
      'Enhances cybersecurity by preventing rogue or compromised CAs from mistakenly issuing valid certificates for your domain.',
    example: 'example.com → 0 issue "letsencrypt.org", 0 iodef "mailto:security@example.com"',
    typicalUseCase:
      'Locking down certificate issuance to specific trusted CAs (e.g., Let\'s Encrypt, DigiCert) and specifying an email or URL to receive violation alerts.',
    whatReturnedValueMeans:
      'Contains three properties: Flags (0 or 128 for critical), Tag ("issue", "issuewild", or "iodef"), and Value (the authorized CA domain or incident report URI).',
    commonTroubleshootingIssues: [
      'Accidentally omitting wildcard permission (issuewild tag) when attempting to generate a wildcard SSL certificate (*.example.com).',
      'CAA records preventing automated renewal of certificates when changing hosting providers.',
    ],
    interviewQuestion: {
      question: 'Is a Certificate Authority legally required to check CAA records before issuing an SSL certificate?',
      answer:
        'Yes. Since September 8, 2017, the CA/Browser Forum (the regulatory body governing public CAs) mandates that all compliant Certificate Authorities MUST check and respect CAA records in DNS prior to issuing public TLS/SSL certificates.',
    },
  },
];
