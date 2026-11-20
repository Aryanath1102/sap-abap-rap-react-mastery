import React, { useState } from 'react';
import {
  FolderKanban,
  CheckCircle2,
  Layers,
  FileCode,
  CheckSquare,
  Square,
  ArrowRight,
  ExternalLink,
  Filter,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import { PROJECTS, LIFECYCLE_STEPS } from '../data/projects';
import { CodeBlock } from '../components/CodeBlock';

export function ProjectsView({ projectChecklists, onToggleStep, onShowToast }) {
  const [activeTier, setActiveTier] = useState('All');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [activeCodeTab, setActiveCodeTab] = useState('dbTable');

  const filteredProjects = activeTier === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.tier === activeTier);

  const selectedProject = PROJECTS.find(p => p.id === selectedProjectId);

  const codeTabs = [
    { id: 'dbTable', label: '1. DB Table (DDL)' },
    { id: 'interfaceView', label: '2. ZI_* Interface View' },
    { id: 'projectionView', label: '3. ZC_* Projection' },
    { id: 'bdef', label: '4. BDEF strict ( 2 )' },
    { id: 'behaviorPool', label: '5. ZBP_* Behavior Pool' },
    { id: 'service', label: '6. Service Def & Binding' },
    { id: 'react', label: '7. React OData V4 Service' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            18 Full-Stack Enterprise Projects
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete company-level development: 20-step lifecycle checklist persisted to SQLite + full backend and React starter code.
          </p>
        </div>

        {/* Tier Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl self-start sm:self-auto">
          {['All', 'Beginner', 'Intermediate', 'Advanced Enterprise'].map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTier === tier
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tier} {tier === 'All' ? `(18)` : tier === 'Beginner' ? `(5)` : tier === 'Intermediate' ? `(5)` : `(8)`}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((p) => {
          const checkedSteps = projectChecklists[p.id] || [];
          const doneCount = checkedSteps.length;
          const pct = Math.round((doneCount / 20) * 100);

          return (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-sky-300 dark:hover:border-sky-800 transition flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                    p.tier === 'Beginner'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : p.tier === 'Intermediate'
                      ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                      : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                  }`}>
                    {p.tier}
                  </span>

                  <span className="font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {doneCount} / 20 steps ({pct}%)
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                  {p.name}
                </h3>

                <p className="text-xs text-sky-700 dark:text-sky-300 font-medium">
                  {p.focus}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {p.summary}
                </p>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedProjectId(p.id);
                  setActiveCodeTab('dbTable');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition shadow-xs"
              >
                <span>Open 20-Step Lifecycle &amp; Code</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* PROJECT DETAIL MODAL / DRAWER */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-mono">
                    {selectedProject.tier}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {selectedProject.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedProject.focus}
                </p>
              </div>

              <button
                onClick={() => setSelectedProjectId(null)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 thin-scroll">
              {/* SECTION A: 20-Step Company Development Lifecycle Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>20-Step Company Development Lifecycle Checklist</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                    {(projectChecklists[selectedProject.id] || []).length} / 20 Completed
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {LIFECYCLE_STEPS.map((step, idx) => {
                    const isChecked = (projectChecklists[selectedProject.id] || []).includes(idx);
                    return (
                      <label
                        key={idx}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
                            : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            onToggleStep(selectedProject.id, idx, e.target.checked);
                          }}
                          className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                        />
                        <span className="leading-snug">{step}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION B: Complete Real-World Multi-Layer Code Tabs */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-500" />
                    <span>Real-World Implementation Code Layers</span>
                  </div>
                </div>

                {/* Code Tabs Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto thin-scroll pb-1">
                  {codeTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCodeTab(tab.id)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-mono font-medium shrink-0 transition ${
                        activeCodeTab === tab.id
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Active Code Display */}
                <div className="mt-2">
                  <CodeBlock
                    code={selectedProject[activeCodeTab] || '// Code snippet not available'}
                    language={activeCodeTab === 'react' ? 'javascript' : activeCodeTab === 'dbTable' ? 'sql' : 'abap'}
                    title={`${selectedProject.name} — ${codeTabs.find(t => t.id === activeCodeTab)?.label}`}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedProjectId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Close Project Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
