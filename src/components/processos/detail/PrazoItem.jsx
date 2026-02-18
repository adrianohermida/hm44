import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

export default function PrazoItem({ prazo, onToggle, completed = false }) {
  const diasRestantes = Math.ceil((new Date(prazo.data_limite) - new Date()) / (1000 * 60 * 60 * 24));
  const isUrgente = diasRestantes <= 3 && diasRestantes >= 0;

  return (
    <div className={`flex items-start gap-2 p-2 rounded hover:bg-[var(--bg-secondary)] ${completed ? 'opacity-60' : ''}`}>
      <Checkbox 
        checked={completed} 
        onCheckedChange={onToggle}
        disabled={completed}
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${completed ? 'line-through' : ''}`}>
          {prazo.titulo}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <Clock className="w-3 h-3 text-[var(--text-tertiary)]" />
          <p className={`text-xs ${isUrgente ? 'text-red-600 font-semibold' : 'text-[var(--text-tertiary)]'}`}>
            {format(new Date(prazo.data_limite), 'dd/MM/yyyy')}
            {isUrgente && ` (${diasRestantes} dias!)`}
          </p>
        </div>
      </div>
    </div>
  );
}