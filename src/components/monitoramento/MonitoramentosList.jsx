import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff } from 'lucide-react';

export default function MonitoramentosList({ monitoramentos, onSelect }) {
  if (!monitoramentos?.length) {
    return (
      <div className="text-center py-8 text-[var(--text-secondary)]">
        Nenhum monitoramento ativo
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {monitoramentos.map((m) => (
        <Card 
          key={m.id} 
          className="p-3 cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors border-[var(--border-primary)]"
          onClick={() => onSelect?.(m)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--text-primary)] truncate">{m.termo}</p>
              <p className="text-xs text-[var(--text-tertiary)] truncate">{m.tipo}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {m.ativo ? (
                <Bell className="w-4 h-4 text-[var(--brand-success)]" />
              ) : (
                <BellOff className="w-4 h-4 text-[var(--text-tertiary)]" />
              )}
              {m.aparicoes_nao_visualizadas > 0 && (
                <Badge className="bg-[var(--brand-warning)] text-white">{m.aparicoes_nao_visualizadas}</Badge>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}