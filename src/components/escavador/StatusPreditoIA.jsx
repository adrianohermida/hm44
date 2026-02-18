import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

export default function StatusPreditoIA({ status }) {
  const config = {
    ATIVO: { color: 'bg-green-100 text-green-800', label: 'Ativo' },
    INATIVO: { color: 'bg-gray-100 text-gray-800', label: 'Inativo' }
  };

  const { color, label } = config[status] || config.INATIVO;

  return (
    <Badge className={`${color} flex items-center gap-1`}>
      <Sparkles className="w-3 h-3" />
      {label} (IA)
    </Badge>
  );
}