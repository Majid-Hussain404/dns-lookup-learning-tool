import React, { useState } from 'react';
import {
  Globe,
  Search,
  BookOpen,
  GitBranch,
  Wrench,
  HelpCircle,
  Info,
  Sun,
  Moon,
  Menu,
  X,
  Radio,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type ActiveTab =
  | 'dashboard'
  | 'lookup'
  | 'guide'
  | 'visualizer'
  | 'troubleshooting'
  | 'quiz'
  | 'about';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isBackendHealthy: boolean | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isBackendHealthy,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Globe },
    { id: 'lookup', label: 'DNS Lookup', icon: Search },
    { id: 'guide', label: 'Records Guide', icon: BookOpen },
    { id: 'visualizer', label: 'Visualizer', icon: GitBranch },
    { id: 'troubleshooting', label: 'Troubleshooting Lab', icon: Wrench },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5 animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  DNS Explorer
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 rounded border border-sky-200 dark:border-sky-800">
                  EDU
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Interactive Networking Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600 dark:text-sky-400' : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Header Controls: Backend Status & Theme Toggle */}
          <div className="flex items-center gap-3">
            {/* Health Status Indicator */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
              title={
                isBackendHealthy === true
                  ? 'Backend API Connected (Port 5000)'
                  : isBackendHealthy === false
                  ? 'Backend API Unreachable'
                  : 'Checking backend status...'
              }
            >
              <Radio
                className={`w-3.5 h-3.5 ${
                  isBackendHealthy === true
                    ? 'text-emerald-500 animate-pulse'
                    : isBackendHealthy === false
                    ? 'text-rose-500'
                    : 'text-amber-500'
                }`}
              />
              <span className="hidden sm:inline text-slate-600 dark:text-slate-300">
                {isBackendHealthy === true
                  ? 'API Live'
                  : isBackendHealthy === false
                  ? 'API Offline'
                  : 'Checking...'}
              </span>
            </div>

            {/* Dark / Light Mode Switch */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
