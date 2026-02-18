import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProcessoMovimentacaoItem({ movimentacao, onToggleImportante }) {
  return (
    <div className="border-l-2 border-[var(--brand-primary-200)] pl-4 pb-3">
      <div className="flex items-start justify-between mb-1">
        <span className="text-xs font-semibold text-[var(--brand-primary-700)]">
          {format(new Date(movimentacao.data), "dd/MM/yyyy HH:mm", { locale: ptBR })}
        </span>
        {onToggleImportante && (
          <button
            onClick={() => onToggleImportante(movimentacao.id)}
            className="hover:opacity-70"
            aria-label="Marcar como importante"
          >
            <Star className={`w-4 h-4 ${movimentacao.importante ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
          </button>
        )}
      </div>
      {movimentacao.tipo && (
        <Badge variant="outline" className="mb-2 text-xs">{movimentacao.tipo}</Badge>
      )}
      <p className="text-sm text-[var(--brand-text-primary)] leading-relaxed">
        {movimentacao.conteudo}
      </p>
      {movimentacao.link_pdf && (
        <a href={movimentacao.link_pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[var(--brand-primary)] hover:underline mt-2">
          <FileText className="w-3 h-3" />
          Ver no Diário
        </a>
      )}
    </div>
  );
}