import React, { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  AlertTriangle,
  Clock,
  Layers,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { DnsLookupResponse, DnsRecordItem } from '../types/dns';

interface ResultsTableProps {
  data: DnsLookupResponse;
  onRunAnother: () => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ data, onRunAnother }) => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(text);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const handleCopyAllJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dns-${data.domain}-${data.recordType}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = () => {
    switch (data.status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            SUCCESS (NOERROR)
          </span>
        );
      case 'NODATA':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            NODATA (Zero Records)
          </span>
        );
      case 'NXDOMAIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            NXDOMAIN (Non-Existent)
          </span>
        );
      case 'TIMEOUT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-800">
            <Clock className="w-3.5 h-3.5" />
            TIMEOUT (Query Exceeded Limit)
          </span>
        );
      case 'SERVFAIL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            SERVFAIL (Server Failure)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            {data.status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Queried Domain
              </span>
              {getStatusBadge()}
            </div>
            <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {data.domain}
            </h2>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyAllJson}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied JSON</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>

            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export File</span>
            </button>

            <button
              onClick={onRunAnother}
              className="px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900 text-xs font-medium border border-sky-200 dark:border-sky-800 flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>New Query</span>
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Record Type</div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white">
              {data.recordType}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Records Found</div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {data.records?.length || 0}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              App Duration
              <span
                title={data.durationNotice}
                className="cursor-help text-slate-400 hover:text-slate-600"
              >
                <HelpCircle className="w-3 h-3" />
              </span>
            </div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white">
              {data.durationMs} ms
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">DNS Resolver</div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate" title={data.resolverNotice}>
              OS / Local Stack
            </div>
          </div>
        </div>

        {/* Educational Notices on Duration & Local Resolver */}
        {(data.durationNotice || data.resolverNotice) && (
          <div className="mt-4 p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 text-xs text-sky-800 dark:text-sky-300 flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              {data.durationNotice && (
                <p>
                  <strong>Measurement Note:</strong> {data.durationNotice}
                </p>
              )}
              {data.resolverNotice && (
                <p className="text-[11px] text-sky-700/80 dark:text-sky-300/80">
                  {data.resolverNotice}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Results Table or State Explanations */}
      {data.records && data.records.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Resolved DNS Resource Records
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              RFC standard format
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-3">Host / Name</th>
                  <th scope="col" className="px-4 py-3">Type</th>
                  <th scope="col" className="px-6 py-3">Value / Target</th>
                  <th scope="col" className="px-4 py-3">TTL</th>
                  <th scope="col" className="px-4 py-3">Priority</th>
                  <th scope="col" className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-xs">
                {data.records.map((rec: DnsRecordItem, idx: number) => {
                  const valString = typeof rec.value === 'object' ? JSON.stringify(rec.value) : String(rec.value ?? '');
                  const isCopied = copiedValue === valString;
                  return (
                    <tr
                      key={`${rec.name}-${rec.type}-${valString}-${idx}`}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-3 text-slate-700 dark:text-slate-300 font-medium">
                        {String(rec.name ?? '')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {rec.type}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-900 dark:text-slate-100 max-w-md break-all">
                        {valString}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                        {rec.ttl !== undefined ? `${rec.ttl}s` : <span className="text-slate-400 italic">N/A</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                        {rec.priority !== undefined ? (
                          <span className="font-semibold text-sky-600 dark:text-sky-400">
                            {rec.priority}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleCopy(rec.value)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          title="Copy record value"
                        >
                          {isCopied ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty / Error Educational Explanations */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {data.status === 'NXDOMAIN'
                  ? 'Domain Does Not Exist (NXDOMAIN)'
                  : data.status === 'NODATA'
                  ? `No ${data.recordType} Records Found (NODATA)`
                  : data.status === 'TIMEOUT'
                  ? 'DNS Query Timed Out'
                  : data.status === 'SERVFAIL'
                  ? 'Nameserver Failure (SERVFAIL)'
                  : data.status === 'REFUSED'
                  ? 'Query Refused by Server (REFUSED)'
                  : data.status === 'ERROR'
                  ? 'DNS Resolution Error'
                  : 'Resolution Notice'}
              </h3>
              {data.message && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {data.message}
                </p>
              )}
            </div>

            {/* Diagnostic advice box */}
            <div className="text-left bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-sky-500" />
                Diagnostic interpretation:
              </div>
              {data.status === 'NXDOMAIN' && (
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                  <li>The domain label is not registered or was deleted from the TLD registry.</li>
                  <li>Check for spelling errors or accidental prefixes (e.g., misspelled TLD).</li>
                  <li>If recently registered, allow time for TLD nameservers to reload their zone files.</li>
                </ul>
              )}
              {data.status === 'NODATA' && (
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                  <li>The domain exists and responds authoritatively, but has no record of type <strong>{data.recordType}</strong>.</li>
                  <li>Try selecting <strong>'ALL'</strong> or another type such as <strong>'A'</strong> or <strong>'NS'</strong>.</li>
                  <li>Many domains only publish A or CNAME records and do not configure MX or CAA.</li>
                </ul>
              )}
              {data.status === 'TIMEOUT' && (
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                  <li>The configured DNS resolver or upstream nameserver took longer than {data.durationMs}ms to respond.</li>
                  <li>Verify internet connectivity and confirm UDP port 53 is not blocked by local firewalls.</li>
                </ul>
              )}
              {data.status === 'SERVFAIL' && (
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                  <li>The authoritative or recursive nameserver encountered an internal failure while processing this query.</li>
                  <li>Common causes include DNSSEC signature validation failure, lame delegation, or zone transfer restrictions.</li>
                  <li>Try querying alternative recursive resolvers (e.g., 1.1.1.1, 8.8.8.8) to see if validation fails globally.</li>
                </ul>
              )}
              {data.status === 'REFUSED' && (
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                  <li>The DNS server explicitly refused to answer this query due to policy, rate limiting, or zone security restrictions.</li>
                  <li>Recursive queries may be disabled on this nameserver for public internet clients.</li>
                </ul>
              )}
              {data.status === 'ERROR' && (
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                  <li>An error occurred while dispatching the DNS query through the local host socket resolver.</li>
                  <li>Verify that your network connection is active and host DNS settings are reachable.</li>
                  <li>Ensure the backend service is running and healthy on port 5001.</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
