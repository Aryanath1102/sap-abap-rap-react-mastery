import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  FolderKanban,
  Layers,
  Sparkles,
  ShieldCheck,
  Compass,
  Database,
  LayoutTemplate
} from 'lucide-react';

export function Sidebar({
  currentView,
  onChangeView,
  progressStats,
  isOpen,
  onCloseMobile,
  activeTrack = 'rap',
  currentSession
}) {
  const isFiori = activeTrack === 'fiori';
  const isAdmin = currentSession?.role === 'admin';

  const navItems = [
    { id: 'tracks', label: 'Learning Paths Hub', icon: Compass, badge: 'Choose' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: isFiori ? '6-Module Fiori Roadmap' : '15-Day RAP Roadmap', icon: CalendarDays },
    { id: 'lessons', label: isFiori ? 'Fiori Modules & Labs' : 'RAP Lessons & Exercises', icon: BookOpen },
    { id: 'projects', label: 'Full-Stack Projects', icon: FolderKanban },
    { id: 'architecture', label: 'Architecture & Search', icon: Layers },
    { id: 'mentor', label: 'AI Mentor & Quiz', icon: Sparkles },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Control Center', icon: ShieldCheck, badge: 'Admin' });
  }

  const overallMastery = progressStats?.readinessPct || 0;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sticky Desktop Sidebar */}
      <aside
        className={`fixed lg:sticky lg:top-[61px] inset-y-0 left-0 z-30 w-64 lg:h-[calc(100vh-61px)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between shrink-0 lg:overflow-y-auto thin-scroll transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-1">
          {/* Active Track Status Card in Sidebar */}
          <div
            onClick={() => {
              onChangeView('tracks');
              onCloseMobile();
            }}
            className="cursor-pointer mb-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-sky-400 dark:hover:border-sky-500 transition group space-y-1"
          >
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              <span>Active Curriculum</span>
              <span className="text-sky-500 group-hover:underline">Switch</span>
            </div>
            <div className="flex items-center gap-2">
              {isFiori ? (
                <LayoutTemplate className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <Database className="w-4 h-4 text-sky-500 shrink-0" />
              )}
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {isFiori ? 'SAP Fiori Track' : 'ABAP RAP Track'}
              </span>
            </div>
          </div>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center justify-between">
            <span>Navigation</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
              v2.0
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeView(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  active
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                    item.badge === 'Admin'
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Progress Card */}
        <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isFiori ? 'Fiori Readiness' : 'RAP Core Readiness'}
            </span>
            <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
              {overallMastery}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/60">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isFiori
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-600'
              }`}
              style={{ width: `${overallMastery}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Clean Core Verified</span>
          </div>
        </div>
      </aside>
    </>
  );
}
