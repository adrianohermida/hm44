import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil } from 'lucide-react';

const statusConfig = {
  pendente: { class: 'bg-[var(--brand-warning)]/10 text-[var(--brand-warning)]', label: 'Pendente' },
  em_andamento: { class: 'bg-blue-100 text-blue-800', label: 'Em Andamento' },
  cumprido: { class: 'bg-[var(--brand-success)]/10 text-[var(--brand-success)]', label: 'Cumprido' },
  prorrogado: { class: 'bg-purple-100 text-purple-800', label: 'Prorrogado' },
  perdido: { class: 'bg-[var(--brand-error)]/10 text-[var(--brand-error)]', label: 'Perdido' }
};

export default function PrazoDetailHeader({ titulo, status, onEdit }) {
  const config = statusConfig[status] || statusConfig.pendente;

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{titulo}</h3>
        <Badge className={`mt-2 ${config.class}`}>
          {config.label}
        </Badge>
      </div>
      <Button size="sm" variant="ghost" onClick={onEdit}>
        <Pencil className="w-4 h-4" />
      </Button>
    </div>
  );
}