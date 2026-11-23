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
  Zap,
  Cpu,
  BookOpen,
  X
} from 'lucide-react';
import { PROJECTS, LIFECYCLE_STEPS } from '../data/projects';
import { PROJECT_BLUEPRINTS } from '../data/projectBlueprints';
import { CodeBlock } from '../components/CodeBlock';

export function ProjectsView({ projectChecklists, onToggleStep, onShowToast }) {
  const [activeTier, setActiveTier] = useState('All');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [modalTab, setModalTab] = useState('requirements'); // 'requirements' | 'design' | 'checklist' | 'code'
  const [activeCodeTab, setActiveCodeTab] = useState('dbTable');

  const filteredProjects = activeTier === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.tier === activeTier);

  const selectedProject = PROJECTS.find(p => p.id === selectedProjectId);
  const selectedBlueprint = selectedProjectId ? PROJECT_BLUEPRINTS[selectedProjectId] : null;

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
            Complete company-level development: 20-step lifecycle checklist, business requirements, performance SLAs, and system designs.
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
          const blueprint = PROJECT_BLUEPRINTS[p.id];
          const hasDesign = Boolean(blueprint?.systemDesign);

          return (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-sky-300 dark:hover:border-sky-800 transition flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                      p.tier === 'Beginner'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : p.tier === 'Intermediate'
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                        : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}>
                      {p.tier}
                    </span>
                    {hasDesign && (
                      <span className="px-1.5 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        📐 System Design
                      </span>
                    )}
                  </div>

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
                  {blueprint?.requirements?.userStory || p.summary}
                </p>

                {/* Performance SLA Pill */}
                {blueprint?.performance?.targetSla && (
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1">
                    <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="truncate">{blueprint.performance.targetSla}</span>
                  </div>
                )}

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
                  setModalTab('requirements');
                  setActiveCodeTab('dbTable');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition shadow-xs"
              >
                <span>Open Project Blueprint &amp; Code</span>
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

            {/* Modal Top Navigation Tabs */}
            <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 overflow-x-auto thin-scroll">
              <button
                onClick={() => setModalTab('requirements')}
                className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-bold border-b-2 transition ${
                  modalTab === 'requirements'
                    ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>1. Requirements &amp; Performance SLA</span>
              </button>

              <button
                onClick={() => setModalTab('design')}
                className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-bold border-b-2 transition ${
                  modalTab === 'design'
                    ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>2. System Design Architecture</span>
                {selectedBlueprint?.systemDesign && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                )}
              </button>

              <button
                onClick={() => setModalTab('checklist')}
                className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-bold border-b-2 transition ${
                  modalTab === 'checklist'
                    ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>3. 20-Step Lifecycle Checklist</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {(projectChecklists[selectedProject.id] || []).length}/20
                </span>
              </button>

              <button
                onClick={() => setModalTab('code')}
                className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-bold border-b-2 transition ${
                  modalTab === 'code'
                    ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>4. Production Code Layers</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 thin-scroll">
              {/* TAB 1: REQUIREMENTS & PERFORMANCE SLA */}
              {modalTab === 'requirements' && selectedBlueprint && (
                <div className="space-y-6 animate-fade-in">
                  {/* User Story Box */}
                  <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                      <span>Enterprise User Story &amp; Business Objective</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      "{selectedBlueprint.requirements?.userStory}"
                    </p>
                  </div>

                  {/* Business Rules */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Enterprise Business Constraints &amp; Validation Rules</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedBlueprint.requirements?.businessRules?.map((rule, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Input / Output Contract */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Input / Output Payload Contract
                    </h4>
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-200 text-xs font-mono leading-relaxed">
                      {selectedBlueprint.requirements?.inputOutput}
                    </div>
                  </div>

                  {/* Performance & Scaling SLAs */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Performance SLA, Indexing &amp; Concurrency Architecture</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Target Response SLA</span>
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                          {selectedBlueprint.performance?.targetSla}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Database Indexing Strategy</span>
                        <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                          {selectedBlueprint.performance?.indexStrategy}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Locking &amp; Concurrency Model</span>
                        <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                          {selectedBlueprint.performance?.concurrency}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Clean Core Compliance</span>
                        <p className="text-sky-600 dark:text-sky-400 font-mono text-[11px]">
                          {selectedBlueprint.performance?.cleanCoreBenchmark}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SYSTEM DESIGN ARCHITECTURE */}
              {modalTab === 'design' && (
                <div className="space-y-6 animate-fade-in">
                  {selectedBlueprint?.systemDesign ? (
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-300">
                          <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span>Enterprise System Design Blueprint &amp; Multi-Tier Data Flow</span>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-200/60 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-bold">
                          Clean Core Tier 1
                        </span>
                      </div>

                      {/* ASCII / Box Diagram */}
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 overflow-x-auto shadow-inner">
                        <pre className="font-mono text-xs sm:text-[13px] text-sky-300 leading-relaxed whitespace-pre">
                          {selectedBlueprint.systemDesign.asciiDiagram}
                        </pre>
                      </div>

                      {/* Layer Explanations */}
                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Architectural Layers &amp; Responsibilities
                        </h4>
                        <div className="grid grid-cols-1 gap-2.5">
                          {selectedBlueprint.systemDesign.layers?.map((layer, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs space-y-1"
                            >
                              <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                <span className="font-mono text-sky-600 dark:text-sky-400">{layer.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{layer.tech}</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {layer.responsibility}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Standard Clean Core RAP Flow */
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-sky-600" />
                          <span>Standard SAP Clean Core RAP 3-Tier Architecture Pattern</span>
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          This project implements the foundational SAP RESTful Application Programming Model (RAP) Managed pattern. It separates concerns across three immutable layers:
                        </p>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 overflow-x-auto shadow-inner">
                        <pre className="font-mono text-xs sm:text-[13px] text-emerald-400 leading-relaxed whitespace-pre">{`+-------------------------------------------------------------+
|  PRESENTATION LAYER: React 18 SPA (OData V4 Client)         |
|  - fetch() with X-CSRF-Token handshake                      |
|  - Optimistic locking via If-Match / ETag headers           |
+-------------------------------------------------------------+
                              |
                     OData V4 HTTP Protocol
                              v
+-------------------------------------------------------------+
|  SERVICE LAYER: Service Definition (ZSD_*) + Binding (ZSB_*) |
|  - Web API / UI binding, Clean Core whitelist               |
+-------------------------------------------------------------+
                              |
                       RAP Orchestration
                              v
+-------------------------------------------------------------+
|  BUSINESS OBJECT LAYER: CDS Projection (ZC_*) + BDEF         |
|  - strict ( 2 ) validation                                  |
|  - Behavior Implementation Pool (ZBP_*)                     |
|  - Determinations, Validations & Dynamic Feature Control    |
+-------------------------------------------------------------+
                              |
                         Data Access
                              v
+-------------------------------------------------------------+
|  DATA LAYER: CDS Interface View (ZI_*) + SAP HANA DB Table  |
|  - DEFINE VIEW ENTITY (zero classic SQL views)              |
|  - UUID primary key + Local Instance Last Changed Timestamp |
+-------------------------------------------------------------+`}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: 20-STEP LIFECYCLE CHECKLIST */}
              {modalTab === 'checklist' && (
                <div className="space-y-4 animate-fade-in">
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
              )}

              {/* TAB 4: COMPLETE REAL-WORLD CODE LAYERS */}
              {modalTab === 'code' && (
                <div className="space-y-3 animate-fade-in">
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
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center shrink-0">
              <span className="text-[11px] text-slate-500 font-mono">
                Clean Core RAP strict ( 2 ) • ABAP Cloud Verified
              </span>
              <button
                onClick={() => setSelectedProjectId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs"
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
