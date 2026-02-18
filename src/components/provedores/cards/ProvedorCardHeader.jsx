import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProvedorCardHeader({ provedor }) {
  return (
    <div>
      <CardTitle>{provedor.nome}</CardTitle>
      <Badge className="mt-2">{provedor.tipo}</Badge>
    </div>
  );
}