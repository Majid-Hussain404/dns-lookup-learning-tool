import React, { useState } from 'react';
import { Search, Loader2, Sparkles, X, HelpCircle } from 'lucide-react';
import { SupportedRecordType } from '../types/dns';

interface DomainLookupFormProps {
  onLookup: (domain: string, type: SupportedRecordType) => void;
  isLoading: boolean;
  initialDomain?: string;
  initialType?: SupportedRecordType;
}

const RECORD_TYPES: { type: SupportedRecordType; label: string; desc: string }[] = [
  { type: 'A', label: 'A', desc: 'IPv4 Address' },
  { type: 'AAAA', label: 'AAAA', desc: 'IPv6 Address' },
  { type: 'MX', label: 'MX', desc: 'Mail Exchangers' },
  { type: 'NS', label: 'NS', desc: 'Name Servers' },
  { type: 'TXT', label: 'TXT', desc: 'Text & SPF' },
  { type: 'CNAME', label: 'CNAME', desc: 'Canonical Alias' },
  { type: 'SOA', label: 'SOA', desc: 'Start of Authority' },
  { type: 'CAA', label: 'CAA', desc: 'CA Authorization' },
  { type: 'ALL', label: 'ALL', desc: 'Query All Types' },
];

const POPULAR_DOMAINS = [
  'example.com',
  'google.com',
  'wikipedia.org',
  'cloudflare.com',
  'github.com',
];

export const DomainLookupForm: React.FC<DomainLookupFormProps> = ({
  onLookup,
  isLoading,
  initialDomain = '',
  initialType = 'A',
}) => {
  const [domain, setDomain] = useState(initialDomain);
  const [selectedType, setSelectedType] = useState<SupportedRecordType>(initialType);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = domain.trim();

    if (!cleanDomain) {
      setValidationError('Please enter a domain name to lookup (e.g., example.com)');
      return;
    }

    setValidationError(null);
    onLookup(cleanDomain, selectedType);
  };

  const handleChipClick = (presetDomain: string) => {
    setDomain(presetDomain);
    setValidationError(null);
    onLookup(presetDomain, selectedType);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Domain Input Field */}
        <div>
          <label
            htmlFor="domain-input"
            className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2"
          >
            Target Domain Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="domain-input"
              type="text"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="e.g. example.com, google.com, or sub.domain.org"
              disabled={isLoading}
              className={`w-full pl-11 pr-10 py-3 rounded-xl border text-base font-mono bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                validationError
                  ? 'border-rose-400 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-sky-500/20 focus:border-sky-500'
              }`}
            />
            {domain && (
              <button
                type="button"
                onClick={() => setDomain('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear domain input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {validationError && (
            <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
              {validationError}
            </p>
          )}
        </div>

        {/* Record Type Selector Pills */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              DNS Record Type
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              Choose 'ALL' to query every type concurrently
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
            {RECORD_TYPES.map(({ type, label, desc }) => {
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  disabled={isLoading}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-600/30 font-semibold scale-[1.02]'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold text-sm tracking-wide">{label}</span>
                  <span
                    className={`text-[9px] truncate max-w-full px-1 ${
                      isSelected ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Suggestion Chips & Submit Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Try:
            </span>
            {POPULAR_DOMAINS.map((popDomain) => (
              <button
                key={popDomain}
                type="button"
                onClick={() => handleChipClick(popDomain)}
                disabled={isLoading}
                className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 dark:hover:text-sky-300 border border-slate-200 dark:border-slate-700 transition-colors font-mono text-[11px]"
              >
                {popDomain}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Resolving DNS...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Resolve Record</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
