import React from 'react';
import { TrendingUp, Target, DollarSign, Eye } from 'lucide-react';

export default function SEOMetrics({ keywords }) {
  const totalVolume = keywords.reduce((sum, kw) => sum + (kw.volume_mensal || 0), 0);
  const avgPosition = keywords.length > 0 
    ? (keywords.reduce((sum, kw) => sum + (kw.posicao_atual || 0), 0) / keywords.length).toFixed(1)
    : 0;
  const avgCPC = keywords.length > 0
    ? (keywords.reduce((sum, kw) => sum + (kw.cpc_medio || 0), 0) / keywords.length).toFixed(2)
    : 0;

  const metrics = [
    { icon: Eye, label: 'Volume Total/mês', value: totalVolume.toLocaleString('pt-BR'), color: 'text-blue-600' },
    { icon: Target, label: 'Posição Média', value: avgPosition + 'º', color: 'text-green-600' },
    { icon: DollarSign, label: 'CPC Médio', value: 'R$ ' + avgCPC, color: 'text-purple-600' },
    { icon: TrendingUp, label: 'Keywords Ativas', value: keywords.length, color: 'text-orange-600' },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full bg-opacity-10 flex items-center justify-center ${metric.color.replace('text-', 'bg-')}`}>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)] mb-1">{metric.value}</p>
            <p className="text-sm text-[var(--text-secondary)]">{metric.label}</p>
          </div>
        );
      })}
    </div>
  );
}