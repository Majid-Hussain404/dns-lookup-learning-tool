import { TroubleshootingScenario } from '../types/dns';

export const TROUBLESHOOTING_SCENARIOS: TroubleshootingScenario[] = [
  {
    id: 'missing-a-record',
    title: 'Domain has no A Record (NODATA)',
    category: 'Missing Record',
    difficulty: 'Beginner',
    problemDescription:
      'Users report that typing "example.com" into their browser results in "Server IP address could not be found" (DNS_PROBE_FINISHED_NXDOMAIN or ERR_NAME_NOT_RESOLVED), even though the domain is registered and nameservers are active.',
    sampleDnsResponse: `; <<>> DiG 9.18.1 <<>> example.com A
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 48123
;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 1, ADDITIONAL: 0

;; AUTHORITY SECTION:
example.com.    1800    IN    SOA    ns1.example.com. hostmaster.example.com. 2024010101 7200 3600 1209600 300`,
    likelyExplanation:
      'The domain name exists and resolves (status: NOERROR), but the answer section contains 0 records (NODATA). The domain owner forgot to create an "A" record pointing to the web server\'s IPv4 address.',
    suggestedCommands: [
      {
        tool: 'dig',
        command: 'dig example.com A +noall +answer +comments',
        description: 'Queries the A record and checks whether the ANSWER count is 0 despite NOERROR status.',
        platformNotice: 'Pre-installed on macOS and most Linux distros; install via BIND tools on Windows.',
      },
      {
        tool: 'nslookup',
        command: 'nslookup -type=A example.com',
        description: 'Built-in Windows/macOS/Linux utility. Checks whether any IPv4 addresses are returned.',
        platformNotice: 'Native on all Windows systems in PowerShell and Command Prompt.',
      },
    ],
    stepByStepSolution: [
      'Log into your DNS provider or domain registrar management console (e.g., Cloudflare, Route 53, Namecheap).',
      'Navigate to the DNS Records section for the domain.',
      'Click "Add Record" and select Type "A".',
      'In the Name field, enter "@" (representing the root domain) or your subdomain.',
      'In the Value/Points To field, enter the public IPv4 address of your hosting server (e.g., 198.51.100.25).',
      'Save the record and allow up to the TTL duration for local caches to update.',
    ],
    knowledgeCheck: {
      question: 'When a DNS query returns status NOERROR with 0 answer records, what does this indicate?',
      options: [
        'The domain name is not registered at all.',
        'The domain exists, but has no records of the requested type (NODATA).',
        'The DNS server is offline and unreachable.',
        'The client has an expired TLS certificate.',
      ],
      correctIndex: 1,
      explanation:
        'NOERROR with 0 answers is the definition of NODATA. The zone exists and answers authoritatively, but does not possess the specific record type requested (e.g. asking for A when only MX or TXT exists).',
    },
  },
  {
    id: 'ipv6-only-no-ipv4',
    title: 'Hostname has an IPv6 (AAAA) but no IPv4 (A) record',
    category: 'Configuration',
    difficulty: 'Intermediate',
    problemDescription:
      'Some users on modern mobile cellular connections can view your website fine, but users in corporate offices or legacy home broadband networks report the site is completely inaccessible.',
    sampleDnsResponse: `; <<>> DiG 9.18.1 <<>> app.example.com A
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 10928
;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 1

; <<>> DiG 9.18.1 <<>> app.example.com AAAA
;; ANSWER SECTION:
app.example.com.    300    IN    AAAA    2001:db8:3333:4444:5555:6666:7777:8888`,
    likelyExplanation:
      'The server administrator configured an AAAA record for IPv6, but omitted the IPv4 A record. Clients on IPv4-only networks (which still constitute a large portion of enterprise networks) cannot route to IPv6 addresses without NAT64/DNS64 translation.',
    suggestedCommands: [
      {
        tool: 'dig',
        command: 'dig app.example.com AAAA +short && dig app.example.com A +short',
        description: 'Inspects both IPv6 and IPv4 records to identify if dual-stack parity is missing.',
      },
      {
        tool: 'nslookup',
        command: 'nslookup -type=AAAA app.example.com\nnslookup -type=A app.example.com',
        description: 'Windows nslookup command to query AAAA followed by A.',
      },
    ],
    stepByStepSolution: [
      'Confirm the IPv4 address assigned to your server or reverse proxy.',
      'Add an A record in your DNS zone pointing to your IPv4 address.',
      'Ensure web server virtual hosts (e.g., Nginx, Apache) are configured to listen on both `listen 80;` and `listen [::]:80;`.',
      'Test connectivity from both IPv4 and IPv6 diagnostic tools.',
    ],
    knowledgeCheck: {
      question: 'What happens to a client with only an IPv4 internet connection when querying a domain with only an AAAA record?',
      options: [
        'The operating system automatically converts the IPv6 address to IPv4.',
        'The query succeeds and the client connects over IPv4.',
        'The resolver returns NODATA for the A query, and the client fails to connect.',
        'The ISP automatically buys an IPv4 address for the domain.',
      ],
      correctIndex: 2,
      explanation:
        'An IPv4-only host cannot connect to an IPv6 address natively. Because no A record exists, the A query returns NODATA, leading to connection failure on IPv4 networks unless an intermediate NAT64 gateway is present.',
    },
  },
  {
    id: 'mx-unexpected-server',
    title: 'MX Record points to unexpected mail server or IP',
    category: 'Protocol & RFC',
    difficulty: 'Intermediate',
    problemDescription:
      'A company switched from on-premise email to Google Workspace, but customers report that emails are either bouncing with "550 Relay Access Denied" or disappearing into old inboxes.',
    sampleDnsResponse: `> nslookup -type=MX company.example
Server:  UnKnown
Address:  192.168.1.1

company.example    MX preference = 10, mail exchanger = oldmail.company.example
company.example    MX preference = 20, mail exchanger = 198.51.100.99`,
    likelyExplanation:
      'Two critical issues: First, the legacy mail server (oldmail.company.example) is still listed with priority 10, receiving all primary traffic. Second, someone entered an IP address (198.51.100.99) directly into an MX record, violating RFC 5321.',
    suggestedCommands: [
      {
        tool: 'dig',
        command: 'dig company.example MX +noall +answer',
        description: 'Displays all active MX records sorted by priority.',
      },
      {
        tool: 'nslookup',
        command: 'nslookup -type=MX company.example 8.8.8.8',
        description: 'Queries public Google DNS directly to bypass local resolver caching.',
        platformNotice: 'Compatible with all Windows systems.',
      },
    ],
    stepByStepSolution: [
      'Remove outdated MX records pointing to decommissioned mail servers.',
      'Never put an IP address into an MX record; replace it with a valid hostname.',
      'Insert the required provider MX records (e.g. aspmx.l.google.com with priority 1).',
      'Lower the TTL beforehand during migrations to speed up worldwide propagation.',
    ],
    knowledgeCheck: {
      question: 'If two MX records exist with priorities 10 and 20, which server will sending mail servers contact first?',
      options: [
        'The server with priority 20 because it has a higher number.',
        'The server with priority 10 because lower priority numbers indicate higher preference.',
        'Both servers at exactly the same time in parallel.',
        'The server that is geographically closer.',
      ],
      correctIndex: 1,
      explanation:
        'In SMTP and DNS MX specifications (RFC 5321), lower priority values represent higher preference. Servers will try preference 10 first; preference 20 is only used as a backup if preference 10 is unreachable.',
    },
  },
  {
    id: 'cname-configuration-issue',
    title: 'CNAME record creates a zone apex or loop conflict',
    category: 'Configuration',
    difficulty: 'Intermediate',
    problemDescription:
      'When attempting to set up a CNAME for "example.com" pointing to a cloud provider, the DNS control panel throws an error: "CNAME records cannot coexist with other records at the apex". Additionally, email and NS records stop functioning.',
    sampleDnsResponse: `; Error returned by DNS validation engine:
Zone apex "example.com" contains SOA and NS records.
RFC 1034 Section 3.6.2 violation: A CNAME record is not allowed at the zone apex because no other records may coexist with a CNAME on the same label.`,
    likelyExplanation:
      'Per RFC 1034, if a CNAME record exists for a name, no other records (including SOA and NS) are permitted for that name. Because the root domain (@) MUST contain SOA and NS, standard CNAME cannot be placed at the apex.',
    suggestedCommands: [
      {
        tool: 'dig',
        command: 'dig example.com ANY',
        description: 'Checks what records coexist at the root of the domain.',
      },
      {
        tool: 'nslookup',
        command: 'nslookup -type=CNAME example.com',
        description: 'Checks if a CNAME has been incorrectly published at the root.',
      },
    ],
    stepByStepSolution: [
      'Do not place a standard CNAME record at your root domain (example.com).',
      'Use CNAME records for subdomains (e.g. www.example.com, api.example.com).',
      'For root domains, either point directly to an IP using an A record, or use your DNS provider\'s "CNAME Flattening", "ALIAS", or "ANAME" virtual record feature.',
      'Ensure www.example.com has a CNAME pointing to the cloud provider, and redirect the root domain to www.',
    ],
    knowledgeCheck: {
      question: 'Why does DNS strictly forbid a standard CNAME record from being placed on the root/apex domain (e.g., example.com)?',
      options: [
        'Because CNAME records cannot handle HTTPS traffic.',
        'Because RFC 1034 prohibits any other record (like mandatory SOA and NS) from coexisting with a CNAME at the same node.',
        'Because CNAME records can only contain IP addresses.',
        'Because internet browsers do not support aliases.',
      ],
      correctIndex: 1,
      explanation:
        'RFC 1034 dictates that a CNAME record cannot coexist with any other record types at the same node. Because every DNS zone apex MUST have an SOA record and NS records, a standard CNAME cannot be placed there.',
    },
  },
  {
    id: 'nxdomain-troubleshooting',
    title: 'Domain returns NXDOMAIN (Non-Existent Domain)',
    category: 'Resolution Failure',
    difficulty: 'Beginner',
    problemDescription:
      'A user typed "www.mycoolprodct.com" and receives an immediate NXDOMAIN error. The site was registered earlier today.',
    sampleDnsResponse: `; <<>> DiG 9.18.1 <<>> www.mycoolprodct.com A
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 59124
;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 1, ADDITIONAL: 1

;; AUTHORITY SECTION:
com.    900    IN    SOA    a.gtld-servers.net. nstld.verisign-grs.com. 1709281200 1800 900 604800 86400`,
    likelyExplanation:
      'NXDOMAIN means the domain name does not exist in the DNS namespace. Notice the typo in the query ("prodct" missing an "u"), or the domain registration has not completed registration in the TLD registry.',
    suggestedCommands: [
      {
        tool: 'dig',
        command: 'dig mycoolprodct.com +trace',
        description: 'Performs iterative lookup from root servers downward to pinpoint where the domain disappears.',
      },
      {
        tool: 'nslookup',
        command: 'nslookup mycoolprodct.com 1.1.1.1',
        description: 'Queries Cloudflare public DNS to check if NXDOMAIN persists across global resolvers.',
      },
    ],
    stepByStepSolution: [
      'Check the spelling of the domain and subdomain carefully for typos.',
      'Perform a WHOIS query to verify if the domain is actively registered and not expired or on clientHold.',
      'Verify that authoritative nameservers are assigned and responding.',
      'If newly registered, allow time for TLD registry zone files to refresh.',
    ],
    knowledgeCheck: {
      question: 'What is the fundamental difference between an NXDOMAIN response and a NODATA response?',
      options: [
        'NXDOMAIN means the server is down; NODATA means the internet cable is unplugged.',
        'NXDOMAIN means the domain name itself does not exist; NODATA means the domain exists, but the requested record type does not.',
        'NXDOMAIN applies only to IPv6; NODATA applies only to IPv4.',
        'There is no difference; they are identical error codes.',
      ],
      correctIndex: 1,
      explanation:
        'NXDOMAIN (Non-Existent Domain) confirms that the domain label does not exist anywhere in the DNS tree. NODATA (NOERROR with 0 answers) confirms that the domain DOES exist, but lacks the specific record type being queried.',
    },
  },
  {
    id: 'dns-request-timeout',
    title: 'DNS Request Times Out (UDP 53 Blocked / Server Offline)',
    category: 'Resolution Failure',
    difficulty: 'Advanced',
    problemDescription:
      'Automated health checks report DNS timeouts. When running dig or nslookup, queries hang for 5 to 15 seconds before failing with "connection timed out; no servers could be reached".',
    sampleDnsResponse: `; <<>> DiG 9.18.1 <<>> @custom-dns.internal example.com
;; communications error to 198.51.100.53#53: timed out
;; communications error to 198.51.100.53#53: timed out
;; no servers could be reached`,
    likelyExplanation:
      'DNS queries primarily use UDP port 53. If a network firewall, security group, or ISP blocks UDP 53, or if the DNS server software crashed, packets are silently dropped, triggering a client timeout.',
    suggestedCommands: [
      {
        tool: 'dig',
        command: 'dig @8.8.8.8 example.com +time=3 +tries=2',
        description: 'Tests if queries reach public Google DNS within a strict 3-second timeout.',
      },
      {
        tool: 'nslookup',
        command: 'nslookup -timeout=3 example.com 8.8.8.8',
        description: 'Windows nslookup command with custom timeout specified.',
      },
    ],
    stepByStepSolution: [
      'Check if UDP port 53 and TCP port 53 are allowed through firewalls, cloud security groups, and routers.',
      'Check if the DNS server daemon (e.g. BIND9, Unbound, CoreDNS, PowerDNS) is actively running (`systemctl status bind9`).',
      'Test TCP resolution using `dig +tcp example.com` to see if only UDP is being blocked or rate-limited.',
      'Verify that network routing and packet filters are not dropping DNS packets.',
    ],
    knowledgeCheck: {
      question: 'Which transport layer protocol and port number do standard DNS queries utilize by default?',
      options: [
        'TCP port 80',
        'UDP port 53 (with TCP port 53 for responses exceeding 512/EDNS bytes or zone transfers)',
        'UDP port 443',
        'ICMP port 7',
      ],
      correctIndex: 1,
      explanation:
        'Standard DNS uses UDP port 53 for fast query/response cycles. TCP port 53 is used when response sizes exceed UDP buffer limits (EDNS0), during zone transfers (AXFR), or when DNS-over-TLS (DoT on port 853) is configured.',
    },
  },
  {
    id: 'txt-domain-verification',
    title: 'TXT Record used for Domain Verification (SPF / Google)',
    category: 'Configuration',
    difficulty: 'Beginner',
    problemDescription:
      'When adding a domain to Google Search Console or configuring SendGrid, the verification panel repeatedly displays "Verification failed: DNS record not found" even after adding a TXT record.',
    sampleDnsResponse: `; <<>> DiG 9.18.1 <<>> example.com TXT
;; ANSWER SECTION:
example.com.    3600    IN    TXT    "google-site-verification=abcdef123456"
example.com.    3600    IN    TXT    "v=spf1 include:_spf.google.com ~all"`,
    likelyExplanation:
      'Common pitfalls: 1) Some DNS control panels append the domain automatically. Entering "example.com" in the host field creates "example.com.example.com". 2) Quotes were accidentally typed inside the value box, resulting in escaped nested quotes. 3) Local DNS caching or TTL hasn\'t expired.',
    suggestedCommands: [
      {
        tool: 'dig',
        command: 'dig example.com TXT +short',
        description: 'Quickly dumps all TXT records to verify quotes and exact strings.',
      },
      {
        tool: 'nslookup',
        command: 'nslookup -type=TXT example.com',
        description: 'Standard Windows nslookup command to inspect text records.',
      },
    ],
    stepByStepSolution: [
      'In your DNS control panel, verify the "Name" or "Host" field. If verifying the root domain, use "@" rather than the full domain name.',
      'Check if your DNS provider automatically wraps values in quotation marks; do not add extra quotes manually.',
      'Check TTL: if TTL is set to 86400 (24 hours), changes may take hours to appear on external verification bots unless purged.',
    ],
    knowledgeCheck: {
      question: 'If you enter "example.com" into the Host/Name field of a DNS control panel that automatically appends the domain name, what record name will actually be created?',
      options: [
        'example.com',
        'example.com.example.com',
        '@.example.com',
        'root.example.com',
      ],
      correctIndex: 1,
      explanation:
        'Many DNS control panels automatically append the zone name. If you input "example.com" instead of "@" or leaving it blank, the resulting FQDN becomes "example.com.example.com", which causes verification lookups for the apex domain to fail.',
    },
  },
  {
    id: 'dns-records-recently-changed',
    title: 'Website DNS records recently changed (TTL Propagation Delay)',
    category: 'Configuration',
    difficulty: 'Beginner',
    problemDescription:
      'You migrated your website to a new server IP 2 hours ago. You can see the new site from your home phone, but your coworker at the office still sees the old server.',
    sampleDnsResponse: `; Querying Office Resolver (Cached, TTL remaining: 14200 seconds):
;; ANSWER SECTION:
example.com.    14200    IN    A    198.51.100.10  <-- Old Server IP

; Querying Authoritative Server directly (Fresh data):
;; ANSWER SECTION:
example.com.    300      IN    A    203.0.113.88   <-- New Server IP`,
    likelyExplanation:
      'DNS caching in action. Recursive resolvers cache DNS records for the duration specified by the TTL (Time-To-Live). The coworker\'s office resolver still holds the old record in cache because the old TTL had not expired when the query was made.',
    suggestedCommands: [
      {
        tool: 'dig',
        command: 'dig example.com A +noall +answer',
        description: 'Displays the remaining TTL countdown in seconds in the second column.',
      },
      {
        tool: 'nslookup',
        command: 'nslookup -debug example.com',
        description: 'Shows debug information including TTL values returned by the resolver.',
      },
    ],
    stepByStepSolution: [
      'Best practice before migration: Lower the TTL to 300 seconds (5 minutes) at least 24-48 hours BEFORE the scheduled migration.',
      'Perform the IP change when the old high TTL has fully expired from caches.',
      'To verify immediate updates, query the authoritative nameservers directly using `dig @ns1.example.com example.com A`.',
      'Flush your local workstation DNS cache (`ipconfig /flushdns` on Windows or `sudo dscacheutil -flushcache` on macOS).',
    ],
    knowledgeCheck: {
      question: 'What is the purpose of the TTL (Time To Live) field in a DNS record?',
      options: [
        'It specifies the expiration date of the domain registration.',
        'It tells caching resolvers how many seconds they are permitted to cache the record before asking again.',
        'It measures the round-trip ping time to the server.',
        'It limits how many users can visit the website simultaneously.',
      ],
      correctIndex: 1,
      explanation:
        'TTL (Time To Live) is a 32-bit unsigned integer specifying the number of seconds that a DNS record may be cached by recursive resolvers and client operating systems before they must re-query authoritative servers.',
    },
  },
];
