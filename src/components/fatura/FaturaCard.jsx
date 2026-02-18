import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function FaturaCard({ fatura }) {
  const statusColors = {
    PENDENTE: 'bg-yellow-100 text-yellow-800',
    PAGO: 'bg-green-100 text-green-800',
    CANCELADO: 'bg-gray-100 text-gray-800'
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm font-semibold">R$ {fatura.valor.toFixed(2)}</p>
            <p className="text-xs text-[var(--text-secondary)]">{fatura.descricao}</p>
          </div>
          <Badge className={statusColors[fatura.status]}>{fatura.status}</Badge>
        </div>
        <p className="text-xs text-[var(--text-tertiary)]">
          {format(new Date(fatura.created_date), 'dd/MM/yyyy', { locale: ptBR })}
        </p>
      </CardContent>
    </Card>
  );
}