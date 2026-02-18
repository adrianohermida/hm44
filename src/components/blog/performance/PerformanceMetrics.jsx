import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Eye, Clock, MousePointerClick } from 'lucide-react';

export default function PerformanceMetrics({ metricas }) {
  const items = [
    { 
      icon: Eye, 
      label: 'Total de Visitas', 
      value: metricas.totalVisitas?.toLocaleString() || '0',
      color: 'text-blue-600'
    },
    { 
      icon: Clock, 
      label: 'Tempo Médio', 
      value: `${Math.round(metricas.tempoMedio || 0)}s`,
      color: 'text-green-600'
    },
    { 
      icon: MousePointerClick, 
      label: 'Taxa de Rejeição', 
      value: `${Math.round(metricas.taxaRejeicao || 0)}%`,
      color: 'text-orange-600'
    },
    { 
      icon: TrendingUp, 
      label: 'Engajamento', 
      value: `${Math.round(metricas.engajamento || 0)}%`,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <Card key={i} className="p-4">
          <item.icon className={`w-8 h-8 mb-2 ${item.color}`} />
          <div className="text-2xl font-bold">{item.value}</div>
          <div className="text-sm text-gray-600">{item.label}</div>
        </Card>
      ))}
    </div>
  );
}