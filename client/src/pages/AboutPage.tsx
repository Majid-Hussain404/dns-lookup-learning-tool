import React from 'react';
import {
  Shield,
  Server,
  Code2,
  AlertCircle,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            Portfolio & Educational Documentation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          About DNS Lookup Learning Tool
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          An interactive, full-stack educational networking application built to help computer science students, junior engineers, and IT professionals master the Domain Name System through hands-on lookups, visual simulations, and diagnostic labs.
        </p>
      </div>

      {/* Motivation & Problem Statement */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          The Problem: The Abstract Nature of DNS
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          DNS is often described as "the phonebook of the internet," yet most students and junior developers interact with it only when a website breaks or an SSL certificate fails to issue. Abstract concepts like recursive resolvers vs. iterative referrals, negative caching, and CNAME apex restrictions can be difficult to grasp through textbook diagrams alone.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>DNS Explorer</strong> was engineered to bridge this gap: providing real, live DNS queries directly from Node.js sockets while accompanying every result with accessible explanations, RFC standards, interactive animations, and diagnostic scenarios.
        </p>
      </section>

      {/* Architectural Overview */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          System Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Code2 className="w-5 h-5 text-sky-500" />
              Frontend Architecture (React + Vite + TypeScript)
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
              <li><strong>UI Framework:</strong> React 18 with TypeScript in strict mode for guaranteed type safety.</li>
              <li><strong>Styling:</strong> Tailwind CSS with custom responsive network palette and system-aware dark mode.</li>
              <li><strong>Visualization Engine:</strong> Step-by-step state machine with interactive play/pause timers and step navigation.</li>
              <li><strong>Zero Paid API Dependency:</strong> Communicates exclusively with our local Express backend.</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Server className="w-5 h-5 text-indigo-500" />
              Backend Architecture (Node.js + Express)
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
              <li><strong>DNS Engine:</strong> Native <code>node:dns/promises</code> module dispatching direct DNS lookups without third-party CLI wrappers.</li>
              <li><strong>Input Validation:</strong> Zod schemas enforcing RFC 1123 domain syntax and strictly rejecting illegal shell characters.</li>
              <li><strong>Rate Limiting:</strong> <code>express-rate-limit</code> protecting system sockets from abuse and spam.</li>
              <li><strong>Security Headers:</strong> Helmet middleware configuring Content Security Policies (CSP) and preventing clickjacking.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Security & Threat Modeling */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-lg">
          <Shield className="w-5 h-5 text-emerald-500" />
          Cybersecurity & Safe Design
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-slate-200 block">
              No Shell Command Execution
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              User domain inputs are never interpolated into shell commands (like <code>exec('dig ' + input)</code>), preventing command injection vulnerabilities.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-slate-200 block">
              Strict Schema Validation
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Input domains are normalized, lowercase-transformed, length-checked (max 253 characters), and validated with RFC regex.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-slate-200 block">
              Privacy-Conscious Logging
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Backend logs record only HTTP route paths and status codes, deliberately omitting query parameter domain names to respect user privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Honest Limitations */}
      <section className="p-6 rounded-3xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-3 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          Technical Transparency & Known Limitations
        </div>
        <ul className="list-disc list-inside space-y-1.5 text-amber-800 dark:text-amber-300">
          <li>
            <strong>OS Resolver Coupling:</strong> Node.js's <code>node:dns/promises</code> module queries the operating system's configured DNS resolver. It does not send raw UDP packets directly to root or authoritative nameservers. Therefore, measured latency and cached values reflect the local resolver environment.
          </li>
          <li>
            <strong>RFC 8482 ANY Query Restrictions:</strong> Modern global DNS providers restrict broad <code>ANY</code> queries. To provide an "ALL" view, our service dispatches concurrent individual queries for standard record types via <code>Promise.allSettled</code>.
          </li>
        </ul>
      </section>
    </div>
  );
};
