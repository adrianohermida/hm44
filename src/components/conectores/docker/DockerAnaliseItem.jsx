import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DockerAnaliseItem({ analise, isSelected, onClick }) {
  const statusIcons = {
    PENDENTE: <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />,
    PROCESSANDO: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
    CONCLUIDO: <CheckCircle className="w-4 h-4 text-green-500" />,
    ERRO: <AlertCircle className="w-4 h-4 text-red-500" />
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start text-left h-auto py-3 px-3",
        isSelected && "bg-[var(--brand-primary-50)] border-l-2 border-[var(--brand-primary)]"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3 w-full">
        {statusIcons[analise.status]}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{analise.titulo}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{analise.tipo_fonte}</p>
          {analise.status === 'PROCESSANDO' && (
            <div className="mt-1 bg-[var(--bg-secondary)] rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[var(--brand-primary)] h-full transition-all"
                style={{ width: `${analise.progresso_percentual}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </Button>
  );
}