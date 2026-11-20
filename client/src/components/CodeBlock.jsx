import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

export function CodeBlock({ code, language = 'abap', title, lineExplanations = [] }) {
  const [copied, setCopied] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs bg-slate-950 text-slate-100 text-xs font-mono">
      {/* Code Header Bar */}
      <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-sans">
        <span className="font-semibold text-slate-300">{title || language.toUpperCase()}</span>
        <div className="flex items-center gap-2">
          {lineExplanations.length > 0 && (
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium transition"
            >
              <Lightbulb className="w-3 h-3 text-amber-400" />
              <span>{showAnnotations ? 'Hide' : 'Explain'} Concepts</span>
              {showAnnotations ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto thin-scroll leading-relaxed">
        <pre className="font-mono text-xs whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>

      {/* Expandable Line-by-Line Architectural Breakdown */}
      {showAnnotations && lineExplanations.length > 0 && (
        <div className="bg-slate-900/90 border-t border-slate-800 p-4 space-y-2 text-xs font-sans">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Line-by-Line Modern ABAP &amp; RAP Architectural Breakdown</span>
          </div>
          <div className="grid grid-cols-1 gap-2 pt-1">
            {lineExplanations.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row gap-2">
                <code className="text-sky-300 font-mono text-[11px] shrink-0 font-semibold">{item.line}</code>
                <span className="text-slate-300 text-xs">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
