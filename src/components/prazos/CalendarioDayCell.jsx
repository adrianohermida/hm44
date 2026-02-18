import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function CalendarioDayCell({ date, prazos }) {
  const count = prazos.length;
  if (count === 0) return null;

  const hasUrgente = prazos.some(p => {
    const dias = Math.ceil((new Date(p.data_vencimento) - new Date()) / (1000 * 60 * 60 * 24));
    return dias <= 3;
  });

  return (
    <Badge
      variant={hasUrgente ? 'destructive' : 'default'}
      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
    >
      {count}
    </Badge>
  );
}