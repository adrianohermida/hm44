import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ResultadoNovoProcessoCard({ resultado, onView }) {
  return (
    <div className="p-3 bg-[var(--brand-bg-secondary)] rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[var(--brand-primary)]" />
          <p className="font-mono text-sm font-semibold">{resultado.numero_cnj}</p>
        </div>
        <Badge variant="outline">{resultado.tribunal_sigla}</Badge>
      </div>
      <p className="text-xs text-[var(--brand-text-secondary)] mb-2">
        {format(new Date(resultado.data_inicio_processo), 'dd/MM/yyyy', { locale: ptBR })} · {resultado.estado_sigla}
      </p>
      {resultado.match_texto && (
        <p className="text-xs bg-yellow-50 p-2 rounded border-l-2 border-yellow-400" dangerouslySetInnerHTML={{ __html: resultado.match_texto }} />
      )}
    </div>
  );
}