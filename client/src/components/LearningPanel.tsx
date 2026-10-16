import React from 'react';
import { BookOpen, CheckCircle, AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { SupportedRecordType } from '../types/dns';
import { RECORDS_GUIDE_DATA } from '../data/recordsGuideData';

interface LearningPanelProps {
  recordType: SupportedRecordType;
  recordCount: number;
  onOpenGuide: (type: SupportedRecordType) => void;
}

export const LearningPanel: React.FC<LearningPanelProps> = ({
  recordType,
  recordCount,
  onOpenGuide,
}) => {
  const guideItem = RECORDS_GUIDE_DATA.find((r) => r.type === recordType);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Educational Record Breakdown
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
          {recordType} Record
        </span>
      </div>

      {recordType === 'ALL' ? (
        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-400">
          <p className="leading-relaxed">
            <strong>Why concurrent individual queries?</strong> In classic DNS, an <code>ANY</code> query was used to request all available records. However, modern nameservers (like Cloudflare, Google, Akamai) decline or restrict broad ANY queries (per RFC 8482) because attackers historically abused them to launch massive DNS Amplification DDoS attacks.
          </p>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 space-y-1">
            <span className="font-semibold block">Under the Hood:</span>
            Our application dispatches simultaneous individual queries for A, AAAA, MX, NS, TXT, CNAME, SOA, and CAA via <code>Promise.allSettled</code>, reproducing an RFC 8482 safe scan.
          </div>
        </div>
      ) : guideItem ? (
        <div className="space-y-5 text-xs text-slate-600 dark:text-slate-400">
          {/* Simple Definition */}
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-200 block text-sm mb-1">
              {guideItem.fullForm}
            </span>
            <p className="leading-relaxed">{guideItem.simpleDefinition}</p>
          </div>

          {/* Result Interpretation */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Result Interpretation:
            </div>
            <p className="leading-relaxed">
              {recordCount > 0
                ? `Discovered ${recordCount} record(s). ${guideItem.whatReturnedValueMeans}`
                : `Zero ${recordType} records returned. This domain does not publish this specific record type. Remember that domains are only required to publish records for services they offer.`}
            </p>
          </div>

          {/* What to check next */}
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-200 block mb-1.5 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              What to check next:
            </span>
            <ul className="list-disc list-inside space-y-1">
              <li>Check the NS records to verify which authoritative servers host this domain.</li>
              <li>Inspect SOA record to review the zone's serial number and refresh timers.</li>
              <li>Check TTL values: lower TTLs (300s) indicate active migrations or dynamic DNS.</li>
            </ul>
          </div>

          {/* Common Misconception */}
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 space-y-1">
            <span className="font-semibold flex items-center gap-1 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5" />
              Common Misconception:
            </span>
            <p className="text-[11px] leading-relaxed">
              {guideItem.commonTroubleshootingIssues[0]}
            </p>
          </div>

          {/* Link to Full Guide */}
          <button
            onClick={() => onOpenGuide(recordType)}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-sky-950/60 text-slate-700 hover:text-sky-700 dark:text-slate-300 dark:hover:text-sky-300 font-medium flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <span>Read full {recordType} guide & interview Q&A</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}
    </div>
  );
};
