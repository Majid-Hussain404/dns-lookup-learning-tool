import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Server,
  Laptop,
  Database,
  Globe,
  Radio,
  Clock,
  Layers,
  Info,
} from 'lucide-react';
import { VISUALIZER_SCENARIOS } from '../data/visualizerSteps';
import { VisualizerStep } from '../types/dns';

export const VisualizerPage: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<'cache-miss' | 'cache-hit'>('cache-miss');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(3000); // 3 seconds per step

  const scenario = VISUALIZER_SCENARIOS[activeScenarioId];
  const totalSteps = scenario.steps.length;
  const currentStep: VisualizerStep = scenario.steps[currentStepIndex];

  // Auto-advance when playing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStepIndex < totalSteps - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, totalSteps, playbackSpeed]);

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleScenarioChange = (id: 'cache-miss' | 'cache-hit') => {
    setIsPlaying(false);
    setActiveScenarioId(id);
    setCurrentStepIndex(0);
  };

  // Node visualization helper
  const nodes = [
    {
      id: 'client',
      label: 'Client Device',
      sub: 'Browser & Stub Resolver',
      icon: Laptop,
      color: 'sky',
    },
    {
      id: 'os-cache',
      label: 'Local Cache',
      sub: 'OS & Hosts file',
      icon: Database,
      color: 'amber',
    },
    {
      id: 'recursive-resolver',
      label: 'Recursive Resolver',
      sub: 'ISP / 8.8.8.8 / 1.1.1.1',
      icon: Server,
      color: 'indigo',
    },
    {
      id: 'root-server',
      label: 'Root Name Server',
      sub: 'Root (.) Zone',
      icon: Globe,
      color: 'purple',
    },
    {
      id: 'tld-server',
      label: 'TLD Name Server',
      sub: '.com Registry',
      icon: Layers,
      color: 'blue',
    },
    {
      id: 'authoritative-server',
      label: 'Authoritative Server',
      sub: 'ns1.example.com',
      icon: Radio,
      color: 'emerald',
    },
    {
      id: 'web-server',
      label: 'Web Server',
      sub: '93.184.216.34:443',
      icon: Globe,
      color: 'teal',
    },
  ];

  // Determine active node and target node based on current step
  const isActiveNode = (nodeId: string) => {
    if (nodeId === 'client' && (currentStep.source === 'user' || currentStep.target === 'os-cache')) return true;
    if (nodeId === currentStep.source || nodeId === currentStep.target) return true;
    return false;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Interactive DNS Protocol Simulation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          DNS Resolution Visualizer
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Step through the journey of a DNS query. Observe the difference between a full iterative cache miss and an instant local cache hit.
        </p>
      </div>

      {/* Mandatory Technical Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-start gap-3 text-xs leading-relaxed">
        <Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-sm">
            Conceptual Educational Model Notice:
          </p>
          <p>
            This visualization illustrates the conceptual stages of DNS resolution. External recursive resolvers (like your ISP or public DNS) perform iterative lookups across root, TLD, and authoritative servers autonomously in the background without exposing their internal queries directly to client web browsers. Local caching, DNS-over-HTTPS (DoH), and pre-fetching will alter query paths.
          </p>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleScenarioChange('cache-miss')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeScenarioId === 'cache-miss'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Scenario A: Cache Miss (Full Referral)
          </button>
          <button
            onClick={() => handleScenarioChange('cache-hit')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeScenarioId === 'cache-hit'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Scenario B: Cache Hit (Instant)
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Clock className="w-4 h-4" />
          <span>Animation Speed:</span>
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none"
          >
            <option value={4000}>Slow (4s)</option>
            <option value={2500}>Normal (2.5s)</option>
            <option value={1200}>Fast (1.2s)</option>
          </select>
        </div>
      </div>

      {/* Main Visualizer Interactive Canvas */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8">
        {/* Step Progress Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Active Stage
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {currentStep.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
          </div>
        </div>

        {/* Node Architecture Map */}
        <div className="relative py-8 px-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-x-auto">
          <div className="min-w-[650px] flex items-center justify-between gap-4 relative">
            {/* Connecting baseline line */}
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-0"></div>

            {/* Individual Nodes */}
            {nodes
              .filter((node) => {
                // If cache-hit, hide root, TLD, authoritative since they are not involved
                if (activeScenarioId === 'cache-hit') {
                  return ['client', 'os-cache', 'web-server'].includes(node.id);
                }
                return true;
              })
              .map((node) => {
                const Icon = node.icon;
                const active = isActiveNode(node.id);
                return (
                  <div
                    key={node.id}
                    className="relative z-10 flex flex-col items-center text-center space-y-2 group transition-all"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        active
                          ? 'bg-sky-600 text-white shadow-xl shadow-sky-500/40 scale-110 ring-4 ring-sky-400/30'
                          : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shadow-sm'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="space-y-0.5">
                      <div
                        className={`text-xs font-bold transition-colors ${
                          active
                            ? 'text-sky-600 dark:text-sky-400 font-extrabold'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {node.label}
                      </div>
                      <div className="text-[10px] text-slate-400 max-w-[90px] truncate">
                        {node.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Step Breakdown Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Action & Description
              </span>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {currentStep.description}
            </p>
            <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-slate-200 block">
                System Involved:
              </span>
              <p>{currentStep.systemInvolved}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Why This Step Is Necessary
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentStep.whyNecessary}
            </p>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Payload / Information Exchanged:
              </span>
              <p className="text-slate-800 dark:text-slate-200 break-words">
                {currentStep.informationExchanged}
              </p>
            </div>
          </div>
        </div>

        {/* Playback Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 transition-all cursor-pointer"
              title="Previous Step"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs flex items-center gap-2 shadow-md shadow-sky-600/20 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Play Animation</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepIndex === totalSteps - 1}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 transition-all cursor-pointer"
              title="Next Step"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
              title="Reset Animation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick step jump buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
            {scenario.steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                }}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                  currentStepIndex === idx
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
