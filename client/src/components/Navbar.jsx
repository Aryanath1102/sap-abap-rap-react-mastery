import React from 'react';
import {
  Flame,
  Download,
  Sun,
  Moon,
  Menu,
  Layers,
  Database,
  LayoutTemplate,
  Users,
  KeyRound,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { getExportUrl } from '../services/api';

export function Navbar({
  streak = 0,
  theme,
  onToggleTheme,
  onToggleMobileSidebar,
  onShowToast,
  activeTrack = 'rap',
  onSelectTrack,
  currentSession,
  activeSessionsCount = 1,
  onOpenAuth,
  onNavigate
}) {
  const handleExport = () => {
    window.location.href = getExportUrl();
    onShowToast?.('Exporting database state as JSON...');
  };

  const hasActiveStreak = Number(streak) > 0;
  const isAdmin = currentSession?.role === 'admin';

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 shadow-xs transition-colors duration-200">
      {/* Brand & Logo Area */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition shrink-0"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Polished SVG Logo Badge */}
        <button
          onClick={() => onNavigate('tracks')}
          className="flex items-center gap-2.5 text-left group"
          title="Switch Learning Track (RAP vs Fiori)"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 shrink-0 ring-1 ring-white/20 group-hover:scale-105 transition">
            <Layers className="w-5 h-5 text-white" />
          </div>

          <div className="min-w-0 hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                SAP Mastery Studio
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-300 dark:border-sky-800 shrink-0">
                Clean Core
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {activeTrack === 'fiori' ? 'SAP Fiori & SAPUI5 Architecture' : 'ABAP RAP RESTful Application Model'}
            </p>
          </div>
        </button>
      </div>

      {/* Middle: Track Switcher Pill */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          onClick={() => onSelectTrack('rap')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
            activeTrack === 'rap'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Switch to ABAP RAP Track"
        >
          <Database className="w-3.5 h-3.5 text-sky-500" />
          <span className="hidden md:inline">Learn</span>
          <span>RAP</span>
        </button>
        <button
          onClick={() => onSelectTrack('fiori')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
            activeTrack === 'fiori'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Switch to SAP Fiori Track"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden md:inline">Learn</span>
          <span>Fiori</span>
        </button>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Concurrent Logon / User Pill */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-xs transition"
          title="Concurrent Sessions & Identity Manager"
        >
          <div className="w-5 h-5 rounded-lg bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">
            {currentSession?.name ? currentSession.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="hidden lg:inline max-w-[100px] truncate">
            {currentSession?.name || 'Log In'}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{activeSessionsCount}</span>
          </span>
        </button>

        {/* Admin Shortcut */}
        {isAdmin && (
          <button
            onClick={() => onNavigate('admin')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs"
            title="Open Admin Control Center"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        )}

        {/* Streak Indicator */}
        <div
          className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shadow-xs transition ${
            hasActiveStreak
              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
          }`}
          title={hasActiveStreak ? `${streak} consecutive active day(s)` : 'Complete Day 1 final assignment to activate your streak!'}
        >
          <Flame className={`w-3.5 h-3.5 ${hasActiveStreak ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
          <span>{streak}d</span>
        </div>

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
