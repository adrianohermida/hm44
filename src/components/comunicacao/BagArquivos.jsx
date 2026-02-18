import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArquivoItem from './ArquivoItem';

export default function BagArquivos({ anexos, onRemover, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <aside className="w-80 border-l border-[var(--border-primary)] bg-[var(--bg-elevated)] flex flex-col h-full">
      <div className="p-4 border-b border-[var(--border-primary)] flex items-center justify-between">
        <h3 className="font-semibold text-[var(--text-primary)]">
          Bag de Arquivos
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {anexos.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)] text-center py-8">
            Nenhum arquivo anexado
          </p>
        ) : (
          <div className="space-y-2">
            {anexos.map((anexo, index) => (
              <ArquivoItem
                key={index}
                anexo={anexo}
                onRemover={() => onRemover(index)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}