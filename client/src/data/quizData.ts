import { QuizQuestion } from '../types/dns';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'DNS Fundamentals',
    question: 'What is the primary role of the Domain Name System (DNS) on the internet?',
    options: [
      'Encrypting data packets transferred between browsers and servers.',
      'Translating human-friendly domain names into machine-routable IP addresses.',
      'Assigning MAC addresses to physical network interface cards.',
      'Storing website database tables on cloud storage.',
    ],
    correctIndex: 1,
    explanation:
      'DNS acts as the phonebook of the internet. It maps human-friendly hostnames (like example.com) to numeric IP addresses (like 93.184.216.34) required for TCP/IP routing.',
  },
  {
    id: 'q2',
    category: 'Resolution Architecture',
    question: 'What is the fundamental difference between a Recursive query and an Iterative query in DNS?',
    options: [
      'Recursive queries are encrypted with TLS; iterative queries are unencrypted.',
      'In a recursive query, the server is asked to find the complete final answer on behalf of the client; in an iterative query, the server either returns the answer or refers the client to another nameserver.',
      'Recursive queries only work for IPv4; iterative queries are required for IPv6.',
      'Recursive queries are used by web browsers; iterative queries are only used by search engines.',
    ],
    correctIndex: 1,
    explanation:
      'In recursive resolution (client to recursive resolver), the resolver promises to do the legwork until it has the final answer or an error. In iterative queries (resolver to root, TLD, and authoritative servers), each server responds with referrals down the tree if it does not hold the final answer.',
  },
  {
    id: 'q3',
    category: 'Caching & TTL',
    question: 'If a DNS A record has a TTL of 300 seconds, what does this tell a recursive DNS resolver?',
    options: [
      'The website will shut down after 5 minutes.',
      'The resolver must discard and re-query the record after 300 seconds before serving new requests.',
      'The DNS query will take 300 seconds to execute.',
      'The server can handle at most 300 simultaneous visitors.',
    ],
    correctIndex: 1,
    explanation:
      'TTL (Time To Live) is the expiration countdown in seconds. A TTL of 300 tells caching resolvers that they may safely answer subsequent client queries from memory for up to 5 minutes before asking authoritative servers again.',
  },
  {
    id: 'q4',
    category: 'Status Codes',
    question: 'What is the key technical difference between an NXDOMAIN response and a NODATA response?',
    options: [
      'NXDOMAIN means your computer has no internet; NODATA means your browser crashed.',
      'NXDOMAIN means the domain name itself does not exist in the DNS; NODATA means the domain exists, but has no records for the specific type requested.',
      'NXDOMAIN is an error returned by root servers; NODATA is returned by your Wi-Fi router.',
      'There is no difference; they are synonymous terms in RFC 1035.',
    ],
    correctIndex: 1,
    explanation:
      'NXDOMAIN (Non-Existent Domain / RCODE 3) confirms that the queried domain name does not exist anywhere in the zone. NODATA (NOERROR status with 0 answer records) means the domain is registered and valid, but has no records matching the requested type (e.g. asking for AAAA when only A is published).',
  },
  {
    id: 'q5',
    category: 'Record Types',
    question: 'Why does RFC 1034 prohibit placing a standard CNAME record on the root apex of a domain (e.g., example.com)?',
    options: [
      'Because CNAME records only work with HTTP port 80.',
      'Because a CNAME record cannot coexist with any other record type at the same node, yet every zone root MUST contain SOA and NS records.',
      'Because root domains must always resolve directly to an IPv6 address.',
      'Because CNAME records are deprecated in modern DNS.',
    ],
    correctIndex: 1,
    explanation:
      'RFC 1034 specifies that if a CNAME exists at a name, no other records of any type are permitted for that name. Since a domain apex must have an SOA record and NS records, placing a standard CNAME at the root violates DNS core standards.',
  },
  {
    id: 'q6',
    category: 'Record Types',
    question: 'When configuring MX (Mail Exchange) records with priorities 10 and 20, how will sending mail transfer agents prioritize them?',
    options: [
      'Priority 20 is favored because it is the higher number.',
      'Priority 10 is favored because in SMTP/DNS standards, lower numbers indicate higher preference.',
      'Traffic is split 50/50 randomly between the two servers.',
      'Sending mail servers only use priority 20 on weekends.',
    ],
    correctIndex: 1,
    explanation:
      'Per RFC 5321, lower MX priority values represent higher preference. Mail exchangers with priority 10 are contacted first; priority 20 is only used as a fallback if the primary server fails to respond.',
  },
  {
    id: 'q7',
    category: 'Authoritative vs Recursive',
    question: 'Which of the following describes an Authoritative DNS Name Server?',
    options: [
      'A server that caches external internet queries for nearby home users.',
      'The server holding the official, definitive DNS records published by the zone owner (the source of truth).',
      'The local proxy software running inside Google Chrome.',
      'A server that assigns DHCP IP addresses to laptops on a Wi-Fi network.',
    ],
    correctIndex: 1,
    explanation:
      'An authoritative nameserver is the official custodian of the DNS zone file. Unlike caching recursive resolvers, authoritative servers do not search the internet; they publish the actual configured records for domains delegated to them.',
  },
  {
    id: 'q8',
    category: 'Troubleshooting',
    question: 'You changed your server IP address, but clients still see your old website. Which of the following is the most likely cause?',
    options: [
      'The DNS registrar deleted your domain.',
      'Recursive resolvers worldwide are still caching the previous record until its original TTL expires.',
      'The website HTML file has a syntax error.',
      'IPv6 was permanently banned by ICANN.',
    ],
    correctIndex: 1,
    explanation:
      'DNS changes do not propagate instantly because caching resolvers respect the original TTL duration assigned to the old record. Until that timer counts down to zero, resolvers will serve the old IP address from cache.',
  },
  {
    id: 'q9',
    category: 'Security & Protocol',
    question: 'What is the role of a DNS CAA (Certificate Authority Authorization) record?',
    options: [
      'It encrypts DNS queries using quantum cryptography.',
      'It restricts which Certificate Authorities (CAs) are legally permitted to issue SSL/TLS certificates for the domain.',
      'It replaces the need for HTTPS on modern websites.',
      'It stores passwords for email accounts.',
    ],
    correctIndex: 1,
    explanation:
      'CAA records (RFC 8659) allow domain owners to declare which Certificate Authorities (e.g. Let\'s Encrypt, DigiCert) have permission to issue SSL/TLS certificates for their domain, protecting against fraudulent certificate issuance.',
  },
  {
    id: 'q10',
    category: 'Troubleshooting Tools',
    question: 'What command-line utility is built into all versions of Microsoft Windows to perform DNS queries directly without installing extra tools?',
    options: [
      'dig',
      'nslookup',
      'grep',
      'curl',
    ],
    correctIndex: 1,
    explanation:
      '`nslookup` is pre-installed on all Windows systems (as well as macOS and Linux). `dig` is standard on Linux/macOS, but on Windows usually requires installing BIND tools.',
  },
];
