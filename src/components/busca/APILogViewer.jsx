import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileJson, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function APILogViewer({ log, onViewDetails }) {
  if (!log) return null;

  return (
    <Card className="p-4 bg-[var(--brand-bg-secondary)] border-[var(--brand-primary-200)]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileJson className="w-5 h-5 text-[var(--brand-primary)]" />
          <div>
            <p className="font-semibold text-[var(--text-primary)]">
              Busca {log.tipo_busca}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              {log.total_resultados} resultado(s) encontrado(s)
            </p>
          </div>
        </div>
        {log.sucesso ? (
          <CheckCircle2 className="w-5 h-5 text-[var(--brand-success)]" />
        ) : (
          <XCircle className="w-5 h-5 text-[var(--brand-error)]" />
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-3">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{log.tempo_resposta_ms}ms</span>
        </div>
        <div>Status: {log.status_code}</div>
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onViewDetails(log)}
        className="w-full"
      >
        Ver Resposta Completa
      </Button>
    </Card>
  );
}