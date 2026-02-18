import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import ProcessoClienteCard from './ProcessoClienteCard';

export default function ProcessoTreeBranch({ processo, apensos, clienteId }) {
  const [expanded, setExpanded] = useState(false);

  if (apensos.length === 0) {
    return <ProcessoClienteCard processo={processo} clienteId={clienteId} />;
  }

  return (
    <div>
      <div className="flex items-start gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex-shrink-0 hover:bg-[var(--bg-secondary)] rounded p-1"
        >
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)]" />
          )}
        </button>
        <div className="flex-1">
          <ProcessoClienteCard processo={processo} apensos={apensos.length} clienteId={clienteId} />
        </div>
      </div>
      {expanded && (
        <div className="ml-6 pl-4 border-l-2 border-[var(--border-primary)] space-y-3 mt-3">
          {apensos.map((ap) => (
            <ProcessoClienteCard key={ap.id} processo={ap} isApenso clienteId={clienteId} />
          ))}
        </div>
      )}
    </div>
  );
}