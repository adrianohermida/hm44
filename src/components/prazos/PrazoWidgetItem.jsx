import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PrazoWidgetItem({ prazo }) {
  const navigate = useNavigate();
  const diasRestantes = differenceInDays(new Date(prazo.data_vencimento), new Date());
  const isUrgente = diasRestantes <= 2;

  const handleClick = () => {
    if (prazo.processo_id) {
      navigate(createPageUrl('ProcessoDetails') + `?id=${prazo.processo_id}`);
    }
  };

  return (
    <div 
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      {isUrgente && <AlertCircle className="w-4 h-4 text-red-500" />}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{prazo.titulo}</p>
        <p className="text-xs text-[var(--text-secondary)]">
          {format(new Date(prazo.data_vencimento), 'dd/MM/yyyy')}
        </p>
      </div>
      <Badge variant={isUrgente ? 'destructive' : 'secondary'}>
        {diasRestantes === 0 ? 'Hoje' : `${diasRestantes}d`}
      </Badge>
    </div>
  );
}