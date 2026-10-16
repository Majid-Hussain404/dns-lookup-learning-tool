import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { RECORDS_GUIDE_DATA } from '../data/recordsGuideData';
import { SupportedRecordType } from '../types/dns';
import { ActiveTab } from '../components/Navbar';

interface RecordsGuidePageProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectLookupRecord: (domain: string, type: SupportedRecordType) => void;
  selectedRecordFromLookup?: SupportedRecordType;
}

export const RecordsGuidePage: React.FC<RecordsGuidePageProps> = ({
  setActiveTab,
  onSelectLookupRecord,
  selectedRecordFromLookup,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const toggleQuestion = (recordType: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [recordType]: !prev[recordType],
    }));
  };

  const handleTestInLookup = (type: SupportedRecordType) => {
    onSelectLookupRecord('example.com', type);
    setActiveTab('lookup');
  };

  const filteredRecords = RECORDS_GUIDE_DATA.filter((item) => {
    const matchesSearch =
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullForm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.simpleDefinition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      activeFilter === 'ALL' || item.type.toUpperCase() === activeFilter.toUpperCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            RFC Specifications & Standards
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          DNS Records Learning Guide
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Comprehensive reference for the fundamental DNS resource records powering the internet. Each card details syntax, RFC compliance, real-world troubleshooting pitfalls, and interview questions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search record types, use cases, or definitions..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA', 'CAA'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeFilter === type
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Record Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecords.map((item) => {
          const isQuestionOpen = expandedQuestions[item.type] || false;
          const isHighlighted = selectedRecordFromLookup === item.type;

          return (
            <div
              key={item.type}
              id={`record-guide-${item.type}`}
              className={`bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-sm flex flex-col justify-between transition-all ${
                isHighlighted
                  ? 'border-sky-500 ring-2 ring-sky-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Type and Full Form */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-base font-mono font-extrabold bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                        {item.type}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {item.fullForm}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTestInLookup(item.type)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-sky-950/60 text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-300 text-xs font-medium flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
                    title={`Test live ${item.type} lookup on example.com`}
                  >
                    <span>Test Lookup</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Definition & Purpose */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {item.simpleDefinition}
                  </p>
                  <p className="leading-relaxed">
                    <strong>Purpose:</strong> {item.purpose}
                  </p>
                </div>

                {/* Illustrative Example */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">
                    Illustrative RFC Example
                  </span>
                  <div className="font-mono text-xs text-sky-700 dark:text-sky-300 font-semibold break-all">
                    {item.example}
                  </div>
                  <div className="text-[10px] text-slate-500 italic">
                    Uses official documentation prefixes (RFC 5737 / RFC 3849)
                  </div>
                </div>

                {/* What the returned value means */}
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    Returned Value Interpretation:
                  </span>
                  <p className="leading-relaxed">{item.whatReturnedValueMeans}</p>
                </div>

                {/* Common Troubleshooting Issues */}
                <div className="text-xs space-y-1.5">
                  <span className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    Common Troubleshooting Pitfalls:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    {item.commonTroubleshootingIssues.map((issue, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Collapsible Interview Question Box */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => toggleQuestion(item.type)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 hover:bg-sky-100/60 dark:hover:bg-sky-900/40 border border-sky-100 dark:border-sky-900/50 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span className="text-xs font-bold text-sky-900 dark:text-sky-200">
                      Technical Interview Q&A
                    </span>
                  </div>
                  {isQuestionOpen ? (
                    <ChevronUp className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  )}
                </button>

                {isQuestionOpen && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2 animate-in fade-in duration-200">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      Q: {item.interviewQuestion.question}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong>A:</strong> {item.interviewQuestion.answer}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
