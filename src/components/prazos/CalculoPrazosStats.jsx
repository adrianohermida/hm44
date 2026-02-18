import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function CalculoPrazosStats({ stats }) {
  if (!stats) return null;

  const items = [
    { icon: Clock, label: 'Pendentes', value: stats.pendentes, color: 'text-amber-600' },
    { icon: CheckCircle, label: 'Calculados', value: stats.calculados, color: 'text-green-600' },
    { icon: Brain, label: 'Taxa IA', value: `${stats.taxaIA}%`, color: 'text-purple-600' },
    { icon: TrendingUp, label: 'Precisão', value: `${stats.precisao}%`, color: 'text-blue-600' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <item.icon className={`w-8 h-8 ${item.color}`} />
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{item.value}</p>
                <p className="text-xs text-[var(--text-secondary)]">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}