import React from 'react';
import { Globe, AlertCircle } from 'lucide-react';
import { ActiveTab } from './Navbar';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">
                <Globe className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                DNS Explorer
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              An open-source educational networking dashboard built to demystify DNS resolution, record analysis, and network troubleshooting for students and developers.
            </p>
          </div>

          {/* Quick Learning Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Learning Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => setActiveTab('lookup')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Live DNS Lookup Tool
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('guide')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  DNS Records Guide (A, MX, etc.)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('visualizer')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Step-by-Step Resolution Visualizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('troubleshooting')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Troubleshooting Lab & Scenarios
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Interactive Knowledge Quiz
                </button>
              </li>
            </ul>
          </div>

          {/* RFC & Standards Reference */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Key RFC Standards
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <li>RFC 1034 / 1035 — Domain Concepts</li>
              <li>RFC 2181 — DNS Clarifications</li>
              <li>RFC 2308 — Negative Caching (SOA)</li>
              <li>RFC 5321 — Mail Exchange (MX)</li>
              <li>RFC 7208 — Sender Policy Framework (SPF)</li>
              <li>RFC 8482 — Providing Minimal ANY Answers</li>
            </ul>
          </div>

          {/* Architecture & Stack */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 text-[11px] rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                React 18 + TS
              </span>
              <span className="px-2 py-0.5 text-[11px] rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Node.js dns/promises
              </span>
              <span className="px-2 py-0.5 text-[11px] rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Express + Zod
              </span>
              <span className="px-2 py-0.5 text-[11px] rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Tailwind CSS
              </span>
              <span className="px-2 py-0.5 text-[11px] rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Vitest
              </span>
            </div>
            <div className="pt-2 text-xs text-slate-500">
              Zero third-party paid APIs. Direct operating system socket resolution.
            </div>
          </div>
        </div>

        {/* Technical Notice Banner */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>Educational Note:</strong> Live queries utilize Node.js's built-in resolver, querying host OS configured resolvers. Results may reflect resolver caching rather than direct authoritative nameserver queries.
            </span>
          </div>
          <div className="shrink-0 text-slate-500">
            MIT License &bull; Built for Students & Engineers
          </div>
        </div>
      </div>
    </footer>
  );
};
