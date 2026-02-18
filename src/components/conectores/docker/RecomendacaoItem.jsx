import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Database, PlusCircle } from 'lucide-react';

export default function RecomendacaoItem({ recomendacao }) {
  const isCriarNova = recomendacao.entity_recomendada === 'CRIAR_NOVA';
  const Icon = isCriarNova ? PlusCircle : Database;
  const color = isCriarNova ? 'text-blue-600' : 'text-green-600';

  return (
    <div className="p-3 bg-white rounded border border-purple-200">
      <div className="flex items-start gap-2 mb-1">
        <Icon className={`w-4 h-4 ${color} mt-0.5`} />
        <div className="flex-1 min-w-0">
          <code className="text-xs font-mono">{recomendacao.endpoint_path}</code>
          <Badge className={`ml-2 text-xs ${isCriarNova ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
            {recomendacao.entity_recomendada}
          </Badge>
          {!isCriarNova && (
            <span className="ml-1 text-xs text-[var(--text-tertiary)]">
              {Math.round(recomendacao.similaridade * 100)}% similar
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-[var(--text-secondary)]">{recomendacao.justificativa}</p>
    </div>
  );
}