import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Trophy,
  Activity,
  ArrowRight,
  RotateCcw,
  Download,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { PRIORITIES } from '../data/priorities';
import { ConfirmModal } from '../components/ConfirmModal';

export function DashboardView({ progress, onResetProgress, onNavigate, onShowToast }) {
  const [showResetModal, setShowResetModal] = useState(false);

  const daysDone = progress.completed_days?.length || 0;
  const exDone = progress.solved_exercises?.length || 0;
  const bestQuiz = progress.best_quiz_score || 0;

  // Weighted interview readiness percentage
  const readinessPct = Math.min(
    100,
    Math.round(((daysDone / 14) * 45) + ((exDone / 14) * 35) + ((bestQuiz / 10) * 20))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>S/4HANA &amp; BTP ABAP Cloud Architect Track</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            SAP Modern ABAP, RAP &amp; React Mastery
          </h2>
          <p className="text-xs sm:text-sm text-sky-200/80 max-w-2xl">
            14-Day Intensive production curriculum designed to transition from classic ABAP to enterprise-grade RAP Managed Business Objects, OData V4, and modern React interfaces.
          </p>
        </div>

        <button
          onClick={() => onNavigate('lessons')}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-sky-500/25 transition active:scale-95"
        >
          <span>Resume Active Lesson</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">14-Day Roadmap</span>
            <CalendarDays className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-slate-900 dark:text-white">
            {daysDone} <span className="text-sm font-normal text-slate-400">/ 14</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{Math.round((daysDone / 14) * 100)}% Roadmap completed</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Hands-on Labs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-slate-900 dark:text-white">
            {exDone} <span className="text-sm font-normal text-slate-400">/ 14</span>
          </div>
          <div className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold mt-1">
            Automated Clean Core validated
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Best Quiz Score</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-slate-900 dark:text-white">
            {bestQuiz} <span className="text-sm font-normal text-slate-400">/ 10</span>
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
            Architecture assessment
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Interview Readiness</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 text-slate-900 dark:text-white">
            {readinessPct}%
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            Calculated across all 14 days
          </div>
        </div>
      </div>

      {/* 8 Mandatory Priorities Tracker */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>8 Mandatory Learning Priorities (Sequence 1 → 8)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Strict progressive competency order: Master foundations before building full-stack RAP and React integration.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold self-start sm:self-auto">
            Clean Core Path
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRIORITIES.map((p) => {
            return (
              <div
                key={p.rank}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex flex-col justify-between gap-2 hover:border-sky-300 dark:hover:border-sky-800 transition group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{p.badge}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                      {p.level}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                    #{p.rank} {p.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('roadmap')}
                  className="mt-2 text-[11px] font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1 hover:underline"
                >
                  <span>Explore in Roadmap</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Persistence Note & Reset Action Bar */}
      <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 rounded-2xl p-4 sm:p-5 text-xs text-sky-900 dark:text-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>cloud Persistent Storage Active</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px] max-w-2xl">
            All your 14-day milestones, solved exercises, 20-step project checklists, assessment scores, and AI mentor conversations are securely saved into your cloud <code className="bg-white/80 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">PostgreSQL</code> database.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-950/40 transition text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetModal}
        title="Reset All Learning Progress?"
        message="This will reset your completed roadmap days, solved exercise submissions, project checklists, and quiz history in the cloud database. This action cannot be undone."
        confirmText="Yes, Reset All"
        onConfirm={() => {
          setShowResetModal(false);
          onResetProgress();
        }}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
}
