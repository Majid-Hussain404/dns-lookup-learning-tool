import React from 'react';
import {
  Search,
  BookOpen,
  GitBranch,
  Wrench,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
} from 'lucide-react';
import { ActiveTab } from '../components/Navbar';
import { DomainLookupForm } from '../components/DomainLookupForm';
import { SupportedRecordType } from '../types/dns';
import { GoogleGeminiEffectDemo } from '../components/GoogleGeminiEffectDemo';

interface DashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
  onInitiateLookup: (domain: string, type: SupportedRecordType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setActiveTab,
  onInitiateLookup,
}) => {
  const handleQuickSubmit = (domain: string, type: SupportedRecordType) => {
    onInitiateLookup(domain, type);
    setActiveTab('lookup');
  };

  const learningModules = [
    {
      tab: 'lookup' as ActiveTab,
      title: 'Live DNS Lookup Tool',
      desc: 'Query real DNS records (A, AAAA, MX, NS, TXT, CNAME, SOA, CAA) with real-time JSON exports.',
      icon: Search,
      color: 'from-blue-600 to-sky-600',
      badge: 'Interactive Tool',
    },
    {
      tab: 'visualizer' as ActiveTab,
      title: 'Resolution Visualizer',
      desc: 'Follow DNS packets step-by-step through Root, TLD, and Authoritative nameservers.',
      icon: GitBranch,
      color: 'from-indigo-600 to-purple-600',
      badge: 'Interactive Flow',
    },
    {
      tab: 'guide' as ActiveTab,
      title: 'DNS Records Guide',
      desc: 'In-depth reference for every DNS record type, with RFC definitions, syntax, and interview Q&As.',
      icon: BookOpen,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Knowledge Base',
    },
    {
      tab: 'troubleshooting' as ActiveTab,
      title: 'Troubleshooting Lab',
      desc: 'Solve 8 real-world networking scenarios: CNAME loops, NXDOMAIN errors, and MX misconfigurations.',
      icon: Wrench,
      color: 'from-amber-600 to-orange-600',
      badge: 'Hands-on Labs',
    },
    {
      tab: 'quiz' as ActiveTab,
      title: 'Knowledge Check Quiz',
      desc: 'Test your understanding of caching, TTLs, recursion, and status codes with instant feedback.',
      icon: HelpCircle,
      color: 'from-pink-600 to-rose-600',
      badge: 'Assessment',
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Google Gemini Scroll Effect Hero */}
      <section className="relative">
        <GoogleGeminiEffectDemo onExploreClick={() => setActiveTab('lookup')} />
      </section>

      {/* Quick Lookup Form Widget */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Try a Live DNS Lookup Now
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dispatched through Node.js resolver to test real domains on the web
            </p>
          </div>
        </div>

        <DomainLookupForm
          isLoading={false}
          onLookup={handleQuickSubmit}
          initialDomain="example.com"
        />
      </section>

      {/* Core Educational Modules Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Explore Learning Modules
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Structured modules designed for computer science students and networking learners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.tab}
                onClick={() => setActiveTab(mod.tab)}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${mod.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
                  <span>Start Module</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Networking Concepts at a Glance */}
      <section className="bg-slate-100 dark:bg-slate-900/60 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          DNS Fundamentals in 60 Seconds
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-200 text-sm">
              <Layers className="w-4 h-4 text-sky-500" />
              Hierarchical Architecture
            </div>
            <p className="leading-relaxed">
              No single computer stores every domain. DNS is divided into hierarchical zones: the <strong>Root (.)</strong>, <strong>Top-Level Domains (.com, .org)</strong>, and <strong>Authoritative Servers</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-200 text-sm">
              <Zap className="w-4 h-4 text-amber-500" />
              Caching & Time-To-Live (TTL)
            </div>
            <p className="leading-relaxed">
              To prevent global bottlenecks, answers are cached in browsers, operating systems, and recursive resolvers. The TTL dictates how long an answer may be served before checking again.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-200 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Security & Validation
            </div>
            <p className="leading-relaxed">
              From SPF/DKIM text records protecting email spoofing to CAA records restricting SSL certificate issuance, DNS plays a mission-critical role in modern cybersecurity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
