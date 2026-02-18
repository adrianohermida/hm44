import React from 'react';
import { FileText } from 'lucide-react';

export default function ProcessoItemButton({ processo, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-2 rounded border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
    >
      <div className="flex items-center gap-2 mb-1">
        <FileText className="w-3 h-3 text-[var(--text-tertiary)]" />
        <span className="text-xs font-mono text-[var(--text-primary)]">
          {processo.numero_cnj}
        </span>
      </div>
      <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
        {processo.titulo || processo.assunto}
      </p>
    </button>
  );
}