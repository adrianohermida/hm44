import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';

export default function FaturasSidebar({ isOpen, onClose, honorarios, selected, onSelect }) {
  return (
    <>
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-[var(--bg-elevated)] border-r border-[var(--border-primary)]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 overflow-auto
      `}>
        <div className="sticky top-0 bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] p-4 flex items-center justify-between md:justify-start gap-3">
          <Filter className="w-5 h-5 text-[var(--text-secondary)]" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Faturas</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden ml-auto">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-2">
          {honorarios.map((h) => (
            <button
              key={h.id}
              onClick={() => onSelect(h)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selected?.id === h.id
                  ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-50)]'
                  : 'border-[var(--border-primary)] hover:border-[var(--brand-primary-200)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <p className="font-semibold text-[var(--text-primary)] truncate">{h.cliente_nome}</p>
              <p className="text-sm text-[var(--text-secondary)] truncate">{h.processo_numero}</p>
              <p className="text-lg font-bold text-[var(--brand-primary)] mt-2">
                R$ {(h.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}