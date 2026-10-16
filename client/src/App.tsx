import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import { DnsLookupPage } from './pages/DnsLookupPage';
import { RecordsGuidePage } from './pages/RecordsGuidePage';
import { VisualizerPage } from './pages/VisualizerPage';
import { TroubleshootingPage } from './pages/TroubleshootingPage';
import { QuizPage } from './pages/QuizPage';
import { AboutPage } from './pages/AboutPage';
import { fetchHealth } from './services/api';
import { SupportedRecordType } from './types/dns';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);

  // Cross-page navigation state
  const [lookupDomain, setLookupDomain] = useState<string>('example.com');
  const [lookupType, setLookupType] = useState<SupportedRecordType>('A');
  const [selectedGuideRecord, setSelectedGuideRecord] = useState<SupportedRecordType | undefined>(undefined);

  // Check backend health on mount and periodically
  useEffect(() => {
    let isMounted = true;

    const checkHealth = async () => {
      try {
        const res = await fetchHealth();
        if (isMounted) {
          setIsBackendHealthy(res.status === 'ok');
        }
      } catch {
        if (isMounted) {
          setIsBackendHealthy(false);
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // 30s heartbeat

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleInitiateLookup = (domain: string, type: SupportedRecordType) => {
    setLookupDomain(domain);
    setLookupType(type);
  };

  const handleSelectGuideRecord = (type: SupportedRecordType) => {
    setSelectedGuideRecord(type);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBackendHealthy={isBackendHealthy}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            onInitiateLookup={handleInitiateLookup}
          />
        )}

        {activeTab === 'lookup' && (
          <DnsLookupPage
            initialDomain={lookupDomain}
            initialType={lookupType}
            setActiveTab={setActiveTab}
            onSelectGuideRecord={handleSelectGuideRecord}
          />
        )}

        {activeTab === 'guide' && (
          <RecordsGuidePage
            setActiveTab={setActiveTab}
            onSelectLookupRecord={handleInitiateLookup}
            selectedRecordFromLookup={selectedGuideRecord}
          />
        )}

        {activeTab === 'visualizer' && <VisualizerPage />}

        {activeTab === 'troubleshooting' && <TroubleshootingPage />}

        {activeTab === 'quiz' && <QuizPage setActiveTab={setActiveTab} />}

        {activeTab === 'about' && <AboutPage />}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
