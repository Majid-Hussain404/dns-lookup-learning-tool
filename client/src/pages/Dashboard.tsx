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
  Sparkles,
} from 'lucide-react';
import { ActiveTab } from '../components/Navbar';
import { DomainLookupForm } from '../components/DomainLookupForm';
import { SupportedRecordType } from '../types/dns';
import { ThreeDMarqueeDemo } from '../components/ThreeDMarqueeDemo';

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
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-900 via-slate-900 to-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.15),transparent_50%)]"></div>
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Networking Education</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Demystifying the{' '}
            <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              Domain Name System
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            The internet speaks in numbers, but humans speak in names. DNS is the global distributed directory that translates human-friendly domains into machine-routable IP addresses.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setActiveTab('lookup')}
              className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/30 transition-all hover:scale-105 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Launch Live Lookup</span>
            </button>
            <button
              onClick={() => setActiveTab('visualizer')}
              className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm flex items-center gap-2 border border-slate-700 transition-all hover:scale-105 cursor-pointer"
            >
              <GitBranch className="w-4 h-4 text-sky-400" />
              <span>Watch Resolution Flow</span>
            </button>
          </div>
        </div>
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

      {/* Interactive 3D Showcase Section */}
      <section className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modern 3D Interface</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Interactive 3D Visual Experience
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            Hardware-accelerated perspective marquee bringing dynamic motion to networking education.
          </p>
        </div>

        <ThreeDMarqueeDemo />
      </section>
    </div>
  );
};
