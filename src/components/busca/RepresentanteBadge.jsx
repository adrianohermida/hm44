import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserCheck } from 'lucide-react';

export default function RepresentanteBadge({ processo }) {
  const drAdrianoNomes = [
    'adriano menezes hermida maia',
    'adriano hermida maia',
    'dr. adriano maia',
    'dr adriano maia'
  ];

  const temDrAdrianoComoRepresentante = processo.partes?.some(parte => 
    parte.advogados?.some(adv => 
      drAdrianoNomes.some(nome => 
        adv.nome?.toLowerCase().includes(nome)
      )
    )
  );

  if (!temDrAdrianoComoRepresentante) return null;

  return (
    <Badge className="bg-[var(--brand-success)] text-white">
      <UserCheck className="w-3 h-3 mr-1" />
      Dr. Adriano é Representante
    </Badge>
  );
}