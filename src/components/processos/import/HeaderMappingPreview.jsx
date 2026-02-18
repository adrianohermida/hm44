import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function HeaderMappingPreview({ mapeamento, modelo }) {
  const campos_importantes = ['numero_cnj', 'tribunal', 'polo_ativo', 'polo_passivo', 'titulo'];
  
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Mapeamento Detectado</h3>
        <Badge>{modelo}</Badge>
      </div>
      <div className="space-y-2 text-xs">
        {Object.entries(mapeamento).slice(0, 8).map(([header, campo]) => {
          const importante = campos_importantes.includes(campo);
          return (
            <div key={header} className="flex items-center gap-2">
              {importante ? (
                <CheckCircle2 className="w-3 h-3 text-green-600" />
              ) : (
                <AlertCircle className="w-3 h-3 text-slate-400" />
              )}
              <code className="text-slate-600">{header}</code>
              <span className="text-slate-400">→</span>
              <code className={importante ? 'text-green-700 font-semibold' : 'text-slate-500'}>
                {campo}
              </code>
            </div>
          );
        })}
      </div>
    </div>
  );
}