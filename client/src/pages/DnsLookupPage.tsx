import React, { useState, useEffect } from 'react';
import { DomainLookupForm } from '../components/DomainLookupForm';
import { ResultsTable } from '../components/ResultsTable';
import { LearningPanel } from '../components/LearningPanel';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { fetchDnsLookup, ApiError } from '../services/api';
import { DnsLookupResponse, SupportedRecordType } from '../types/dns';
import { ActiveTab } from '../components/Navbar';
import { AlertCircle, History } from 'lucide-react';

interface DnsLookupPageProps {
  initialDomain?: string;
  initialType?: SupportedRecordType;
  setActiveTab: (tab: ActiveTab) => void;
  onSelectGuideRecord?: (type: SupportedRecordType) => void;
}

export const DnsLookupPage: React.FC<DnsLookupPageProps> = ({
  initialDomain = 'example.com',
  initialType = 'A',
  setActiveTab,
  onSelectGuideRecord,
}) => {
  const [currentDomain, setCurrentDomain] = useState(initialDomain);
  const [currentType, setCurrentType] = useState<SupportedRecordType>(initialType);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DnsLookupResponse | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [recentQueries, setRecentQueries] = useState<{ domain: string; type: SupportedRecordType }[]>(
    () => {
      const saved = localStorage.getItem('dns_recent_queries');
      return saved ? JSON.parse(saved) : [];
    }
  );

  const performLookup = async (domain: string, type: SupportedRecordType) => {
    setIsLoading(true);
    setGeneralError(null);
    setCurrentDomain(domain);
    setCurrentType(type);

    try {
      const response = await fetchDnsLookup(domain, type);
      setResult(response);

      // Save to recent queries history
      setRecentQueries((prev) => {
        const filtered = prev.filter(
          (q) => !(q.domain.toLowerCase() === domain.toLowerCase() && q.type === type)
        );
        const updated = [{ domain, type }, ...filtered].slice(0, 5);
        localStorage.setItem('dns_recent_queries', JSON.stringify(updated));
        return updated;
      });
    } catch (err: unknown) {
      if (err instanceof ApiError && err.response) {
        setResult(err.response);
      } else {
        const errorMsg =
          err instanceof Error
            ? err.message
            : 'An unexpected network error occurred while performing DNS query.';
        setGeneralError(errorMsg);
        setResult(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial lookup on mount if domain is provided
  useEffect(() => {
    if (initialDomain && !result && !isLoading) {
      performLookup(initialDomain, initialType);
    }
  }, []);

  const handleOpenGuide = (type: SupportedRecordType) => {
    if (onSelectGuideRecord) {
      onSelectGuideRecord(type);
    }
    setActiveTab('guide');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          DNS Record Lookup & Analysis
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Perform live DNS queries using Node.js socket resolver. Analyze returned record values, TTLs, and RFC formatting.
        </p>
      </div>

      {/* Lookup Form */}
      <DomainLookupForm
        onLookup={performLookup}
        isLoading={isLoading}
        initialDomain={currentDomain}
        initialType={currentType}
      />

      {/* Recent Queries Bar */}
      {recentQueries.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 font-medium text-slate-400">
            <History className="w-3.5 h-3.5" />
            Recent Lookups:
          </span>
          {recentQueries.map((item, idx) => (
            <button
              key={`${item.domain}-${item.type}-${idx}`}
              onClick={() => performLookup(item.domain, item.type)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 dark:hover:text-sky-300 font-mono text-[11px] border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {item.domain}{' '}
              <span className="font-bold text-sky-600 dark:text-sky-400">({item.type})</span>
            </button>
          ))}
        </div>
      )}

      {/* General Connection Error Alert */}
      {generalError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Backend Service Connection Failure</h4>
            <p className="text-xs leading-relaxed">{generalError}</p>
            <div className="pt-2 text-[11px] font-mono text-rose-700 dark:text-rose-400">
              Ensure you started the backend server with <code>npm run dev</code> or <code>npm run dev:server</code>.
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && <SkeletonLoader />}

      {/* Results & Educational Breakdown Grid */}
      {!isLoading && result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results Table (2 Columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <ResultsTable
              data={result}
              onRunAnother={() => {
                const input = document.getElementById('domain-input');
                if (input) {
                  input.focus();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
          </div>

          {/* Educational Learning Panel (1 Column on large screens) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <LearningPanel
                recordType={result.recordType}
                recordCount={result.records.length}
                onOpenGuide={handleOpenGuide}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
