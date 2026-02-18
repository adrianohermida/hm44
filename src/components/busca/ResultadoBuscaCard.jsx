import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar } from 'lucide-react';
import ImportarProcessoButton from './ImportarProcessoButton';

export default function ResultadoBuscaCard({ processo }) {
  return (
    <Card className="p-4 border-[var(--border-primary)]">
      <div className="flex items-start gap-3">
        <FileText className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[var(--text-primary)] truncate">
            {processo.numero_cnj}
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
            {processo.tribunal_nome}
          </p>
          {processo.data_inicio && (
            <div className="flex items-center gap-1 mt-2 text-xs text-[var(--text-tertiary)]">
              <Calendar className="w-3 h-3" />
              {new Date(processo.data_inicio).toLocaleDateString('pt-BR')}
            </div>
          )}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Badge variant="outline">{processo.tribunal_sigla}</Badge>
            {processo.grau && <Badge variant="outline">{processo.grau}º grau</Badge>}
          </div>
        </div>
        <ImportarProcessoButton processo={processo} />
      </div>
    </Card>
  );
}