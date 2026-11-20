import React, { useState } from 'react';
import {
  Layers,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  Copy,
  Check
} from 'lucide-react';
import { ARCH_LAYERS } from '../data/architecture';
import { KB_ITEMS } from '../data/knowledgeBase';
import { CodeBlock } from '../components/CodeBlock';

export function ArchitectureView({ onShowToast }) {
  const [activeLayerKey, setActiveLayerKey] = useState('react');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedSnippetId, setCopiedSnippetId] = useState(null);

  const activeLayer = ARCH_LAYERS[activeLayerKey] || ARCH_LAYERS.react;

  const categories = ['All', 'Modern ABAP', 'CDS Views', 'RAP BDEF', 'RAP EML', 'React & OData V4', 'Clean Core', 'RAP Draft', 'RAP Actions'];

  const filteredKb = KB_ITEMS.filter((item) => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopySnippet = async (id, snippet) => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedSnippetId(id);
      setTimeout(() => setCopiedSnippetId(null), 2000);
      onShowToast?.('Code snippet copied!');
    } catch {
      onShowToast?.('Failed to copy', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* SECTION 1: Clickable 5-Layer Full-Stack Architecture Diagram */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>Interactive Enterprise 5-Layer Stack</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Full-Stack SAP RAP &amp; React Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Click any layer in the data pipeline to inspect its internal mechanics, Clean Core rules, and real code.
          </p>
        </div>

        {/* 5 Layer Clickable Flow Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-2">
          {Object.entries(ARCH_LAYERS).map(([key, layer]) => {
            const isActive = activeLayerKey === key;
            return (
              <button
                key={key}
                onClick={() => setActiveLayerKey(key)}
                className={`p-3.5 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                  isActive
                    ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/60 shadow-md ring-2 ring-sky-400/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800 bg-slate-50/60 dark:bg-slate-950/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase font-mono text-slate-400 mb-1">
                    <span>LAYER {layer.layerNumber}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />}
                  </div>
                  <div className={`text-xs font-bold leading-tight ${isActive ? 'text-sky-700 dark:text-sky-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {layer.title.split('(')[0].trim()}
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 block">
                  {layer.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Layer Inspector */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 space-y-4 transition">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider font-mono text-sky-600 dark:text-sky-400">
                Layer {activeLayer.layerNumber} Inspector
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {activeLayer.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeLayer.subtitle}
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-semibold self-start sm:self-auto">
              {activeLayer.badge}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {activeLayer.overview}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Runtime Data Flow:</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {activeLayer.dataFlow}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Clean Core Architectural Mandate:</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {activeLayer.cleanCoreRule}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Key Technical Mechanics:
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {activeLayer.keyMechanics.map((mech, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <span className="text-sky-500 font-bold">•</span>
                  <span>{mech}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Layer Code Block */}
          <div className="space-y-1.5 pt-2">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Layer Code Example:
            </div>
            <CodeBlock
              code={activeLayer.sampleCode}
              language={activeLayer.language}
              title={`${activeLayer.title} Implementation`}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Searchable Modern SAP Knowledge Base */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Live-Searchable Modern SAP &amp; RAP Knowledge Base</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Instant architectural cheat-sheet for constructor expressions, EML, strict ( 2 ), CSRF, and Clean Core.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search: VALUE, EML, strict, CSRF..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto thin-scroll pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold shrink-0 transition ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Knowledge Base Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {filteredKb.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 hover:border-sky-300 dark:hover:border-sky-800 transition flex flex-col justify-between gap-2.5"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-sky-600 dark:text-sky-400">{item.term}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                    {item.badge}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {item.summary}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.details}
                </p>
              </div>

              {item.codeSnippet && (
                <div className="relative mt-1">
                  <pre className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-emerald-300 text-[11px] font-mono p-2.5 rounded-lg overflow-x-auto thin-scroll">
                    <code>{item.codeSnippet}</code>
                  </pre>
                  <button
                    onClick={() => handleCopySnippet(item.id, item.codeSnippet)}
                    className="absolute top-2 right-2 p-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs transition"
                    title="Copy snippet"
                  >
                    {copiedSnippetId === item.id ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredKb.length === 0 && (
            <div className="col-span-full py-8 text-center text-xs text-slate-400">
              No matching knowledge base articles found for "{searchTerm}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
