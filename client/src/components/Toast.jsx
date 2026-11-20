import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-sky-400 shrink-0" />
  };

  const type = toast.type || 'info';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-auto flex items-center gap-3 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-slide-up">
      {icons[type]}
      <p className="flex-1 font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
