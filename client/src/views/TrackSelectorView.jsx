import React from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  LayoutTemplate,
  Database,
  Code2,
  Rocket,
  CheckCircle2,
  Compass,
  FileCode2,
  Server
} from 'lucide-react';

export function TrackSelectorView({ activeTrack, onSelectTrack, onNavigate }) {
  const tracks = [
    {
      id: 'rap',
      title: 'SAP ABAP RAP Track',
      subtitle: 'ABAP RESTful Application Programming Model & Clean Core',
      tag: 'BACKEND & CORE ARCHITECTURE',
      tagColor: 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800',
      icon: Database,
      duration: '15 Days (Day 0 to Day 14)',
      curriculumCount: '15 Days • 150 Assignments • 18 Projects',
      description: 'Master Modern ABAP Cloud from zero to enterprise architect. Covers immutable core syntax, typed internal tables, CDS view entities, RAP behavior pools, EML transactional buffer queries, Draft tables, and Clean Core compliance.',
      highlights: [
        'Day 0 Prerequisite Fast Track (From Zero for Java/JS devs)',
        'Core Data Services (CDS) View Entities & Compositions',
        'RAP Behavior Definitions (BDEF) with Determinations & Validations',
        'Entity Manipulation Language (EML) in Local Mode',
        'Draft Handling, Active/Draft buffers & Concurrency',
        'Clean Core SAP S/4HANA Cloud & BTP Architecture'
      ],
      primaryButtonText: activeTrack === 'rap' ? 'Continue RAP Track →' : 'Switch to RAP Track'
    },
    {
      id: 'fiori',
      title: 'SAP Fiori Track',
      subtitle: 'SAP Fiori Elements, Freestyle SAPUI5 & Cloud Launchpad',
      tag: 'FRONTEND & USER EXPERIENCE',
      tagColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      icon: LayoutTemplate,
      duration: '6 Deep Modules',
      curriculumCount: '6 Modules • 60 Assignments • Floorplan Sandboxes',
      description: 'Build enterprise-grade, responsive user experiences. Master metadata-driven SAP Fiori Elements, custom Freestyle SAPUI5 with MVC architecture, OData V4 protocol semantics, On-Premise/BTP deployment, and SAP Build Work Zone.',
      highlights: [
        'Module 1: Fiori Fundamentals, Floorplans & OData V4 ($select, $filter, $expand)',
        'Module 2: Fiori Elements, Metadata Extensions (MDE) & @UI Annotations',
        'Module 3: Freestyle SAPUI5, MVC, Data Binding & XML Fragments',
        'Module 4: S/4HANA BSP Deployment & BTP Cloud Foundry MTA (mbt build)',
        'Module 5: Fiori Launchpad (FLP), Semantic Objects, Spaces & Pages, PFCG Roles',
        'Module 6: SAP Build Work Zone, Channel Manager & BTP Role Collections'
      ],
      primaryButtonText: activeTrack === 'fiori' ? 'Continue Fiori Track →' : 'Switch to Fiori Track'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white p-6 sm:p-10 shadow-xl border border-sky-800/40">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>SAP FULL-STACK ARCHITECT ACADEMY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Select Your Learning Path: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-300">
              ABAP RAP or SAP Fiori
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Welcome to the dual-track enterprise training suite. Whether you want to master the backend database engine with <strong>Modern ABAP &amp; RAP</strong>, or craft modern metadata-driven interfaces with <strong>SAP Fiori &amp; SAPUI5</strong>, select your focus below. You can seamlessly switch between tracks at any time.
          </p>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -top-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Dual Path Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {tracks.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTrack === t.id;

          return (
            <div
              key={t.id}
              className={`rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-sky-500 ring-2 ring-sky-500/20 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="p-6 sm:p-8 space-y-6">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${t.tagColor}`}>
                      {t.tag}
                    </span>
                    {isSelected && (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active Path</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {t.title}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400 font-mono">
                    {t.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                    {t.description}
                  </p>
                </div>

                {/* Key Syllabus Bullet points */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                    Curriculum Modules &amp; Coverage:
                  </span>
                  <ul className="space-y-2">
                    {t.highlights.map((h, i) => (
                      <li key={i} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-sky-500 font-bold shrink-0">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action footer */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                  {t.curriculumCount}
                </span>
                <button
                  onClick={() => {
                    onSelectTrack(t.id);
                    onNavigate('lessons');
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-xs ${
                    isSelected
                      ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900'
                  }`}
                >
                  <span>{t.primaryButtonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
