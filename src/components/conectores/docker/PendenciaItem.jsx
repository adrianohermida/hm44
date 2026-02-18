import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileQuestion, Settings, DollarSign } from 'lucide-react';

export default function PendenciaItem({ pendencia }) {
  const icons = {
    SCHEMA_FALTANDO: FileQuestion,
    PARAMETROS_INCOMPLETOS: Settings,
    PRECIFICACAO_FALTANDO: DollarSign
  };

  const Icon = icons[pendencia.tipo] || FileQuestion;

  return (
    <div className="p-3 bg-white rounded border border-yellow-200">
      <div className="flex items-start gap-2 mb-1">
        <Icon className="w-4 h-4 text-yellow-600 mt-0.5" />
        <div className="flex-1 min-w-0">
          <code className="text-xs font-mono">{pendencia.endpoint_path}</code>
          <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">{pendencia.tipo}</Badge>
        </div>
      </div>
      <p className="text-sm text-[var(--text-secondary)]">{pendencia.mensagem}</p>
      {pendencia.sugestao_ia && (
        <p className="text-xs text-[var(--text-tertiary)] mt-1 italic">💡 {pendencia.sugestao_ia}</p>
      )}
    </div>
  );
}