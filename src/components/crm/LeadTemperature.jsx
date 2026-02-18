import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function LeadTemperature({ temperatura }) {
  const config = {
    quente: { bg: 'bg-red-500', label: 'Quente' },
    morno: { bg: 'bg-yellow-500', label: 'Morno' },
    frio: { bg: 'bg-blue-500', label: 'Frio' }
  };

  const { bg, label } = config[temperatura] || config.frio;

  return (
    <Badge className={`${bg} text-white text-xs`}>
      {label}
    </Badge>
  );
}