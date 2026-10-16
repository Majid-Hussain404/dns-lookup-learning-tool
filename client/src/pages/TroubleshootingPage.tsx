import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  XCircle,
  Terminal,
  AlertTriangle,
  Lightbulb,
  Check,
  Copy,
  Info,
} from 'lucide-react';
import { TROUBLESHOOTING_SCENARIOS } from '../data/troubleshootingScenarios';
import { TroubleshootingScenario } from '../types/dns';

export const TroubleshootingPage: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    TROUBLESHOOTING_SCENARIOS[0].id
  );
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const scenario: TroubleshootingScenario =
    TROUBLESHOOTING_SCENARIOS.find((s) => s.id === selectedScenarioId) ||
    TROUBLESHOOTING_SCENARIOS[0];

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(cmd);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [scenario.id]: optionIndex,
    }));
    setQuizSubmitted((prev) => ({
      ...prev,
      [scenario.id]: true,
    }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Interactive Network Diagnosis Lab
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          DNS Troubleshooting Learning Lab
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Master real-world diagnostic workflows for production DNS incidents. Review raw command line outputs, compare <code>dig</code> vs. Windows <code>nslookup</code>, and verify your deduction with knowledge checks.
        </p>
      </div>

      {/* Safety Notice on Command Execution */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
        <p>
          <strong>Security Notice:</strong> The terminal commands provided below are educational diagnostic instructions for you to run in your local PowerShell, Command Prompt, or terminal. For cybersecurity reasons, this web application never executes raw shell commands on behalf of clients.
        </p>
      </div>

      {/* Layout: Scenarios List (Left) + Detail Workspace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Scenario List Navigation */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
            Select Diagnostic Scenario ({TROUBLESHOOTING_SCENARIOS.length})
          </div>

          <div className="space-y-2">
            {TROUBLESHOOTING_SCENARIOS.map((item, index) => {
              const isSelected = item.id === selectedScenarioId;
              const hasAnswered = quizSubmitted[item.id];
              const isCorrect =
                hasAnswered && quizAnswers[item.id] === item.knowledgeCheck.correctIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedScenarioId(item.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-500 ring-2 ring-sky-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.difficulty === 'Beginner'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.difficulty === 'Intermediate'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {item.difficulty}
                    </span>

                    {hasAnswered && (
                      <span
                        className={`text-[10px] font-bold flex items-center gap-0.5 ${
                          isCorrect ? 'text-emerald-600' : 'text-rose-500'
                        }`}
                      >
                        {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {isCorrect ? 'Solved' : 'Review'}
                      </span>
                    )}
                  </div>

                  <div className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {index + 1}. {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {item.category}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Scenario Diagnostic Workspace */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header info */}
            <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                  {scenario.category}
                </span>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Difficulty: {scenario.difficulty}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {scenario.title}
              </h2>
            </div>

            {/* Problem Statement */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Incident Description
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                {scenario.problemDescription}
              </p>
            </div>

            {/* Sample DNS CLI Response */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-sky-500" />
                2. Captured Terminal / Resolver Output
              </h3>
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                {scenario.sampleDnsResponse}
              </pre>
            </div>

            {/* Likely Explanation */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                3. Root Cause Analysis
              </h3>
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                {scenario.likelyExplanation}
              </div>
            </div>

            {/* Diagnostic Commands (dig and nslookup) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-indigo-500" />
                4. Recommended Diagnostic Commands
              </h3>

              <div className="space-y-3">
                {scenario.suggestedCommands.map((cmd, idx) => {
                  const isCopied = copiedCommand === cmd.command;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                          {cmd.tool}
                        </span>
                        <button
                          onClick={() => handleCopyCommand(cmd.command)}
                          className="text-xs text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1 transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-500 text-[11px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Copy Command</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                        {cmd.command}
                      </div>

                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        {cmd.description}
                      </div>

                      {cmd.platformNotice && (
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                          💡 {cmd.platformNotice}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Solution */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                5. Step-by-Step Remediation Plan
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 dark:text-slate-300 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                {scenario.stepByStepSolution.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Interactive Knowledge-Check Question */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Knowledge Check: Diagnostic Verification
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 space-y-3">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {scenario.knowledgeCheck.question}
                </p>

                <div className="space-y-2">
                  {scenario.knowledgeCheck.options.map((option, optIdx) => {
                    const isSelected = quizAnswers[scenario.id] === optIdx;
                    const isSubmitted = quizSubmitted[scenario.id];
                    const isCorrect = optIdx === scenario.knowledgeCheck.correctIndex;

                    let btnStyle =
                      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-400';

                    if (isSubmitted) {
                      if (isCorrect) {
                        btnStyle =
                          'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-medium';
                      } else if (isSelected && !isCorrect) {
                        btnStyle =
                          'bg-rose-50 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswerSelect(optIdx)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs border flex items-center justify-between gap-3 transition-colors ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {isSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                        {isSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted[scenario.id] && (
                  <div className="pt-2 text-[11px] text-slate-600 dark:text-slate-400 border-t border-sky-100 dark:border-sky-900/60 leading-relaxed">
                    <strong>Explanation:</strong> {scenario.knowledgeCheck.explanation}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
