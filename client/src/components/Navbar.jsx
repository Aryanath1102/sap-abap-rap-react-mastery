import React from 'react';
import { Flame, Download, Sun, Moon, Menu, Layers } from 'lucide-react';
import { getExportUrl } from '../services/api';

export function Navbar({ streak = 0, theme, onToggleTheme, onToggleMobileSidebar, onShowToast }) {
  const handleExport = () => {
    window.location.href = getExportUrl();
    onShowToast?.('Exporting SQLite database state as JSON...');
  };

  const hasActiveStreak = Number(streak) > 0;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between gap-3 shadow-xs transition-colors duration-200">
      {/* Brand & Logo Area */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition shrink-0"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Polished SVG Logo Badge */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 shrink-0 ring-1 ring-white/20">
          <Layers className="w-5 h-5 text-white" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
              SAP Modern ABAP &amp; RAP Studio
            </span>
            <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-300 dark:border-sky-800 shrink-0">
              Clean Core
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            14-Day Intensive Enterprise Full-Stack Architect Masterclass
          </p>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Streak Indicator */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shadow-xs transition ${
            hasActiveStreak
              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
          }`}
          title={hasActiveStreak ? `${streak} consecutive active day(s)` : 'Complete Day 1 final assignment to activate your streak!'}
        >
          <Flame className={`w-3.5 h-3.5 ${hasActiveStreak ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">Streak:</span>
          <span>{streak} Day{streak === 1 ? '' : 's'}</span>
        </div>

        {/* Export JSON Button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-xs transition"
          title="Export complete SQLite learning state as JSON"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Export Progress</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-xs transition"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
    </header>
  );
}
