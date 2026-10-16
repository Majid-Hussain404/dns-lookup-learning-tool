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

export interface RecordGuideItem {
  type: SupportedRecordType;
  fullForm: string;
  simpleDefinition: string;
  purpose: string;
  example: string;
  typicalUseCase: string;
  whatReturnedValueMeans: string;
  commonTroubleshootingIssues: string[];
  interviewQuestion: {
    question: string;
    answer: string;
  };
}

export interface VisualizerStep {
  stepNumber: number;
  title: string;
  source: string;
  target: string;
  description: string;
  systemInvolved: string;
  whyNecessary: string;
  informationExchanged: string;
  packetType: 'query' | 'response' | 'cache' | 'connection';
  statusHighlight: string;
}

export interface TroubleshootingScenario {
  id: string;
  title: string;
  category: 'Configuration' | 'Missing Record' | 'Resolution Failure' | 'Protocol & RFC';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  problemDescription: string;
  sampleDnsResponse: string;
  likelyExplanation: string;
  suggestedCommands: {
    tool: 'dig' | 'nslookup';
    command: string;
    description: string;
    platformNotice?: string;
  }[];
  stepByStepSolution: string[];
  knowledgeCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
