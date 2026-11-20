import React from 'react';
import { Check, Calendar, ArrowRight, Clock, Star, Lock } from 'lucide-react';
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
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            14-Day Intensive Architect Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete sequence from Modern ABAP expressions to enterprise RAP Managed Business Objects, Draft handling, OData V4, and React UI integration.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800 self-start sm:self-auto">
          Completed: {completedDays.length} / 14 Days
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROADMAP_14_DAYS.map((dayItem) => {
          const isDone = completedDays.includes(dayItem.day);
          const unlocked = isDayUnlocked(dayItem.day, completedDays, solvedExercises);

          return (
            <div
              key={dayItem.day}
              className={`rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between gap-4 ${
                isDone
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  : unlocked
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800'
                  : 'bg-slate-100/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-80'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black tracking-wider px-2 py-0.5 rounded-md font-mono ${
                      unlocked ? 'bg-sky-600 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      DAY {dayItem.day}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {dayItem.priority}
                    </span>
                    {!unlocked && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{dayItem.duration}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {dayItem.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {dayItem.focus}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Core Modules Covered:
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
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    if (unlocked) {
                      onSelectLesson(dayItem.lessonId);
                      onNavigate('lessons');
                    } else {
                      onShowToast?.(`🔒 Day ${dayItem.day} is locked! Complete Day ${dayItem.day - 1} first to unlock.`, 'error');
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition shadow-xs ${
                    unlocked
                      ? 'bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {unlocked ? (
                    <>
                      <span>Open Deep Lesson</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Complete Day {dayItem.day - 1} First</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (unlocked) {
                      onToggleDay(dayItem.day);
                    } else {
                      onShowToast?.(`🔒 Complete Day ${dayItem.day - 1} first before completing Day ${dayItem.day}.`, 'error');
                    }
                  }}
                  disabled={!unlocked}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                    isDone
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : unlocked
                      ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-400 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isDone ? 'Done' : 'Mark Done'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
