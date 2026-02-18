import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, FileText } from 'lucide-react';

export default function ResultadoMonitoramentoGrid({ resultados, onView }) {
  if (!resultados?.length) {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)]">
        Nenhum processo novo encontrado
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {resultados.map((r) => (
        <Card 
          key={r.id} 
          className="p-4 cursor-pointer hover:shadow-md transition-shadow border-[var(--border-primary)]"
          onClick={() => onView?.(r)}
        >
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--text-primary)] truncate">{r.numero_cnj}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{r.tribunal_sigla}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">{r.estado_sigla}</Badge>
                {!r.visualizado && (
                  <Badge className="bg-[var(--brand-warning)] text-white text-xs">Novo</Badge>
                )}
              </div>
            </div>
            {!r.visualizado && (
              <Eye className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}