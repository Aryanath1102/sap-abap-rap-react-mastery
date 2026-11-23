import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileCode,
  Send,
  Eye,
  RotateCcw,
  Sparkles,
  History,
  ShieldCheck,
  Award,
  Layers,
  Tv,
  Flame,
  Scale,
  Clock,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  XCircle,
  Info,
  Terminal,
  Bookmark,
  ChevronDown,
  ArrowUp,
  FileText,
  Lock
} from 'lucide-react';
import { LESSONS } from '../data/lessons';
import { isDayUnlocked } from '../App';
import { CodeBlock } from '../components/CodeBlock';
import { submitAssignment, fetchSubmissions, fetchProgress } from '../services/api';

export function LessonsView({
  activeLessonId,
  onSelectLesson,
  completedDays = [],
  solvedExercises = [],
  onNavigate,
  onShowToast,
  onRefreshProgress,
  lessons = LESSONS
}) {
  const currentLesson = lessons.find(l => l.id === activeLessonId) || lessons[0];
  const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const assignments = currentLesson.assignments || (currentLesson.assignment ? [currentLesson.assignment] : []);
  const [activeAssignmentIndex, setActiveAssignmentIndex] = useState(0);
  const currentAssignment = assignments[activeAssignmentIndex] || assignments[0] || currentLesson.assignment;

  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [userCode, setUserCode] = useState(currentAssignment?.starterCode || '');
  const [submitting, setSubmitting] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [submissionsHistory, setSubmissionsHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [viewTab, setViewTab] = useState('all'); // 'all', 'narrative', 'keywords', 'showdown', 'code', 'lab'
  const [copiedIndices, setCopiedIndices] = useState({});
  const [solvedExerciseIds, setSolvedExerciseIds] = useState([]);
  useEffect(() => { fetchProgress().then(p => setSolvedExerciseIds(p.solved_assignment_ids || [])).catch(() => {}); }, []);

  // When active lesson changes, reset editor code and fetch past submissions
  useEffect(() => {
    setActiveAssignmentIndex(0);
    const firstAsg = (currentLesson.assignments && currentLesson.assignments[0]) || currentLesson.assignment;
    setUserCode(firstAsg?.starterCode || '');
    setValidationResult(null);
    setShowHint(false);
    setShowSolution(false);
    setActiveFileIndex(0);

    loadSubmissions(currentLesson.id);
  }, [currentLesson.id]);

  const handleSelectAssignment = (idx) => {
    setActiveAssignmentIndex(idx);
    const target = assignments[idx];
    setUserCode(target?.starterCode || '');
    setValidationResult(null);
    setShowHint(false);
    setShowSolution(false);
  };

  async function loadSubmissions(lessonId) {
    try {
      setLoadingHistory(true);
      const history = await fetchSubmissions(lessonId);
      setSubmissionsHistory(history);
      if (history.length > 0 && history[0].architect_feedback) {
        setValidationResult(history[0].architect_feedback);
        if (history[0].user_code) {
          setUserCode(history[0].user_code);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch history:', err.message);
    } finally {
      setLoadingHistory(false);
    }
  }

  const isSolved = solvedExercises.includes(currentLesson.id);
  const isNextUnlocked = nextLesson ? isDayUnlocked(nextLesson.day, completedDays, solvedExercises) : false;

  const handleSubmit = async () => {
    if (!userCode.trim()) {
      onShowToast?.('Please write your solution before submitting.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitAssignment(currentLesson.id, userCode, currentAssignment.id);
      setValidationResult(res.validation);
      setSubmissionsHistory(res.history || []);

      if (res.validation.status === 'passed') {
        const solvedKey = `${currentLesson.id}-${currentAssignment.id}`;
        if (!solvedExerciseIds.includes(solvedKey)) {
          const nextSolved = [...solvedExerciseIds, solvedKey];
          setSolvedExerciseIds(nextSolved);

        }

        onRefreshProgress?.();
        if (currentAssignment.isCapstone) {
          onShowToast?.(`🏆 Spectacular! You conquered the Day ${currentLesson.day} Master Capstone! All concepts mastered!`, 'success');
        } else {
          onShowToast?.(`🎉 Exercise ${currentAssignment.id} Passed! Clean Core compliance verified!`, 'success');
        }
      } else {
        onShowToast?.(`ATC Validation found ${res.validation.violations?.length || 1} issues. See remediation below.`, 'warning');
      }
    } catch (err) {
      onShowToast?.(`Submission error: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const currentFile = currentLesson.files[activeFileIndex] || currentLesson.files[0];
  const keywords = currentLesson.deepDiveKeywords || [];
  const showdown = currentLesson.elementShowdown;

  const copyKeywordSnippet = (text, idx) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedIndices(prev => ({ ...prev, [idx]: true }));
      setTimeout(() => {
        setCopiedIndices(prev => ({ ...prev, [idx]: false }));
      }, 2000);
      onShowToast?.('Code snippet copied to clipboard!', 'info');
    }
  };

  // Smooth scroll and push section into browser history so browser back button works
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Record section in browser history
      const query = `?view=lessons&lesson=${currentLesson.id}#${id}`;
      window.history.pushState({ view: 'lessons', lessonId: currentLesson.id, hash: id }, '', query);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 max-w-5xl mx-auto">
      {/* =====================================================================
          TOP BREADCRUMB & BACK NAVIGATION BAR
      ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                onNavigate?.('roadmap');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs transition"
            title="Navigate to previous view or module"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Back</span>
          </button>

          <button
            onClick={() => onNavigate?.('roadmap')}
            className="hidden sm:inline-flex text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition"
          >
            14-Day Roadmap
          </button>

          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">/</span>

          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">
            Day {currentLesson.day}: {currentLesson.title.replace(/^Day \d+:\s*/, '')}
          </span>
        </div>

        {/* Previous / Next Chapter Quick Controls */}
        <div className="flex items-center gap-1.5">
          {prevLesson && (
            <button
              onClick={() => onSelectLesson(prevLesson.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-semibold transition"
              title={`Switch to Chapter Day ${prevLesson.day}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Day {prevLesson.day}</span>
            </button>
          )}

          {nextLesson && (
            <button
              onClick={() => {
                if (isNextUnlocked) {
                  onSelectLesson(nextLesson.id);
                } else {
                  onShowToast?.(`🔒 Day ${nextLesson.day} is locked! Complete this day's final assignment first.`, 'error');
                }
              }}
              disabled={!isNextUnlocked}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold border transition ${
                isNextUnlocked
                  ? 'bg-sky-600 hover:bg-sky-500 text-white border-sky-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
              }`}
              title={isNextUnlocked ? `Switch to Chapter Day ${nextLesson.day}` : `Day ${nextLesson.day} is locked until Day ${currentLesson.day} assignment is completed`}
            >
              <span>{isNextUnlocked ? `Day ${nextLesson.day}` : `🔒 Day ${nextLesson.day}`}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* =====================================================================
          CHAPTER HEADER
      ===================================================================== */}
      <header id="chapter-header" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 rounded-3xl shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-sky-600 text-white tracking-wider flex items-center gap-1.5 shadow-xs">
                <BookOpen className="w-3.5 h-3.5" />
                <span>
                  {currentLesson.day === 0
                    ? 'PREREQUISITE FOUNDATIONS'
                    : (currentLesson.track === 'fiori'
                        ? `MODULE ${currentLesson.day} OF 6`
                        : `CHAPTER ${currentLesson.day} OF 14`)}
                </span>
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentLesson.readTime || '20 min read'}</span>
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                isSolved
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
              }`}>
                {isSolved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Flame className="w-3.5 h-3.5 text-amber-600" />}
                <span>{isSolved ? 'Final Lab Solved & Saved' : 'Final Assignment on Last Page'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentLesson.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed">
              {currentLesson.subtitle}
            </p>
          </div>

          {/* Chapter Selector with Locked Days */}
          <div className="shrink-0 w-full lg:w-72">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Switch Chapter (Progression Locked)
            </label>
            <select
              value={currentLesson.id}
              onChange={(e) => onSelectLesson(e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
            >
              {lessons.map((l) => {
                const unlocked = isDayUnlocked(l.day, completedDays, solvedExercises);
                const titleLabel = l.track === 'fiori'
                  ? `Module ${l.day}: ${l.title.replace(/^Module \d+:\s*/, '')}`
                  : (l.day === 0
                      ? '🚀 Day 0 (Prerequisites): Modern ABAP Core Mechanics'
                      : `Day ${l.day}: ${l.title.replace(/^Day \d+:\s*/, '')}`);
                return (
                  <option key={l.id} value={l.id} disabled={!unlocked}>
                    {unlocked ? titleLabel : `🔒 ${titleLabel} (Complete Previous First)`}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* View Mode Pills */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Filter View:
            </span>
            {[
              { id: 'all', label: '📖 Full Linear Chapter (Book Flow)' },
              { id: 'narrative', label: '🎙️ Intro & Analogy' },
              { id: 'keywords', label: currentLesson.day === 0 ? '🔍 Core Modules (§0.1 - §0.5)' : `🔍 Core Modules (§${currentLesson.day}.1 - §${currentLesson.day}.${keywords.length})` },
              { id: 'showdown', label: '⚖️ The Showdown' },
              { id: 'code', label: `💻 Codebase (${currentLesson.files.length})` },
              { id: 'lab', label: '🧪 Final Assignment (Last Page)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setViewTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition ${
                  viewTab === tab.id
                    ? 'bg-sky-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollToSection('section-assignment')}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>Jump to Last Page (Assignment)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* =====================================================================
          CHAPTER TABLE OF CONTENTS / BOOK ROADMAP
      ===================================================================== */}
      {viewTab === 'all' && (
        <nav aria-label="Chapter Index" className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-sky-500" />
              <span>Chapter Index &amp; Reading Roadmap</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Browser History Enabled (Use Back Button Anytime)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => scrollToSection('section-foundation')}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left hover:border-sky-400 dark:hover:border-sky-500 transition group flex items-start gap-2"
            >
              <span className="font-mono text-sky-600 dark:text-sky-400 font-bold shrink-0">§0.0</span>
              <span className="text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                Chapter Foundation &amp; Mental Models
              </span>
            </button>

            {keywords.map((kw, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSection(`module-${idx}`)}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left hover:border-sky-400 dark:hover:border-sky-500 transition group flex items-start gap-2"
              >
                <span className="font-mono text-sky-600 dark:text-sky-400 font-bold shrink-0">
                  §{currentLesson.day}.{idx + 1}
                </span>
                <span className="text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 truncate">
                  {kw.name}
                </span>
              </button>
            ))}

            {showdown && (
              <button
                onClick={() => scrollToSection('section-showdown')}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left hover:border-sky-400 dark:hover:border-sky-500 transition group flex items-start gap-2"
              >
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold shrink-0">§COMP</span>
                <span className="text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Architectural Showdown
                </span>
              </button>
            )}

            <button
              onClick={() => scrollToSection('section-code')}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left hover:border-sky-400 dark:hover:border-sky-500 transition group flex items-start gap-2"
            >
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">§CODE</span>
              <span className="text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                Full Runnable Production Code
              </span>
            </button>

            <button
              onClick={() => scrollToSection('section-assignment')}
              className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-left hover:border-sky-500 transition group flex items-start gap-2 col-span-1 sm:col-span-2 lg:col-span-1 font-semibold"
            >
              <span className="font-mono text-sky-700 dark:text-sky-300 font-bold shrink-0">§FINAL</span>
              <span className="text-sky-900 dark:text-sky-200 group-hover:underline">
                Chapter Final Lab &amp; Assignment (Last Page)
              </span>
            </button>
          </div>
        </nav>
      )}

      {/* =====================================================================
          SECTION 1: CHAPTER FOUNDATION (STACKED VERTICALLY "UP AND DOWN")
      ===================================================================== */}
      {(viewTab === 'all' || viewTab === 'narrative') && (
        <section id="section-foundation" className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">§0.0</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Chapter Foundation, Mental Model &amp; Enterprise Context
            </h2>
          </div>

          {/* Lead Architect Keynote Hook Banner */}
          {currentLesson.vlogHook && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-950 border border-sky-800/60 p-5 sm:p-6 text-white shadow-md">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 shrink-0">
                  <Tv className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/30">
                      Lead Architect Keynote • Day {currentLesson.day}
                    </span>
                    <span className="text-[11px] text-sky-300 font-mono">
                      Architectural Motivation
                    </span>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-sky-100 italic font-serif">
                    "{currentLesson.vlogHook}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ZERO-TO-HERO BEGINNER BRIDGE: For Developers Who Never Learned Classic ABAP or Any SAP */}
          {currentLesson.beginnerBridge && (
            <div className="rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-sky-500/5 to-transparent p-6 sm:p-7 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
                      Zero-to-Hero Fast Track • Beginner Bridge
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {currentLesson.beginnerBridge.title}
                    </h3>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 self-start sm:self-auto">
                  No Prior SAP Experience Required
                </span>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                {currentLesson.beginnerBridge.summary}
              </p>

              {/* Why Old SAP Was Hard vs Why Modern RAP Is Clean */}
              {currentLesson.beginnerBridge.whyClassicWasHard && (
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Why Old SAP Was Hard vs Why Modern RAP Is Clean &amp; Modern:</span>
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentLesson.beginnerBridge.whyClassicWasHard}
                  </p>
                </div>
              )}

              {/* Jargon Buster Grid */}
              {currentLesson.beginnerBridge.jargonBuster?.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                    SAP Jargon Buster (Translated Into Modern Web &amp; Backend Concepts):
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {currentLesson.beginnerBridge.jargonBuster.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-sky-700 dark:text-sky-300">{item.term}</span>
                          <span className="text-[10px] text-slate-400">Concept</span>
                        </div>
                        <p className="text-xs text-slate-800 dark:text-slate-200">{item.translation}</p>
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono pt-0.5">
                          ↳ Modern Web: {item.modernEquivalent}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pro Tips */}
              {currentLesson.beginnerBridge.proTips?.length > 0 && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-950 dark:text-emerald-200 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Architect Tips for Fast Mastery:</span>
                  </span>
                  <ul className="list-disc pl-5 space-y-0.5 text-slate-700 dark:text-slate-300">
                    {currentLesson.beginnerBridge.proTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* VERTICAL STACK (UP AND DOWN): Level 1 Layman Analogy on Top */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-900/60 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-900/40 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Level 1: Intuitive Mental Model &amp; Real-World Analogy</span>
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-900">
                Core Intuition (Top)
              </span>
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
              {currentLesson.layman}
            </p>
          </div>

          {/* VERTICAL STACK (UP AND DOWN): Level 2 SAP Technical Specification Below */}
          <div className="bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-transparent border border-sky-300 dark:border-sky-900/60 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-sky-200 dark:border-sky-900/40 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>Level 2: Official SAP Technical Definition &amp; Clean Core Architecture</span>
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-900">
                Enterprise Specification (Down)
              </span>
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
              {currentLesson.technical}
            </p>
          </div>

          {/* VERTICAL STACK (UP AND DOWN): Enterprise Production War Story */}
          {currentLesson.warStory && (
            <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>Enterprise Production War Story &amp; Architecture Post-Mortem</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Real S/4HANA Migration Case Study
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                {currentLesson.warStory}
              </p>
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          SECTION 2: EXHAUSTIVE CORE MODULES
          RENDERED SEQUENTIALLY ONE AFTER ANOTHER (OLD-FASHIONED BOOK STYLE)
      ===================================================================== */}
      {(viewTab === 'all' || viewTab === 'keywords') && keywords.length > 0 && (
        <section id="section-modules" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
                <Layers className="w-4 h-4" />
                <span>Textbook Module Blueprint • Sequential Chapter Content</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Every Keyword &amp; Constructor Expression Explained In-Depth
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Read continuously down the page. Use your browser's back button anytime to return to a previous module.
              </p>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-full font-mono bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold border border-sky-300 dark:border-sky-800 self-start sm:self-auto shrink-0">
              {keywords.length} Core Modules In Order
            </span>
          </div>

          {/* SEQUENTIAL LIST OF MODULES (ONE AFTER ANOTHER) */}
          <div className="space-y-8">
            {keywords.map((kw, idx) => (
              <article
                key={idx}
                id={`module-${idx}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 scroll-mt-24"
              >
                {/* Module Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-sky-600 text-white">
                        §{currentLesson.day}.{idx + 1}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Module Topic
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {kw.name}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    {kw.sapDocRef && (
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-sky-500" />
                        <span>{kw.sapDocRef}</span>
                      </span>
                    )}
                    <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      SAP Clean Core Certified
                    </span>
                  </div>
                </div>

                {/* Level 1: Layman Analogy */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-2">
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Intuitive Mental Model &amp; Layman Analogy</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                    {kw.laymanAnalogy}
                  </p>
                </div>

                {/* Level 2: Technical Definition */}
                <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/40 space-y-2">
                  <div className="text-xs font-bold text-sky-900 dark:text-sky-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Official SAP Technical Specification &amp; Compiler Mechanics</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                    {kw.technicalDefinition}
                  </p>
                </div>

                {/* Syntax Blueprint */}
                {kw.syntax && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-sky-500" />
                      <span>Formal Syntax Blueprint:</span>
                    </span>
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 overflow-x-auto shadow-xs">
                      <pre className="whitespace-pre-wrap">{kw.syntax}</pre>
                    </div>
                  </div>
                )}

                {/* Under the Hood */}
                {kw.underTheHood && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Under the Hood (Compiler Optimization, HANA Engine &amp; Memory Allocation)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      {kw.underTheHood}
                    </p>
                  </div>
                )}

                {/* Common Senior Architect Pitfalls */}
                {kw.commonPitfall && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-2">
                    <div className="text-xs font-bold text-rose-900 dark:text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Senior Architect Pitfall &amp; Clean Core Compliance Rule</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                      {kw.commonPitfall}
                    </p>
                  </div>
                )}

                {/* Modern Clean Core Code Example */}
                {kw.modernExample && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Modern Clean Core Production Code Example:</span>
                      </span>
                      <button
                        onClick={() => copyKeywordSnippet(kw.modernExample, idx)}
                        className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono flex items-center gap-1.5 transition"
                      >
                        {copiedIndices[idx] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Snippet</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 overflow-x-auto shadow-xs">
                      <pre className="whitespace-pre-wrap">{kw.modernExample}</pre>
                    </div>

                    {/* Spring Boot & Express.js Developer Decoder */}
                    {kw.springBootBridge && (
                      <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <span>Spring Boot &amp; Express.js Developer Decoder (Line-by-Line Translation):</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                          {kw.springBootBridge.explanation}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-2xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono block">
                              🌱 Spring Boot / Java Equivalent:
                            </span>
                            <pre className="text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre leading-relaxed">
                              {kw.springBootBridge.springBootCode}
                            </pre>
                          </div>
                          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-2xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 font-mono block">
                              ⚡ Express.js / Node.js Equivalent:
                            </span>
                            <pre className="text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre leading-relaxed">
                              {kw.springBootBridge.expressCode}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          SECTION 3: ARCHITECTURAL SHOWDOWN (LEGACY VS MODERN)
      ===================================================================== */}
      {(viewTab === 'all' || viewTab === 'showdown') && showdown && (
        <section id="section-showdown" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                <Scale className="w-4 h-4" />
                <span>Battle of the Paradigms • Architectural Showdown</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {showdown.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {showdown.subtitle}
              </p>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-full font-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-900 self-start sm:self-auto">
              Clean Core Evaluation
            </span>
          </div>

          {/* Stacked comparison (Up and Down) */}
          <div className="space-y-5">
            {/* Element A: Legacy pre-7.40 */}
            <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-900/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                    Element A (Legacy Procedural Approach)
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                  {showdown.elementA.cleanCoreVerdict}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {showdown.elementA.name}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {showdown.elementA.concept}
              </p>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Legacy Code Pattern:
                </span>
                <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 font-mono text-xs text-rose-950 dark:text-rose-200 overflow-x-auto">
                  <pre className="whitespace-pre">{showdown.elementA.syntax}</pre>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-rose-100 dark:border-rose-900/30 space-y-1.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Pros:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                    {showdown.elementA.pros?.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-rose-100 dark:border-rose-900/30 space-y-1.5">
                  <span className="font-bold text-rose-700 dark:text-rose-400 block">Cons &amp; Drawbacks:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                    {showdown.elementA.cons?.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Element B: Modern Clean Core */}
            <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-900/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Element B (Modern Clean Core Standard)
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {showdown.elementB.cleanCoreVerdict}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {showdown.elementB.name}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {showdown.elementB.concept}
              </p>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Modern Clean Core Pattern:
                </span>
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 font-mono text-xs text-emerald-950 dark:text-emerald-200 overflow-x-auto">
                  <pre className="whitespace-pre">{showdown.elementB.syntax}</pre>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-emerald-100 dark:border-emerald-900/30 space-y-1.5">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block">Pros &amp; Strengths:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                    {showdown.elementB.pros?.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-emerald-100 dark:border-emerald-900/30 space-y-1.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Trade-offs &amp; Rules:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                    {showdown.elementB.cons?.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Comparison Matrix Table */}
          {showdown.comparisonTable && showdown.comparisonTable.length > 0 && (
            <div className="space-y-2 pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Direct Feature &amp; Runtime Comparison Matrix:
              </span>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3.5">Evaluation Dimension</th>
                      <th className="p-3.5 text-rose-700 dark:text-rose-400">{showdown.elementA.name}</th>
                      <th className="p-3.5 text-emerald-700 dark:text-emerald-400">{showdown.elementB.name}</th>
                      <th className="p-3.5 text-sky-700 dark:text-sky-400">Clean Core Winner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans">
                    {showdown.comparisonTable.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                        <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                          {row.feature}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-400">
                          {row.elementA}
                        </td>
                        <td className="p-3.5 text-emerald-700 dark:text-emerald-300 font-medium">
                          {row.elementB}
                        </td>
                        <td className="p-3.5 font-bold font-mono text-sky-600 dark:text-sky-400">
                          {row.winner || 'Modern ABAP'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Senior Architect Recommendation */}
          {showdown.architectAdvice && (
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-3.5 text-xs sm:text-sm">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                <div className="font-bold text-indigo-950 dark:text-indigo-200">
                  Senior Architect Production Recommendation:
                </div>
                <p className="leading-relaxed">
                  {showdown.architectAdvice}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          SECTION 4: EXTENSIVE MULTI-FILE CODE LISTING
      ===================================================================== */}
      {(viewTab === 'all' || viewTab === 'code') && (
        <section id="section-code" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
                <FileCode className="w-4 h-4" />
                <span>Production Reference Codebase</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Realistic Production Implementation
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Verified for ABAP Cloud (Language Version 5), CDS View Entities, RAP strict ( 2 ), and OData V4 standards.
              </p>
            </div>

            {currentLesson.files.length > 1 && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl shrink-0">
                {currentLesson.files.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFileIndex(idx)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-mono font-medium transition ${
                      activeFileIndex === idx
                        ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {file.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <CodeBlock
            code={currentFile.code}
            language={currentFile.lang}
            title={currentFile.name}
            lineExplanations={currentLesson.lineExplanations}
          />
        </section>
      )}

      {/* =====================================================================
          SECTION 5: CHAPTER FINAL PAGE — 10 PROGRESSIVE HANDS-ON ASSIGNMENTS
      ===================================================================== */}
      {(viewTab === 'all' || viewTab === 'lab') && (
        <section id="section-assignment" className="bg-white dark:bg-slate-900 border-2 border-sky-500/40 dark:border-sky-500/30 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 scroll-mt-24">
          {/* Header & Overall Chapter Progress */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent border border-sky-400/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 font-mono">
                  Chapter Final Page • Hands-On Lab Curriculum
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  10 Progressive Coding Exercises (Warm-up to Master Capstone)
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full font-mono font-bold bg-white dark:bg-slate-800 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-slate-700">
                Completed: {assignments.filter(a => solvedExerciseIds.includes(`${currentLesson.id}-${a.id}`)).length} / {assignments.length}
              </span>
              {isSolved && (
                <span className="text-xs px-3 py-1 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Day Certified</span>
                </span>
              )}
            </div>
          </div>

          {/* 10-ASSIGNMENT INTERACTIVE STEPPER NAVIGATION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Select Assignment (1 to 10):</span>
              <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                Exercise 10 is the Big Master Capstone
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto thin-scroll pb-2">
              {assignments.map((asg, idx) => {
                const isSelected = activeAssignmentIndex === idx;
                const isDone = solvedExerciseIds.includes(`${currentLesson.id}-${asg.id}`);
                return (
                  <button
                    key={asg.id}
                    onClick={() => handleSelectAssignment(idx)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-xs font-bold ring-2 ring-sky-400/30'
                        : asg.isCapstone
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100'
                        : isDone
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : asg.isCapstone ? (
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 text-[10px] flex items-center justify-center font-mono shrink-0">
                        {asg.id}
                      </span>
                    )}
                    <span>{asg.isCapstone ? 'Ex 10 (Master Capstone)' : `Ex ${asg.id}`}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE ASSIGNMENT HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-slate-100 dark:border-slate-800 py-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                  Exercise {currentAssignment.id} of {assignments.length}
                </span>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                  currentAssignment.isCapstone
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                    : currentAssignment.difficulty === 'Warm-up'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300'
                }`}>
                  {currentAssignment.isCapstone ? '🏆 Comprehensive Master Capstone (All Concepts Synthesized)' : currentAssignment.difficulty}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {currentAssignment.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>~{currentAssignment.estimatedMinutes || 10} min</span>
              </span>
              {solvedExerciseIds.includes(`${currentLesson.id}-${currentAssignment.id}`) && (
                <span className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Passed</span>
                </span>
              )}
            </div>
          </div>

          {/* Prompt Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Assignment Specification &amp; Business Rules:
            </span>
            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
              {currentAssignment.prompt}
            </div>
          </div>

          {/* Interactive Code Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">ABAP Cloud / Clean Core Coding Sandbox:</span>
              <button
                onClick={() => setUserCode(currentAssignment.starterCode || '')}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Starter Code</span>
              </button>
            </div>

            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              rows={11}
              className="w-full font-mono text-xs sm:text-sm p-4 sm:p-5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-inner leading-relaxed"
              placeholder="Write your modern ABAP Clean Core solution here..."
            />
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/20 transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Running Clean Core ATC...' : 'Submit & Validate Solution'}</span>
              </button>

              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-xs font-semibold transition"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              </button>

              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showSolution ? 'Hide Solution' : 'Reveal Reference Solution'}</span>
              </button>
            </div>

            {validationResult && (
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  validationResult.status === 'passed'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                }`}>
                  Grade: {validationResult.grade} ({validationResult.complianceScore}%)
                </span>
              </div>
            )}
          </div>

          {/* Hint Box */}
          {showHint && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2 animate-fade-in">
              <div className="font-bold flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Architect Guidance &amp; Hint:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 leading-relaxed">
                {(currentAssignment.hints || []).map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Solution Box */}
          {showSolution && (
            <div className="space-y-2 animate-fade-in">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Official Clean Core Reference Solution:</span>
              </div>
              <CodeBlock code={currentAssignment.solution || '// Solution not available'} language="abap" title={`${currentAssignment.title} — Reference Solution`} />
            </div>
          )}

          {/* Automated Clean Core Validation Result */}
          {validationResult && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-3.5 animate-fade-in ${
              validationResult.status === 'passed'
                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                : 'bg-red-50/60 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-950 dark:text-red-200'
            }`}>
              <div className="flex items-center justify-between border-b border-current/20 pb-2.5">
                <div className="flex items-center gap-2">
                  {validationResult.status === 'passed' ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  <span className="font-bold text-sm">
                    {validationResult.status === 'passed'
                      ? 'Automated Clean Core Validation: Passed'
                      : 'Automated Clean Core Validation: Issues Found'}
                  </span>
                </div>
                <span className="font-mono font-bold text-xs px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-current/30">
                  Compliance Score: {validationResult.complianceScore} / 100
                </span>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed">
                {validationResult.architectNotes}
              </p>

              {validationResult.violations?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                    Violations &amp; Required Remediation:
                  </div>
                  {validationResult.violations.map((v, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-red-200 dark:border-red-900 text-xs space-y-1">
                      <div className="font-bold text-red-700 dark:text-red-400 flex items-center justify-between">
                        <span>• {v.rule}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-mono">
                          {v.severity}
                        </span>
                      </div>
                      <div className="text-slate-800 dark:text-slate-200">{v.message}</div>
                      <div className="text-slate-600 dark:text-slate-400 pt-1 font-sans">
                        <strong>Remediation:</strong> {v.remediation}
                      </div>
                      {v.example && (
                        <code className="block bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-emerald-300 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg text-[11px] font-mono mt-1">
                          {v.example}
                        </code>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {validationResult.strengths?.length > 0 && (
                <div className="pt-2 border-t border-current/20">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>Recognized Clean Core Architectural Strengths:</span>
                  </div>
                  <ul className="text-xs space-y-1 pl-4 list-disc text-slate-700 dark:text-slate-300">
                    {validationResult.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* cloud Submission History */}
          {submissionsHistory.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <History className="w-4 h-4" />
                <span>cloud Submission History for Chapter {currentLesson.day} ({submissionsHistory.length} attempts)</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto thin-scroll">
                {submissionsHistory.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${sub.status === 'passed' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Status: {sub.status.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-[11px] font-mono">
                        {new Date(sub.submitted_at).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setUserCode(sub.user_code);
                        if (sub.architect_feedback) setValidationResult(sub.architect_feedback);
                      }}
                      className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      Load into Editor
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              CHAPTER NAVIGATION FOOTER AT THE VERY BOTTOM (LAST PAGE)
          ================================================================= */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {prevLesson ? (
              <button
                onClick={() => {
                  onSelectLesson(prevLesson.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
              >
                <ArrowLeft className="w-4 h-4 text-sky-500" />
                <span>← Previous Chapter (Day {prevLesson.day})</span>
              </button>
            ) : <div />}

            <button
              onClick={() => scrollToSection('chapter-header')}
              className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top of Chapter</span>
            </button>

            {nextLesson ? (
              <button
                onClick={() => {
                  if (isNextUnlocked) {
                    onSelectLesson(nextLesson.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    onShowToast?.(`🔒 Day ${nextLesson.day} is locked! Complete this day's final assignment first to unlock Day ${nextLesson.day}.`, 'error');
                  }
                }}
                disabled={!isNextUnlocked}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs ${
                  isNextUnlocked
                    ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
                    : 'bg-slate-200 dark:bg-slate-800/80 text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                }`}
              >
                {isNextUnlocked ? (
                  <>
                    <span>Next Chapter: Day {nextLesson.day}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Day {nextLesson.day} Locked (Complete Lab First)</span>
                  </>
                )}
              </button>
            ) : <div />}
          </div>
        </section>
      )}
    </div>
  );
}
