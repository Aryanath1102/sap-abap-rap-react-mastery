import React, { useState } from 'react';
import { Check, Calendar, ArrowRight, Clock, Star, Lock, Mic, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';
import { ROADMAP_14_DAYS } from '../data/roadmap';
import { isDayUnlocked } from '../App';

export function RoadmapView({
  completedDays = [],
  solvedExercises = [],
  onToggleDay,
  onSelectLesson,
  onNavigate,
  onShowToast
}) {
  const [openChallenges, setOpenChallenges] = useState({});

  const toggleChallenge = (id) => {
    setOpenChallenges(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Roadmap Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>ENTERPRISE RAP MASTER ROADMAP (BEGINNER → EXPERT)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            SAP RAP Curriculum: Modules 0 through 8
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Starting from absolute zero ABAP knowledge to designing, developing, debugging, and explaining enterprise-level RAP applications. Complete with <strong>2-Minute Interviewer Challenges</strong> and Eclipse ADT / SAP S/4HANA checkpoints.
          </p>
        </div>
        <div className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800 self-start sm:self-auto shrink-0 shadow-2xs font-mono">
          Progress: {completedDays.length} / 9 Modules Completed
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {ROADMAP_14_DAYS.map((dayItem) => {
          const isDone = completedDays.includes(dayItem.day);
          const unlocked = isDayUnlocked(dayItem.day, completedDays, solvedExercises);
          const hasSubLessons = dayItem.subLessons && dayItem.subLessons.length > 0;
          const isChallengeOpen = openChallenges[dayItem.day];

          return (
            <div
              key={dayItem.day}
              className={`rounded-3xl border p-5 sm:p-6 shadow-xs transition-all flex flex-col justify-between gap-4 ${
                isDone
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  : unlocked
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800 shadow-sm'
                  : 'bg-slate-100/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-80'
              }`}
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-black tracking-wider px-2.5 py-1 rounded-lg font-mono ${
                      unlocked ? 'bg-sky-600 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      MODULE {dayItem.moduleNumber !== undefined ? dayItem.moduleNumber : dayItem.day}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {dayItem.priority}
                    </span>
                    {!unlocked && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{dayItem.duration}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {dayItem.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {dayItem.focus}
                </p>

                {/* Sub-lessons list (e.g. 0.1 to 0.10) */}
                {hasSubLessons && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                      Sub-Lessons in this Module:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                      {dayItem.subLessons.map((sub) => (
                        <div key={sub.id} className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-[10px]">{sub.id}</span>
                          <span className="truncate">{sub.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topics Covered */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                    Core Architecture Topics:
                  </div>
                  <ul className="space-y-1">
                    {dayItem.topics.map((t, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <span className="text-sky-500 font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 🎤 Two-Minute Interviewer Challenge Accordion */}
                {dayItem.interviewerChallenge && (
                  <div className="mt-2 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 overflow-hidden">
                    <button
                      onClick={() => toggleChallenge(dayItem.day)}
                      className="w-full p-3 text-left flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-300 hover:bg-indigo-100/40 dark:hover:bg-indigo-900/40 transition"
                    >
                      <div className="flex items-center gap-2">
                        <Mic className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>🎤 2-Minute Interviewer Challenge</span>
                      </div>
                      {isChallengeOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isChallengeOpen && (
                      <div className="p-3.5 pt-0 space-y-2 text-xs border-t border-indigo-100 dark:border-indigo-900/40">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 italic">
                          "{dayItem.interviewerChallenge.question}"
                        </p>
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 font-mono block">
                            Key Points You Must Articulate:
                          </span>
                          <ul className="space-y-1 pl-3 list-disc text-slate-600 dark:text-slate-400">
                            {dayItem.interviewerChallenge.keyPoints.map((kp, kpi) => (
                              <li key={kpi}>{kp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    if (unlocked) {
                      onSelectLesson(dayItem.lessonId);
                      onNavigate('lessons');
                    } else {
                      onShowToast?.(`🔒 Module ${dayItem.moduleNumber !== undefined ? dayItem.moduleNumber : dayItem.day} is locked! Complete the previous module first to unlock.`, 'error');
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition shadow-xs ${
                    unlocked
                      ? 'bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {unlocked ? (
                    <>
                      <span>Open Module Lesson</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Complete Module {(dayItem.moduleNumber || dayItem.day) - 1} First</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleDay(dayItem.day)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center ${
                    isDone
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-500'
                  }`}
                  title={isDone ? 'Mark module as pending' : 'Mark module as completed'}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
